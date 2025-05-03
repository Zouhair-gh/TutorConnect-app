package ma.tutorconnect.tutorconnect.dto;

import java.sql.Date;

public record CreateDeliverableRequest(
        String title,
        String description,
        Date deadline,
        Long roomId
) {}