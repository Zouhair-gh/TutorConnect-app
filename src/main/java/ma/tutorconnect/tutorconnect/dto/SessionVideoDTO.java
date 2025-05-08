package ma.tutorconnect.tutorconnect.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SessionVideoDTO {
    private Long sessionId;
    private String roomName;
    private String status;  // CREATED, STARTED, ENDED
    private String joinUrl;




    public void setSessionId(Long sessionId) {
        this.sessionId = sessionId;
    }

    public void setRoomName(String roomName) {
        this.roomName = roomName;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public void setJoinUrl(String joinUrl) {
        this.joinUrl = joinUrl;
    }

    public Long getSessionId() {
        return sessionId;
    }

    public String getRoomName() {
        return roomName;
    }

    public String getStatus() {
        return status;
    }

    public String getJoinUrl() {
        return joinUrl;
    }
}