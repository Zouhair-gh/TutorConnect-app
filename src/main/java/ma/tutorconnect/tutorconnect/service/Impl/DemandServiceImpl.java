package ma.tutorconnect.tutorconnect.service.Impl;

import ma.tutorconnect.tutorconnect.dto.*;
import ma.tutorconnect.tutorconnect.entity.Demand;
import ma.tutorconnect.tutorconnect.enums.DemandStatus;
import ma.tutorconnect.tutorconnect.enums.RoleEnum;

import ma.tutorconnect.tutorconnect.repository.DemandRepository;
import ma.tutorconnect.tutorconnect.service.DemandService;
import ma.tutorconnect.tutorconnect.service.RoomService;
import ma.tutorconnect.tutorconnect.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.Date;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class DemandServiceImpl implements DemandService {

    @Autowired
    private DemandRepository demandRepository;

    @Autowired
    private UserService userService;

    @Autowired
    private RoomService roomService;

    @Override
    public DemandDto.Response createDemand(DemandDto.Request request) {
        Demand demand = mapRequestToEntity(request);
        demand = demandRepository.save(demand);
        return mapEntityToResponse(demand);
    }

    @Override
    public DemandDto.Response createRoomDemand(DemandRoomDto request) {
        Demand demand = new Demand();
        demand.setFullName(request.getTutorId().toString()); // Temporary, will be replaced with actual tutor name
        demand.setPurpose(request.isRenewal() ? "Room Renewal" : "Room Creation");
        demand.setDemandType(request.isRenewal() ? "ROOM_RENEWAL" : "ROOM_CREATION");
        demand.setRoomName(request.getName());
        demand.setRoomCapacity(request.getCapacity());
        demand.setRoomStartDate(request.getStartDate().toLocalDate());
        demand.setRoomEndDate(request.getEndDate().toLocalDate());
        demand.setRoomAmount(request.getAmount().doubleValue());
        demand.setTutorId(request.getTutorId());

        if (request.isRenewal()) {
            demand.setOriginalRoomId(request.getOriginalRoomId());
        }

        demand = demandRepository.save(demand);
        return mapEntityToResponse(demand);
    }

    @Override
    public DemandDto.Response createTutorAccountDemand(DemandDto.Request request) {
        request.setPurpose("Tutor Account Creation");
        Demand demand = mapRequestToEntity(request);
        demand.setDemandType("TUTOR_ACCOUNT");
        demand = demandRepository.save(demand);
        return mapEntityToResponse(demand);
    }

    @Override
    public DemandDto.Response updateDemandStatus(Long id, DemandDto.StatusUpdate statusUpdate) {
        Demand demand = demandRepository.findById(id).get();

        demand.setStatus(statusUpdate.getStatus());
        demand.setProcessedAt(LocalDateTime.now());

        if (statusUpdate.getStatus() == DemandStatus.APPROVED) {
            performApprovedAction(demand);
        }

        demand = demandRepository.save(demand);
        return mapEntityToResponse(demand);
    }

    private void performApprovedAction(Demand demand) {
        switch(demand.getDemandType()) {
            case "TUTOR_ACCOUNT":
                createTutorAccount(demand);
                break;
            case "ROOM_CREATION":
                createRoom(demand);
                break;
            case "ROOM_RENEWAL":
                renewRoom(demand);
                break;
            default:
                throw new IllegalArgumentException("Unknown demand type: " + demand.getDemandType());
        }
    }

    private void createTutorAccount(Demand demand) {
        CreateUserDto userDto = new CreateUserDto();
        String[] nameParts = demand.getFullName().split(" ");
        userDto.setFirstName(nameParts[0]);
        userDto.setLastName(nameParts.length > 1 ? nameParts[1] : "");
        userDto.setEmail(demand.getEmail());
        userDto.setPhoneNumber(demand.getPhone());
        userDto.setRole(RoleEnum.TUTOR);
        userDto.setSpecialites(demand.getExperience());

        userService.createUser(userDto);
    }

    private void createRoom(Demand demand) {
        CreateRoomDto roomDto = new CreateRoomDto();
        roomDto.setName(demand.getRoomName());
        roomDto.setCapacity(demand.getRoomCapacity());
        roomDto.setStartDate(Date.valueOf(demand.getRoomStartDate()));
        roomDto.setEndDate(Date.valueOf(demand.getRoomEndDate()));
        roomDto.setAmount(demand.getRoomAmount().longValue());
        roomDto.setTutorId(demand.getTutorId());

        roomService.createRoom(roomDto);
    }

    private void renewRoom(Demand demand) {
        if(demand.getRoomEndDate() == null) {
            throw new IllegalStateException("Room end date is required for renewal");
        }

        RoomRenewalRequestDto renewalDto = new RoomRenewalRequestDto();
        renewalDto.setRoomId(demand.getOriginalRoomId());
        renewalDto.setNewEndDate(demand.getRoomEndDate().toString());
        renewalDto.setCapacity(demand.getRoomCapacity());
        renewalDto.setAmount(demand.getRoomAmount());

        roomService.renewRoom(renewalDto);
    }


    private Demand mapRequestToEntity(DemandDto.Request request) {
        Demand demand = new Demand();
        demand.setFullName(request.getFullName());
        demand.setEmail(request.getEmail());
        demand.setPhone(request.getPhone());
        demand.setPurpose(request.getPurpose());
        demand.setExperience(request.getExperience());
        demand.setMessage(request.getMessage());
        return demand;
    }

    private DemandDto.Response mapEntityToResponse(Demand demand) {
        return new DemandDto.Response(
                demand.getId(),
                demand.getFullName(),
                demand.getEmail(),
                demand.getPhone(),
                demand.getPurpose(),
                demand.getExperience(),
                demand.getMessage(),
                demand.getStatus(),
                demand.getCreatedAt(),
                demand.getProcessedAt(),
                demand.getDemandType(),
                demand.getRoomName(),
                demand.getRoomCapacity(),
                demand.getRoomStartDate(),
                demand.getRoomEndDate(),
                demand.getRoomAmount(),
                demand.getTutorId(),
                demand.getOriginalRoomId()
        );
    }

    @Override
    public DemandDto.Response getDemandById(Long id) {
        Demand demand = demandRepository.findById(id).get();
        return mapEntityToResponse(demand);
    }

    @Override
    public List<DemandDto.Response> getAllDemands() {
        return demandRepository.findAll().stream()
                .map(this::mapEntityToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<DemandDto.Response> getDemandsByStatus(DemandStatus status) {
        return demandRepository.findByStatus(status).stream()
                .map(this::mapEntityToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public void deleteDemand(Long id) {
        if (!demandRepository.existsById(id)) {

        }
        demandRepository.deleteById(id);
    }
}