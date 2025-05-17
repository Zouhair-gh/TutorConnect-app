package ma.tutorconnect.tutorconnect.service;

import ma.tutorconnect.tutorconnect.dto.CreateRoomDto;
import ma.tutorconnect.tutorconnect.dto.RoomRenewalRequestDto;
import ma.tutorconnect.tutorconnect.dto.RoomWithParticipantsDTO;
import ma.tutorconnect.tutorconnect.entity.Tutor;
import org.springframework.http.ResponseEntity;

import java.util.List;

public interface TutorService {
    List<Tutor> getAllTutors();
    Tutor getTutorById(Long id);
    Tutor saveTutor(Tutor tutor);
    void deleteTutor(Long id);
    ResponseEntity<?> requestRoomRenewal(RoomRenewalRequestDto renewalRequest);

    List<CreateRoomDto> getRoomsByTutor(Long tutorId);
    List<RoomWithParticipantsDTO> getRoomsWithParticipantsByTutor(Long tutorId);

}
