package ma.tutorconnect.tutorconnect.controller;
import com.fasterxml.jackson.databind.ObjectMapper;
import ma.tutorconnect.tutorconnect.dto.*;
import ma.tutorconnect.tutorconnect.service.DeliverableService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.web.multipart.MultipartFile;

import java.sql.Date;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@SpringBootTest
class DeliverableControllerTest {

    @Mock
    private DeliverableService deliverableService;

    @InjectMocks
    private DeliverableController deliverableController;

    private ObjectMapper objectMapper;
    private DeliverableDTO testDeliverable;
    private List<DeliverableDTO> testDeliverableList;
    private DeliverableCommentDTO testComment;
    private List<DeliverableCommentDTO> testCommentList;
    private CreateDeliverableRequest createRequest;
    private SubmitDeliverableRequest submitRequest;
    private GradeDeliverableRequest gradeRequest;

    @BeforeEach
    void setUp() {
        objectMapper = new ObjectMapper();
        // Initialize test DeliverableDTO
        testDeliverable = new DeliverableDTO();
        testDeliverable.setId(1L);
        testDeliverable.setTitle("Test Deliverable");
        testDeliverable.setDescription("Test Description");
        testDeliverable.setStartDate(Date.valueOf("2025-01-01"));
        testDeliverable.setEndDate(Date.valueOf("2025-01-15"));
        testDeliverable.setDeadline(Date.valueOf("2025-01-10"));
        testDeliverable.setRoomId(1L);
        testDeliverable.setRoomName("Test Room");
        testDeliverable.setParticipantId(2L);
        testDeliverable.setParticipantName("Test Participant");
        testDeliverable.setTutorId(3L);
        testDeliverable.setTutorName("Test Tutor");
        testDeliverable.setGrade(0.0);
        testDeliverable.setFeedback(null);
        testDeliverable.setStatus("Created");
        testDeliverable.setSubmitted(false);
        testDeliverable.setPastDeadline(false);
        testDeliverable.setFilePath(null);
        testDeliverable.setSubmissionDate(null);
        testDeliverable.setComments(null);
        testDeliverableList = Arrays.asList(testDeliverable);

        // Initialize test DeliverableCommentDTO
        testComment = new DeliverableCommentDTO();
        testComment.setId(1L);
        testComment.setContent("Test Comment");
        testComment.setCreatedAt(LocalDateTime.now());
        testComment.setUserId(1L);
        testComment.setUserName("Test User");
        testComment.setUserRole("PARTICIPANT");
        testCommentList = Arrays.asList(testComment);

        // Initialize request objects
        createRequest = new CreateDeliverableRequest(
                "Test Deliverable",
                "Test Description",
                Date.valueOf("2025-01-10"),
                1L,
                100,
                Arrays.asList(2L),
                null,
                true
        );

        submitRequest = new SubmitDeliverableRequest(
                1L,
                "/uploads/test-file.pdf",
                "Test submission notes",
                Arrays.asList("http://example.com/attachment1")
        );

        // Initialize grade request using the record constructor
        gradeRequest = new GradeDeliverableRequest(
                1L,    // deliverableId
                85.0,  // grade
                "Good work!"  // feedback
        );
    }
    // Test methods

    @Test
    @DisplayName("Create deliverables - returns created deliverables")
    void createDeliverables_ReturnsCreatedDeliverables() {
        when(deliverableService.createDeliverables(any(CreateDeliverableRequest.class)))
                .thenReturn(testDeliverableList);

        ResponseEntity<List<DeliverableDTO>> response = deliverableController.createDeliverables(createRequest);

        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertEquals(testDeliverableList, response.getBody());
        verify(deliverableService).createDeliverables(createRequest);
    }

    @Test
    @DisplayName("Get room deliverables - returns deliverables for room")
    void getRoomDeliverables_ReturnsDeliverables() {
        Long roomId = 1L;
        when(deliverableService.getRoomDeliverables(roomId)).thenReturn(testDeliverableList);

        ResponseEntity<List<DeliverableDTO>> response = deliverableController.getRoomDeliverables(roomId);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(testDeliverableList, response.getBody());
        verify(deliverableService).getRoomDeliverables(roomId);
    }

    @Test
    @DisplayName("Get deliverable by ID - returns deliverable with comments")
    void getDeliverable_ReturnsDeliverableWithComments() {
        Long deliverableId = 1L;
        testDeliverable.setComments(testCommentList);
        when(deliverableService.getDeliverableById(deliverableId)).thenReturn(testDeliverable);

        ResponseEntity<DeliverableDTO> response = deliverableController.getDeliverable(deliverableId);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(testDeliverable, response.getBody());
        assertNotNull(response.getBody().getComments());
        assertEquals(1, response.getBody().getComments().size());
        verify(deliverableService).getDeliverableById(deliverableId);
    }

    @Test
    @DisplayName("Submit deliverable with files - returns updated deliverable")
    void submitDeliverableWithFiles_ReturnsUpdatedDeliverable() {
        List<MultipartFile> files = Arrays.asList(
                new MockMultipartFile("file1", "test.pdf", MediaType.APPLICATION_PDF_VALUE, "test".getBytes())
        );

        DeliverableDTO submittedDeliverable = new DeliverableDTO();
        submittedDeliverable.setId(testDeliverable.getId());
        submittedDeliverable.setSubmitted(true);
        submittedDeliverable.setSubmissionDate(new Date(System.currentTimeMillis()));
        submittedDeliverable.setFilePath("/uploads/test-file.pdf");
        submittedDeliverable.setStatus("Submitted");

        when(deliverableService.submitDeliverable(any(SubmitDeliverableRequest.class), anyList()))
                .thenReturn(submittedDeliverable);

        ResponseEntity<DeliverableDTO> response = deliverableController.submitDeliverable(submitRequest, files);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(submittedDeliverable, response.getBody());
        assertTrue(response.getBody().isSubmitted());
        assertNotNull(response.getBody().getSubmissionDate());
        verify(deliverableService).submitDeliverable(submitRequest, files);
    }

    @Test
    @DisplayName("Submit deliverable without files - returns updated deliverable")
    void submitDeliverableWithoutFiles_ReturnsUpdatedDeliverable() {
        SubmitDeliverableRequest requestWithAttachments = new SubmitDeliverableRequest(
                1L,
                null,
                "Online submission",
                Arrays.asList("http://example.com/doc1", "http://example.com/doc2")
        );

        DeliverableDTO submittedDeliverable = new DeliverableDTO();
        submittedDeliverable.setId(testDeliverable.getId());
        submittedDeliverable.setSubmitted(true);
        submittedDeliverable.setSubmissionDate(new Date(System.currentTimeMillis()));
        submittedDeliverable.setStatus("Submitted");

        when(deliverableService.submitDeliverable(eq(requestWithAttachments), eq(List.of())))
                .thenReturn(submittedDeliverable);

        ResponseEntity<DeliverableDTO> response = deliverableController.submitDeliverable(
                requestWithAttachments,
                List.of()
        );

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(submittedDeliverable, response.getBody());
        verify(deliverableService).submitDeliverable(requestWithAttachments, List.of());
    }

    @Test
    @DisplayName("Delete deliverable - returns no content")
    void deleteDeliverable_ReturnsNoContent() {
        Long deliverableId = 1L;
        doNothing().when(deliverableService).deleteDeliverable(deliverableId);

        ResponseEntity<Void> response = deliverableController.deleteDeliverable(deliverableId);

        assertEquals(HttpStatus.NO_CONTENT, response.getStatusCode());
        assertNull(response.getBody());
        verify(deliverableService).deleteDeliverable(deliverableId);
    }

    @Test
    @DisplayName("Grade deliverable - returns graded deliverable with feedback")
    void gradeDeliverable_ReturnsGradedDeliverable() {
        DeliverableDTO gradedDeliverable = new DeliverableDTO();
        gradedDeliverable.setId(testDeliverable.getId());
        gradedDeliverable.setGrade(85.0);
        gradedDeliverable.setFeedback("Excellent work!");
        gradedDeliverable.setStatus("Graded");

        when(deliverableService.gradeDeliverable(any(GradeDeliverableRequest.class)))
                .thenReturn(gradedDeliverable);

        ResponseEntity<DeliverableDTO> response = deliverableController.gradeDeliverable(gradeRequest);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(gradedDeliverable, response.getBody());
        assertEquals(85.0, response.getBody().getGrade());
        assertEquals("Excellent work!", response.getBody().getFeedback());
        verify(deliverableService).gradeDeliverable(gradeRequest);
    }

    @Test
    @DisplayName("Add comment - returns created comment")
    void addComment_ReturnsCreatedComment() {
        Long deliverableId = 1L;
        String content = "New comment";

        when(deliverableService.addComment(eq(deliverableId), eq(content)))
                .thenReturn(testComment);

        ResponseEntity<DeliverableCommentDTO> response = deliverableController.addComment(deliverableId, content);

        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertEquals(testComment, response.getBody());
        verify(deliverableService).addComment(deliverableId, content);
    }

    @Test
    @DisplayName("Get comments - returns comments for deliverable")
    void getComments_ReturnsComments() {
        Long deliverableId = 1L;
        when(deliverableService.getDeliverableComments(deliverableId)).thenReturn(testCommentList);

        ResponseEntity<List<DeliverableCommentDTO>> response = deliverableController.getComments(deliverableId);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(testCommentList, response.getBody());
        verify(deliverableService).getDeliverableComments(deliverableId);
    }

    @Test
    @DisplayName("Set visibility - returns updated deliverable")
    void setVisibility_ReturnsUpdatedDeliverable() {
        Long deliverableId = 1L;
        boolean visible = true;

        DeliverableDTO updatedDeliverable = new DeliverableDTO();
        updatedDeliverable.setId(testDeliverable.getId());
        // Remove the setVisible line since it doesn't exist in DTO
        // Add other fields that might be updated
        updatedDeliverable.setStatus("VISIBLE"); // or whatever status represents visibility

        // Adjust the mock to match what your service actually returns
        when(deliverableService.setDeliverableVisibility(eq(deliverableId), eq(visible)))
                .thenReturn(updatedDeliverable);

        ResponseEntity<DeliverableDTO> response = deliverableController.setVisibility(deliverableId, visible);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(updatedDeliverable, response.getBody());
        verify(deliverableService).setDeliverableVisibility(deliverableId, visible);
    }

    @Test
    @DisplayName("Get participant deliverables - returns deliverables for participant")
    void getParticipantDeliverables_ReturnsDeliverables() {
        Long participantId = 2L;
        when(deliverableService.getParticipantDeliverables(participantId)).thenReturn(testDeliverableList);

        ResponseEntity<List<DeliverableDTO>> response = deliverableController.getParticipantDeliverables(participantId);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(testDeliverableList, response.getBody());
        verify(deliverableService).getParticipantDeliverables(participantId);
    }

    @Test
    @DisplayName("Get tutor deliverables - returns deliverables for tutor")
    void getTutorDeliverables_ReturnsDeliverables() {
        when(deliverableService.getTutorDeliverables()).thenReturn(testDeliverableList);

        ResponseEntity<List<DeliverableDTO>> response = deliverableController.getTutorDeliverables();

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(testDeliverableList, response.getBody());
        verify(deliverableService).getTutorDeliverables();
    }
}