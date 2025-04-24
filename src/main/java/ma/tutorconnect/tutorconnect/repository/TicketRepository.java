package ma.tutorconnect.tutorconnect.repository;

import ma.tutorconnect.tutorconnect.entity.Ticket;
import ma.tutorconnect.tutorconnect.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TicketRepository extends JpaRepository<Ticket, Long> {
    List<Ticket> findByTutor(User tutor);
    List<Ticket> findByTutorOrderByCreatedAtDesc(User tutor);
}