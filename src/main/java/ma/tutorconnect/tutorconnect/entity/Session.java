package ma.tutorconnect.tutorconnect.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import ma.tutorconnect.tutorconnect.enums.SessionStatus;
import ma.tutorconnect.tutorconnect.enums.SessionType;


import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Session {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String description;
    private LocalDateTime startTime;
    private LocalDateTime endTime;

    @Enumerated(EnumType.STRING)
    private SessionType sessionType;

    private boolean isRecurring;
    private String recurringPattern; // Could be "WEEKLY", "DAILY", etc. with additional data

    // Link to the room this session belongs to
    @ManyToOne
    @JoinColumn(name = "room_id")
    private Room room;

    @ManyToMany
    @JoinTable(
            name = "session_attendees",
            joinColumns = @JoinColumn(name = "session_id"),
            inverseJoinColumns = @JoinColumn(name = "participant_id")
    )
    private List<Participant> attendees = new ArrayList<>();


    // Track session status
    @Enumerated(EnumType.STRING)
    private SessionStatus status = SessionStatus.SCHEDULED;

    // Flag to track if the session was created by a tutor or requested by a participant
    private boolean tutorCreated = true;

    public Long getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public LocalDateTime getStartTime() {
        return startTime;
    }

    public String getDescription() {
        return description;
    }

    public LocalDateTime getEndTime() {
        return endTime;
    }

    public SessionType getSessionType() {
        return sessionType;
    }

    public boolean isRecurring() {
        return isRecurring;
    }

    public String getRecurringPattern() {
        return recurringPattern;
    }

    public Room getRoom() {
        return room;
    }

    public List<Participant> getAttendees() {
        return attendees;
    }

    public SessionStatus getStatus() {
        return status;
    }

    public boolean isTutorCreated() {
        return tutorCreated;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setStartTime(LocalDateTime startTime) {
        this.startTime = startTime;
    }

    public void setEndTime(LocalDateTime endTime) {
        this.endTime = endTime;
    }

    public void setSessionType(SessionType sessionType) {
        this.sessionType = sessionType;
    }

    public void setRecurring(boolean recurring) {
        isRecurring = recurring;
    }

    public void setRecurringPattern(String recurringPattern) {
        this.recurringPattern = recurringPattern;
    }

    public void setRoom(Room room) {
        this.room = room;
    }

    public void setAttendees(List<Participant> attendees) {
        this.attendees = attendees;
    }

    public void setStatus(SessionStatus status) {
        this.status = status;
    }

    public void setTutorCreated(boolean tutorCreated) {
        this.tutorCreated = tutorCreated;
    }
}