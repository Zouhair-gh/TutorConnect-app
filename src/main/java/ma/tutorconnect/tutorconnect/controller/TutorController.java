package ma.tutorconnect.tutorconnect.controller;


import ma.tutorconnect.tutorconnect.entity.Tutor;
import ma.tutorconnect.tutorconnect.service.TutorService;
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
    @GetMapping("/dashboard/{id}")
    public Tutor getTutorDashboard(@PathVariable Long id) {
        Tutor tutor = tutorService.getTutorById(id);
        return tutor;
    }
}

