package ma.tutorconnect.tutorconnect.service;

import ma.tutorconnect.tutorconnect.dto.CreateRoomDto;
import ma.tutorconnect.tutorconnect.entity.Room;

import java.util.List;

public interface RoomService {
    List<Room> getAllRooms();
    Room getRoomById(Long id);
    Room saveRoom(CreateRoomDto createRoomDto);
    Room updateRoom(Long id, Room room);
    void deleteRoom(Long id);
}
