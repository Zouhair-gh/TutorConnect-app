package ma.tutorconnect.tutorconnect.service.Impl;

import ma.tutorconnect.tutorconnect.dto.CreateRoomDto;
import ma.tutorconnect.tutorconnect.dto.ParticipantDTO;
import ma.tutorconnect.tutorconnect.dto.RoomWithParticipantsDTO;
import ma.tutorconnect.tutorconnect.entity.Room;
import ma.tutorconnect.tutorconnect.entity.Tutor;
import ma.tutorconnect.tutorconnect.repository.RoomRepository;
import ma.tutorconnect.tutorconnect.repository.TutorRepository;
import ma.tutorconnect.tutorconnect.service.TutorService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class TutorServiceImpl implements TutorService {

    private final TutorRepository tutorRepository;
    private final RoomRepository roomRepository; // Inject RoomRepository


    public TutorServiceImpl(TutorRepository tutorRepository , RoomRepository roomRepository)
    {
        this.tutorRepository = tutorRepository;
        this.roomRepository = roomRepository;
    }

    @Override
    public List<Tutor> getAllTutors() {
        return List.of();
    }

    @Override
    public Tutor getTutorById(Long id) {
        return null;
    }

    @Override
    public Tutor saveTutor(Tutor tutor) {
        return null;
    }

    @Override
    public void deleteTutor(Long id) {

    }
    @Override
    public List<CreateRoomDto> getRoomsByTutor(Long tutorId) {
        List<Room> rooms = roomRepository.findByTutorId(tutorId);
        return rooms.stream().map(room -> new CreateRoomDto(
                room.getId(),
                room.getName(),
                room.getCapacity(),
                room.getStartDate(),
                room.getEndDate(),
                room.getAmount()
        )).collect(Collectors.toList());
    }

    @Override
    public List<RoomWithParticipantsDTO> getRoomsWithParticipantsByTutor(Long tutorId) {
        List<Room> rooms = roomRepository.findByTutorId(tutorId);
        return rooms.stream().map(room -> {
            CreateRoomDto roomDTO = new CreateRoomDto(
                    room.getId(),
                    room.getName(),
                    room.getCapacity(),
                    room.getStartDate(),
                    room.getEndDate(),
                    room.getAmount()
            );
            List<ParticipantDTO> participantDTOS = room.getParticipants()
                    .stream()
                    .map(p -> new ParticipantDTO(p.getId(), p.getFirstName(), p.getLastName(), p.getEmail()))
                    .collect(Collectors.toList());

            return new RoomWithParticipantsDTO(roomDTO, participantDTOS);
        }).collect(Collectors.toList());
    }
}
