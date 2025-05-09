package ma.tutorconnect.tutorconnect.service;


import ma.tutorconnect.tutorconnect.dto.AttendanceStatsDTO;
import ma.tutorconnect.tutorconnect.dto.DeliverableStatsDTO;
import ma.tutorconnect.tutorconnect.dto.SessionChartDTO;
import ma.tutorconnect.tutorconnect.dto.TutorDashboardStatsDTO;
import ma.tutorconnect.tutorconnect.entity.Deliverable;
import ma.tutorconnect.tutorconnect.entity.Participant;
import ma.tutorconnect.tutorconnect.entity.Session;
import ma.tutorconnect.tutorconnect.repository.DeliverableRepository;
import ma.tutorconnect.tutorconnect.repository.ParticipantRepository;
import ma.tutorconnect.tutorconnect.repository.SessionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.TextStyle;
import java.util.*;
import java.util.stream.Collectors;


@Service
public class TutorDashboardService {

    private final SessionRepository sessionRepository;
    private final ParticipantRepository participantRepository;
    private final DeliverableRepository deliverableRepository;

    @Autowired
    public TutorDashboardService(
            SessionRepository sessionRepository,
            ParticipantRepository participantRepository,
            DeliverableRepository deliverableRepository) {
        this.sessionRepository = sessionRepository;
        this.participantRepository = participantRepository;
        this.deliverableRepository = deliverableRepository;
    }

    public TutorDashboardStatsDTO getDashboardStats(Long tutorId) {
        TutorDashboardStatsDTO stats = new TutorDashboardStatsDTO();

        // Get upcoming sessions count
        LocalDateTime now = LocalDateTime.now();
        List<Session> tutorSessions = sessionRepository.findSessionsByTutorId(tutorId);
        int upcomingSessions = (int) tutorSessions.stream()
                .filter(session -> session.getStartTime().isAfter(now))
                .count();
        stats.setUpcomingSessions(upcomingSessions);

        // Get pending deliverables count
        List<Deliverable> deliverables = deliverableRepository.findByTutorId(tutorId);
        int pendingDeliverables = (int) deliverables.stream()
                .filter(d -> !d.isSubmitted() && d.getDeadline().after(new Date()))
                .count();
        stats.setPendingDeliverables(pendingDeliverables);

        // Get active students (unique participants across all sessions)
        Set<Long> activeStudentIds = new HashSet<>();
        for (Session session : tutorSessions) {
            if (session.getAttendees() != null) {
                session.getAttendees().forEach(participant -> activeStudentIds.add(participant.getId()));
            }
        }
        stats.setActiveStudents(activeStudentIds.size());

        // Get session chart data (sessions per month for the last 6 months)
        stats.setSessionChartData(getSessionChartData(tutorId));

        // Get most active students
        stats.setMostActiveStudents(getMostActiveStudents(tutorId));

        // Get deliverable stats
        stats.setDeliverableStats(getDeliverableStats(tutorId));

        // Get attendance stats
        stats.setAttendanceStats(getAttendanceStats(tutorId));

        return stats;
    }

    private List<SessionChartDTO> getSessionChartData(Long tutorId) {
        List<SessionChartDTO> chartData = new ArrayList<>();
        LocalDateTime now = LocalDateTime.now();

        // Get data for the last 6 months
        for (int i = 5; i >= 0; i--) {
            LocalDateTime start = now.minusMonths(i).withDayOfMonth(1).withHour(0).withMinute(0).withSecond(0);
            LocalDateTime end;
            if (i == 0) {
                end = now;
            } else {
                end = start.plusMonths(1).minusSeconds(1);
            }

            List<Session> sessions = sessionRepository.findByStartTimeBetween(start, end);
            long count = sessions.stream()
                    .filter(session -> {
                        try {
                            return session.getRoom().getTutor().getId().equals(tutorId);
                        } catch (Exception e) {
                            return false;
                        }
                    })
                    .count();

            // Format month as "Jan", "Feb", etc.
            String monthLabel = start.getMonth().getDisplayName(TextStyle.SHORT, Locale.ENGLISH);
            chartData.add(new SessionChartDTO(monthLabel, count));
        }

        return chartData;
    }

    private List<String> getMostActiveStudents(Long tutorId) {
        // Logic to find students who attended the most sessions
        Map<Long, Integer> participantSessionCount = new HashMap<>();
        List<Session> tutorSessions = sessionRepository.findSessionsByTutorId(tutorId);

        for (Session session : tutorSessions) {
            if (session.getAttendees() != null) {
                for (Participant attendee : session.getAttendees()) {
                    participantSessionCount.put(
                            attendee.getId(),
                            participantSessionCount.getOrDefault(attendee.getId(), 0) + 1
                    );
                }
            }
        }

        // Sort by session count and get top 3 names
        return participantSessionCount.entrySet().stream()
                .sorted(Map.Entry.<Long, Integer>comparingByValue().reversed())
                .limit(3)
                .map(entry -> {
                    Participant participant = participantRepository.findById(entry.getKey()).orElse(null);
                    if (participant != null) {
                        return participant.getFirstName() + " " + participant.getLastName() + " (" + entry.getValue() + " sessions)";
                    }
                    return "Unknown";
                })
                .collect(Collectors.toList());
    }

    private DeliverableStatsDTO getDeliverableStats(Long tutorId) {
        List<Deliverable> deliverables = deliverableRepository.findByTutorId(tutorId);
        int completed = 0;
        int inProgress = 0;
        int overdue = 0;
        int notStarted = 0;  // Optional

        Date now = new Date();

        for (Deliverable d : deliverables) {
            if (d.isSubmitted()) {
                completed++;
            } else {
                if (d.getDeadline().after(now)) {
                    inProgress++;
                } else {
                    overdue++;
                }
            }
        }

        DeliverableStatsDTO stats = new DeliverableStatsDTO();
        stats.setCompleted(completed);
        stats.setInProgress(inProgress);
        stats.setOverdue(overdue);
        stats.setNotStarted(notStarted);  // Optional (always zero here)

        return stats;
    }

    private List<AttendanceStatsDTO> getAttendanceStats(Long tutorId) {
        List<Session> sessions = sessionRepository.findSessionsByTutorId(tutorId);
        List<AttendanceStatsDTO> statsList = new ArrayList<>();

        for (Session session : sessions) {
            AttendanceStatsDTO stats = new AttendanceStatsDTO();
            stats.setSessionName(session.getTitle());  // Assuming session has title
            int totalParticipants = session.getAttendees() != null ? session.getAttendees().size() : 0;
            stats.setTotalParticipants(totalParticipants);
            stats.setAttended(totalParticipants);  // Assuming all attended

            statsList.add(stats);
        }

        return statsList;
    }
}
