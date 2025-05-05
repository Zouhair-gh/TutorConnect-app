package ma.tutorconnect.tutorconnect.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import ma.tutorconnect.tutorconnect.entity.User;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    User findByEmail(String email);

    boolean existsByEmail(String email);

    boolean existsByUsername(String username);

    User findByUsername(String username);


    @Query("SELECT COUNT(user) FROM User user")
    long countUsers();


}
