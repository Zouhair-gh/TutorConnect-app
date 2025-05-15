package ma.tutorconnect.tutorconnect.service;

import ma.tutorconnect.tutorconnect.dto.ParticipantDashboardDTO;
import ma.tutorconnect.tutorconnect.entity.Participant;
import ma.tutorconnect.tutorconnect.repository.DeliverableRepository;
import ma.tutorconnect.tutorconnect.repository.ParticipantRepository;
import ma.tutorconnect.tutorconnect.repository.PaymentRepository;
import ma.tutorconnect.tutorconnect.repository.RoomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ParticipantDashboardService {

    @Autowired
    private RoomRepository roomRepository;

    @Autowired
    private DeliverableRepository deliverableRepository;

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private ParticipantRepository participantRepository;

   /* public ParticipantDashboardDTO getDashboardSummary(Long participantId) {
        Participant participant = participantRepository.findById(participantId)
                .orElseThrow(() -> new RuntimeException("Participant not found"));

        long roomCount = roomRepository.findRoomsByParticipant(participant).size();
        long totalAssignments = deliverableRepository.countAllByParticipantId(participantId);
      //  long completedAssignments = deliverableRepository.countCompletedByParticipantId(participantId);
        double totalPaid = paymentRepository.sumPaidByParticipantId(participantId);
        double totalUnpaid = paymentRepository.sumUnpaidByParticipantId(participantId);

        return new ParticipantDashboardDTO(roomCount, totalAssignments, completedAssignments, totalPaid, totalUnpaid);
    } */
}

