package ma.tutorconnect.tutorconnect.scheduler;

import ma.tutorconnect.tutorconnect.dto.NotificationDto;
import ma.tutorconnect.tutorconnect.entity.Room;
import ma.tutorconnect.tutorconnect.repository.RoomRepository;
import ma.tutorconnect.tutorconnect.service.NotificationService;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.sql.Date;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Component
public class RoomNotificationScheduler {
    private final RoomRepository roomRepository;
    private final NotificationService notificationService;

    public RoomNotificationScheduler(RoomRepository roomRepository,
                                     NotificationService notificationService) {
        this.roomRepository = roomRepository;
        this.notificationService = notificationService;
    }

    // Runs every day at 11 PM (23:00)
    @Scheduled(cron = "0 0 23 * * ?")  // <-- Updated cron expression
    public void notifyTutorsOfApproachingEndDates() {
        LocalDate today = LocalDate.now();
        LocalDate threeDaysLater = today.plusDays(3);

        List<Room> roomsEndingSoon = roomRepository.findByEndDateBetween(
                Date.valueOf(today),
                Date.valueOf(threeDaysLater)
        );

        roomsEndingSoon.forEach(room -> {
            long daysRemaining = ChronoUnit.DAYS.between(today, room.getEndDate().toLocalDate());
            String message = String.format(
                    "Room '%s' is ending in %d day%s. Consider renewal if needed.",
                    room.getName(),
                    daysRemaining,
                    daysRemaining == 1 ? "" : "s"
            );

            NotificationDto notification = new NotificationDto(
                    room.getTutor().getId(),
                    "Room Ending Soon",
                    message,
                    "ROOM_RENEWAL"
            );

            notificationService.sendNotification(room.getTutor().getId(), notification);
        });
    }
}