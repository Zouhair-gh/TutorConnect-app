package ma.tutorconnect.tutorconnect.repository;

import ma.tutorconnect.tutorconnect.entity.Participant;
import ma.tutorconnect.tutorconnect.entity.Room;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RoomRepository extends JpaRepository<Room, Long> {
    Room findByName(String name);
    List<Room> findByTutorId(Long tutorId);
    Room findAllById(Long id);

    @Query("SELECT COUNT(r) FROM Room r")
    long countRooms();

    @Query("SELECT r FROM Room r JOIN r.participants p WHERE p = :participant")
    List<Room> findRoomsByParticipant(@Param("participant") Participant participant);

    @Query("SELECT r FROM Room r WHERE r.endDate BETWEEN :startDate AND :endDate")
    List<Room> findByEndDateBetween(@Param("startDate") java.sql.Date startDate,
                                     @Param("endDate") java.sql.Date endDate);

    @Query("SELECT DISTINCT r FROM Room r JOIN r.participants p WHERE p.id = :participantId")
    List<Room> findRoomsByParticipantId(@Param("participantId") Long participantId);
}
