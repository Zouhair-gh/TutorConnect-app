package ma.tutorconnect.tutorconnect.dto;

// SubmitDeliverable this i forr participants
public record SubmitDeliverableRequest(
        Long deliverableId,
        String filePath
) {}

