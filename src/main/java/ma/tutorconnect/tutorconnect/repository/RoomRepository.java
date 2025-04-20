package ma.tutorconnect.tutorconnect.repository;

import ma.tutorconnect.tutorconnect.entity.Room;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RoomRepository extends JpaRepository<Room, Long> {
}
