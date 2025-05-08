package ma.tutorconnect.tutorconnect.repository;

import ma.tutorconnect.tutorconnect.entity.Session;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface SessionRepository extends JpaRepository<Session, Long> {

    List<Session> findByRoomId(Long roomId);

    @Query("SELECT s FROM Session s WHERE s.room.id = :roomId AND s.startTime > :now ORDER BY s.startTime")
    List<Session> findUpcomingSessionsByRoomId(@Param("roomId") Long roomId, @Param("now") LocalDateTime now);

    @Query("SELECT s FROM Session s JOIN s.room r JOIN r.participants p WHERE p.id = :participantId")
    List<Session> findSessionsByParticipantId(@Param("participantId") Long participantId);

    @Query("SELECT s FROM Session s JOIN s.attendees a WHERE a.id = :participantId")
    List<Session> findSessionsByAttendeeId(@Param("participantId") Long participantId);

    @Query("SELECT s FROM Session s JOIN s.room r WHERE r.tutor.id = :tutorId")
    List<Session> findSessionsByTutorId(@Param("tutorId") Long tutorId);

    List<Session> findByStartTimeBetween(LocalDateTime start, LocalDateTime end);
}