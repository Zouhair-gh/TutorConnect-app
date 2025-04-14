package ma.tutorconnect.tutorconnect.repository;

import ma.tutorconnect.tutorconnect.entity.Participant;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ParticipantRepository extends JpaRepository<Participant , Long> {

}
