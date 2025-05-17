package ma.tutorconnect.tutorconnect.service.Impl;

import jakarta.persistence.EntityNotFoundException;
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
import org.springframework.transaction.annotation.Transactional;

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
    @Transactional
    public Room createRoom(CreateRoomDto createRoomDto) {
        Tutor tutor = tutorRepository.findById(createRoomDto.getTutorId()).get();

        Room room = new Room();
        room.setName(createRoomDto.getName());
        room.setCapacity(createRoomDto.getCapacity());
        room.setStartDate(createRoomDto.getStartDate());
        room.setEndDate(createRoomDto.getEndDate());
        room.setAmount(createRoomDto.getAmount());
        room.setTutor(tutor);

        return roomRepository.save(room);
    }

    @Override
    @Transactional
    public void renewRoom(RoomRenewalRequestDto renewalDto) {
        Room room = roomRepository.findById(renewalDto.getRoomId()).get();


        // Update the room's end date
        room.setEndDate(Date.valueOf(renewalDto.getNewEndDate()));

        // Update other fields if provided
        if (renewalDto.getCapacity() != null) {
            room.setCapacity(renewalDto.getCapacity());
        }
        if (renewalDto.getAmount() != null) {
            room.setAmount(renewalDto.getAmount().longValue());
        }

        roomRepository.save(room);

        // Create notification
        NotificationDto notification = new NotificationDto(
                room.getTutor().getId(),
                "Room Renewal Approved",
                String.format("Your room '%s' has been renewed until %s",
                        room.getName(), renewalDto.getNewEndDate()),
                "ROOM_RENEWAL"
        );
        notificationService.sendNotification(room.getTutor().getId(), notification);
    }

    @Override
    public ResponseEntity<?> createRoomDemand(DemandRoomDto demandRoomDto) {
        try {
            Tutor tutor = tutorRepository.findById(demandRoomDto.getTutorId()).get();

            Demand demand = new Demand();
            demand.setFullName(tutor.getFirstName() + " " + tutor.getLastName());
            demand.setEmail(tutor.getEmail());
            demand.setPurpose("Room Creation Request");
            demand.setMessage(buildRoomRequestMessage(demandRoomDto));
            demand.setStatus(DemandStatus.PENDING);
            demand.setDemandType("ROOM_CREATION");

            // Set room details for reference
            demand.setRoomName(demandRoomDto.getName());
            demand.setRoomCapacity(demandRoomDto.getCapacity());
            demand.setRoomStartDate(demandRoomDto.getStartDate().toLocalDate());
            demand.setRoomEndDate(demandRoomDto.getEndDate().toLocalDate());
            demand.setRoomAmount(demandRoomDto.getAmount().doubleValue());
            demand.setTutorId(demandRoomDto.getTutorId());

            demandRepository.save(demand);

            // Notify admin
            NotificationDto notification = new NotificationDto(
                    null, // admin notification
                    "New Room Creation Request",
                    String.format("Tutor %s requested to create room '%s'",
                            demand.getFullName(), demandRoomDto.getName()),
                    "ROOM_CREATION_REQUEST"
            );
            notificationService.sendNotification(null, notification);

            return ResponseEntity.ok("Room creation request submitted successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to submit room creation request: " + e.getMessage());
        }
    }

    @Override
    public ResponseEntity<?> requestRoomRenewal(Long roomId, DemandRoomDto demandRoomDto) {
        try {
            Room room = roomRepository.findById(roomId).get();
            Tutor tutor = tutorRepository.findById(demandRoomDto.getTutorId()).get();

            long daysRemaining = calculateDaysRemaining(room.getEndDate());

            if (daysRemaining > 5) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body("Renewal can only be requested when 5 or fewer days remain");
            }

            Demand demand = new Demand();
            demand.setFullName(tutor.getFirstName() + " " + tutor.getLastName());
            demand.setEmail(tutor.getEmail());
            demand.setPurpose("Room Renewal Request");
            demand.setMessage(buildRoomRenewalMessage(room, demandRoomDto));
            demand.setStatus(DemandStatus.PENDING);
            demand.setDemandType("ROOM_RENEWAL");

            // Set room details for reference
            demand.setRoomName(room.getName());
            demand.setRoomCapacity(demandRoomDto.getCapacity());
            demand.setRoomStartDate(room.getStartDate().toLocalDate());
            demand.setRoomEndDate(demandRoomDto.getEndDate().toLocalDate());
            demand.setRoomAmount(demandRoomDto.getAmount().doubleValue());
            demand.setTutorId(demandRoomDto.getTutorId());
            demand.setOriginalRoomId(room.getId());

            demandRepository.save(demand);

            // Notify admin
            NotificationDto notification = new NotificationDto(
                    null, // admin notification
                    "New Room Renewal Request",
                    String.format("Tutor %s requested to renew room '%s'",
                            demand.getFullName(), room.getName()),
                    "ROOM_RENEWAL_REQUEST"
            );
            notificationService.sendNotification(null, notification);

            return ResponseEntity.ok("Room renewal request submitted successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to submit room renewal request: " + e.getMessage());
        }
    }

    @Transactional
    public Room saveRoom(CreateRoomDto dto) throws EntityNotFoundException {

        Tutor tutor = tutorRepository.findById(dto.getTutorId())
                .orElseThrow(() -> new EntityNotFoundException("Tutor not found with id: " + dto.getTutorId()));


        Room room = new Room();
        room.setName(dto.getName());
        room.setCapacity(dto.getCapacity());
        room.setAmount(dto.getAmount());
        room.setStartDate(Date.valueOf(dto.getStartDate().toLocalDate()));
        room.setEndDate(Date.valueOf(dto.getEndDate().toLocalDate()));
        room.setTutor(tutor);


        Room savedRoom = roomRepository.save(room);

        return savedRoom;
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
    public Room updateRoom(Long id, UpdateRoomDto updateRoomDto) {
        // 1. Find the existing room
        Room existingRoom = roomRepository.findById(id).get();

        // 2. Validate dates
        LocalDate startDate = LocalDate.parse(updateRoomDto.getStartDate());
        LocalDate endDate = LocalDate.parse(updateRoomDto.getEndDate());

        if (endDate.isBefore(startDate)) {
            throw new IllegalArgumentException("End date cannot be before start date");
        }

        // 3. Calculate duration and amount if needed
        long daysBetween = java.time.temporal.ChronoUnit.DAYS.between(startDate, endDate) + 1;
        double amount = daysBetween * 20; // Assuming 20 per day

        // 4. Update the room entity
        existingRoom.setName(updateRoomDto.getName());
        existingRoom.setCapacity(updateRoomDto.getCapacity());
        existingRoom.setAmount((long) amount);
        existingRoom.setStartDate(Date.valueOf(startDate));
        existingRoom.setEndDate(Date.valueOf(endDate));

        // 5. Save and return
        return roomRepository.save(existingRoom);
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