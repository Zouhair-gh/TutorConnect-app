package ma.tutorconnect.tutorconnect.service.Impl;

import ma.tutorconnect.tutorconnect.dto.*;
import ma.tutorconnect.tutorconnect.entity.*;
import ma.tutorconnect.tutorconnect.enums.RoleEnum;
import ma.tutorconnect.tutorconnect.repository.*;
import ma.tutorconnect.tutorconnect.security.AuthenticationFacade;
import ma.tutorconnect.tutorconnect.service.DeliverableService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.security.Principal;
import java.sql.Date;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class DeliverableServiceImpl implements DeliverableService {
    private final AuthenticationFacade authenticationFacade;
    private final TutorRepository tutorRepository;
    private final ParticipantRepository participantRepository;
    private final UserRepository userRepository;
    private final RoomRepository roomRepository;
    private final DeliverableRepository deliverableRepository;
    private final DeliverableCommentRepository commentRepository;
    private final DeliverableAttachmentRepository attachmentRepository;

    @Value("${file.upload-dir}")
    private String uploadDir;

    @Autowired
    public DeliverableServiceImpl(AuthenticationFacade authenticationFacade,
                                  TutorRepository tutorRepository,
                                  ParticipantRepository participantRepository,
                                  UserRepository userRepository,
                                  RoomRepository roomRepository,
                                  DeliverableRepository deliverableRepository,
                                  DeliverableCommentRepository commentRepository,
                                  DeliverableAttachmentRepository attachmentRepository) {
        this.authenticationFacade = authenticationFacade;
        this.tutorRepository = tutorRepository;
        this.participantRepository = participantRepository;
        this.userRepository = userRepository;
        this.roomRepository = roomRepository;
        this.deliverableRepository = deliverableRepository;
        this.commentRepository = commentRepository;
        this.attachmentRepository = attachmentRepository;
    }

    @Override
    @Transactional
    public List<DeliverableDTO> createDeliverables(CreateDeliverableRequest request) {
        // Get the authenticated user
        String email = authenticationFacade.getAuthenticatedUsername();
        Tutor tutor = tutorRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Tutor not found"));

        // Find room by ID
        Room room = roomRepository.findById(request.roomId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Room not found"));

        // Verify tutor owns the room
        if (room.getTutor() == null || !room.getTutor().getId().equals(tutor.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Unauthorized access to room");
        }

        List<DeliverableDTO> createdDeliverables = new ArrayList<>();

        // If specific participants are assigned
        if (request.assignedParticipantIds() != null && !request.assignedParticipantIds().isEmpty()) {
            for (Long participantId : request.assignedParticipantIds()) {
                Participant participant = participantRepository.findById(participantId)
                        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                                "Participant with ID " + participantId + " not found"));

                // Verify participant is part of the room
                if (!room.getParticipants().contains(participant)) {
                    throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                            "Participant is not enrolled in this room");
                }

                Deliverable deliverable = createSingleDeliverable(request, room, tutor, participant);
                createdDeliverables.add(convertToDTO(deliverable));
            }
        } else {
            // Assign to all participants in the room
            for (Participant participant : room.getParticipants()) {
                Deliverable deliverable = createSingleDeliverable(request, room, tutor, participant);
                createdDeliverables.add(convertToDTO(deliverable));
            }
        }

        return createdDeliverables;
    }

    private Deliverable createSingleDeliverable(CreateDeliverableRequest request, Room room, Tutor tutor, Participant participant) {
        Deliverable deliverable = new Deliverable();
        deliverable.setTitle(request.title());
        deliverable.setDescription(request.description());
        deliverable.setDeadline(request.deadline());
        deliverable.setRoom(room);
        deliverable.setTutor(tutor);
        deliverable.setParticipant(participant);
        deliverable.setStartDate(new Date(System.currentTimeMillis()));
        deliverable.setSubmitted(false);
        deliverable.setVisible(request.isVisible());
        deliverable.setMaxPoints(request.maxPoints());
        deliverable.setAttachmentUrl(request.attachmentUrl());

        return deliverableRepository.save(deliverable);
    }

    @Override
    public List<DeliverableDTO> getRoomDeliverables(Long roomId) {
        String email = authenticationFacade.getAuthenticatedUsername();
        User user = userRepository.findByEmail(email);

        // Verify room exists
        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Room not found"));

        List<Deliverable> deliverables;

        // If user is a tutor, show all deliverables for the room
        if (tutorRepository.existsByEmail(email)) {
            Tutor tutor = tutorRepository.findByEmail(email).get();

            // Check if tutor owns the room
            if (!room.getTutor().getId().equals(tutor.getId())) {
                throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You don't have access to this room's deliverables");
            }

            deliverables = deliverableRepository.findByRoomId(roomId);
        }
        // If user is a participant, only show their deliverables
        else if (participantRepository.existsByEmail(email)) {
            Participant participant = participantRepository.findByEmail(email);

            // Check if participant is enrolled in the room
            if (room.getParticipants().stream().noneMatch(p -> p.getId().equals(participant.getId()))) {
                throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You don't have access to this room's deliverables");
            }

            deliverables = deliverableRepository.findByRoomIdAndParticipantId(roomId, participant.getId());
        } else {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Unauthorized access");
        }

        return deliverables.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public DeliverableDTO submitDeliverable(SubmitDeliverableRequest request, List<MultipartFile> files) {
        String email = authenticationFacade.getAuthenticatedUsername();
        Participant participant = participantRepository.findByEmail(email);

        Deliverable deliverable = deliverableRepository.findById(request.deliverableId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Deliverable not found"));

        // Verify this deliverable belongs to this participant
        if (!deliverable.getParticipant().getId().equals(participant.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You cannot submit this deliverable");
        }

        // Check if deliverable is already submitted
        if (deliverable.isSubmitted()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Deliverable has already been submitted");
        }

        // Check if deliverable is visible to participants
        if (!deliverable.isVisible()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "This deliverable is not available for submission yet");
        }

        // Save submission data
        Date currentDate = new Date(System.currentTimeMillis());
        deliverable.setFilePath(request.filePath());
        deliverable.setSubmissionDate(currentDate);
        deliverable.setSubmitted(true);

        // Process attachments if provided
        if (files != null && !files.isEmpty()) {
            for (MultipartFile file : files) {
                String filePath = saveFile(file, deliverable.getId());

                DeliverableAttachment attachment = new DeliverableAttachment();
                attachment.setFileName(file.getOriginalFilename());
                attachment.setFileType(file.getContentType());
                attachment.setDeliverable(deliverable);
                attachmentRepository.save(attachment);
            }
        }

        // Add submission notes as a comment if provided
        if (request.submissionNotes() != null && !request.submissionNotes().isEmpty()) {
            DeliverableComment comment = new DeliverableComment();
            comment.setContent(request.submissionNotes());
            comment.setCreatedAt(new Date(System.currentTimeMillis()));
            comment.setUser(participant);
            comment.setDeliverable(deliverable);
            commentRepository.save(comment);
        }

        Deliverable saved = deliverableRepository.save(deliverable);
        return convertToDTO(saved);
    }

    @Override
    public DeliverableDTO getDeliverableById(Long id) {
        String email = authenticationFacade.getAuthenticatedUsername();
        User user = userRepository.findByEmail(email);

        Deliverable deliverable = deliverableRepository.findByIdWithRelations(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));

        boolean hasAccess = switch (user.getRole()) {
            case ADMIN -> true;
            case TUTOR -> deliverable.getTutor() != null &&
                    deliverable.getTutor().getId().equals(user.getId());
            case PARTICIPANT -> deliverable.getParticipant() != null &&
                    deliverable.getParticipant().getId().equals(user.getId()) &&
                    deliverable.isVisible();
            default -> false;
        };

        if (!hasAccess) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN,
                    "You don't have access to this deliverable");
        }

        return convertToDTO(deliverable);
    }

    @Override
    @Transactional
    public DeliverableDTO gradeDeliverable(GradeDeliverableRequest request) {
        String email = authenticationFacade.getAuthenticatedUsername();
        Tutor tutor = tutorRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.FORBIDDEN, "Only tutors can grade deliverables"));

        Deliverable deliverable = deliverableRepository.findById(request.deliverableId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Deliverable not found"));

        // Verify tutor owns this deliverable
        if (!deliverable.getTutor().getId().equals(tutor.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You cannot grade this deliverable");
        }

        // Check if deliverable is submitted
        if (!deliverable.isSubmitted()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Cannot grade a deliverable that hasn't been submitted");
        }

        // Validate grade if max points is set
        if (deliverable.getMaxPoints() != null && request.grade() != null) {
            if (request.grade() < 0 || request.grade() > deliverable.getMaxPoints()) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                        "Grade must be between 0 and " + deliverable.getMaxPoints());
            }
        }

        // Save grade and feedback
        deliverable.setGrade(request.grade());
        deliverable.setFeedback(request.feedback());
        Deliverable saved = deliverableRepository.save(deliverable);
        return convertToDTO(saved);
    }

    @Override
    @Transactional
    public void deleteDeliverable(Long id) {
        String email = authenticationFacade.getAuthenticatedUsername();
        Tutor tutor = tutorRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.FORBIDDEN, "Only tutors can delete deliverables"));

        Deliverable deliverable = deliverableRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Deliverable not found"));

        // Verify tutor owns this deliverable
        if (!deliverable.getTutor().getId().equals(tutor.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You cannot delete this deliverable");
        }

        deliverableRepository.deleteById(id);
    }

    @Override
    @Transactional
    public DeliverableCommentDTO addComment(Long deliverableId, String content) {
        String email = authenticationFacade.getAuthenticatedUsername();
        User user = userRepository.findByEmail(email);

        Deliverable deliverable = deliverableRepository.findById(deliverableId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Deliverable not found"));

        // Check access permissions
        boolean hasAccess = false;

        if (tutorRepository.existsByEmail(email)) {
            // Tutor access - must be the owner of the room
            Tutor tutor = tutorRepository.findByEmail(email).get();
            hasAccess = deliverable.getTutor().getId().equals(tutor.getId());
        } else if (participantRepository.existsByEmail(email)) {
            // Participant access - must be assigned to this deliverable
            Participant participant = participantRepository.findByEmail(email);
            hasAccess = deliverable.getParticipant().getId().equals(participant.getId()) && deliverable.isVisible();
        }

        if (!hasAccess) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You don't have access to comment on this deliverable");
        }

        DeliverableComment comment = new DeliverableComment();
        comment.setContent(content);

        comment.setCreatedAt(new Date(System.currentTimeMillis()));
        comment.setUser(user);
        comment.setDeliverable(deliverable);

        DeliverableComment saved = commentRepository.save(comment);
        return convertToCommentDTO(saved);
    }

    @Override
    public List<DeliverableCommentDTO> getDeliverableComments(Long deliverableId) {
        String email = authenticationFacade.getAuthenticatedUsername();
        User user = userRepository.findByEmail(email);

        Deliverable deliverable = deliverableRepository.findById(deliverableId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Deliverable not found"));

        // Check access permissions
        boolean hasAccess = false;

        if (tutorRepository.existsByEmail(email)) {
            // Tutor access - must be the owner of the room
            Tutor tutor = tutorRepository.findByEmail(email).get();
            hasAccess = deliverable.getTutor().getId().equals(tutor.getId());
        } else if (participantRepository.existsByEmail(email)) {
            // Participant access - must be assigned to this deliverable
            Participant participant = participantRepository.findByEmail(email);
            hasAccess = deliverable.getParticipant().getId().equals(participant.getId()) && deliverable.isVisible();
        }

        if (!hasAccess) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You don't have access to comments for this deliverable");
        }

        List<DeliverableComment> comments = commentRepository.findByDeliverableIdOrderByCreatedAtDesc(deliverableId);
        return comments.stream()
                .map(this::convertToCommentDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public DeliverableDTO setDeliverableVisibility(Long id, boolean isVisible) {
        String email = authenticationFacade.getAuthenticatedUsername();
        Tutor tutor = tutorRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.FORBIDDEN, "Only tutors can modify deliverable visibility"));

        Deliverable deliverable = deliverableRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Deliverable not found"));

        // Verify tutor owns this deliverable
        if (!deliverable.getTutor().getId().equals(tutor.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You cannot modify this deliverable");
        }

        deliverable.setVisible(isVisible);
        Deliverable saved = deliverableRepository.save(deliverable);
        return convertToDTO(saved);
    }

    @Override
    public List<DeliverableDTO> getParticipantDeliverables(Long participantId) {
        String email = authenticationFacade.getAuthenticatedUsername();

        // Check if user is authorized
        boolean isAuthorized = false;

        // Self-access for participants
        if (participantRepository.existsByEmail(email)) {
            Participant participant = participantRepository.findByEmail(email);
            isAuthorized = participant.getId().equals(participantId);
        }
        // Tutor access - must be the tutor of rooms the participant is in
        else if (tutorRepository.existsByEmail(email)) {
            Tutor tutor = tutorRepository.findByEmail(email).get();
            List<Room> tutoredRooms = roomRepository.findByTutorId(tutor.getId());
            Participant participant = participantRepository.findById(participantId)
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Participant not found"));

            isAuthorized = tutoredRooms.stream()
                    .anyMatch(room -> room.getParticipants().contains(participant));
        }

        if (!isAuthorized) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You don't have access to this participant's deliverables");
        }

        List<Deliverable> deliverables;

        // If participant viewing own deliverables, only show visible ones
        if (participantRepository.existsByEmail(email)) {
            deliverables = deliverableRepository.findByParticipantIdAndIsVisibleTrue(participantId);
        } else {
            deliverables = deliverableRepository.findByParticipantId(participantId);
        }

        return deliverables.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<DeliverableDTO> getTutorDeliverables() {
        String email = authenticationFacade.getAuthenticatedUsername();
        Tutor tutor = tutorRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.FORBIDDEN, "Only tutors can access this endpoint"));

        List<Deliverable> deliverables = deliverableRepository.findByTutorId(tutor.getId());

        return deliverables.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<DeliverableDTO> getRoomDeliverablesForParticipant(Long roomId, Principal principal) {
        // Get authenticated participant
        Participant participant = participantRepository.findByEmail(principal.getName());

        // Verify room exists and participant is enrolled
        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Room not found"));

        if (!room.getParticipants().contains(participant)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Not enrolled in this room");
        }

        // Get deliverables for this participant in the room
        List<Deliverable> deliverables = deliverableRepository.findByRoomIdAndParticipantId(roomId, participant.getId());

        return deliverables.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<DeliverableDTO> getDeliverablesForCurrentParticipant(Principal principal) {
        Participant participant = participantRepository.findByEmail(principal.getName());

        List<Deliverable> deliverables = deliverableRepository.findByParticipantId(participant.getId());

        return deliverables.stream()
                .filter(Deliverable::isVisible)
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    private String saveFile(MultipartFile file, Long deliverableId) {
        try {
            String uploadPath = uploadDir + "/deliverables/" + deliverableId;
            Path path = Paths.get(uploadPath);

            if (!Files.exists(path)) {
                Files.createDirectories(path);
            }

            String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
            Path filePath = path.resolve(fileName);
            Files.copy(file.getInputStream(), filePath);

            return filePath.toString();
        } catch (IOException e) {
            throw new RuntimeException("Failed to store file", e);
        }
    }

    private DeliverableDTO convertToDTO(Deliverable deliverable) {
        DeliverableDTO dto = new DeliverableDTO();
        dto.setId(deliverable.getId());
        dto.setTitle(deliverable.getTitle());
        dto.setDescription(deliverable.getDescription());
        dto.setStartDate(deliverable.getStartDate());
        dto.setEndDate(deliverable.getEndDate());
        dto.setDeadline(deliverable.getDeadline());
        dto.setSubmissionDate(deliverable.getSubmissionDate());
        dto.setFilePath(deliverable.getFilePath());
        dto.setSubmitted(deliverable.isSubmitted());
        dto.setPastDeadline(deliverable.isPastDeadline());

        // Calculate status based on deliverable state
        String status;
        if (deliverable.isSubmitted()) {
            status = deliverable.getGrade() != null ? "GRADED" : "SUBMITTED";
        } else if (deliverable.isPastDeadline()) {
            status = "LATE";
        } else {
            status = "PENDING";
        }
        dto.setStatus(status);

        dto.setGrade(deliverable.getGrade() != null ? deliverable.getGrade() : 0.0);
        dto.setFeedback(deliverable.getFeedback());
        dto.setRoomId(deliverable.getRoom().getId());
        dto.setRoomName(deliverable.getRoom().getName());

        if (deliverable.getParticipant() != null) {
            dto.setParticipantId(deliverable.getParticipant().getId());
            dto.setParticipantName(
                    deliverable.getParticipant().getFirstName() + " " +
                            deliverable.getParticipant().getLastName()
            );
        }

        dto.setTutorId(deliverable.getTutor().getId());
        dto.setTutorName(
                deliverable.getTutor().getFirstName() + " " +
                        deliverable.getTutor().getLastName()
        );

        // Convert comments to DTOs
        List<DeliverableCommentDTO> commentDTOs = deliverable.getComments().stream()
                .map(this::convertToCommentDTO)
                .collect(Collectors.toList());
        dto.setComments(commentDTOs);

        return dto;
    }

    private DeliverableCommentDTO convertToCommentDTO(DeliverableComment comment) {
        String userName = "";
        String userRole = "";

        if (comment.getUser() instanceof Tutor) {
            Tutor tutor = (Tutor) comment.getUser();
            userName = tutor.getFirstName() + " " + tutor.getLastName();
            userRole = "TUTOR";
        } else if (comment.getUser() instanceof Participant) {
            Participant participant = (Participant) comment.getUser();
            userName = participant.getFirstName() + " " + participant.getLastName();
            userRole = "PARTICIPANT";
        }

        return new DeliverableCommentDTO(
                comment.getId(),
                comment.getContent(),
                comment.getCreatedAt().toInstant().atZone(ZoneId.systemDefault()).toLocalDateTime(),
                comment.getUser().getId(),
                userName,
                userRole
        );
    }
}