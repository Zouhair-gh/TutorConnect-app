package ma.tutorconnect.tutorconnect.repository;

import ma.tutorconnect.tutorconnect.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface PaymentRepository extends JpaRepository<Payment, Long> {
    @Query("SELECT COUNT(pay) FROM Payment pay")
    long countPayments();

    @Query("SELECT COALESCE(SUM(p.amount), 0) FROM Payment p WHERE p.participant.id = :participantId AND p.paid = 'Paid'")
    double sumPaidByParticipantId(@Param("participantId") Long participantId);

    @Query("SELECT COALESCE(SUM(p.amount), 0) FROM Payment p WHERE p.participant.id = :participantId AND p.paid <> 'Paid'")
    double sumUnpaidByParticipantId(@Param("participantId") Long participantId);
}