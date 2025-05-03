package ma.tutorconnect.tutorconnect.repository;

import ma.tutorconnect.tutorconnect.entity.DeliverableComment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DeliverableCommentRepository extends JpaRepository<DeliverableComment, Long> {
    List<DeliverableComment> findByDeliverableIdOrderByCreatedAtDesc(Long deliverableId);
}