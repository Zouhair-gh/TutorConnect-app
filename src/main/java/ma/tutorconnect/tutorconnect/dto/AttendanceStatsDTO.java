package ma.tutorconnect.tutorconnect.dto;

public class AttendanceStatsDTO {
    private String sessionName;
    private int totalParticipants;
    private int attended;

    // Getters and setters
    public String getSessionName() { return sessionName; }
    public void setSessionName(String sessionName) { this.sessionName = sessionName; }
    public int getTotalParticipants() { return totalParticipants; }
    public void setTotalParticipants(int totalParticipants) { this.totalParticipants = totalParticipants; }
    public int getAttended() { return attended; }
    public void setAttended(int attended) { this.attended = attended; }


}