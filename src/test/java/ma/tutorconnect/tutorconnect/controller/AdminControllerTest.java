package ma.tutorconnect.tutorconnect.controller;

import ma.tutorconnect.tutorconnect.dto.CreateUserDto;
import ma.tutorconnect.tutorconnect.entity.*;
import ma.tutorconnect.tutorconnect.service.AdminService;
import ma.tutorconnect.tutorconnect.service.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.ResponseEntity;

import java.util.Arrays;
import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class AdminControllerTest {

    @Mock
    private UserService userService;

    @Mock
    private AdminService adminService;

    @InjectMocks
    private AdminController adminController;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    public void testCreateUser_Success() {
        CreateUserDto dto = new CreateUserDto();
        User user = new User(); // populate if needed
        when(userService.createUser(dto)).thenReturn(user);

        ResponseEntity<?> response = adminController.createUser(dto);

        assertEquals(201, response.getStatusCodeValue());
        assertEquals(user, response.getBody());
    }

    @Test
    public void testCreateUser_Exception() {
        CreateUserDto dto = new CreateUserDto();
        when(userService.createUser(dto)).thenThrow(new RuntimeException("User creation failed"));

        ResponseEntity<?> response = adminController.createUser(dto);

        assertEquals(400, response.getStatusCodeValue());
        assertTrue(((Map<?, ?>) response.getBody()).get("error").toString().contains("User creation failed"));
    }

    @Test
    public void testGetAllTutors() {
        List<Tutor> tutors = Arrays.asList(new Tutor(), new Tutor());
        when(adminService.getAllTutors()).thenReturn(tutors);

        ResponseEntity<List<Tutor>> response = adminController.getAllTutors();

        assertEquals(200, response.getStatusCodeValue());
        assertEquals(tutors, response.getBody());
    }

    @Test
    public void testGetAllParticipants() {
        List<Participant> participants = Arrays.asList(new Participant(), new Participant());
        when(adminService.getAllParticipants()).thenReturn(participants);

        ResponseEntity<List<Participant>> response = adminController.getAllParticipants();

        assertEquals(200, response.getStatusCodeValue());
        assertEquals(participants, response.getBody());
    }

    @Test
    public void testGetAllRooms() {
        List<Room> rooms = Arrays.asList(new Room(), new Room());
        when(adminService.getAllRooms()).thenReturn(rooms);

        ResponseEntity<List<Room>> response = adminController.getAllRooms();

        assertEquals(200, response.getStatusCodeValue());
        assertEquals(rooms, response.getBody());
    }
}
