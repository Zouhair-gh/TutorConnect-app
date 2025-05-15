package ma.tutorconnect.tutorconnect.service;

import ma.tutorconnect.tutorconnect.dto.NotificationDto;
import java.util.List;

public interface NotificationService {
    void sendNotification(Long recipientId, NotificationDto notificationDto);
    void markAsRead(Long notificationId);
    List<NotificationDto> getUserNotifications(Long userId);
}