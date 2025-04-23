package ma.tutorconnect.tutorconnect.service.Impl;

import ma.tutorconnect.tutorconnect.dto.CreateRoomDto;
import ma.tutorconnect.tutorconnect.entity.Room;
import ma.tutorconnect.tutorconnect.repository.RoomRepository;
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
    public Room getRoomById(Long id)
    {
        return roomRepository.findById(id).orElse(null);
    }

    @Override
    public Room saveRoom(CreateRoomDto createRoomDto) {
        Room room = new Room();
        room.setName(createRoomDto.getName());
        room.setCapacity(createRoomDto.getCapacity());
        room.setStartDate(createRoomDto.getStartDate());
        room.setEndDate(createRoomDto.getEndDate());
        room.setAmount(createRoomDto.getAmount());

        return roomRepository.save(room);
    }
    @Override
    public Room updateRoom(Long id, Room updatedRoom) {
        Room existingRoom = roomRepository.findById(id).orElse(null);
        if (existingRoom == null) {
            throw new RuntimeException("Room not found with ID: " + id);
        }

        existingRoom.setName(updatedRoom.getName());
        existingRoom.setCapacity(updatedRoom.getCapacity());
        existingRoom.setStartDate(updatedRoom.getStartDate());
        existingRoom.setEndDate(updatedRoom.getEndDate());
        existingRoom.setAmount(updatedRoom.getAmount());

        return roomRepository.save(existingRoom);
    }

    @Override
    public void deleteRoom(Long id) {

        roomRepository.deleteById(id);
    }
}
