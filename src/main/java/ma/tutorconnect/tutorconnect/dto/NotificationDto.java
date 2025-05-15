package ma.tutorconnect.tutorconnect.dto;

import java.time.LocalDateTime;

public class NotificationDto {
    private Long recipientId;  // Add this field
    private String title;
    private String message;
    private String type;
    private LocalDateTime timestamp;
    private boolean read;

    // Constructors
    public NotificationDto() {}

    public NotificationDto(Long recipientId, String title, String message, String type) {
        this.recipientId = recipientId;
        this.title = title;
        this.message = message;
        this.type = type;
        this.timestamp = LocalDateTime.now();
        this.read = false;
    }

    // Getters and Setters
    public Long getRecipientId() { return recipientId; }  // Add this getter
    public void setRecipientId(Long recipientId) { this.recipientId = recipientId; }  // Add this setter
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }
    public boolean isRead() { return read; }
    public void setRead(boolean read) { this.read = read; }
}