package ma.tutorconnect.tutorconnect.service.Impl;

import ma.tutorconnect.tutorconnect.dto.NotificationDto;
import ma.tutorconnect.tutorconnect.entity.Notification;
import ma.tutorconnect.tutorconnect.repository.NotificationRepository;
import ma.tutorconnect.tutorconnect.service.NotificationService;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class NotificationServiceImpl implements NotificationService {
    private final SimpMessagingTemplate messagingTemplate;
    private final NotificationRepository notificationRepository;

    public NotificationServiceImpl(SimpMessagingTemplate messagingTemplate,
                                   NotificationRepository notificationRepository) {
        this.messagingTemplate = messagingTemplate;
        this.notificationRepository = notificationRepository;
    }

    @Override
    public void sendNotification(Long recipientId, NotificationDto notificationDto) {
        // Save to database
        Notification notification = new Notification();
        notification.setRecipientId(recipientId);
        notification.setTitle(notificationDto.getTitle());
        notification.setMessage(notificationDto.getMessage());
        notification.setType(notificationDto.getType());
        notification.setCreatedAt(LocalDateTime.now());
        notification.setRead(false);
        notificationRepository.save(notification);

        // Send via WebSocket
        String destination = "/topic/user/" + recipientId + "/notifications";
        messagingTemplate.convertAndSend(destination, notificationDto);
    }

    @Override
    public void markAsRead(Long notificationId) {
        notificationRepository.findById(notificationId).ifPresent(notification -> {
            notification.setRead(true);
            notificationRepository.save(notification);
        });
    }

    @Override
    public List<NotificationDto> getUserNotifications(Long userId) {
        return notificationRepository.findByRecipientIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    private NotificationDto convertToDto(Notification notification) {
        NotificationDto dto = new NotificationDto();
        dto.setRecipientId(notification.getRecipientId());
        dto.setTitle(notification.getTitle());
        dto.setMessage(notification.getMessage());
        dto.setType(notification.getType());
        dto.setTimestamp(notification.getCreatedAt());
        dto.setRead(notification.isRead());
        return dto;
    }
}