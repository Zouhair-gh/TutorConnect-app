package ma.tutorconnect.tutorconnect.controller;

import ma.tutorconnect.tutorconnect.dto.SessionDTO;
import ma.tutorconnect.tutorconnect.enums.SessionStatus;
import ma.tutorconnect.tutorconnect.service.SessionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sessions")
public class SessionController {

    @Autowired
    private SessionService sessionService;

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
}