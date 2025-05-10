package ma.tutorconnect.tutorconnect.controller;

import ma.tutorconnect.tutorconnect.dto.*;
import ma.tutorconnect.tutorconnect.service.DeliverableService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/deliverables")
public class    DeliverableController {
    private final DeliverableService deliverableService;

    @Autowired
    public DeliverableController(DeliverableService deliverableService) {
        this.deliverableService = deliverableService;
    }

    @PostMapping
    public ResponseEntity<List<DeliverableDTO>> createDeliverables(@RequestBody CreateDeliverableRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(deliverableService.createDeliverables(request));
    }

    @GetMapping("/room/{roomId}")
    public ResponseEntity<List<DeliverableDTO>> getRoomDeliverables(@PathVariable Long roomId) {
        return ResponseEntity.ok(deliverableService.getRoomDeliverables(roomId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<DeliverableDTO> getDeliverable(@PathVariable Long id) {
        return ResponseEntity.ok(deliverableService.getDeliverableById(id));
    }

    @PostMapping(value = "/submit", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<DeliverableDTO> submitDeliverable(
            @RequestPart("request") SubmitDeliverableRequest request,
            @RequestPart(value = "files", required = false) List<MultipartFile> files) {
        return ResponseEntity.ok(deliverableService.submitDeliverable(request, files));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDeliverable(@PathVariable Long id) {
        deliverableService.deleteDeliverable(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/grade")
    public ResponseEntity<DeliverableDTO> gradeDeliverable(@RequestBody GradeDeliverableRequest request) {
        return ResponseEntity.ok(deliverableService.gradeDeliverable(request));
    }

    @PostMapping("/{id}/comments")
    public ResponseEntity<DeliverableCommentDTO> addComment(
            @PathVariable Long id,
            @RequestBody String content) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(deliverableService.addComment(id, content));
    }

    @GetMapping("/{id}/comments")
    public ResponseEntity<List<DeliverableCommentDTO>> getComments(@PathVariable Long id) {
        return ResponseEntity.ok(deliverableService.getDeliverableComments(id));
    }

    @PatchMapping("/{id}/visibility")
    public ResponseEntity<DeliverableDTO> setVisibility(
            @PathVariable Long id,
            @RequestParam boolean visible) {
        return ResponseEntity.ok(deliverableService.setDeliverableVisibility(id, visible));
    }

    @GetMapping("/participant/{participantId}")
    public ResponseEntity<List<DeliverableDTO>> getParticipantDeliverables(@PathVariable Long participantId) {
        return ResponseEntity.ok(deliverableService.getParticipantDeliverables(participantId));
    }

    @GetMapping("/tutor")
    public ResponseEntity<List<DeliverableDTO>> getTutorDeliverables() {
        return ResponseEntity.ok(deliverableService.getTutorDeliverables());
    }

}