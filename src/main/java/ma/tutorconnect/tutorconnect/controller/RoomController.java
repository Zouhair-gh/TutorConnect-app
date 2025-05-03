package ma.tutorconnect.tutorconnect.controller;

import ma.tutorconnect.tutorconnect.dto.*;
import ma.tutorconnect.tutorconnect.entity.Room;
import ma.tutorconnect.tutorconnect.service.RoomService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/rooms")
public class RoomController {
    private final RoomService roomService;

    public RoomController(RoomService roomService) {
        this.roomService = roomService;
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/create")
    public ResponseEntity<Room> createRoom(@RequestBody CreateRoomDto createRoomDto) {
        Room createdRoom = roomService.saveRoom(createRoomDto);
        return new ResponseEntity<>(createdRoom, HttpStatus.CREATED);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/all")
    public List<Room> getAllRooms() {
        return roomService.getAllRooms();
    }

    @PreAuthorize("hasRole('TUTOR')")
    @GetMapping("/my-rooms")
    public List<Room> getMyRooms() {
        return roomService.getRoomsByCurrentTutor();
    }

    @PreAuthorize("hasRole('TUTOR')")
    @PostMapping("/request-room")
    public ResponseEntity<?> requestRoomCreation(@RequestBody DemandRoomDto demandRoomDto) {
        return roomService.requestRoomCreation(demandRoomDto);
    }

    @PreAuthorize("hasRole('TUTOR')")
    @PostMapping("/request-renewal/{roomId}")
    public ResponseEntity<?> requestRoomRenewal(@PathVariable Long roomId,
                                                @RequestBody DemandRoomDto demandRoomDto) {
        return roomService.requestRoomRenewal(roomId, demandRoomDto);
    }

    @GetMapping("/{id}")
    public ResponseEntity<RoomWithParticipantsDTO> getRoomById(@PathVariable Long id) {
        RoomWithParticipantsDTO room = roomService.getRoomWithParticipants(id);
        return ResponseEntity.ok(room);
    }
}