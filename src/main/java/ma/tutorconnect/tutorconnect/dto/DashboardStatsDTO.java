package ma.tutorconnect.tutorconnect.dto;

public class DashboardStatsDTO {

    private long totalParticipants;
    private long totalTutors;
    private long totalUsers;
    private long totalPayments;
    private long totalRooms;

    public long getTotalParticipants() {
        return totalParticipants;
    }

    public long getTotalTutors() {
        return totalTutors;
    }

    public long getTotalUsers (){
        return totalUsers;
    }

    public long getTotalPayments() {
        return totalPayments;
    }

    public long getTotalRooms() {
        return totalRooms;
    }

    public void setTotalParticipants(long totalParticipants) {
        this.totalParticipants = totalParticipants;
    }

    public void setTotalTutors(long totalTutors) {
        this.totalTutors = totalTutors;
    }

    public void setTotalDeliverables(long totalUsers) {
        this.totalUsers = totalUsers;
    }

    public void setTotalPayments(long totalPayments) {
        this.totalPayments = totalPayments;
    }

    public void setTotalRooms(long totalRooms) {
        this.totalRooms = totalRooms;
    }

    public DashboardStatsDTO(long totalParticipants, long totalTutors, long totalUsers, long totalPayments, long totalRooms) {
        this.totalParticipants = totalParticipants;
        this.totalTutors = totalTutors;
        this.totalUsers = totalUsers;
        this.totalPayments = totalPayments;
        this.totalRooms = totalRooms;
    }
}
