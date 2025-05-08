package ma.tutorconnect.tutorconnect.service;

import ma.tutorconnect.tutorconnect.dto.DashboardStatsDTO;
import ma.tutorconnect.tutorconnect.entity.*;
import ma.tutorconnect.tutorconnect.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AdminService {

    @Autowired
    private TutorRepository tutorRepository;

    @Autowired
    private ParticipantRepository participantRepository;

    @Autowired
    private RoomRepository roomRepository;

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private UserRepository userRepository;

    public DashboardStatsDTO getDashboardStats() {
        long tutorCount = tutorRepository.countTutors();
        long participantCount = participantRepository.countParticipants();
        long roomCount = roomRepository.countRooms();
        long paymentCount = paymentRepository.countPayments();
        long userCount = userRepository.countUsers();

        return new DashboardStatsDTO(tutorCount, participantCount, roomCount, paymentCount, userCount);
    }

    public List<Tutor> getAllTutors() {
        return tutorRepository.findAll();
    }

    public List<Participant> getAllParticipants() {
        return participantRepository.findAll();
    }

    public List<Room> getAllRooms() {
        return roomRepository.findAll();
    }

    public List<Payment> getAllPayments() {
        return paymentRepository.findAll();
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
}