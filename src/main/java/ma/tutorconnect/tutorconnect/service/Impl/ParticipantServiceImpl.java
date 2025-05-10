package ma.tutorconnect.tutorconnect.service.Impl;

import ma.tutorconnect.tutorconnect.dto.CreateRoomDto;
import ma.tutorconnect.tutorconnect.dto.ParticipantDTO;
import ma.tutorconnect.tutorconnect.dto.AddParticipantRequest;
import ma.tutorconnect.tutorconnect.dto.RoomWithParticipantsDTO;
import ma.tutorconnect.tutorconnect.entity.Participant;
import ma.tutorconnect.tutorconnect.entity.Room;
import ma.tutorconnect.tutorconnect.repository.ParticipantRepository;
import ma.tutorconnect.tutorconnect.repository.RoomRepository;
import ma.tutorconnect.tutorconnect.service.ParticipantService;
import org.springframework.security.core.context.SecurityContextHolder;
import java.util.Optional;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

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
        // Get the currently authenticated user's email
        String email = SecurityContextHolder.getContext().getAuthentication().getName();

        // Find the participant by email
        Optional<Participant> participantOptional = findByEmail(email);
        Participant participant = participantOptional.orElseThrow(() -> new RuntimeException("Participant not found with email: " + email));

        // Get all rooms where this participant is a member using the custom query
        List<Room> participantRooms = roomRepository.findRoomsByParticipant(participant);

        // Convert rooms to DTOs
        return participantRooms.stream()
                .map(room -> {
                    // Create CreateRoomDto from Room
                    CreateRoomDto roomDto = new CreateRoomDto(
                            room.getId(),
                            room.getName(),
                            room.getCapacity(),
                            room.getStartDate(),
                            room.getEndDate(),
                            room.getAmount(),
                            room.getTutor() != null ? room.getTutor().getId() : null
                    );

                    // Get participants for this room
                    List<ParticipantDTO> participantDTOs = room.getParticipants().stream()
                            .map(this::convertToDTO)
                            .collect(Collectors.toList());

                    // Create and return RoomWithParticipantsDTO
                    return new RoomWithParticipantsDTO(roomDto, participantDTOs);
                })
                .collect(Collectors.toList());
    }
}