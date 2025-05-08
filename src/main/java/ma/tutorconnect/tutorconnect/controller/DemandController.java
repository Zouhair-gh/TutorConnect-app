package ma.tutorconnect.tutorconnect.controller;

import ma.tutorconnect.tutorconnect.dto.DemandDto;
import ma.tutorconnect.tutorconnect.enums.DemandStatus;
import ma.tutorconnect.tutorconnect.service.DemandService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/demands")
public class DemandController {

    private final DemandService demandService;

    @Autowired
    public DemandController(DemandService demandService) {
        this.demandService = demandService;
    }

    @PostMapping
    public ResponseEntity<DemandDto.Response> createDemand(@RequestBody DemandDto.Request request) {
        DemandDto.Response response = demandService.createDemand(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<DemandDto.Response> getDemand(@PathVariable Long id) {
        DemandDto.Response response = demandService.getDemandById(id);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<List<DemandDto.Response>> getAllDemands() {
        List<DemandDto.Response> demands = demandService.getAllDemands();
        return ResponseEntity.ok(demands);
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<DemandDto.Response>> getDemandsByStatus(@PathVariable DemandStatus status) {
        List<DemandDto.Response> demands = demandService.getDemandsByStatus(status);
        return ResponseEntity.ok(demands);
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<DemandDto.Response> updateDemandStatus(
            @PathVariable Long id,
            @RequestBody DemandDto.StatusUpdate statusUpdate) {
        DemandDto.Response response = demandService.updateDemandStatus(id, statusUpdate);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDemand(@PathVariable Long id) {
        demandService.deleteDemand(id);
        return ResponseEntity.noContent().build();
    }


}