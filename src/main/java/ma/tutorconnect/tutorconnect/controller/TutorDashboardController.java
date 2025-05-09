package ma.tutorconnect.tutorconnect.controller;

import ma.tutorconnect.tutorconnect.dto.TutorDashboardStatsDTO;
import ma.tutorconnect.tutorconnect.service.TutorDashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/tutor/dashboard")
public class TutorDashboardController {

    private final TutorDashboardService dashboardService;

    @Autowired
    public TutorDashboardController(TutorDashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping("/stats/{tutorId}")
    public ResponseEntity<TutorDashboardStatsDTO> getDashboardStats(@PathVariable Long tutorId) {
        TutorDashboardStatsDTO stats = dashboardService.getDashboardStats(tutorId);
        return ResponseEntity.ok(stats);
    }
}
