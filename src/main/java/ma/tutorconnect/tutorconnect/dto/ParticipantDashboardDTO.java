package ma.tutorconnect.tutorconnect.dto;

public class ParticipantDashboardDTO {
    private long roomCount;
    private long totalAssignments;
    private long completedAssignments;
    private double totalPaid;
    private double totalUnpaid;

    // constructor
    public ParticipantDashboardDTO(long roomCount, long totalAssignments, long completedAssignments, double totalPaid, double totalUnpaid) {
        this.roomCount = roomCount;
        this.totalAssignments = totalAssignments;
        this.completedAssignments = completedAssignments;
        this.totalPaid = totalPaid;
        this.totalUnpaid = totalUnpaid;
    }

    public long getRoomCount() {
        return roomCount;
    }

    public void setRoomCount(long roomCount) {
        this.roomCount = roomCount;
    }

    public long getTotalAssignments() {
        return totalAssignments;
    }

    public void setTotalAssignments(long totalAssignments) {
        this.totalAssignments = totalAssignments;
    }

    public long getCompletedAssignments() {
        return completedAssignments;
    }

    public void setCompletedAssignments(long completedAssignments) {
        this.completedAssignments = completedAssignments;
    }

    public double getTotalPaid() {
        return totalPaid;
    }

    public void setTotalPaid(double totalPaid) {
        this.totalPaid = totalPaid;
    }

    public double getTotalUnpaid() {
        return totalUnpaid;
    }

    public void setTotalUnpaid(double totalUnpaid) {
        this.totalUnpaid = totalUnpaid;
    }
}
