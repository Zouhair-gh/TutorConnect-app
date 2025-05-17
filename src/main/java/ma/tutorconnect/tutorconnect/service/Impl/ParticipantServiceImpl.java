package ma.tutorconnect.tutorconnect.service.Impl;

import ma.tutorconnect.tutorconnect.dto.*;
import ma.tutorconnect.tutorconnect.entity.Participant;
import ma.tutorconnect.tutorconnect.entity.Room;
import ma.tutorconnect.tutorconnect.entity.User;
import ma.tutorconnect.tutorconnect.enums.RoleEnum;
import ma.tutorconnect.tutorconnect.repository.ParticipantRepository;
import ma.tutorconnect.tutorconnect.repository.RoomRepository;
import ma.tutorconnect.tutorconnect.repository.UserRepository;
import ma.tutorconnect.tutorconnect.service.ParticipantService;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.security.core.context.SecurityContextHolder;
import java.util.Optional;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ParticipantServiceImpl implements ParticipantService {

    private final RoomRepository roomRepository;
    private final ParticipantRepository participantRepository;
    private final UserRepository userRepository;

    public ParticipantServiceImpl(RoomRepository roomRepository,
                                  ParticipantRepository participantRepository,
                                  @Qualifier("userRepository") UserRepository userRepository) {
        this.roomRepository = roomRepository;
        this.participantRepository = participantRepository;
        this.userRepository = userRepository;
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

    @Override
    public ParticipantDTO getParticipantInRoom(Long roomId, Long participantId) {
        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new RuntimeException("Room not found"));

        return room.getParticipants().stream()
                .filter(p -> p.getId().equals(participantId))
                .findFirst()
                .map(this::convertToDTO)
                .orElseThrow(() -> new RuntimeException("Participant not found in this room"));
    }

    @Override
    public Optional<Participant> findByEmail(String email) {
        return Optional.empty();
    }

    @Override
    public List<RoomWithParticipantsDTO> getRoomsForCurrentParticipant() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();

        User user = userRepository.findByEmail(email);

        if (!RoleEnum.PARTICIPANT.equals(user.getRole())) {
            throw new RuntimeException("User is not registered as a participant");
        }

        Participant participant = participantRepository.findById(user.getId())
                .orElseThrow(() -> new RuntimeException("Participant record not found"));

        List<Room> rooms = roomRepository.findRoomsByParticipantId(participant.getId());

        return rooms.stream()
                .map(this::convertToRoomWithParticipantsDTO)
                .collect(Collectors.toList());
    }

    private RoomWithParticipantsDTO convertToRoomWithParticipantsDTO(Room room) {
        RoomDTO roomDto = new RoomDTO(
                room.getId(),
                room.getName(),
                room.getCapacity(),
                room.getAmount(),
                room.getStartDate().toLocalDate(),
                room.getEndDate().toLocalDate()
        );

        List<ParticipantDTO> participantDTOs = room.getParticipants().stream()
                .map(this::convertParticipantToDTO)
                .collect(Collectors.toList());

        return new RoomWithParticipantsDTO(roomDto, participantDTOs);
    }

    private ParticipantDTO convertParticipantToDTO(Participant participant) {
        // Try to get user from repository
        User user = userRepository.findById(participant.getId())
                .orElse(null);

        // If user found, use those details, otherwise use participant details
        if (user != null) {
            return new ParticipantDTO(
                    participant.getId(),
                    user.getFirstName(),
                    user.getLastName(),
                    user.getEmail()
            );
        } else {
            return new ParticipantDTO(
                    participant.getId(),
                    participant.getFirstName(),
                    participant.getLastName(),
                    participant.getEmail()
            );
        }
    }
}