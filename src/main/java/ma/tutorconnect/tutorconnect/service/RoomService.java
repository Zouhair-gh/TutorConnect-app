package ma.tutorconnect.tutorconnect.service;

import ma.tutorconnect.tutorconnect.entity.Room;

import java.util.List;

public interface RoomService {
    List<Room> getAllRooms();
    Room getRoomById(Long id);
    Room saveRoom(Room room);
    void deleteRoom(Long id);
}
