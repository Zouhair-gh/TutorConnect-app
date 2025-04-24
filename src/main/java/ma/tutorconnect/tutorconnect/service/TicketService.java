package ma.tutorconnect.tutorconnect.service;

import ma.tutorconnect.tutorconnect.dto.CreateTicketRequest;
import ma.tutorconnect.tutorconnect.dto.TicketDTO;
import ma.tutorconnect.tutorconnect.enums.TicketStatus;

import java.util.List;

public interface TicketService {
    TicketDTO createTicket(String tutorEmail, CreateTicketRequest request);
    List<TicketDTO> getTicketsByTutor(String tutorEmail);
    TicketDTO getTicketById(Long id, String tutorEmail);
    TicketDTO updateTicketStatus(Long id, TicketStatus status, String staffEmail);
    void deleteTicket(Long id, String tutorEmail);
}