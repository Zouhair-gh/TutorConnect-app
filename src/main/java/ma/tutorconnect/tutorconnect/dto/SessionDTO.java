package ma.tutorconnect.tutorconnect.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import ma.tutorconnect.tutorconnect.enums.SessionStatus;
import ma.tutorconnect.tutorconnect.enums.SessionType;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SessionDTO {
    private Long id;
    private String title;
    private String description;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private SessionType sessionType;
    private boolean isRecurring;
    private String recurringPattern;
    private Long roomId;
    private String roomName;
    private List<Long> attendeeIds;
    private SessionStatus status;
    private boolean tutorCreated;

    // Additional fields for convenience
    private String tutorName;
    private int totalParticipants;
    private int confirmedAttendees;

    public Long getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public String getDescription() {
        return description;
    }

    public LocalDateTime getStartTime() {
        return startTime;
    }

    public LocalDateTime getEndTime() {
        return endTime;
    }

    public boolean isRecurring() {
        return isRecurring;
    }
    public Boolean getisRecurring() {
        return isRecurring;
    }


    public SessionType getSessionType() {
        return sessionType;
    }

    public String getRecurringPattern() {
        return recurringPattern;
    }

    public Long getRoomId() {
        return roomId;
    }

    public String getRoomName() {
        return roomName;
    }

    public List<Long> getAttendeeIds() {
        return attendeeIds;
    }

    public SessionStatus getStatus() {
        return status;
    }

    public boolean isTutorCreated() {
        return tutorCreated;
    }

    public String getTutorName() {
        return tutorName;
    }

    public int getTotalParticipants() {
        return totalParticipants;
    }

    public int getConfirmedAttendees() {
        return confirmedAttendees;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setStartTime(LocalDateTime startTime) {
        this.startTime = startTime;
    }
   public void setIsRecurring(boolean isRecurring) {
        this.isRecurring = isRecurring;
    }


    public void setEndTime(LocalDateTime endTime) {
        this.endTime = endTime;
    }

    public void setSessionType(SessionType sessionType) {
        this.sessionType = sessionType;
    }

    public void setRecurringPattern(String recurringPattern) {
        this.recurringPattern = recurringPattern;
    }

    public void setRecurring(boolean recurring) {
        isRecurring = recurring;
    }

    public void setRoomId(Long roomId) {
        this.roomId = roomId;
    }

    public void setRoomName(String roomName) {
        this.roomName = roomName;
    }

    public void setAttendeeIds(List<Long> attendeeIds) {
        this.attendeeIds = attendeeIds;
    }

    public void setStatus(SessionStatus status) {
        this.status = status;
    }

    public void setTutorCreated(boolean tutorCreated) {
        this.tutorCreated = tutorCreated;
    }

    public void setTotalParticipants(int totalParticipants) {
        this.totalParticipants = totalParticipants;
    }

    public void setTutorName(String tutorName) {
        this.tutorName = tutorName;
    }

    public void setConfirmedAttendees(int confirmedAttendees) {
        this.confirmedAttendees = confirmedAttendees;
    }
}