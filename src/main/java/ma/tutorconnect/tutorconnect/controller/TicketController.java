package ma.tutorconnect.tutorconnect.controller;

import ma.tutorconnect.tutorconnect.dto.CreateTicketRequest;
import ma.tutorconnect.tutorconnect.dto.TicketDTO;
import ma.tutorconnect.tutorconnect.enums.TicketStatus;
import ma.tutorconnect.tutorconnect.service.TicketService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/tickets")
public class TicketController {

    @Autowired
    private TicketService ticketService;

    @PostMapping
    public ResponseEntity<TicketDTO> createTicket(
            @AuthenticationPrincipal String tutorEmail,
            @Valid @RequestBody CreateTicketRequest request) {
        TicketDTO ticket = ticketService.createTicket(tutorEmail, request);
        return new ResponseEntity<>(ticket, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<TicketDTO>> getTickets(@AuthenticationPrincipal String email) {
        List<TicketDTO> tickets = ticketService.getTicketsByTutor(email);
        return ResponseEntity.ok(tickets);
    }

    @GetMapping("/{id}")
    public ResponseEntity<TicketDTO> getTicketById(
            @PathVariable Long id,
            @AuthenticationPrincipal String email) {
        TicketDTO ticket = ticketService.getTicketById(id, email);
        return ResponseEntity.ok(ticket);
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<TicketDTO> updateTicketStatus(
            @PathVariable Long id,
            @RequestParam TicketStatus status,
            @AuthenticationPrincipal String email) {
        TicketDTO ticket = ticketService.updateTicketStatus(id, status, email);
        return ResponseEntity.ok(ticket);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTicket(
            @PathVariable Long id,
            @AuthenticationPrincipal String email) {
        ticketService.deleteTicket(id, email);
        return ResponseEntity.noContent().build();
    }
}