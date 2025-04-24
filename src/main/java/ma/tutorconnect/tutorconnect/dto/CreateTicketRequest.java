package ma.tutorconnect.tutorconnect.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import ma.tutorconnect.tutorconnect.enums.TicketPriority;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateTicketRequest {
    @NotBlank(message = "Subject is required")
    private String subject;

    @NotBlank(message = "Description is required")
    private String description;

    @NotNull(message = "Priority is required")
    private TicketPriority priority;

    public @NotBlank(message = "Subject is required") String getSubject() {
        return subject;
    }

    public @NotBlank(message = "Description is required") String getDescription() {
        return description;
    }

    public @NotNull(message = "Priority is required") TicketPriority getPriority() {
        return priority;
    }
    public void setSubject(@NotBlank(message = "Subject is required") String subject) {
        this.subject = subject;
    }
    public void setDescription(@NotBlank(message = "Description is required") String description) {
        this.description = description;
    }
    public void setPriority(@NotNull(message = "Priority is required") TicketPriority priority) {
        this.priority = priority;
    }
}