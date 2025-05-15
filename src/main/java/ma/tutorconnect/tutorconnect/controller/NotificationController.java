package ma.tutorconnect.tutorconnect.controller;

import ma.tutorconnect.tutorconnect.dto.NotificationDto;
import ma.tutorconnect.tutorconnect.service.NotificationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {
    private final NotificationService notificationService;

    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @PostMapping
    public ResponseEntity<?> sendNotification(@RequestBody NotificationDto notificationDto) {
        // Add validation
        if (notificationDto.getRecipientId() == null) {
            return ResponseEntity.badRequest().body("Recipient ID is required");
        }
        if (notificationDto.getMessage() == null || notificationDto.getMessage().isEmpty()) {
            return ResponseEntity.badRequest().body("Message is required");
        }

        notificationService.sendNotification(
                notificationDto.getRecipientId(),
                notificationDto
        );
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{id}/read")
    public ResponseEntity<?> markAsRead(@PathVariable Long id) {
        notificationService.markAsRead(id);
        return ResponseEntity.ok().build();
    }

    // Add this new endpoint to get notifications for a user
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<NotificationDto>> getUserNotifications(@PathVariable Long userId) {
        // You would need to implement this in your service
        // For now returning empty list as placeholder
        return ResponseEntity.ok(Collections.emptyList());
    }
}