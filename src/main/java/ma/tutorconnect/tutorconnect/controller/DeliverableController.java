package ma.tutorconnect.tutorconnect.controller;

import ma.tutorconnect.tutorconnect.dto.CreateDeliverableRequest;
import ma.tutorconnect.tutorconnect.dto.DeliverableDTO;
import ma.tutorconnect.tutorconnect.dto.SubmitDeliverableRequest;
import ma.tutorconnect.tutorconnect.service.DeliverableService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/deliverables")
public class DeliverableController {
    private DeliverableService deliverableService;

    @Autowired
    public DeliverableController(DeliverableService deliverableService) {
        this.deliverableService = deliverableService;
    }

    @PostMapping
    public ResponseEntity<DeliverableDTO> createDeliverable(@RequestBody CreateDeliverableRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(deliverableService.createDeliverable(request));
    }

    @GetMapping("/room/{roomId}")
    public ResponseEntity<List<DeliverableDTO>> getRoomDeliverables(@PathVariable Long roomId) {
        return ResponseEntity.ok(deliverableService.getRoomDeliverables(roomId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<DeliverableDTO> getDeliverable(@PathVariable Long id) {
        return ResponseEntity.ok(deliverableService.getDeliverableById(id));
    }

    @PostMapping("/submit")
    public ResponseEntity<DeliverableDTO> submitDeliverable(@RequestBody SubmitDeliverableRequest request) {
        return ResponseEntity.ok(deliverableService.submitDeliverable(request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDeliverable(@PathVariable Long id) {
        deliverableService.deleteDeliverable(id);
        return ResponseEntity.noContent().build();
    }
}
