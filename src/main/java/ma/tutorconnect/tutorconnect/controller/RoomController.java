package ma.tutorconnect.tutorconnect.controller;

import ma.tutorconnect.tutorconnect.entity.Room;
import ma.tutorconnect.tutorconnect.entity.User;
import ma.tutorconnect.tutorconnect.service.RoomService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/rooms")

public class RoomController {
    private RoomService roomService;
    public RoomController(RoomService roomService) {
        this.roomService = roomService;
    }
    @GetMapping
    public List<Room> getAllRooms () { return roomService.getAllRooms();}
    @GetMapping("/{id}")
    public Room getRoomById(@PathVariable Long id) { return roomService.getRoomById(id);}
    @PostMapping("/create")
    public Room createRoom(@RequestBody Room room) { return roomService.saveRoom(room);}
   @PutMapping("/{id}")
   public Room updateRoom(@PathVariable Long id, @RequestBody Room room) { return roomService.saveRoom(room);}
    @DeleteMapping("/{id}")
    public void deleteRoom(@PathVariable Long id) { roomService.deleteRoom(id);}
}
