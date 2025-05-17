package ma.tutorconnect.tutorconnect.dto;

import java.util.List;

public class RoomWithParticipantsDTO {
    private RoomDTO room;
    private List<ParticipantDTO> participants;

    // Constructors
    public RoomWithParticipantsDTO() {}

    public RoomWithParticipantsDTO(RoomDTO room, List<ParticipantDTO> participants) {
        this.room = room;
        this.participants = participants;
    }

    // Getters and Setters
    public RoomDTO getRoom() { return room; }
    public void setRoom(RoomDTO room) { this.room = room; }
    public List<ParticipantDTO> getParticipants() { return participants; }
    public void setParticipants(List<ParticipantDTO> participants) { this.participants = participants; }
}