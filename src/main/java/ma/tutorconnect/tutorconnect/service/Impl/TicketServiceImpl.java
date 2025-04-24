package ma.tutorconnect.tutorconnect.service.Impl;

import ma.tutorconnect.tutorconnect.dto.CreateTicketRequest;
import ma.tutorconnect.tutorconnect.dto.TicketDTO;
import ma.tutorconnect.tutorconnect.entity.Ticket;
import ma.tutorconnect.tutorconnect.entity.User;
import ma.tutorconnect.tutorconnect.enums.RoleEnum;
import ma.tutorconnect.tutorconnect.enums.TicketStatus;
import ma.tutorconnect.tutorconnect.repository.TicketRepository;
import ma.tutorconnect.tutorconnect.repository.UserRepository;
import ma.tutorconnect.tutorconnect.service.TicketService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class TicketServiceImpl implements TicketService {

    @Autowired
    private TicketRepository ticketRepository;

    @Autowired
    private UserRepository userRepository;

    @Override
    public TicketDTO createTicket(String tutorEmail, CreateTicketRequest request) {
        User tutor = userRepository.findByEmail(tutorEmail);

        if (tutor == null || tutor.getRole() != RoleEnum.TUTOR) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Only tutors can create tickets");
        }

        Ticket ticket = new Ticket();
        ticket.setTutor(tutor);
        ticket.setSubject(request.getSubject());
        ticket.setDescription(request.getDescription());
        ticket.setStatus(TicketStatus.NEW);
        ticket.setPriority(request.getPriority());

        Ticket savedTicket = ticketRepository.save(ticket);
        return mapToDTO(savedTicket);
    }

    @Override
    public List<TicketDTO> getTicketsByTutor(String tutorEmail) {
        User tutor = userRepository.findByEmail(tutorEmail);

        if (tutor == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found");
        }

        if (tutor.getRole() == RoleEnum.TUTOR) {
            List<Ticket> tickets = ticketRepository.findByTutorOrderByCreatedAtDesc(tutor);
            return tickets.stream().map(this::mapToDTO).collect(Collectors.toList());
        } else if (tutor.getRole() == RoleEnum.STAFF || tutor.getRole() == RoleEnum.ADMIN) {
            List<Ticket> tickets = ticketRepository.findAll();
            return tickets.stream().map(this::mapToDTO).collect(Collectors.toList());
        } else {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Unauthorized access");
        }
    }

    @Override
    public TicketDTO getTicketById(Long id, String email) {
        User user = userRepository.findByEmail(email);

        if (user == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found");
        }

        Ticket ticket = ticketRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Ticket not found"));

        // Verify user is the tutor who created the ticket or is staff/admin
        if (user.getRole() == RoleEnum.TUTOR && !ticket.getTutor().getId().equals(user.getId()) &&
                user.getRole() != RoleEnum.STAFF && user.getRole() != RoleEnum.ADMIN) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You can only view your own tickets");
        }

        return mapToDTO(ticket);
    }

    @Override
    public TicketDTO updateTicketStatus(Long id, TicketStatus status, String email) {
        User user = userRepository.findByEmail(email);

        if (user == null || (user.getRole() != RoleEnum.STAFF && user.getRole() != RoleEnum.ADMIN)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Only staff can update ticket status");
        }

        Ticket ticket = ticketRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Ticket not found"));

        ticket.setStatus(status);
        Ticket updatedTicket = ticketRepository.save(ticket);
        return mapToDTO(updatedTicket);
    }

    @Override
    public void deleteTicket(Long id, String tutorEmail) {
        User user = userRepository.findByEmail(tutorEmail);

        if (user == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found");
        }

        Ticket ticket = ticketRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Ticket not found"));

        if (user.getRole() == RoleEnum.TUTOR && !ticket.getTutor().getId().equals(user.getId()) &&
                user.getRole() != RoleEnum.ADMIN && user.getRole() != RoleEnum.STAFF) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You can only delete your own tickets");
        }

        ticketRepository.delete(ticket);
    }

    private TicketDTO mapToDTO(Ticket ticket) {
        TicketDTO ticketDTO = new TicketDTO();
        ticketDTO.setId(ticket.getId());
        ticketDTO.setTutorEmail(ticket.getTutor().getEmail());
        ticketDTO.setTutorName(ticket.getTutor().getFirstName() + " " + ticket.getTutor().getLastName());
        ticketDTO.setSubject(ticket.getSubject());
        ticketDTO.setDescription(ticket.getDescription());
        ticketDTO.setStatus(ticket.getStatus());
        ticketDTO.setPriority(ticket.getPriority());
        ticketDTO.setCreatedAt(ticket.getCreatedAt());
        ticketDTO.setUpdatedAt(ticket.getUpdatedAt());
        return ticketDTO;
    }
}