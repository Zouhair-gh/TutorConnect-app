package ma.tutorconnect.tutorconnect.controller;

import ma.tutorconnect.tutorconnect.dto.RoomWithParticipantsDTO;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import ma.tutorconnect.tutorconnect.dto.ParticipantDTO;
import ma.tutorconnect.tutorconnect.dto.AddParticipantRequest;
import ma.tutorconnect.tutorconnect.service.ParticipantService;

@RestController
@RequestMapping("/api/rooms/{roomId}/participants")
public class ParticipantController {

    private final ParticipantService participantService;

    public ParticipantController(ParticipantService participantService) {
        this.participantService = participantService;
    }

    @GetMapping
    public ResponseEntity<List<ParticipantDTO>> getRoomParticipants(@PathVariable Long roomId) {
        List<ParticipantDTO> participants = participantService.getRoomParticipants(roomId);
        return ResponseEntity.ok(participants);
    }

    @GetMapping("/{participantId}")
    public ResponseEntity<ParticipantDTO> getParticipantDetails(
            @PathVariable Long roomId,
            @PathVariable Long participantId) {

        ParticipantDTO participant = participantService.getParticipantInRoom(roomId, participantId);
        return ResponseEntity.ok(participant);
    }

    @PostMapping
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

    @DeleteMapping("/{participantId}")
    public ResponseEntity<Void> removeParticipantFromRoom(
            @PathVariable Long roomId,
            @PathVariable Long participantId) {
        participantService.removeParticipantFromRoom(roomId, participantId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/available")
    public ResponseEntity<List<ParticipantDTO>> getAvailableParticipants(@PathVariable Long roomId) {
        List<ParticipantDTO> participants = participantService.getAvailableParticipants(roomId);
        return ResponseEntity.ok(participants);
    }

    @GetMapping("/my-rooms")
    public ResponseEntity<List<RoomWithParticipantsDTO>> getRoomsForCurrentParticipant() {
        List<RoomWithParticipantsDTO> rooms = participantService.getRoomsForCurrentParticipant();
        return ResponseEntity.ok(rooms);
    }
}