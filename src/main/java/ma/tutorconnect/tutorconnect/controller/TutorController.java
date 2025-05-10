package ma.tutorconnect.tutorconnect.controller;


import ma.tutorconnect.tutorconnect.dto.RoomRenewalRequestDto;
import ma.tutorconnect.tutorconnect.dto.RoomWithParticipantsDTO;
import ma.tutorconnect.tutorconnect.dto.TutorDashboardDto;
import ma.tutorconnect.tutorconnect.entity.Tutor;
import ma.tutorconnect.tutorconnect.service.TutorService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tutors")
public class TutorController {
    private final TutorService tutorService;

    public TutorController(TutorService tutorService) {
        this.tutorService = tutorService;
    }

    @GetMapping
    public List<Tutor> getAllTutors() {
        return tutorService.getAllTutors();
    }

    @GetMapping("/{id}")
    public Tutor getTutor(@PathVariable Long id) {
        return tutorService.getTutorById(id);
    }

    @PostMapping
    public Tutor createTutor(@RequestBody Tutor tutor) {
        return tutorService.saveTutor(tutor);
    }

    @DeleteMapping("/{id}")
    public void deleteTutor(@PathVariable Long id) {
        tutorService.deleteTutor(id);
    }

   // Get the dashboard data for the tutor
   // added by maaroufi
   @GetMapping("/{id}/dashboard")
   public TutorDashboardDto getTutorDashboard(@PathVariable Long id) {
       Tutor tutor = tutorService.getTutorById(id);
       List<RoomWithParticipantsDTO> roomsWithParticipants = tutorService.getRoomsWithParticipantsByTutor(id);

       TutorDashboardDto dashboardDto = new TutorDashboardDto(
               tutor.getId(),
               tutor.getFirstName(),
               tutor.getLastName(),
               tutor.getEmail(),
               tutor.getSpecialites(),
               roomsWithParticipants
       );

       return dashboardDto;
   }
    @PreAuthorize("hasRole('TUTOR')")
    @PostMapping("/rooms/request")
    public ResponseEntity<?> requestRoomRenewal(@RequestBody RoomRenewalRequestDto renewalRequest) {
        return tutorService.requestRoomRenewal(renewalRequest);
    }

}

