package ma.tutorconnect.tutorconnect.controller;

import jakarta.persistence.EntityNotFoundException;
import ma.tutorconnect.tutorconnect.dto.*;
import ma.tutorconnect.tutorconnect.entity.Room;
import ma.tutorconnect.tutorconnect.service.RoomService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/rooms")
public class RoomController {
    private final RoomService roomService;
    private static final Logger log = LoggerFactory.getLogger(RoomController.class);

    public RoomController(RoomService roomService) {
        this.roomService = roomService;
    }

    @PostMapping("/create")
    public ResponseEntity<?> createRoom(@RequestBody CreateRoomDto createRoomDto) {
        try {
            log.info("Creating room with data: {}", createRoomDto);

            if (createRoomDto.getTutorId() == null) {
                return ResponseEntity.badRequest().body("Tutor ID is required");
            }

            Room createdRoom = roomService.saveRoom(createRoomDto);

            if (createdRoom == null) {
                log.error("Room creation failed - service returned null");
                return ResponseEntity.internalServerError()
                        .body("Failed to create room - service returned null");
            }

            // Simplified response
            return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
                    "status", "success",
                    "roomId", createdRoom.getId()
            ));
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Tutor not found: " + e.getMessage());
        } catch (Exception e) {
            log.error("Room creation error", e);
            return ResponseEntity.internalServerError()
                    .body("Error: " + e.getMessage());
        }
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



    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<Room> updateRoom(
            @PathVariable Long id,
            @RequestBody UpdateRoomDto updateRoomDto
    ) {
        Room roomToUpdate = new Room();
        roomToUpdate.setId(id);
        roomToUpdate.setName(updateRoomDto.getName());
        roomToUpdate.setCapacity(updateRoomDto.getCapacity());
        roomToUpdate.setAmount(updateRoomDto.getAmount().longValue());
        roomToUpdate.setStartDate(java.sql.Date.valueOf(updateRoomDto.getStartDate()));
        roomToUpdate.setEndDate(java.sql.Date.valueOf(updateRoomDto.getEndDate()));

        Room updatedRoom = roomService.updateRoom(id, roomToUpdate);
        return ResponseEntity.ok(updatedRoom);
    }
}