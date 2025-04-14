package ma.tutorconnect.tutorconnect.service;

import ma.tutorconnect.tutorconnect.entity.Tutor;

import java.util.List;

public interface TutorService {
    List<Tutor> getAllTutors();
    Tutor getTutorById(Long id);
    Tutor saveTutor(Tutor tutor);
    void deleteTutor(Long id);
}
