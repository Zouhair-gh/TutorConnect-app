import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosClient from '../../../api/axiosClient';
import { JitsiMeeting } from '@jitsi/react-sdk';
import { Spinner, Alert, Button } from 'react-bootstrap';

const VideoConference = ({ userRole }) => {
    const { sessionId } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [roomDetails, setRoomDetails] = useState(null);
    const [isSessionEnded, setIsSessionEnded] = useState(false);
    const [userDetails, setUserDetails] = useState(null);

    // Fetch authenticated user details first
    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                // Get the JWT token from storage
                const token = localStorage.getItem('token');

                if (!token) {
                    throw new Error('Authentication token not found');
                }

                // Use the token to fetch user details
                const response = await axiosClient.get('/api/verifyToken', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                setUserDetails({
                    email: response.data.email,
                    username: response.data.username,
                    role: response.data.role
                });

                console.log('User details fetched:', response.data);
            } catch (err) {
                console.error('Failed to fetch user details:', err);
                setError('Authentication error: ' + (err.response?.data?.message || err.message));
            }
        };

        fetchUserDetails();
    }, []);

    // Initialize video session after user details are available
    useEffect(() => {
        const initializeVideoSession = async () => {
            // Don't proceed until we have user details
            if (!userDetails) return;

            try {
                // For tutors, create/start the session
                if (userRole === 'TUTOR') {
                    console.log('Tutor starting session:', sessionId);
                    const response = await axiosClient.post(`/sessions/${sessionId}/video/start`);
                    console.log('Tutor session response:', response.data);
                    setRoomDetails(response.data);
                }
                // For participants, get room details
                else {
                    console.log('Participant joining session:', sessionId);
                    const response = await axiosClient.get(`/sessions/${sessionId}/video`);
                    console.log('Participant session response:', response.data);
                    setRoomDetails(response.data);
                }
                setLoading(false);
            } catch (err) {
                console.error('Video session initialization error:', err);
                setError(err.response?.data?.message || 'Failed to initialize video session');
                setLoading(false);
            }
        };

        initializeVideoSession();
    }, [sessionId, userRole, userDetails]);

    const handleApiReady = (externalApi) => {
        console.log('Jitsi API ready, user role:', userRole);

        // Store the API reference for later use
        window.jitsiApi = externalApi;

        // For tutors, add moderator controls
        if (userRole === 'TUTOR') {
            console.log('Setting up tutor/moderator controls');

            // Auto-accept join requests
            externalApi.addListener('participantKnockingIn', (participant) => {
                console.log('Participant knocking:', participant);
                externalApi.executeCommand('answerKnockingParticipant', participant.id, true);
            });

            // If room has password protection
            externalApi.addListener('passwordRequired', () => {
                const moderatorPassword = roomDetails?.moderatorPassword || 'tutor123';
                console.log('Setting moderator password');
                externalApi.executeCommand('password', moderatorPassword);
            });
        } else {
            // For participants who might need a password
            externalApi.addListener('passwordRequired', () => {
                const participantPassword = roomDetails?.participantPassword || '';
                console.log('Setting participant password');
                if (participantPassword) {
                    externalApi.executeCommand('password', participantPassword);
                }
            });
        }

        // Track participant joins
        externalApi.addListener('participantJoined', (participant) => {
            console.log(`${participant.displayName} joined the session`);
            // You could send this to your backend to track attendance
        });

        // Track participant leaves
        externalApi.addListener('participantLeft', (participant) => {
            console.log(`${participant.displayName} left the session`);
        });

        // Handle connection errors
        externalApi.addListener('videoConferenceJoinFailed', (error) => {
            console.error('Failed to join conference:', error);
        });

        // Handle successful join
        externalApi.addListener('videoConferenceJoined', (conference) => {
            console.log('Successfully joined conference:', conference);
        });

        // Handle session end
        externalApi.addListener('readyToClose', () => {
            endSession();
        });
    };

    const endSession = async () => {
        try {
            if (userRole === 'TUTOR') {
                await axiosClient.post(`/sessions/${sessionId}/video/end`);
            }
            setIsSessionEnded(true);
            navigate(`/sessions/${sessionId}/summary`);
        } catch (err) {
            setError('Failed to properly end the session');
        }
    };

    if (loading) {
        return (
            <div className="text-center py-5">
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
                <p className="mt-2">Preparing your video session...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container py-5">
                <Alert variant="danger">
                    <Alert.Heading>Error</Alert.Heading>
                    <p>{error}</p>
                    <Button onClick={() => window.location.reload()}>Try Again</Button>
                </Alert>
            </div>
        );
    }

    if (isSessionEnded) {
        return (
            <div className="container py-5">
                <Alert variant="success">
                    <Alert.Heading>Session Ended</Alert.Heading>
                    <p>You will be redirected to the session summary.</p>
                </Alert>
            </div>
        );
    }

    // Make sure we have the room name and user details before rendering
    if (!roomDetails?.roomName || !userDetails) {
        return (
            <div className="container py-5">
                <Alert variant="warning">
                    <Alert.Heading>Missing Required Information</Alert.Heading>
                    <p>Unable to get the necessary details. Please try again.</p>
                    <Button onClick={() => window.location.reload()}>Try Again</Button>
                </Alert>
            </div>
        );
    }

    return (
        <div style={{ height: '100vh', width: '100%' }}>
            <JitsiMeeting
                roomName={roomDetails.roomName}
                configOverwrite={{
                    startWithAudioMuted: true,
                    startWithVideoMuted: false,
                    disableModeratorIndicator: userRole !== 'TUTOR',
                    enableNoisyMicDetection: false,
                    prejoinPageEnabled: false,
                    // Disable external authentication - we'll use our own user info
                    disableThirdPartyRequests: true,
                    disableProfile: false,
                    // Critical settings for lobby mode issues:
                    enableWelcomePage: false,
                    enableClosePage: false,
                    // Prevent waiting in lobby:
                    lobby: {
                        autoKnock: true,
                        enableForceMute: false
                    },
                    // Set this based on your setup
                    requireDisplayName: false,
                }}
                interfaceConfigOverwrite={{
                    DISABLE_JOIN_LEAVE_NOTIFICATIONS: true,
                    SHOW_CHROME_EXTENSION_BANNER: false,
                    MOBILE_APP_PROMO: false,
                    HIDE_INVITE_MORE_HEADER: true,
                    DISABLE_FOCUS_INDICATOR: true,
                    DISABLE_VIDEO_BACKGROUND: true,
                    TOOLBAR_BUTTONS: [
                        'microphone', 'camera', 'desktop', 'fullscreen',
                        'hangup', 'profile', 'chat', 'raisehand',
                        'videoquality', 'filmstrip', 'tileview',
                        'mute-everyone'
                    ]
                }}
                getIFrameRef={(iframeRef) => {
                    iframeRef.style.height = '100%';
                    iframeRef.style.width = '100%';
                    iframeRef.style.borderRadius = '8px';
                }}
                onApiReady={(externalApi) => handleApiReady(externalApi)}
                userInfo={{
                    displayName: userDetails.username || 'Anonymous',
                    email: userDetails.email || '',
                    moderator: userRole === 'TUTOR'
                }}
                jwt={roomDetails.jwt || ''} // Add JWT if provided by backend
            />

            {userRole === 'TUTOR' && (
                <div style={{ position: 'fixed', bottom: '10px', right: '10px', zIndex: 1000 }}>
                    <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => {
                            if (window.jitsiApi) {
                                console.log('Executing command to end lobby mode');
                                window.jitsiApi.executeCommand('toggleLobby', false);
                            }
                        }}
                    >
                        Accept All Participants
                    </Button>
                </div>
            )}
        </div>
    );
};

export default VideoConference;