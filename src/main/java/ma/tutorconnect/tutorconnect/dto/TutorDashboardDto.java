package ma.tutorconnect.tutorconnect.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import ma.tutorconnect.tutorconnect.dto.RoomWithParticipantsDTO;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TutorDashboardDto {
    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private String specialites;

    private List<RoomWithParticipantsDTO> roomsWithParticipants;
}
