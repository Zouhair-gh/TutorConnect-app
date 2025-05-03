package ma.tutorconnect.tutorconnect.dto;

public record GradeDeliverableRequest(
        Long deliverableId,
        Double grade,
        String feedback
) {}