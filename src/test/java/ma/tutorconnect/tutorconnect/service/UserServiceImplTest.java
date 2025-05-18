package ma.tutorconnect.tutorconnect.service;

import ma.tutorconnect.tutorconnect.dto.CreateUserDto;
import ma.tutorconnect.tutorconnect.entity.Participant;
import ma.tutorconnect.tutorconnect.entity.Staff;
import ma.tutorconnect.tutorconnect.entity.Tutor;
import ma.tutorconnect.tutorconnect.entity.User;
import ma.tutorconnect.tutorconnect.enums.RoleEnum;
import ma.tutorconnect.tutorconnect.repository.ParticipantRepository;
import ma.tutorconnect.tutorconnect.repository.StaffRepository;
import ma.tutorconnect.tutorconnect.repository.TutorRepository;
import ma.tutorconnect.tutorconnect.repository.UserRepository;
import ma.tutorconnect.tutorconnect.service.Impl.UserServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceImplTest {

    @Mock
    private UserRepository userRepository;
    @Mock
    private ParticipantRepository participantRepository;
    @Mock
    private TutorRepository tutorRepository;
    @Mock
    private StaffRepository staffRepository;
    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private UserServiceImpl userService;

    private CreateUserDto dto;

    @BeforeEach
    void setUp() {
        dto = new CreateUserDto();
        dto.setFirstName("Jane");
        dto.setLastName("Doe");
        dto.setEmail("jane.doe@example.com");
        dto.setUsername("janedoe");
        dto.setPassword("password");
        dto.setCin("CIN123");
        dto.setPhoneNumber("0600000000");
        dto.setBirthDate(java.sql.Date.valueOf("1990-01-01"));
        dto.setGender("F");
    }

    @Test
    void testCreateParticipantSuccess() {
        dto.setRole(RoleEnum.PARTICIPANT);
        when(userRepository.findByEmail(dto.getEmail())).thenReturn(null);
        when(userRepository.findByUsername(dto.getUsername())).thenReturn(null);
        when(passwordEncoder.encode(dto.getPassword())).thenReturn("encoded");
        when(participantRepository.save(any(Participant.class)))
                .thenAnswer(inv -> inv.getArgument(0));

        User user = userService.createUser(dto);

        assertTrue(user instanceof Participant);
        assertEquals("jane.doe@example.com", user.getEmail());
        verify(participantRepository).save(any(Participant.class));
    }

    @Test
    void testCreateTutorSuccess() {
        dto.setRole(RoleEnum.TUTOR);
        when(userRepository.findByEmail(dto.getEmail())).thenReturn(null);
        when(userRepository.findByUsername(dto.getUsername())).thenReturn(null);
        when(passwordEncoder.encode(dto.getPassword())).thenReturn("encoded");
        when(tutorRepository.save(any(Tutor.class)))
                .thenAnswer(inv -> inv.getArgument(0));

        User user = userService.createUser(dto);

        assertTrue(user instanceof Tutor);
        verify(tutorRepository).save(any(Tutor.class));
    }

    @Test
    void testCreateStaffSuccess() {
        dto.setRole(RoleEnum.STAFF);
        dto.setBibliographie("Bio");
        dto.setSpecialiter("Spec");
        dto.setNbrAnneeExp(5);
        when(userRepository.findByEmail(dto.getEmail())).thenReturn(null);
        when(userRepository.findByUsername(dto.getUsername())).thenReturn(null);
        when(passwordEncoder.encode(dto.getPassword())).thenReturn("encoded");
        when(staffRepository.save(any(Staff.class)))
                .thenAnswer(inv -> inv.getArgument(0));

        User user = userService.createUser(dto);

        assertTrue(user instanceof Staff);
        verify(staffRepository).save(any(Staff.class));
    }

    @Test
    void testCreateAdminSuccess() {
        dto.setRole(RoleEnum.ADMIN);
        when(userRepository.findByEmail(dto.getEmail())).thenReturn(null);
        when(userRepository.findByUsername(dto.getUsername())).thenReturn(null);
        when(passwordEncoder.encode(dto.getPassword())).thenReturn("encoded");
        when(userRepository.save(any(User.class)))
                .thenAnswer(inv -> inv.getArgument(0));

        User user = userService.createUser(dto);

        assertTrue(user.isAdmin());
        verify(userRepository).save(any(User.class));
    }

    @Test
    void testCreateUserEmailConflict() {
        dto.setRole(RoleEnum.ADMIN);
        when(userRepository.findByEmail(dto.getEmail())).thenReturn(new User());

        RuntimeException ex = assertThrows(RuntimeException.class,
                () -> userService.createUser(dto));
        assertEquals("Email already in use", ex.getMessage());
    }

    @Test
    void testGetAllUsers() {
        userService.getAllUsers();
        verify(userRepository).findAll();
    }

    @Test
    void testGetUserById() {
        User u = new User();
        when(userRepository.findById(1L)).thenReturn(Optional.of(u));
        User found = userService.getUserById(1L);
        assertSame(u, found);
    }

    @Test
    void testUpdateUserNotFound() {
        when(userRepository.findById(1L)).thenReturn(Optional.empty());
        assertThrows(RuntimeException.class, () -> userService.updateUser(1L, new User()));
    }

    @Test
    void testDeleteUser() {
        doNothing().when(userRepository).deleteById(1L);
        userService.deleteUser(1L);
        verify(userRepository).deleteById(1L);
    }
}
