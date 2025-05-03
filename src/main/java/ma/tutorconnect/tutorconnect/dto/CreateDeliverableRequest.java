package ma.tutorconnect.tutorconnect.dto;

import java.sql.Date;
import java.util.List;

public record CreateDeliverableRequest(
        String title,
        String description,
        Date deadline,
        Long roomId,
        Integer maxPoints,
        List<Long> assignedParticipantIds,
        String attachmentUrl,
        boolean isVisible
) {}