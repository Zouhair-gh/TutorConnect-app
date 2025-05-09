package ma.tutorconnect.tutorconnect.dto;

import java.util.ArrayList;
import java.util.List;

public class TutorDashboardStatsDTO {
    private int upcomingSessions;
    private int pendingDeliverables;
    private int activeStudents;
    private List<SessionChartDTO> sessionChartData;
    private List<String> mostActiveStudents;
    private DeliverableStatsDTO deliverableStats;
    private List<AttendanceStatsDTO> attendanceStats;

    // Default constructor
    public TutorDashboardStatsDTO() {
        // Initialize default values to prevent null pointer exceptions
        this.upcomingSessions = 0;
        this.pendingDeliverables = 0;
        this.activeStudents = 0;
        this.sessionChartData = new ArrayList<>();
        this.mostActiveStudents = new ArrayList<>();
        this.deliverableStats = new DeliverableStatsDTO();
        this.attendanceStats = new ArrayList<>();
    }

    // Getters and setters
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