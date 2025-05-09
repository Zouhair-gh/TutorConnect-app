package ma.tutorconnect.tutorconnect.controller;

import ma.tutorconnect.tutorconnect.dto.SessionDTO;
import ma.tutorconnect.tutorconnect.dto.SessionVideoDTO;
import ma.tutorconnect.tutorconnect.entity.Participant;
import ma.tutorconnect.tutorconnect.entity.Session;
import ma.tutorconnect.tutorconnect.enums.SessionStatus;
import ma.tutorconnect.tutorconnect.repository.ParticipantRepository;
import ma.tutorconnect.tutorconnect.repository.SessionRepository;
import ma.tutorconnect.tutorconnect.service.SessionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/sessions")
public class SessionController {

    @Autowired
    private SessionService sessionService;

    private static final org.slf4j.Logger logger = org.slf4j.LoggerFactory.getLogger(SessionService.class);
    @Autowired
    private SessionRepository sessionRepository;
    @Autowired
    private ParticipantRepository participantRepository;


    @GetMapping
    public ResponseEntity<List<SessionDTO>> getAllSessions() {
        return ResponseEntity.ok(sessionService.getAllSessions());
    }

    @GetMapping("/{id}")
    public ResponseEntity<SessionDTO> getSessionById(@PathVariable Long id) {
        return ResponseEntity.ok(sessionService.getSessionById(id));
    }

    @GetMapping("/room/{roomId}")
    public ResponseEntity<List<SessionDTO>> getSessionsByRoomId(@PathVariable Long roomId) {
        return ResponseEntity.ok(sessionService.getSessionsByRoomId(roomId));
    }

    @GetMapping("/room/{roomId}/upcoming")
    public ResponseEntity<List<SessionDTO>> getUpcomingSessions(@PathVariable Long roomId) {
        return ResponseEntity.ok(sessionService.getUpcomingSessions(roomId));
    }

    @GetMapping("/participant/{participantId}")
    public ResponseEntity<List<SessionDTO>> getSessionsByParticipant(@PathVariable Long participantId) {
        return ResponseEntity.ok(sessionService.getSessionsByParticipant(participantId));
    }

    @GetMapping("/tutor/{tutorId}")
    public ResponseEntity<List<SessionDTO>> getSessionsByTutor(@PathVariable Long tutorId) {
        return ResponseEntity.ok(sessionService.getSessionsByTutor(tutorId));
    }

    @PostMapping
    public ResponseEntity<SessionDTO> createSession(@RequestBody SessionDTO sessionDTO) {
        return new ResponseEntity<>(sessionService.createSession(sessionDTO), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<SessionDTO> updateSession(@PathVariable Long id, @RequestBody SessionDTO sessionDTO) {
        return ResponseEntity.ok(sessionService.updateSession(id, sessionDTO));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSession(@PathVariable Long id) {
        sessionService.deleteSession(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/status")
    public ResponseEntity<SessionDTO> changeSessionStatus(
            @PathVariable Long id,
            @RequestParam SessionStatus status) {
        return ResponseEntity.ok(sessionService.changeSessionStatus(id, status));
    }

    @PostMapping("/{sessionId}/attend/{participantId}")
    public ResponseEntity<SessionDTO> confirmAttendance(
            @PathVariable Long sessionId,
            @PathVariable Long participantId) {
        return ResponseEntity.ok(sessionService.confirmAttendance(sessionId, participantId));
    }

    @DeleteMapping("/{sessionId}/attend/{participantId}")
    public ResponseEntity<SessionDTO> cancelAttendance(
            @PathVariable Long sessionId,
            @PathVariable Long participantId) {
        return ResponseEntity.ok(sessionService.cancelAttendance(sessionId, participantId));
    }

    @PostMapping("/{id}/video")
    public ResponseEntity<SessionVideoDTO> createVideoRoom(@PathVariable Long id) {
        // Generate a unique room name for the session
        String roomName = "tutor-connect-" + UUID.randomUUID().toString().substring(0, 8);

        SessionVideoDTO videoDTO = new SessionVideoDTO();
        videoDTO.setSessionId(id);
        videoDTO.setRoomName(roomName);
        videoDTO.setStatus("CREATED");

        // In next implementation meetings storage toi db logixw could be here


        return new ResponseEntity<>(videoDTO, HttpStatus.CREATED);
    }

    @PostMapping("/{sessionId}/video/start")
    public ResponseEntity<Map<String, String>> startVideoSession(
            @PathVariable Long sessionId) {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        String username = authentication.getName();
        if (!sessionService.isUserSessionOwner(sessionId, username)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        return ResponseEntity.ok(sessionService.startVideoSession(sessionId));
    }

    @GetMapping("/{sessionId}/video")
    public ResponseEntity<?> getVideoSessionInfo(@PathVariable Long sessionId) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication == null || !authentication.isAuthenticated()) {
                logger.warn("Unauthenticated user attempting to access video session");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("message", "Authentication required"));
            }

            String username = authentication.getName();

            logger.info("User attempting to access video session: {}", username);

            // Check if user has permission
            if (!sessionService.isUserAllowedInSession(sessionId, username)) {
                logger.warn("User {} denied access to session {}", username, sessionId);
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(Map.of("message", "You are not allowed to access this session"));
            }

            // Get video session info
            Map<String, String> videoInfo = sessionService.getVideoSessionInfo(sessionId);
            logger.info("Returning video info for session {}: {}", sessionId, videoInfo);

            return ResponseEntity.ok(videoInfo);
        } catch (Exception e) {
            logger.error("Error retrieving video session info: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Error retrieving video session information"));
        }
    }

    @PostMapping("/{id}/video/end")
    public ResponseEntity<SessionVideoDTO> endVideoSession(@PathVariable Long id) {
        // Logic to end the video session
        SessionVideoDTO videoDTO = new SessionVideoDTO();
        videoDTO.setSessionId(id);
        videoDTO.setRoomName("tutor-connect-session-" + id);
        videoDTO.setStatus("ENDED");

        return ResponseEntity.ok(videoDTO);
    }

    @GetMapping("/{sessionId}/video/debug")
    public ResponseEntity<?> debugVideoSession(@PathVariable Long sessionId) {
        Map<String, Object> debugInfo = new HashMap<>();

        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

            debugInfo.put("authenticated", authentication != null && authentication.isAuthenticated());
            debugInfo.put("username", authentication != null ? authentication.getName() : "not authenticated");
            debugInfo.put("authorities", authentication != null ?
                    authentication.getAuthorities().stream()
                            .map(a -> a.getAuthority())
                            .collect(Collectors.toList()) :
                    Collections.emptyList());

            Optional<Session> sessionOpt = sessionRepository.findById(sessionId);
            debugInfo.put("sessionExists", sessionOpt.isPresent());

            if (sessionOpt.isPresent()) {
                Session session = sessionOpt.get();
                debugInfo.put("sessionId", session.getId());
                debugInfo.put("sessionTitle", session.getTitle());
                debugInfo.put("sessionStatus", session.getStatus().toString());
                debugInfo.put("attendeeCount", session.getAttendees().size());
                if (session.getRoom() != null) {
                    debugInfo.put("roomId", session.getRoom().getId());
                    debugInfo.put("roomName", session.getRoom().getName());
                    debugInfo.put("hasTutor", session.getRoom().getTutor() != null);
                    if (session.getRoom().getTutor() != null) {
                        debugInfo.put("tutorEmail", session.getRoom().getTutor().getEmail());
                    }
                }

                if (authentication != null && authentication.isAuthenticated()) {
                    String username = authentication.getName();
                    boolean isAllowed = sessionService.isUserAllowedInSession(sessionId, username);
                    debugInfo.put("isAllowed", isAllowed);
                } else {
                    debugInfo.put("isAllowed", false);
                }

                List<String> attendeeEmails = session.getAttendees().stream()
                        .map(p -> p.getEmail())
                        .collect(Collectors.toList());
                debugInfo.put("attendeeEmails", attendeeEmails);
            }

            return ResponseEntity.ok(debugInfo);
        } catch (Exception e) {
            debugInfo.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(debugInfo);
        }


    }

    @GetMapping("/participant/current")
    public ResponseEntity<List<SessionDTO>> getSessionsForCurrentParticipant(
            @AuthenticationPrincipal UserDetails userDetails) {

        String email = userDetails.getUsername();
        Participant participant = participantRepository.findByEmail(email);

        return ResponseEntity.ok(sessionService.getSessionsByParticipant(participant.getId()));
    }
    @PostMapping("/{sessionId}/confirm-attendance")
    public ResponseEntity<SessionDTO> confirmAttendance(
            @PathVariable Long sessionId,
            @AuthenticationPrincipal UserDetails userDetails) {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username;

        if (userDetails != null) {
            username = userDetails.getUsername();
        } else if (authentication != null) {
            Object principal = authentication.getPrincipal();
            if (principal instanceof UserDetails) {
                username = ((UserDetails) principal).getUsername();
            } else {
                username = principal.toString();
            }
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        return ResponseEntity.ok(sessionService.confirmAttendance(sessionId, username));
    }


}