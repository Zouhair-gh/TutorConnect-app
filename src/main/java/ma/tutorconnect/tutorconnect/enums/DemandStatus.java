package ma.tutorconnect.tutorconnect.enums;


public enum DemandStatus {
    PENDING,
    APPROVED,
    REJECTED;
    public static DemandStatus fromString(String value) {
        try {
            return DemandStatus.valueOf(value.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Invalid demand status: " + value);
        }
    }
}
