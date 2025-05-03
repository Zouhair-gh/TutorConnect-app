package ma.tutorconnect.tutorconnect.dto;

import java.sql.Date;

public record DeliverableDTO(
        Long id,
        String title,
        String description,
        Date startDate,
        Date endDate,
        Date deadline,
        String filePath,
        boolean isSubmitted,
        Long roomId,
        Long participantId,
        Long tutorId
) {}



