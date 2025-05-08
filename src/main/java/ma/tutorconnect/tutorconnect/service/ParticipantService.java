package ma.tutorconnect.tutorconnect.service;

import ma.tutorconnect.tutorconnect.dto.AddParticipantRequest;
import ma.tutorconnect.tutorconnect.dto.ParticipantDTO;
import ma.tutorconnect.tutorconnect.dto.RoomWithParticipantsDTO;

import java.util.List;

public interface ParticipantService {
    List<ParticipantDTO> getRoomParticipants(Long roomId);
    ParticipantDTO addParticipantToRoom(Long roomId, AddParticipantRequest request) ;
    void removeParticipantFromRoom(Long roomId, Long participantId);
    List<ParticipantDTO> getAvailableParticipants(Long roomId);
    ParticipantDTO getParticipantInRoom(Long roomId, Long participantId);

    //method to get rooms for participant
    List<RoomWithParticipantsDTO> getRoomsForCurrentParticipant();
}

