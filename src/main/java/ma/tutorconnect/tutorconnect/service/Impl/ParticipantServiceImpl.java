package ma.tutorconnect.tutorconnect.service.Impl;

import ma.tutorconnect.tutorconnect.dto.ParticipantDTO;
import ma.tutorconnect.tutorconnect.dto.AddParticipantRequest;
import ma.tutorconnect.tutorconnect.entity.Participant;
import ma.tutorconnect.tutorconnect.entity.Room;
import ma.tutorconnect.tutorconnect.repository.ParticipantRepository;
import ma.tutorconnect.tutorconnect.repository.RoomRepository;
import ma.tutorconnect.tutorconnect.service.ParticipantService;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ParticipantServiceImpl implements ParticipantService {

    private final RoomRepository roomRepository;
    private final ParticipantRepository participantRepository;

    public ParticipantServiceImpl(RoomRepository roomRepository,
                                  ParticipantRepository participantRepository) {
        this.roomRepository = roomRepository;
        this.participantRepository = participantRepository;
    }

    @Override
    public List<ParticipantDTO> getRoomParticipants(Long roomId) {
        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new RuntimeException("Room not found"));

        return room.getParticipants().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public ParticipantDTO addParticipantToRoom(Long roomId, AddParticipantRequest request) {
        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new RuntimeException("Room not found"));

        if (room.getParticipants().size() >= room.getCapacity()) {
            throw new RuntimeException("Room capacity exceeded");
        }

        Participant participant = participantRepository.findById(request.participantId())
                .orElseThrow(() -> new RuntimeException("Participant not found"));

        room.getParticipants().add(participant);
        roomRepository.save(room);

        return convertToDTO(participant);
    }

    @Override
    public void removeParticipantFromRoom(Long roomId, Long participantId) {
        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new RuntimeException("Room not found"));

        Participant participant = participantRepository.findById(participantId)
                .orElseThrow(() -> new RuntimeException("Participant not found"));

        room.getParticipants().remove(participant);
        roomRepository.save(room);
    }

    @Override
    public List<ParticipantDTO> getAvailableParticipants(Long roomId) {
        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new RuntimeException("Room not found"));

        List<Participant> allParticipants = participantRepository.findAll();
        List<Participant> roomParticipants = room.getParticipants();

        return allParticipants.stream()
                .filter(p -> !roomParticipants.contains(p))
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    private ParticipantDTO convertToDTO(Participant participant) {
        return new ParticipantDTO(
                participant.getId(),
                participant.getFirstName(),
                participant.getLastName(),
                participant.getEmail()
        );
    }

}