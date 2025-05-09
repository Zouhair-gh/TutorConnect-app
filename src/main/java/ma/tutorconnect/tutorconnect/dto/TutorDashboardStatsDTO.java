package ma.tutorconnect.tutorconnect.dto;

import java.util.List;

public class TutorDashboardStatsDTO {
    private int upcomingSessions;
    private int pendingDeliverables;
    private int activeStudents;
    private List<SessionChartDTO> sessionChartData;
    private List<String> mostActiveStudents;
    private DeliverableStatsDTO deliverableStats;
    private List<AttendanceStatsDTO> attendanceStats;

    // Getters and setters
    // ... (add all getters and setters)

    public int getUpcomingSessions() {
        return upcomingSessions;
    }

    public void setUpcomingSessions(int upcomingSessions) {
        this.upcomingSessions = upcomingSessions;
    }

    public int getPendingDeliverables() {
        return pendingDeliverables;
    }

    public void setPendingDeliverables(int pendingDeliverables) {
        this.pendingDeliverables = pendingDeliverables;
    }

    public int getActiveStudents() {
        return activeStudents;
    }

    public void setActiveStudents(int activeStudents) {
        this.activeStudents = activeStudents;
    }

    public List<SessionChartDTO> getSessionChartData() {
        return sessionChartData;
    }

    public void setSessionChartData(List<SessionChartDTO> sessionChartData) {
        this.sessionChartData = sessionChartData;
    }

    public List<String> getMostActiveStudents() {
        return mostActiveStudents;
    }

    public void setMostActiveStudents(List<String> mostActiveStudents) {
        this.mostActiveStudents = mostActiveStudents;
    }

    public DeliverableStatsDTO getDeliverableStats() {
        return deliverableStats;
    }

    public void setDeliverableStats(DeliverableStatsDTO deliverableStats) {
        this.deliverableStats = deliverableStats;
    }

    public List<AttendanceStatsDTO> getAttendanceStats() {
        return attendanceStats;
    }

    public void setAttendanceStats(List<AttendanceStatsDTO> attendanceStats) {
        this.attendanceStats = attendanceStats;
    }
}

