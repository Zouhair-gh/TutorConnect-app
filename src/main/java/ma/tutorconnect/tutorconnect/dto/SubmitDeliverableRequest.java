package ma.tutorconnect.tutorconnect.dto;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;

public record SubmitDeliverableRequest(
        Long deliverableId,
        String submissionNotes
) {
    @JsonCreator
    public SubmitDeliverableRequest(
            @JsonProperty("deliverableId") Long deliverableId,
            @JsonProperty("submissionNotes") String submissionNotes
    ) {
        this.deliverableId = deliverableId;
        this.submissionNotes = submissionNotes;
    }
}