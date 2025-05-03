package ma.tutorconnect.tutorconnect.repository;

import ma.tutorconnect.tutorconnect.entity.Deliverable;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface DeliverableRepository extends JpaRepository<Deliverable, Long> {
    List<Deliverable> findByRoomId(Long roomId);
    List<Deliverable> findByParticipantId(Long participantId);
    List<Deliverable> findByTutorId(Long tutorId);
    List<Deliverable> findByRoomIdAndParticipantId(Long roomId, Long participantId);
    List<Deliverable> findByRoomIdAndTutorId(Long roomId, Long tutorId);
    List<Deliverable> findByParticipantIdAndIsVisibleTrue(Long participantId);}