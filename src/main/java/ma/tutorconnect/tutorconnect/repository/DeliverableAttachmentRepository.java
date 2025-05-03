package ma.tutorconnect.tutorconnect.repository;

import ma.tutorconnect.tutorconnect.entity.DeliverableAttachment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DeliverableAttachmentRepository extends JpaRepository<DeliverableAttachment, Long> {
    List<DeliverableAttachment> findByDeliverableId(Long deliverableId);
}