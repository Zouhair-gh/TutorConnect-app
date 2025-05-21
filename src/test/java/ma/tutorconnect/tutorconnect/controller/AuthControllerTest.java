package ma.tutorconnect.tutorconnect.controller;

import ma.tutorconnect.tutorconnect.dto.LoginRequest;
import ma.tutorconnect.tutorconnect.entity.User;
import ma.tutorconnect.tutorconnect.enums.RoleEnum;
import ma.tutorconnect.tutorconnect.repository.UserRepository;
import ma.tutorconnect.tutorconnect.security.JwtUtil;
import ma.tutorconnect.tutorconnect.service.AuthService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class AuthControllerTest {

    @InjectMocks
    private AuthController authController;

    @Mock
    private AuthService authService;

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtUtil jwtUtil;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this); // Initialise les mocks
    }

    @Test
    void testLoginSuccess() throws Exception {
        LoginRequest request = new LoginRequest();
        request.setEmail("test@example.com");
        request.setPassword("password123");

        User user = new User();
        user.setEmail("test@example.com");
        user.setPassword("encodedPassword");

        when(userRepository.findByEmail("test@example.com")).thenReturn(user);
        when(passwordEncoder.matches("password123", "encodedPassword")).thenReturn(true);
        when(jwtUtil.generateToken("test@example.com")).thenReturn("jwt-token");

        String token = authController.login(request);

        assertEquals("jwt-token", token);
    }

    @Test
    void testLoginInvalidPassword() {
        LoginRequest request = new LoginRequest();
        request.setEmail("test@example.com");
        request.setPassword("wrongPass");

        User user = new User();
        user.setEmail("test@example.com");
        user.setPassword("encodedPassword");

        when(userRepository.findByEmail("test@example.com")).thenReturn(user);
        when(passwordEncoder.matches("wrongPass", "encodedPassword")).thenReturn(false);

        Exception ex = assertThrows(Exception.class, () -> authController.login(request));
        assertTrue(ex.getMessage().contains("Password doesn't match"));
    }

    @Test
    void testLoginUserNotFound() {
        LoginRequest request = new LoginRequest();
        request.setEmail("notfound@example.com");
        request.setPassword("pass");

        when(userRepository.findByEmail("notfound@example.com")).thenReturn(null);

        Exception ex = assertThrows(Exception.class, () -> authController.login(request));
        assertTrue(ex.getMessage().contains("User not found"));
    }

    @Test
    void testLogoutValidToken() {
        String tokenHeader = "Bearer abc.def.ghi";
        ResponseEntity<Map<String, String>> response = authController.logout(tokenHeader);
        assertEquals(200, response.getStatusCodeValue());
        assertEquals("Successfully logged out", response.getBody().get("message"));
    }

    @Test
    void testLogoutInvalidHeader() {
        ResponseEntity<Map<String, String>> response = authController.logout("InvalidToken");
        assertEquals(401, response.getStatusCodeValue());
    }

    @Test
    void testVerifyTokenSuccess() {
        String header = "Bearer valid.token";
        String rawToken = "valid.token";

        User user = new User();
        user.setEmail("test@example.com");
        user.setUsername("user");
        user.setRole(RoleEnum.PARTICIPANT); // ou ADMIN, TUTOR, etc.

        when(jwtUtil.validateToken(rawToken)).thenReturn(true);
        when(jwtUtil.extractEmail(rawToken)).thenReturn("test@example.com");
        when(userRepository.findByEmail("test@example.com")).thenReturn(user);

        ResponseEntity<Map<String, Object>> response = authController.verifyToken(header);

        assertEquals(200, response.getStatusCodeValue());
        assertEquals("test@example.com", response.getBody().get("email"));
        assertEquals("user", response.getBody().get("username"));
        assertEquals(RoleEnum.PARTICIPANT, response.getBody().get("role"));
    }

    @Test
    void testVerifyTokenInvalid() {
        String header = "Bearer invalid.token";

        when(jwtUtil.validateToken("invalid.token")).thenReturn(false);

        ResponseEntity<Map<String, Object>> response = authController.verifyToken(header);
        assertEquals(401, response.getStatusCodeValue());
    }
}
