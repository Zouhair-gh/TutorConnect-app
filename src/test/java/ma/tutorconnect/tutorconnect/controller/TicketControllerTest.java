package ma.tutorconnect.tutorconnect.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import ma.tutorconnect.tutorconnect.dto.CreateTicketRequest;
import ma.tutorconnect.tutorconnect.dto.TicketDTO;
import ma.tutorconnect.tutorconnect.enums.TicketPriority;
import ma.tutorconnect.tutorconnect.enums.TicketStatus;
import ma.tutorconnect.tutorconnect.service.TicketService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.time.LocalDateTime;
import java.util.List;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith(MockitoExtension.class)
public class TicketControllerTest {

    private MockMvc mockMvc;

    @Mock
    private TicketService ticketService;

    @InjectMocks
    private TicketController ticketController;

    private ObjectMapper objectMapper = new ObjectMapper();

    private TicketDTO sampleTicket;

    @BeforeEach
    void setup() {
        mockMvc = MockMvcBuilders.standaloneSetup(ticketController).build();

        sampleTicket = new TicketDTO();
        sampleTicket.setId(1L);
        sampleTicket.setTutorEmail("tutor@example.com");
        sampleTicket.setTutorName("John Tutor");
        sampleTicket.setSubject("Test subject");
        sampleTicket.setDescription("Test description");
        sampleTicket.setStatus(TicketStatus.NEW);
        sampleTicket.setPriority(TicketPriority.HIGH);
        sampleTicket.setCreatedAt(LocalDateTime.now());
        sampleTicket.setUpdatedAt(LocalDateTime.now());

        // Setup security context with authenticated user
        Authentication authentication = new UsernamePasswordAuthenticationToken("tutor@example.com", "password");
        SecurityContext securityContext = SecurityContextHolder.createEmptyContext();
        securityContext.setAuthentication(authentication);
        SecurityContextHolder.setContext(securityContext);
    }

    @Test
    void testCreateTicket() throws Exception {
        CreateTicketRequest request = new CreateTicketRequest();
        request.setSubject("Test subject");
        request.setDescription("Test description");

        when(ticketService.createTicket(eq("tutor@example.com"), any(CreateTicketRequest.class))).thenReturn(sampleTicket);

        mockMvc.perform(post("/api/tickets")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(sampleTicket.getId()))
                .andExpect(jsonPath("$.tutorEmail").value(sampleTicket.getTutorEmail()))
                .andExpect(jsonPath("$.subject").value(sampleTicket.getSubject()))
                .andExpect(jsonPath("$.status").value(sampleTicket.getStatus().toString()));

        verify(ticketService).createTicket(eq("tutor@example.com"), any(CreateTicketRequest.class));
    }

    @Test
    void testGetTickets() throws Exception {
        when(ticketService.getTicketsByTutor("tutor@example.com")).thenReturn(List.of(sampleTicket));

        mockMvc.perform(get("/api/tickets"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(sampleTicket.getId()))
                .andExpect(jsonPath("$[0].tutorEmail").value(sampleTicket.getTutorEmail()));

        verify(ticketService).getTicketsByTutor("tutor@example.com");
    }

    @Test
    void testGetTicketById() throws Exception {
        when(ticketService.getTicketById(1L, "tutor@example.com")).thenReturn(sampleTicket);

        mockMvc.perform(get("/api/tickets/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(sampleTicket.getId()))
                .andExpect(jsonPath("$.tutorEmail").value(sampleTicket.getTutorEmail()));

        verify(ticketService).getTicketById(1L, "tutor@example.com");
    }

    @Test
    void testUpdateTicketStatus() throws Exception {
        TicketDTO updatedTicket = new TicketDTO();
        updatedTicket.setId(1L);
        updatedTicket.setStatus(TicketStatus.CLOSED);

        when(ticketService.updateTicketStatus(1L, TicketStatus.CLOSED, "tutor@example.com")).thenReturn(updatedTicket);

        mockMvc.perform(put("/api/tickets/1/status")
                        .param("status", "CLOSED"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("CLOSED"));

        verify(ticketService).updateTicketStatus(1L, TicketStatus.CLOSED, "tutor@example.com");
    }

    @Test
    void testDeleteTicket() throws Exception {
        mockMvc.perform(delete("/api/tickets/1"))
                .andExpect(status().isNoContent());

        verify(ticketService).deleteTicket(1L, "tutor@example.com");
    }
}