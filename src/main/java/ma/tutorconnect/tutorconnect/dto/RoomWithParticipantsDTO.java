package ma.tutorconnect.tutorconnect.dto;

import java.time.LocalDateTime;
import java.util.List;
/*
public class RoomWithParticipantsDTO {
    private RoomDTO room;
    private List<ParticipantDTO> participants;

    // Constructors
    public RoomWithParticipantsDTO() {}

    public RoomWithParticipantsDTO(RoomDTO room, List<ParticipantDTO> participants) {
        this.room = room;
        this.participants = participants;
    }

    // Getters and Setters
    public RoomDTO getRoom() { return room; }
    public void setRoom(RoomDTO room) { this.room = room; }
    public List<ParticipantDTO> getParticipants() { return participants; }
    public void setParticipants(List<ParticipantDTO> participants) { this.participants = participants; }
}
*/
public class RoomWithParticipantsDTO {


    private Long id;
    private String name;
    private String description;
    private String status; // ACTIVE, COMPLETED, etc.
    private Integer progress; // 0-100
    private String tutorName;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private List<ParticipantDTO> classmates; // Other participants in the same room

    public RoomWithParticipantsDTO(Long id, String name, String description, String status, Integer progress, String tutorName, LocalDateTime startDate, LocalDateTime endDate, List<ParticipantDTO> classmates) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.status = status;
        this.progress = progress;
        this.tutorName = tutorName;
        this.startDate = startDate;
        this.endDate = endDate;
        this.classmates = classmates;
    }
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Integer getProgress() { return progress; }
    public void setProgress(Integer progress) { this.progress = progress; }

    public String getTutorName() { return tutorName; }
    public void setTutorName(String tutorName) { this.tutorName = tutorName; }

    public LocalDateTime getStartDate() { return startDate; }
    public void setStartDate(LocalDateTime startDate) { this.startDate = startDate; }

    public LocalDateTime getEndDate() { return endDate; }
    public void setEndDate(LocalDateTime endDate) { this.endDate = endDate; }

    public List<ParticipantDTO> getClassmates() { return classmates; }
    public void setClassmates(List<ParticipantDTO> classmates) { this.classmates = classmates; }
}