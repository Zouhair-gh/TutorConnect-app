package ma.tutorconnect.tutorconnect.repository;

import ma.tutorconnect.tutorconnect.entity.Tutor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface TutorRepository extends JpaRepository<Tutor, Long> {
}
