package ma.tutorconnect.tutorconnect.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ParticipantDTO {
    private Long id;
    private String firstName;
    private String lastName;
    private String email;
}

