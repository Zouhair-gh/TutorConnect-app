package ma.tutorconnect.tutorconnect.repository;

import ma.tutorconnect.tutorconnect.entity.Participant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;


@Repository
public interface ParticipantRepository extends JpaRepository<Participant , Long> {
    boolean existsByEmail(String email);

    boolean existsByPhoneNumber(String phoneNumber);

    boolean existsByUsername(String username);

    Participant findByEmail(String email);

    Participant findByPhoneNumber(String phoneNumber);

    Participant findByUsername(String username);
    @Query("SELECT COUNT(p) FROM Participant p")
    long countParticipants();


}
