package ma.tutorconnect.tutorconnect.controller;


import ma.tutorconnect.tutorconnect.dto.ParticipantDashboardDTO;
import ma.tutorconnect.tutorconnect.service.ParticipantDashboardService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/participants")
public class ParticipantDashboardController {

    private final ParticipantDashboardService dashboardService;

    public ParticipantDashboardController(ParticipantDashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

   /* @GetMapping("/{participantId}/dashboard-summary")
    public ResponseEntity<ParticipantDashboardDTO> getDashboardSummary(@PathVariable Long participantId) {
        ParticipantDashboardDTO summary = dashboardService.getDashboardSummary(participantId);
        return ResponseEntity.ok(summary);
    } */
}
