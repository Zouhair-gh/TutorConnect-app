package ma.tutorconnect.tutorconnect.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RoomWithParticipantsDTO {
    private CreateRoomDto room;
    private List<ParticipantDTO> participants;
}