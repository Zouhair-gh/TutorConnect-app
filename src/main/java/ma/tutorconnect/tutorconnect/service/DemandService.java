package ma.tutorconnect.tutorconnect.service;

import ma.tutorconnect.tutorconnect.dto.DemandDto;
import ma.tutorconnect.tutorconnect.enums.DemandStatus;

import java.util.List;

public interface DemandService {
    DemandDto.Response createDemand(DemandDto.Request demandRequest);
    DemandDto.Response getDemandById(Long id);
    List<DemandDto.Response> getAllDemands();
    List<DemandDto.Response> getDemandsByStatus(DemandStatus status);
    DemandDto.Response updateDemandStatus(Long id, DemandDto.StatusUpdate statusUpdate);
    void deleteDemand(Long id);
}