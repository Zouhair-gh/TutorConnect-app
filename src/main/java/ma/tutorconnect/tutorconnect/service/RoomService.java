package ma.tutorconnect.tutorconnect.service;

import ma.tutorconnect.tutorconnect.dto.CreateRoomDto;
import ma.tutorconnect.tutorconnect.entity.Room;
import ma.tutorconnect.tutorconnect.dto.*;
import org.springframework.http.ResponseEntity;

import java.util.List;

public interface RoomService {
    List<Room> getAllRooms();
    Room getRoomById(Long id);
    Room saveRoom(CreateRoomDto createRoomDto);
    Room updateRoom(Long id, Room room);
    void deleteRoom(Long id);
    List<Room> getRoomsByCurrentTutor();
    RoomWithParticipantsDTO getRoomWithParticipants(Long id);
    ResponseEntity<?> requestRoomCreation(DemandRoomDto demandRoomDto);
    Room updateRoom(Long id, UpdateRoomDto updateRoomDto);
    ResponseEntity<?> requestRoomRenewal(Long roomId, DemandRoomDto demandRoomDto);

    Room createRoom(CreateRoomDto createRoomDto);
    void renewRoom(RoomRenewalRequestDto renewalDto);
    ResponseEntity<?> createRoomDemand(DemandRoomDto demandRoomDto);
}
