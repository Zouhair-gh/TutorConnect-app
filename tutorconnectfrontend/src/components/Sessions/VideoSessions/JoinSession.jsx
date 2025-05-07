import React from 'react';
import { useParams } from 'react-router-dom';
import VideoConference from "./VideoConference";

const JoinSession = () => {
    const { sessionId } = useParams();

    return (
        <VideoConference userRole="PARTICIPANT" />
    );
};

export default JoinSession;