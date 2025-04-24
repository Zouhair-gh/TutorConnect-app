package ma.tutorconnect.tutorconnect.service.Impl;

import ma.tutorconnect.tutorconnect.dto.DemandDto;
import ma.tutorconnect.tutorconnect.entity.Demand;
import ma.tutorconnect.tutorconnect.enums.DemandStatus;
import ma.tutorconnect.tutorconnect.repository.DemandRepository;
import ma.tutorconnect.tutorconnect.service.DemandService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class DemandServiceImpl implements DemandService {

    private final DemandRepository demandRepository;

    @Autowired
    public DemandServiceImpl(DemandRepository demandRepository) {
        this.demandRepository = demandRepository;
    }

    @Override
    @Transactional
    public DemandDto.Response createDemand(DemandDto.Request demandRequest) {
        Demand demand = new Demand();
        demand.setFullName(demandRequest.getFullName());
        demand.setEmail(demandRequest.getEmail());
        demand.setPhone(demandRequest.getPhone());
        demand.setPurpose(demandRequest.getPurpose());
        demand.setExperience(demandRequest.getExperience());
        demand.setMessage(demandRequest.getMessage());
        demand.setStatus(DemandStatus.PENDING);
        demand.setCreatedAt(LocalDateTime.now());

        Demand savedDemand = demandRepository.save(demand);
        return convertToDto(savedDemand);
    }

    @Override
    public DemandDto.Response getDemandById(Long id) {
        Demand demand = demandRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Demand not found with id: " + id));
        return convertToDto(demand);
    }

    @Override
    public List<DemandDto.Response> getAllDemands() {
        return demandRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<DemandDto.Response> getDemandsByStatus(DemandStatus status) {
        return demandRepository.findByStatus(status).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public DemandDto.Response updateDemandStatus(Long id, DemandDto.StatusUpdate statusUpdate) {
        Demand demand = demandRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Demand not found with id: " + id));

        demand.setStatus(statusUpdate.getStatus());

        // If the status is being updated, set the processed time
        if (statusUpdate.getStatus() != DemandStatus.PENDING) {
            demand.setProcessedAt(LocalDateTime.now());
        }

        Demand updatedDemand = demandRepository.save(demand);
        return convertToDto(updatedDemand);
    }

    @Override
    @Transactional
    public void deleteDemand(Long id) {
        if (!demandRepository.existsById(id)) {
            throw new RuntimeException("Demand not found with id: " + id);
        }
        demandRepository.deleteById(id);
    }

    private DemandDto.Response convertToDto(Demand demand) {
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
                demand.getProcessedAt()
        );
    }
}