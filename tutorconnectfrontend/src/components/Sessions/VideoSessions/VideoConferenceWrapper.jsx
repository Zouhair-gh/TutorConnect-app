import React from 'react';
import { useLocation } from 'react-router-dom';
import VideoConference from './VideoConference';

const VideoConferenceWrapper = ({ isTutor }) => {
    const location = useLocation();


    return (
        <VideoConference
            userRole={isTutor ? 'TUTOR' : 'PARTICIPANT'}
            key={location.pathname}
        />
    );
};

export default VideoConferenceWrapper;