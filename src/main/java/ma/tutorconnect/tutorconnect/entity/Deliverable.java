package ma.tutorconnect.tutorconnect.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.sql.Date;
import java.util.ArrayList;
import java.util.List;

@Entity
@Data
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
    private boolean isVisible;
    private Double grade;
    private String feedback;
    private Integer maxPoints;
    private String attachmentUrl;

    @ManyToOne
    @JoinColumn(name = "room_id")
    private Room room;

    @ManyToOne
    @JoinColumn(name = "participant_id")
    private Participant participant;

    @ManyToOne
    @JoinColumn(name = "tutor_id")
    private Tutor tutor;

    @OneToMany(mappedBy = "deliverable", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<DeliverableComment> comments = new ArrayList<>();

    @OneToMany(mappedBy = "deliverable", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<DeliverableAttachment> attachments = new ArrayList<>();

    @Transient
    public boolean isPastDeadline() {
        if (deadline == null) return false;
        return new Date(System.currentTimeMillis()).after(deadline);
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

    public Date getStartDate() {
        return startDate;
    }

    public Date getEndDate() {
        return endDate;
    }

    public Date getDeadline() {
        return deadline;
    }

    public boolean isSubmitted() {
        return isSubmitted;
    }

    public Date getSubmissionDate() {
        return submissionDate;
    }

    public String getFilePath() {
        return filePath;
    }

    public boolean isVisible() {
        return isVisible;
    }

    public Double getGrade() {
        return grade;
    }

    public String getFeedback() {
        return feedback;
    }

    public String getAttachmentUrl() {
        return attachmentUrl;
    }

    public Room getRoom() {
        return room;
    }

    public Integer getMaxPoints() {
        return maxPoints;
    }

    public Participant getParticipant() {
        return participant;
    }

    public Tutor getTutor() {
        return tutor;
    }

    public List<DeliverableAttachment> getAttachments() {
        return attachments;
    }

    public List<DeliverableComment> getComments() {
        return comments;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public void setStartDate(Date startDate) {
        this.startDate = startDate;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setEndDate(Date endDate) {
        this.endDate = endDate;
    }

    public void setDeadline(Date deadline) {
        this.deadline = deadline;
    }

    public void setSubmissionDate(Date submissionDate) {
        this.submissionDate = submissionDate;
    }

    public void setFilePath(String filePath) {
        this.filePath = filePath;
    }

    public void setSubmitted(boolean submitted) {
        isSubmitted = submitted;
    }

    public void setVisible(boolean visible) {
        isVisible = visible;
    }

    public void setGrade(Double grade) {
        this.grade = grade;
    }

    public void setFeedback(String feedback) {
        this.feedback = feedback;
    }

    public void setMaxPoints(Integer maxPoints) {
        this.maxPoints = maxPoints;
    }

    public void setAttachmentUrl(String attachmentUrl) {
        this.attachmentUrl = attachmentUrl;
    }

    public void setRoom(Room room) {
        this.room = room;
    }

    public void setParticipant(Participant participant) {
        this.participant = participant;
    }

    public void setTutor(Tutor tutor) {
        this.tutor = tutor;
    }

    public void setComments(List<DeliverableComment> comments) {
        this.comments = comments;
    }

    public void setAttachments(List<DeliverableAttachment> attachments) {
        this.attachments = attachments;
    }
}