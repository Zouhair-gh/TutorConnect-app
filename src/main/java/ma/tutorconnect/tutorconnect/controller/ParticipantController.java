package ma.tutorconnect.tutorconnect.controller;

import ma.tutorconnect.tutorconnect.dto.RoomWithParticipantsDTO;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import ma.tutorconnect.tutorconnect.dto.ParticipantDTO;
import ma.tutorconnect.tutorconnect.dto.AddParticipantRequest;
import ma.tutorconnect.tutorconnect.service.ParticipantService;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
public class ParticipantController {
    private final ParticipantService participantService;

    public ParticipantController(ParticipantService participantService) {
        this.participantService = participantService;
    }

    // Room-specific participant endpoints
    @GetMapping("/api/rooms/{roomId}/participants")
    public ResponseEntity<List<ParticipantDTO>> getRoomParticipants(@PathVariable Long roomId) {
        List<ParticipantDTO> participants = participantService.getRoomParticipants(roomId);
        return ResponseEntity.ok(participants);
    }

    @GetMapping("/api/rooms/{roomId}/participants/{participantId}")
    public ResponseEntity<ParticipantDTO> getParticipantDetails(
            @PathVariable Long roomId,
            @PathVariable Long participantId) {
        ParticipantDTO participant = participantService.getParticipantInRoom(roomId, participantId);
        return ResponseEntity.ok(participant);
    }

    @PostMapping("/api/rooms/{roomId}/participants")
    public ResponseEntity<?> addParticipantToRoom(
            @PathVariable Long roomId,
            @RequestBody AddParticipantRequest request) {
        ParticipantDTO participant = participantService.addParticipantToRoom(roomId, request);
        if (participant == null) {
            // Room is full or participant doesn't exist
            return ResponseEntity.status(409).body("Cannot add participant to room");
        }
        return ResponseEntity.ok(participant);
    }

    @DeleteMapping("/api/rooms/{roomId}/participants/{participantId}")
    public ResponseEntity<Void> removeParticipantFromRoom(
            @PathVariable Long roomId,
            @PathVariable Long participantId) {
        participantService.removeParticipantFromRoom(roomId, participantId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/api/rooms/{roomId}/participants/available")
    public ResponseEntity<List<ParticipantDTO>> getAvailableParticipants(@PathVariable Long roomId) {
        List<ParticipantDTO> participants = participantService.getAvailableParticipants(roomId);
        return ResponseEntity.ok(participants);
    }

    // Participant-specific endpoints (not tied to a specific room)
    @GetMapping("/api/participants/my-rooms")
    public ResponseEntity<List<RoomWithParticipantsDTO>> getRoomsForCurrentParticipant() {
        // Log authentication details
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        System.out.println("User: " + auth.getName());
        System.out.println("Authorities: " + auth.getAuthorities());
        System.out.println("Fetching rooms for current participant");

        try {
            List<RoomWithParticipantsDTO> rooms = participantService.getRoomsForCurrentParticipant();
            return ResponseEntity.ok(rooms);
        } catch (Exception e) {
            System.err.println("Error fetching rooms: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }
}