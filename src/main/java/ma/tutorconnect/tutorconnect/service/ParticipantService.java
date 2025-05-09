package ma.tutorconnect.tutorconnect.service;

import ma.tutorconnect.tutorconnect.dto.AddParticipantRequest;
import ma.tutorconnect.tutorconnect.dto.ParticipantDTO;
import ma.tutorconnect.tutorconnect.dto.RoomWithParticipantsDTO;
import ma.tutorconnect.tutorconnect.entity.Participant;

import java.util.List;
import java.util.Optional;

public interface ParticipantService {
    List<ParticipantDTO> getRoomParticipants(Long roomId);
    ParticipantDTO addParticipantToRoom(Long roomId, AddParticipantRequest request) ;
    void removeParticipantFromRoom(Long roomId, Long participantId);
    List<ParticipantDTO> getAvailableParticipants(Long roomId);
    ParticipantDTO getParticipantInRoom(Long roomId, Long participantId);

    Optional<Participant> findByEmail(String email);


    //method to get rooms for participant
    List<RoomWithParticipantsDTO> getRoomsForCurrentParticipant();
}

