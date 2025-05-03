package ma.tutorconnect.tutorconnect.service.Impl;

import ma.tutorconnect.tutorconnect.dto.CreateDeliverableRequest;
import ma.tutorconnect.tutorconnect.dto.DeliverableDTO;
import ma.tutorconnect.tutorconnect.dto.SubmitDeliverableRequest;
import ma.tutorconnect.tutorconnect.entity.Deliverable;
import ma.tutorconnect.tutorconnect.entity.Room;
import ma.tutorconnect.tutorconnect.entity.Tutor;
import ma.tutorconnect.tutorconnect.entity.User;
import ma.tutorconnect.tutorconnect.repository.*;
import ma.tutorconnect.tutorconnect.security.AuthenticationFacade;
import ma.tutorconnect.tutorconnect.service.DeliverableService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.sql.Date;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class DeliverableServiceImpl implements DeliverableService {
    private final AuthenticationFacade authenticationFacade;
    private final TutorRepository tutorRepository;
    private final UserRepository userRepository;
    private final RoomRepository roomRepository;
    private final DeliverableRepository deliverableRepository;

    @Autowired
    public DeliverableServiceImpl(AuthenticationFacade authenticationFacade,
                                  TutorRepository tutorRepository,
                                  UserRepository userRepository,
                                  RoomRepository roomRepository,
                                  DeliverableRepository deliverableRepository) {
        this.authenticationFacade = authenticationFacade;
        this.tutorRepository = tutorRepository;
        this.userRepository = userRepository;
        this.roomRepository = roomRepository;
        this.deliverableRepository = deliverableRepository;
    }

    @Override
    public DeliverableDTO createDeliverable(CreateDeliverableRequest request) {
        // Get the authenticated email from the token
        String email = authenticationFacade.getAuthenticatedUsername();

        // First try to find tutor directly by email
        Tutor tutor = tutorRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Tutor not found"));

        // Find room by ID
        Room room = roomRepository.findById(request.roomId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Room not found"));

        // Verify tutor owns the room
        if (room.getTutor() == null || !room.getTutor().getId().equals(tutor.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Unauthorized access to room");
        }

        // Create deliverable
        Deliverable deliverable = new Deliverable();
        deliverable.setTitle(request.title());
        deliverable.setDescription(request.description());
        deliverable.setDeadline(request.deadline());
        deliverable.setRoom(room);
        deliverable.setTutor(tutor);
        deliverable.setStartDate(new Date(System.currentTimeMillis()));
        deliverable.setSubmitted(false);

        Deliverable saved = deliverableRepository.save(deliverable);
        return convertToDTO(saved);
    }

    @Override
    public List<DeliverableDTO> getRoomDeliverables(Long roomId) {
        // Verify room exists
        if (!roomRepository.existsById(roomId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Room not found");
        }

        return deliverableRepository.findByRoomId(roomId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public DeliverableDTO submitDeliverable(SubmitDeliverableRequest request) {
        Deliverable deliverable = deliverableRepository.findById(request.deliverableId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Deliverable not found"));

        // Check if deliverable is already submitted
        if (deliverable.isSubmitted()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Deliverable has already been submitted");
        }

        // Check if deadline has passed
        Date currentDate = new Date(System.currentTimeMillis());
        if (currentDate.after(deliverable.getDeadline())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Deadline has passed");
        }

        deliverable.setFilePath(request.filePath());
        deliverable.setSubmissionDate(currentDate);
        deliverable.setSubmitted(true);

        Deliverable saved = deliverableRepository.save(deliverable);
        return convertToDTO(saved);
    }

    @Override
    public DeliverableDTO getDeliverableById(Long id) {
        Deliverable deliverable = deliverableRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Deliverable not found"));
        return convertToDTO(deliverable);
    }

    @Override
    public void deleteDeliverable(Long id) {
        if (!deliverableRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Deliverable not found");
        }
        deliverableRepository.deleteById(id);
    }

    private DeliverableDTO convertToDTO(Deliverable deliverable) {
        return new DeliverableDTO(
                deliverable.getId(),
                deliverable.getTitle(),
                deliverable.getDescription(),
                deliverable.getStartDate(),
                deliverable.getSubmissionDate(),
                deliverable.getDeadline(),
                deliverable.getFilePath(),
                deliverable.isSubmitted(),
                deliverable.getRoom().getId(),
                deliverable.getParticipant() != null ? deliverable.getParticipant().getId() : null,
                deliverable.getTutor().getId()
        );
    }
}