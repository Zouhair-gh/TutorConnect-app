package ma.tutorconnect.tutorconnect.service;

import ma.tutorconnect.tutorconnect.dto.SessionDTO;
import ma.tutorconnect.tutorconnect.dto.SessionVideoDTO;
import ma.tutorconnect.tutorconnect.entity.Participant;
import ma.tutorconnect.tutorconnect.entity.Room;
import ma.tutorconnect.tutorconnect.entity.Session;
import ma.tutorconnect.tutorconnect.enums.SessionStatus;
import ma.tutorconnect.tutorconnect.repository.ParticipantRepository;
import ma.tutorconnect.tutorconnect.repository.RoomRepository;
import ma.tutorconnect.tutorconnect.repository.SessionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class SessionService {

    @Autowired
    private SessionRepository sessionRepository;

    @Autowired
    private RoomRepository roomRepository;

    @Autowired
    private ParticipantRepository participantRepository;

    private static final org.slf4j.Logger logger = org.slf4j.LoggerFactory.getLogger(SessionService.class);

    public List<SessionDTO> getAllSessions() {
        return sessionRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public SessionDTO getSessionById(Long id) {
        Session session = sessionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Session not found with id: " + id));
        return convertToDTO(session);
    }

    public List<SessionDTO> getSessionsByRoomId(Long roomId) {
        return sessionRepository.findByRoomId(roomId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<SessionDTO> getUpcomingSessions(Long roomId) {
        return sessionRepository.findUpcomingSessionsByRoomId(roomId, LocalDateTime.now()).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<SessionDTO> getSessionsByParticipant(Long participantId) {
        return sessionRepository.findSessionsByParticipantId(participantId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<SessionDTO> getSessionsByTutor(Long tutorId) {
        return sessionRepository.findSessionsByTutorId(tutorId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public SessionDTO createSession(SessionDTO sessionDTO) {
        Session session = convertToEntity(sessionDTO);

        // Validate room exists and user has access
        Room room = roomRepository.findById(sessionDTO.getRoomId())
                .orElseThrow(() -> new RuntimeException("Room not found with id: " + sessionDTO.getRoomId()));

        session.setRoom(room);

        // Handle recurring sessions if needed
        if (session.isRecurring()) {
            // Here you would implement the logic for creating recurring sessions
            // This is a simplified version just handling a single session
        }

        Session savedSession = sessionRepository.save(session);
        return convertToDTO(savedSession);
    }

    @Transactional
    public SessionDTO updateSession(Long id, SessionDTO sessionDTO) {
        Session existingSession = sessionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Session not found with id: " + id));

        // Update fields
        existingSession.setTitle(sessionDTO.getTitle());
        existingSession.setDescription(sessionDTO.getDescription());
        existingSession.setStartTime(sessionDTO.getStartTime());
        existingSession.setEndTime(sessionDTO.getEndTime());
        existingSession.setSessionType(sessionDTO.getSessionType());
        existingSession.setStatus(sessionDTO.getStatus());

        // Handle recurring pattern updates if needed
        if (sessionDTO.isRecurring() != existingSession.isRecurring() ||
                !sessionDTO.getRecurringPattern().equals(existingSession.getRecurringPattern())) {
            existingSession.setRecurring(sessionDTO.isRecurring());
            existingSession.setRecurringPattern(sessionDTO.getRecurringPattern());
            // Here you would implement the logic for updating recurring sessions
        }

        Session updatedSession = sessionRepository.save(existingSession);
        return convertToDTO(updatedSession);
    }

    @Transactional
    public void deleteSession(Long id) {
        sessionRepository.deleteById(id);
    }

    @Transactional
    public SessionDTO confirmAttendance(Long sessionId, Long participantId) {
        Session session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new RuntimeException("Session not found with id: " + sessionId));

        Participant participant = participantRepository.findById(participantId)
                .orElseThrow(() -> new RuntimeException("Participant not found with id: " + participantId));

        // Check if participant is part of the room
        if (!session.getRoom().getParticipants().contains(participant)) {
            throw new RuntimeException("Participant is not part of this room");
        }

        // Add participant to attendees if not already there
        if (!session.getAttendees().contains(participant)) {
            session.getAttendees().add(participant);
            sessionRepository.save(session);
        }

        return convertToDTO(session);
    }

    @Transactional
    public SessionDTO cancelAttendance(Long sessionId, Long participantId) {
        Session session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new RuntimeException("Session not found with id: " + sessionId));

        Participant participant = participantRepository.findById(participantId)
                .orElseThrow(() -> new RuntimeException("Participant not found with id: " + participantId));

        // Remove participant from attendees if present
        if (session.getAttendees().contains(participant)) {
            session.getAttendees().remove(participant);
            sessionRepository.save(session);
        }

        return convertToDTO(session);
    }

    @Transactional
    public SessionDTO changeSessionStatus(Long id, SessionStatus status) {
        Session session = sessionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Session not found with id: " + id));

        session.setStatus(status);
        Session updatedSession = sessionRepository.save(session);

        return convertToDTO(updatedSession);
    }

    private SessionDTO convertToDTO(Session session) {
        SessionDTO dto = new SessionDTO();
        dto.setId(session.getId());
        dto.setTitle(session.getTitle());
        dto.setDescription(session.getDescription());
        dto.setStartTime(session.getStartTime());
        dto.setEndTime(session.getEndTime());
        dto.setSessionType(session.getSessionType());
        dto.setIsRecurring(session.isRecurring());
        dto.setRecurringPattern(session.getRecurringPattern());
        dto.setRoomId(session.getRoom().getId());
        dto.setRoomName(session.getRoom().getName());
        dto.setStatus(session.getStatus());
        dto.setTutorCreated(session.isTutorCreated());

        // Set additional convenience fields
        dto.setTutorName(session.getRoom().getTutor().getFirstName() + " " + session.getRoom().getTutor().getLastName());
        dto.setTotalParticipants(session.getRoom().getParticipants().size());
        dto.setConfirmedAttendees(session.getAttendees().size());

        // Set attendee ids
        List<Long> attendeeIds = session.getAttendees().stream()
                .map(Participant::getId)
                .collect(Collectors.toList());
        dto.setAttendeeIds(attendeeIds);

        return dto;
    }

    private Session convertToEntity(SessionDTO dto) {
        Session session = new Session();
        session.setId(dto.getId());
        session.setTitle(dto.getTitle());
        session.setDescription(dto.getDescription());
        session.setStartTime(dto.getStartTime());
        session.setEndTime(dto.getEndTime());
        session.setSessionType(dto.getSessionType());
        session.setRecurring(dto.isRecurring());
        session.setRecurringPattern(dto.getRecurringPattern());
        session.setStatus(dto.getStatus());
        session.setTutorCreated(dto.isTutorCreated());

        // Handle attendees if provided
        if (dto.getAttendeeIds() != null && !dto.getAttendeeIds().isEmpty()) {
            List<Participant> attendees = new ArrayList<>();
            for (Long attendeeId : dto.getAttendeeIds()) {
                participantRepository.findById(attendeeId).ifPresent(attendees::add);
            }
            session.setAttendees(attendees);
        }

        return session;
    }


    public boolean isUserSessionOwner(Long sessionId, String userEmail) {
        try {
            Optional<Session> sessionOpt = sessionRepository.findById(sessionId);
            if (!sessionOpt.isPresent()) {
                return false;
            }

            Session session = sessionOpt.get();

            if (session.getRoom() != null && session.getRoom().getTutor() != null) {
                return session.getRoom().getTutor().getEmail().equals(userEmail);
            }

            if (session.isTutorCreated() && !session.getAttendees().isEmpty()) {
                return session.getAttendees().get(0).getEmail().equals(userEmail);
            }

            return false;
        } catch (Exception e) {
            logger.error("Error checking if user is session owner: {}", e.getMessage(), e);
            return false;
        }
    }

    public boolean isUserAllowedInSession(Long sessionId, String userEmail) {
        try {
            Optional<Session> sessionOpt = sessionRepository.findById(sessionId);
            if (!sessionOpt.isPresent()) {
                logger.warn("Session with ID {} not found", sessionId);
                return false;
            }

            Session session = sessionOpt.get();

            // Log for debugging
            logger.info("Checking if user {} is allowed in session {}", userEmail, sessionId);
            logger.info("Session has {} attendees", session.getAttendees().size());

            boolean isAttendee = session.getAttendees().stream()
                    .anyMatch(p -> p.getEmail().equals(userEmail));

            boolean isRoomOwner = false;
            if (session.getRoom() != null && session.getRoom().getTutor() != null) {
                isRoomOwner = session.getRoom().getTutor().getEmail().equals(userEmail);
            }

            logger.info("User {} is attendee: {}, is room owner: {}", userEmail, isAttendee, isRoomOwner);

            return isAttendee || isRoomOwner;
        } catch (Exception e) {
            logger.error("Error checking if user is allowed in session: {}", e.getMessage(), e);
            return false;
        }
    }
    public String getSessionRoomName(Long sessionId) {
        // Generate consistent room name based on session ID
        return "tutorconnect-session-" + sessionId;
    }

    public Map<String, String> startVideoSession(Long sessionId) {
        Map<String, String> response = new HashMap<>();
        response.put("roomName", "tutorconnect-" + sessionId + "-" + UUID.randomUUID().toString().substring(0, 8));
        return response;
    }

    public Map<String, String> getVideoSessionInfo(Long sessionId) {
        Map<String, String> response = new HashMap<>();
        response.put("roomName", getSessionRoomName(sessionId));
        response.put("status", "AVAILABLE");
        return response;
    }
    public SessionVideoDTO endVideoSession(Long sessionId) {
        SessionVideoDTO videoDTO = new SessionVideoDTO();
        videoDTO.setSessionId(sessionId);
        videoDTO.setStatus("ENDED");
        return videoDTO;
    }

    public SessionVideoDTO createVideoRoom(Long sessionId) {
        SessionVideoDTO videoDTO = new SessionVideoDTO();
        videoDTO.setSessionId(sessionId);
        videoDTO.setRoomName("tutor-connect-" + UUID.randomUUID().toString().substring(0, 8));
        videoDTO.setStatus("CREATED");
        return videoDTO;
    }

    public SessionVideoDTO getVideoRoomDetails(Long sessionId) {
        SessionVideoDTO videoDTO = new SessionVideoDTO();
        videoDTO.setSessionId(sessionId);
        videoDTO.setRoomName("tutor-connect-session-" + sessionId);
        videoDTO.setStatus("AVAILABLE");
        videoDTO.setJoinUrl("https://meet.jit.si/" + videoDTO.getRoomName());
        return videoDTO;
    }

    @Transactional
    public SessionDTO confirmAttendance(Long sessionId, String participantEmail) {
        Session session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new RuntimeException("Session not found"));

        Participant participant = participantRepository.findByEmail(participantEmail);

        if (!session.getRoom().getParticipants().contains(participant)) {
            throw new RuntimeException("Participant not in this room");
        }
        if (!session.getAttendees().contains(participant)) {
            session.getAttendees().add(participant);
            sessionRepository.save(session);
        }

        return convertToDTO(session);
    }


}