package ma.tutorconnect.tutorconnect.service.Impl;

import ma.tutorconnect.tutorconnect.entity.Room;
import ma.tutorconnect.tutorconnect.repository.RoomRepository;
import ma.tutorconnect.tutorconnect.repository.TutorRepository;
import ma.tutorconnect.tutorconnect.service.RoomService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RoomServiceImpl implements RoomService {
    private final RoomRepository roomRepository;
    public RoomServiceImpl(RoomRepository room){
        this.roomRepository = room;
    }
    @Override
    public List<Room> getAllRooms() {
        return roomRepository.findAll();
    }

    @Override
    public Room getRoomById(Long id) {
        return roomRepository.findById(id).orElse(null);
    }

    @Override
    public Room saveRoom(Room room) {
        return roomRepository.save(room);
    }

    @Override
    public void deleteRoom(Long id) {
        roomRepository.deleteById(id);
    }
}
