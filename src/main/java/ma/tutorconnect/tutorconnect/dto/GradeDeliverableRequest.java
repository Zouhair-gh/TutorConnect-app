package ma.tutorconnect.tutorconnect.dto;

public record GradeDeliverableRequest(
        Long deliverableId,
        Double grade,
        String feedback

) {
    @Override
    public Long deliverableId() {
        return deliverableId;
    }

    @Override
    public Double grade() {
        return grade;
    }

    @Override
    public String feedback() {
        return feedback;
    }
}