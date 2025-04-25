package ma.tutorconnect.tutorconnect.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ma.tutorconnect.tutorconnect.entity.Demand;
import ma.tutorconnect.tutorconnect.enums.DemandStatus;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DemandRepository extends JpaRepository<Demand, Long> {
    List<Demand> findByStatus(DemandStatus status);
    List<Demand> findByEmail(String email);
}