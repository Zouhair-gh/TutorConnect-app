package ma.tutorconnect.tutorconnect.service.Impl;

import ma.tutorconnect.tutorconnect.dto.CreateUserDto;
import ma.tutorconnect.tutorconnect.entity.*;
import ma.tutorconnect.tutorconnect.enums.RoleEnum;
import ma.tutorconnect.tutorconnect.repository.*;
import ma.tutorconnect.tutorconnect.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ParticipantRepository participantRepository;

    @Autowired
    private TutorRepository tutorRepository;

    @Autowired
    private StaffRepository staffRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public User createUser(CreateUserDto createUserDto) {
        if (userRepository.findByEmail(createUserDto.getEmail()) != null) {
            throw new RuntimeException("Email already in use");
        }

        if (createUserDto.getUsername() != null && !createUserDto.getUsername().isEmpty() &&
                userRepository.findByUsername(createUserDto.getUsername()) != null) {
            throw new RuntimeException("Username already in use");
        }

        User user;

        switch (createUserDto.getRole()) {
            case PARTICIPANT:
                user = createParticipant(createUserDto);
                break;
            case TUTOR:
                user = createTutor(createUserDto);
                break;
            case STAFF:
                user = createStaff(createUserDto);
                break;
            case ADMIN:
                user = createAdmin(createUserDto);
                break;
            default:
                throw new RuntimeException("Invalid role specified");
        }

        return user;
    }

    private Participant createParticipant(CreateUserDto dto) {
        Participant participant = new Participant();
        setCommonUserFields(participant, dto);
        return participantRepository.save(participant);
    }

    private Tutor createTutor(CreateUserDto dto) {
        Tutor tutor = new Tutor();
        setCommonUserFields(tutor, dto);
        tutor.setSpecialites(dto.getSpecialites());
        return tutorRepository.save(tutor);
    }

    private Staff createStaff(CreateUserDto dto) {
        Staff staff = new Staff();
        setCommonUserFields(staff, dto);
        staff.setBibliographie(dto.getBibliographie());
        staff.setSpecialiter(dto.getSpecialiter());
        staff.setNbrAnneeExp(dto.getNbrAnneeExp() != null ? dto.getNbrAnneeExp() : 0);
        return staffRepository.save(staff);
    }

    private User createAdmin(CreateUserDto dto) {
        User admin = new User();
        setCommonUserFields(admin, dto);
        admin.setAdmin(true);
        return userRepository.save(admin);
    }

    private void setCommonUserFields(User user, CreateUserDto dto) {

        user.setFirstName(dto.getFirstName());
        user.setLastName(dto.getLastName());
        user.setEmail(dto.getEmail());
        user.setPassword(passwordEncoder.encode(dto.getPassword()));
        user.setCin(dto.getCin());
        user.setPhoneNumber(dto.getPhoneNumber());
        user.setBirthDate(dto.getBirthDate());
        user.setGender(dto.getGender());
        user.setUsername(dto.getUsername());
        user.setRole(dto.getRole());
        user.setAdmin(dto.getRole() == RoleEnum.ADMIN);
    }

    @Override
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @Override
    public User getUserById(Long id) {
        return userRepository.findById(id).orElse(null);
    }

    @Override
    public User updateUser(Long id, User updatedUser) {
        return userRepository.findById(id).map(user -> {
            user.setFirstName(updatedUser.getFirstName());
            user.setLastName(updatedUser.getLastName());
            user.setEmail(updatedUser.getEmail());
            user.setPassword(passwordEncoder.encode(updatedUser.getPassword()));
            user.setCin(updatedUser.getCin());
            user.setPhoneNumber(updatedUser.getPhoneNumber());
            user.setBirthDate(updatedUser.getBirthDate());
            user.setGender(updatedUser.getGender());
            user.setUsername(updatedUser.getUsername());
            user.setRole(updatedUser.getRole());
            return userRepository.save(user);
        }).orElseThrow(() -> new RuntimeException("User not found with id: " + id));
    }


    @Override
    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }
}
