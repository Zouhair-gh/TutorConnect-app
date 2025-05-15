package ma.tutorconnect.tutorconnect.service.Impl;

import ma.tutorconnect.tutorconnect.dto.*;
import ma.tutorconnect.tutorconnect.entity.*;
import ma.tutorconnect.tutorconnect.enums.DemandStatus;
import ma.tutorconnect.tutorconnect.repository.*;
import ma.tutorconnect.tutorconnect.service.NotificationService;
import ma.tutorconnect.tutorconnect.service.RoomService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import java.sql.Date;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class RoomServiceImpl implements RoomService {
    private final RoomRepository roomRepository;
    private final TutorRepository tutorRepository;
    private final DemandRepository demandRepository;
    private final NotificationService notificationService;

    public RoomServiceImpl(RoomRepository roomRepository,
                           TutorRepository tutorRepository,
                           DemandRepository demandRepository,
                           NotificationService notificationService) {
        this.roomRepository = roomRepository;
        this.tutorRepository = tutorRepository;
        this.demandRepository = demandRepository;
        this.notificationService = notificationService;
    }

    @Override
    public Room saveRoom(CreateRoomDto createRoomDto) {
        Room room = new Room();
        room.setName(createRoomDto.getName());
        room.setCapacity(createRoomDto.getCapacity());
        room.setStartDate(createRoomDto.getStartDate());
        room.setEndDate(createRoomDto.getEndDate());
        room.setAmount(createRoomDto.getAmount());
        Tutor tutor = tutorRepository.findById(createRoomDto.getTutorId())
                .orElseThrow(() -> new RuntimeException("Tutor not found with id: " + createRoomDto.getTutorId()));
        room.setTutor(tutor);
        return roomRepository.save(room);
    }

    @Override
    public Room updateRoom(Long id, Room updatedRoom) {
        Room existingRoom = roomRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Room not found with id: " + id));
        existingRoom.setName(updatedRoom.getName());
        existingRoom.setCapacity(updatedRoom.getCapacity());
        existingRoom.setStartDate(updatedRoom.getStartDate());
        existingRoom.setEndDate(updatedRoom.getEndDate());
        existingRoom.setAmount(updatedRoom.getAmount());
        if (updatedRoom.getTutor() != null) {
            Tutor tutor = tutorRepository.findById(updatedRoom.getTutor().getId())
                    .orElseThrow(() -> new RuntimeException("Tutor not found"));
            existingRoom.setTutor(tutor);
        }
        return roomRepository.save(existingRoom);
    }

    @Override
    public void deleteRoom(Long id) {
        if (!roomRepository.existsById(id)) {
            throw new RuntimeException("Room not found with id: " + id);
        }
        roomRepository.deleteById(id);
    }

    @Override
    public List<Room> getAllRooms() {
        return roomRepository.findAll();
    }

    @Override
    public Room getRoomById(Long id) {
        return roomRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Room not found with id: " + id));
    }

    @Override
    public List<Room> getRoomsByCurrentTutor() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        Tutor tutor = tutorRepository.findByEmail(username)
                .orElseThrow(() -> new RuntimeException("Tutor not found"));
        return roomRepository.findByTutorId(tutor.getId());
    }

    @Override
    public RoomWithParticipantsDTO getRoomWithParticipants(Long id) {
        Room room = roomRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Room not found with id: " + id));
        List<ParticipantDTO> participants = room.getParticipants().stream()
                .map(p -> new ParticipantDTO(
                        p.getId(),
                        p.getFirstName(),
                        p.getLastName(),
                        p.getEmail()))
                .collect(Collectors.toList());
        CreateRoomDto roomDto = new CreateRoomDto(
                room.getId(),
                room.getName(),
                room.getCapacity(),
                room.getStartDate(),
                room.getEndDate(),
                room.getAmount(),
                room.getTutor() != null ? room.getTutor().getId() : null
        );
        return new RoomWithParticipantsDTO(roomDto, participants);
    }

    @Override
    public ResponseEntity<?> requestRoomCreation(DemandRoomDto demandRoomDto) {
        Demand demand = new Demand();
        demand.setFullName("Room Creation Request");
        demand.setEmail(getCurrentTutor().getEmail());
        demand.setPurpose("Request to create new room: " + demandRoomDto.getName());
        demand.setMessage(buildRoomRequestMessage(demandRoomDto));
        demand.setStatus(DemandStatus.PENDING);
        demand.setDemandType("ROOM_CREATION");
        demandRepository.save(demand);
        return ResponseEntity.ok("Room creation request submitted successfully");
    }

    @Override
    public ResponseEntity<?> requestRoomRenewal(Long roomId, DemandRoomDto demandRoomDto) {
        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new RuntimeException("Room not found with id: " + roomId));

        long daysRemaining = calculateDaysRemaining(room.getEndDate());

        if (daysRemaining > 5) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Renewal can only be requested when 5, 2, or 1 day remains");
        }

        Demand demand = new Demand();
        demand.setFullName("Room Renewal Request");
        demand.setEmail(getCurrentTutor().getEmail());
        demand.setPurpose("Request to renew room: " + room.getName());
        demand.setMessage(buildRoomRenewalMessage(room, demandRoomDto));
        demand.setStatus(DemandStatus.PENDING);
        demand.setDemandType("ROOM_RENEWAL");
        demand.setProcessedAt(null);
        demandRepository.save(demand);

        // Corrected notification creation - add recipientId as first parameter
        NotificationDto notification = new NotificationDto(
                room.getTutor().getId(),  // recipientId
                "Room Renewal Requested",  // title
                String.format("Room '%s' renewal requested (ends in %d days)",
                        room.getName(), daysRemaining),  // message
                "ROOM_RENEWAL"  // type
        );

        notificationService.sendNotification(room.getTutor().getId(), notification);

        return ResponseEntity.ok("Room renewal request submitted successfully");
    }

    private Tutor getCurrentTutor() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return tutorRepository.findByEmail(username)
                .orElseThrow(() -> new RuntimeException("Tutor not found"));
    }

    private long calculateDaysRemaining(Date endDate) {
        LocalDate end = endDate.toLocalDate();
        LocalDate now = LocalDate.now();
        return ChronoUnit.DAYS.between(now, end);
    }

    private String buildRoomRequestMessage(DemandRoomDto demandRoomDto) {
        return String.format(
                "New Room Request Details:%n" +
                        "Name: %s%n" +
                        "Capacity: %d%n" +
                        "Start Date: %s%n" +
                        "End Date: %s%n" +
                        "Amount: %d%n" +
                        "Tutor ID: %d",
                demandRoomDto.getName(),
                demandRoomDto.getCapacity(),
                demandRoomDto.getStartDate(),
                demandRoomDto.getEndDate(),
                demandRoomDto.getAmount(),
                demandRoomDto.getTutorId());
    }

    private String buildRoomRenewalMessage(Room room, DemandRoomDto demandRoomDto) {
        return String.format(
                "Room Renewal Request Details:%n" +
                        "Original Room: %s (ID: %d)%n" +
                        "New End Date: %s%n" +
                        "New Amount: %d%n" +
                        "Original End Date: %s%n" +
                        "Requested by Tutor ID: %d",
                room.getName(),
                room.getId(),
                demandRoomDto.getEndDate(),
                demandRoomDto.getAmount(),
                room.getEndDate(),
                demandRoomDto.getTutorId());
    }
}