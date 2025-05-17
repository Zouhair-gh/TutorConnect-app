package ma.tutorconnect.tutorconnect.service.Impl;

import ma.tutorconnect.tutorconnect.dto.*;
import ma.tutorconnect.tutorconnect.entity.Demand;
import ma.tutorconnect.tutorconnect.entity.Room;
import ma.tutorconnect.tutorconnect.entity.Tutor;
import ma.tutorconnect.tutorconnect.enums.DemandStatus;
import ma.tutorconnect.tutorconnect.repository.DemandRepository;
import ma.tutorconnect.tutorconnect.repository.RoomRepository;
import ma.tutorconnect.tutorconnect.repository.TutorRepository;
import ma.tutorconnect.tutorconnect.service.TutorService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class TutorServiceImpl implements TutorService {

    private final TutorRepository tutorRepository;
    private final RoomRepository roomRepository;
    private final DemandRepository demandRepository;


    public TutorServiceImpl(TutorRepository tutorRepository, RoomRepository roomRepository, DemandRepository demandRepository) {
        this.tutorRepository = tutorRepository;
        this.roomRepository = roomRepository;
        this.demandRepository = demandRepository;
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
            // Create RoomDTO instead of CreateRoomDto
            RoomDTO roomDTO = new RoomDTO(
                    room.getId(),
                    room.getName(),
                    room.getCapacity(),
                    room.getAmount(),
                    room.getStartDate().toLocalDate(),
                    room.getEndDate().toLocalDate()
            );

            List<ParticipantDTO> participantDTOS = room.getParticipants()
                    .stream()
                    .map(p -> new ParticipantDTO(p.getId(), p.getFirstName(), p.getLastName(), p.getEmail()))
                    .collect(Collectors.toList());

            return new RoomWithParticipantsDTO(roomDTO, participantDTOS);
        }).collect(Collectors.toList());
    }

    public ResponseEntity<?> requestRoomRenewal(RoomRenewalRequestDto renewalRequest) {
        try {
            // Vérifier que la salle existe et appartient au tuteur
            Room room = roomRepository.findById(renewalRequest.getRoomId())
                    .orElseThrow(() -> new RuntimeException("Room not found"));

            Tutor currentTutor = getCurrentTutor();
            if (!room.getTutor().getId().equals(currentTutor.getId())) {
                return ResponseEntity.status(403).body("You don't own this room");
            }

            // Créer la demande
            Demand demand = new Demand();
            demand.setDemandType("ROOM_RENEWAL");
            demand.setPurpose(renewalRequest.getPurpose());
            demand.setMessage(renewalRequest.getMessage());
            demand.setStatus(DemandStatus.PENDING);
            demand.setCreatedAt(LocalDateTime.now());

            // Remplir les infos du tuteur
            demand.setFullName(currentTutor.getFirstName() + " " + currentTutor.getLastName());
            demand.setEmail(currentTutor.getEmail());

            // Sauvegarder la demande
            Demand savedDemand = demandRepository.save(demand);

            return ResponseEntity.ok(savedDemand);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    private Tutor getCurrentTutor() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return tutorRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Tutor not found"));
    }
}