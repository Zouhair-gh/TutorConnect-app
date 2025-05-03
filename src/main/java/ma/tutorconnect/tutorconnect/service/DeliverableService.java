package ma.tutorconnect.tutorconnect.service;

import ma.tutorconnect.tutorconnect.dto.CreateDeliverableRequest;
import ma.tutorconnect.tutorconnect.dto.DeliverableDTO;
import ma.tutorconnect.tutorconnect.dto.SubmitDeliverableRequest;

import java.util.List;

public interface DeliverableService {
    /**
     * Creates a new deliverable assignment
     * @param request The creation request containing deliverable details
     * @return The created deliverable
     */
    DeliverableDTO createDeliverable(CreateDeliverableRequest request);

    /**
     * Retrieves a deliverable by its ID
     * @param id The deliverable ID
     * @return The deliverable details
     */
    DeliverableDTO getDeliverableById(Long id);

    /**
     * Gets all deliverables for a specific room
     * @param roomId The room ID
     * @return List of deliverables in the room
     */
    List<DeliverableDTO> getRoomDeliverables(Long roomId);

    /**
     * Submits a deliverable with the specified file
     * @param request The submission request
     * @return The updated deliverable
     */
    DeliverableDTO submitDeliverable(SubmitDeliverableRequest request);

    /**
     * Deletes a deliverable
     * @param id The deliverable ID to delete
     */
    void deleteDeliverable(Long id);
}