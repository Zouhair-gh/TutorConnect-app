package ma.tutorconnect.tutorconnect.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.sql.Date;

@Entity

public class Deliverable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String description;
    private Date startDate;
    private Date endDate;
    private Date deadline;
    private Date submissionDate;
    private String filePath;
    private boolean isSubmitted;

    @ManyToOne
    @JoinColumn(name = "room_id")
    private Room room;

    @ManyToOne
    @JoinColumn(name = "participant_id")
    private Participant participant;

    @ManyToOne
    @JoinColumn(name = "tutor_id")
    private Tutor tutor;

    public Date getSubmissionDate() {
        return submissionDate;
    }
    public void setSubmissionDate(Date submissionDate) {
        this.submissionDate = submissionDate;
    }

    public Long getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public String getDescription() {
        return description;
    }

    public Date getEndDate() {
        return endDate;
    }

    public Date getStartDate() {
        return startDate;
    }

    public Date getDeadline() {
        return deadline;
    }

    public String getFilePath() {
        return filePath;
    }

    public boolean isSubmitted() {
        return isSubmitted;
    }

    public Room getRoom() {
        return room;
    }

    public Participant getParticipant() {
        return participant;
    }

    public Tutor getTutor() {
        return tutor;
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

    public void setStartDate(Date startDate) {
        this.startDate = startDate;
    }

    public void setEndDate(Date endDate) {
        this.endDate = endDate;
    }

    public void setDeadline(Date deadline) {
        this.deadline = deadline;
    }

    public void setFilePath(String filePath) {
        this.filePath = filePath;
    }

    public void setSubmitted(boolean submitted) {
        isSubmitted = submitted;
    }

    public void setRoom(Room room) {
        this.room = room;
    }

    public void setTutor(Tutor tutor) {
        this.tutor = tutor;
    }

    public void setParticipant(Participant participant) {
        this.participant = participant;
    }
}