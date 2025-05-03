package ma.tutorconnect.tutorconnect.repository;

import ma.tutorconnect.tutorconnect.entity.Deliverable;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface DeliverableRepository extends JpaRepository<Deliverable, Long> {
    List<Deliverable> findByRoomId(Long roomId);
    List<Deliverable> findByParticipantId(Long participantId);
    List<Deliverable> findByTutorId(Long tutorId);
}