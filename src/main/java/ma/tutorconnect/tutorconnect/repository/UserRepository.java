package ma.tutorconnect.tutorconnect.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import ma.tutorconnect.tutorconnect.entity.User;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@Repository
public interface UserRepository extends JpaRepository<User, Long> {



    boolean existsByEmail(String email);

    boolean existsByUsername(String username);


    /**
     * Find user by email
     */
    @Query("SELECT u FROM User u WHERE u.email = :email")
    User findByEmail(@Param("email") String email);

    /**
     * Find user by username
     */
    @Query("SELECT u FROM User u WHERE u.username = :username")
    User findByUsername(@Param("username") String username);



    @Query("SELECT COUNT(user) FROM User user")
    long countUsers();


}
