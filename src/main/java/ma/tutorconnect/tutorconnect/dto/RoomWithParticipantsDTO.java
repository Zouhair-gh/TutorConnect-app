package ma.tutorconnect.tutorconnect.dto;

import java.util.List;

public class RoomWithParticipantsDTO {
    private CreateRoomDto room;
    private List<ParticipantDTO> participants;

    // Default constructor
    public RoomWithParticipantsDTO() {
    }

    // Constructor with all parameters
    public RoomWithParticipantsDTO(CreateRoomDto room, List<ParticipantDTO> participants) {
        this.room = room;
        this.participants = participants;
    }

    // Getters and setters
    public CreateRoomDto getRoom() {
        return room;
    }

    public void setRoom(CreateRoomDto room) {
        this.room = room;
    }

    public List<ParticipantDTO> getParticipants() {
        return participants;
    }

    public void setParticipants(List<ParticipantDTO> participants) {
        this.participants = participants;
    }
}