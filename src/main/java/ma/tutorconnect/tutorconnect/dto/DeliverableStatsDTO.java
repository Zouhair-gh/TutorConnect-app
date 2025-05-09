package ma.tutorconnect.tutorconnect.dto;

public class DeliverableStatsDTO {
    private int completed;
    private int inProgress;
    private int overdue;
    private int notStarted;

    // Getters and setters
    public int getCompleted() { return completed; }
    public void setCompleted(int completed) { this.completed = completed; }
    public int getInProgress() { return inProgress; }
    public void setInProgress(int inProgress) { this.inProgress = inProgress; }
    public int getOverdue() { return overdue; }
    public void setOverdue(int overdue) { this.overdue = overdue; }
    public int getNotStarted() { return notStarted; }
    public void setNotStarted(int notStarted) { this.notStarted = notStarted; }
}
