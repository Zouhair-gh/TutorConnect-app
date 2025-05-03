package ma.tutorconnect.tutorconnect.repository;

import ma.tutorconnect.tutorconnect.entity.Tutor;
import ma.tutorconnect.tutorconnect.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TutorRepository extends JpaRepository<Tutor, Long> {
    Optional<Tutor> findByEmail(String email);
    boolean existsByEmail(String email);

    @Query("SELECT t FROM Tutor t WHERE t.username = :username")
    Optional<Tutor> findByUsername(@Param("username") String username);

    @Query("SELECT t FROM Tutor t WHERE t.id = :userId")
    Tutor findByUserId(@Param("userId") Long userId);
}