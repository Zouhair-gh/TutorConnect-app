package ma.tutorconnect.tutorconnect.service.Impl;

import ma.tutorconnect.tutorconnect.entity.Tutor;
import ma.tutorconnect.tutorconnect.repository.TutorRepository;
import ma.tutorconnect.tutorconnect.service.TutorService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TutorServiceImpl implements TutorService {

    private final TutorRepository tutorRepository;

    public TutorServiceImpl(TutorRepository tutorRepository)
    {
        this.tutorRepository = tutorRepository;
    }

    @Override
    public List<Tutor> getAllTutors() {
        return List.of();
    }

    @Override
    public Tutor getTutorById(Long id) {
        return null;
    }

    @Override
    public Tutor saveTutor(Tutor tutor) {
        return null;
    }

    @Override
    public void deleteTutor(Long id) {

    }
}
