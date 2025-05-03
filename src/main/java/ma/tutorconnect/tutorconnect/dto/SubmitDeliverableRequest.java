package ma.tutorconnect.tutorconnect.dto;

import java.sql.Date;
import java.util.List;
// SubmitDeliverable this i forr participants
public record SubmitDeliverableRequest(
        Long deliverableId,
        String filePath,
        String submissionNotes,
        List<String> attachmentUrls
) {}



