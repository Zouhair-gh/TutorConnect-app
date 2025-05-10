package ma.tutorconnect.tutorconnect.repository;

import ma.tutorconnect.tutorconnect.entity.Deliverable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface DeliverableRepository extends JpaRepository<Deliverable, Long> {
    List<Deliverable> findByRoomId(Long roomId);
    List<Deliverable> findByParticipantId(Long participantId);
    List<Deliverable> findByTutorId(Long tutorId);
    List<Deliverable> findByRoomIdAndParticipantId(Long roomId, Long participantId);
    List<Deliverable> findByRoomIdAndTutorId(Long roomId, Long tutorId);
    List<Deliverable> findByParticipantIdAndIsVisibleTrue(Long participantId);



    @Query("SELECT COUNT(d) FROM Deliverable d WHERE d.participant.id = :participantId")
    long countAllByParticipantId(@Param("participantId") Long participantId);

    @Query("SELECT COUNT(d) FROM Deliverable d WHERE d.participant.id = :participantId AND d.completed = true")
    long countCompletedByParticipantId(@Param("participantId") Long participantId);



}
