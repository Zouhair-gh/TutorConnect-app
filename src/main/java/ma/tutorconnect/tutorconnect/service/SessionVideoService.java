package ma.tutorconnect.tutorconnect.service;

import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class SessionVideoService {
    // In-memory store for active video sessions
    private final Map<Long, String> activeSessions = new ConcurrentHashMap<>();

    public String createVideoRoom(Long sessionId) {
        // Generate unique room name
        String roomName = "tutorconnect-" + sessionId + "-" + UUID.randomUUID().toString().substring(0, 8);

        // Store in memory
        activeSessions.put(sessionId, roomName);

        return roomName;
    }

    public String getSessionRoomName(Long sessionId) {
        String roomName = activeSessions.get(sessionId);
        if (roomName == null) {
            throw new IllegalStateException("No active video session for session ID: " + sessionId);
        }
        return roomName;
    }

    public void endVideoSession(Long sessionId) {
        activeSessions.remove(sessionId);
    }

    public boolean isVideoSessionActive(Long sessionId) {
        return activeSessions.containsKey(sessionId);
    }
}