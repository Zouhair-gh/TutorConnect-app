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
    const [sessionInfo, setSessionInfo] = useState({
        roomName: '',
        requirePassword: false,
        moderatorPassword: ''
    });
    const [userDetails, setUserDetails] = useState(null);

    useEffect(() => {
        const fetchSessionInfo = async () => {
            try {
                // Make sure we have a valid token
                const token = localStorage.getItem('token'); // Check which key you're using for token storage

                // Check if token is set properly in localStorage
                console.log('Using token:', token);

                const response = await axiosClient.get(`/sessions/${sessionId}/video`);
                setSessionInfo(response.data);
                setLoading(false);
            } catch (err) {
                console.error('Failed to fetch session info:', err);
                console.error('Error response:', err.response);
                setError(err.response?.data?.message || 'Access denied');
                setLoading(false);
            }
        };

        // Set default user details if they're null
        if (!userDetails) {
            setUserDetails({
                displayName: 'Anonymous User',
                email: 'anonymous@example.com'
            });
        }

        fetchSessionInfo();
    }, [sessionId, navigate]);
    const handleApiReady = (externalApi) => {
        // Set user information
        externalApi.executeCommand('displayName', userDetails.displayName);
        externalApi.executeCommand('email', userDetails.email);

        // Handle password if required (for tutors)
        if (sessionInfo.requirePassword) {
            externalApi.addEventListener('passwordRequired', () => {
                externalApi.executeCommand('password', sessionInfo.moderatorPassword);
            });
        }

        // Handle session end
        externalApi.addEventListener('readyToClose', () => {
            navigate(`/sessions/${sessionId}/summary`);
        });
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
                    <Alert.Heading>Access Denied</Alert.Heading>
                    <p>{error}</p>
                    {error.includes('403') && (
                        <Button
                            variant="primary"
                            onClick={() => navigate('/log')}
                        >
                            Go to Login
                        </Button>
                    )}
                </Alert>
            </div>
        );
    }

    return (
        <div style={{ height: '100vh', width: '100%' }}>
            <JitsiMeeting
                roomName={sessionInfo.roomName}
                configOverwrite={{
                    startWithAudioMuted: true,
                    startWithVideoMuted: false,
                    disableThirdPartyRequests: true,
                    disableProfile: true,
                    requireDisplayName: true,
                    enableWelcomePage: false,
                    enableClosePage: false,
                    authentication: { enabled: false }, // Disable external auth
                    disableGravatar: true,
                    enableNoisyMicDetection: false,
                    prejoinPageEnabled: false,
                    toolbarButtons: [
                        'microphone', 'camera', 'desktop', 'fullscreen',
                        'hangup', 'profile', 'chat', 'raisehand'
                    ]
                }}
                interfaceConfigOverwrite={{
                    DISABLE_JOIN_LEAVE_NOTIFICATIONS: true,
                    SHOW_CHROME_EXTENSION_BANNER: false,
                    MOBILE_APP_PROMO: false,
                    HIDE_INVITE_MORE_HEADER: true
                }}
                userInfo={{
                    displayName: userDetails.displayName,
                    email: userDetails.email
                }}
                onApiReady={handleApiReady}
                getIFrameRef={(iframe) => {
                    iframe.style.height = '100%';
                    iframe.style.width = '100%';
                }}
            />

            {userRole === 'TUTOR' && (
                <div style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 1000 }}>
                    <Button
                        variant="danger"
                        onClick={() => navigate(`/sessions/${sessionId}/summary`)}
                    >
                        End Session
                    </Button>
                </div>
            )}
        </div>
    );
};

export default VideoConference;