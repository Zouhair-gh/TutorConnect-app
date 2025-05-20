package ma.tutorconnect.tutorconnect.service;

import ma.tutorconnect.tutorconnect.dto.*;
import org.springframework.web.multipart.MultipartFile;

import java.security.Principal;
import java.util.List;

public interface DeliverableService {
    List<DeliverableDTO> createDeliverables(CreateDeliverableRequest request);
    List<DeliverableDTO> getRoomDeliverables(Long roomId);
    DeliverableDTO submitDeliverable(SubmitDeliverableRequest request, List<MultipartFile> files);
    DeliverableDTO getDeliverableById(Long id);
    void deleteDeliverable(Long id);
    DeliverableDTO gradeDeliverable(GradeDeliverableRequest request);
    DeliverableCommentDTO addComment(Long deliverableId, String content);
    List<DeliverableCommentDTO> getDeliverableComments(Long deliverableId);
    DeliverableDTO setDeliverableVisibility(Long id, boolean isVisible);
    List<DeliverableDTO> getParticipantDeliverables(Long participantId);
    List<DeliverableDTO> getTutorDeliverables();
    List<DeliverableDTO> getRoomDeliverablesForParticipant(Long roomId, Principal principal);
    List<DeliverableDTO> getDeliverablesForCurrentParticipant(Principal principal);
}