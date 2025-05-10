package ma.tutorconnect.tutorconnect.controller;

import ma.tutorconnect.tutorconnect.dto.LoginRequest;
import ma.tutorconnect.tutorconnect.entity.User;
import ma.tutorconnect.tutorconnect.enums.RoleEnum;
import ma.tutorconnect.tutorconnect.repository.UserRepository;
import ma.tutorconnect.tutorconnect.security.JwtUtil;
import ma.tutorconnect.tutorconnect.service.AuthService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.sql.Date;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@SpringBootTest
class AuthControllerTest {

    @Mock
    private AuthService authService;

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtUtil jwtUtil;

    @InjectMocks
    private AuthController authController;

    private User testUser;
    private String validToken;
    private LoginRequest validLoginRequest;

    @BeforeEach
    void setUp() {
        testUser = new User();
        testUser.setId(20L);
        testUser.setEmail("test@example.com");
        testUser.setUsername("testuser");
        testUser.setPassword("hashedPassword");
        testUser.setFirstName("Test");
        testUser.setLastName("User");
        testUser.setCin("AB123456");
        testUser.setPhoneNumber("0612345678");
        testUser.setBirthDate(Date.valueOf("1990-01-01"));
        testUser.setGender("Male");
        testUser.setRole(RoleEnum.PARTICIPANT);
        testUser.setAdmin(false);

        // Setup valid token
        validToken = "valid.jwt.token";

        // Setup valid login request
        validLoginRequest = new LoginRequest();
        validLoginRequest.setEmail("test@example.com");
        validLoginRequest.setPassword("password123");
    }

    @Test
    @DisplayName("Login with valid credentials should return a JWT token")
    void login_WithValidCredentials_ReturnsToken() throws Exception {
        // Arrange
        when(userRepository.findByEmail(anyString())).thenReturn(testUser);
        when(passwordEncoder.matches(anyString(), anyString())).thenReturn(true);
        when(jwtUtil.generateToken(anyString())).thenReturn(validToken);

        // Act
        String result = authController.login(validLoginRequest);

        // Assert
        assertNotNull(result);
        assertEquals(validToken, result);
        verify(userRepository, times(1)).findByEmail("test@example.com");
        verify(passwordEncoder, times(1)).matches("password123", "hashedPassword");
        verify(jwtUtil, times(1)).generateToken("test@example.com");
    }

    @Test
    @DisplayName("Login with invalid email should throw exception")
    void login_WithInvalidEmail_ThrowsException() {
        // Arrange
        when(userRepository.findByEmail(anyString())).thenReturn(null);

        // Act & Assert
        Exception exception = assertThrows(Exception.class, () -> {
            authController.login(validLoginRequest);
        });

        assertTrue(exception.getMessage().contains("User not found with email"));
        verify(userRepository, times(1)).findByEmail("test@example.com");
        verify(passwordEncoder, never()).matches(anyString(), anyString());
        verify(jwtUtil, never()).generateToken(anyString());
    }

    @Test
    @DisplayName("Login with invalid password should throw exception")
    void login_WithInvalidPassword_ThrowsException() {
        // Arrange
        when(userRepository.findByEmail(anyString())).thenReturn(testUser);
        when(passwordEncoder.matches(anyString(), anyString())).thenReturn(false);

        // Act & Assert
        Exception exception = assertThrows(Exception.class, () -> {
            authController.login(validLoginRequest);
        });

        assertTrue(exception.getMessage().contains("Password doesn't match"));
        verify(userRepository, times(1)).findByEmail("test@example.com");
        verify(passwordEncoder, times(1)).matches("password123", "hashedPassword");
        verify(jwtUtil, never()).generateToken(anyString());
    }

    @Test
    @DisplayName("Logout with valid token should return success message")
    void logout_WithValidToken_ReturnsSuccessMessage() {
        // Arrange
        String authHeader = "Bearer " + validToken;

        // Act
        ResponseEntity<Map<String, String>> response = authController.logout(authHeader);

        // Assert
        assertTrue(response.getStatusCode().is2xxSuccessful());
        assertEquals("Successfully logged out", response.getBody().get("message"));
    }

    @Test
    @DisplayName("Logout with invalid auth header should return unauthorized")
    void logout_WithInvalidAuthHeader_ReturnsUnauthorized() {
        // Act with null header
        ResponseEntity<Map<String, String>> nullResponse = authController.logout(null);
        // Assert
        assertTrue(nullResponse.getStatusCode().is4xxClientError());
        assertNull(nullResponse.getBody());

        // Act with invalid header format
        ResponseEntity<Map<String, String>> invalidResponse = authController.logout("InvalidHeader");
        // Assert
        assertTrue(invalidResponse.getStatusCode().is4xxClientError());
        assertNull(invalidResponse.getBody());
    }

    @Test
    @DisplayName("Verify token with valid token should return user info")
    void verifyToken_WithValidToken_ReturnsUserInfo() {
        // Arrange
        String authHeader = "Bearer " + validToken;
        when(jwtUtil.validateToken(anyString())).thenReturn(true);
        when(jwtUtil.extractEmail(anyString())).thenReturn("test@example.com");
        when(userRepository.findByEmail(anyString())).thenReturn(testUser);

        // Act
        ResponseEntity<Map<String, Object>> response = authController.verifyToken(authHeader);

        // Assert
        assertTrue(response.getStatusCode().is2xxSuccessful());
        assertEquals("test@example.com", response.getBody().get("email"));
        assertEquals("testuser", response.getBody().get("username"));
        assertEquals(testUser.getRole(), response.getBody().get("role"));

        verify(jwtUtil, times(1)).validateToken(validToken);
        verify(jwtUtil, times(1)).extractEmail(validToken);
        verify(userRepository, times(1)).findByEmail("test@example.com");
    }

    @Test
    @DisplayName("Verify token with invalid token should return unauthorized")
    void verifyToken_WithInvalidToken_ReturnsUnauthorized() {
        // Arrange
        String authHeader = "Bearer " + validToken;
        when(jwtUtil.validateToken(anyString())).thenReturn(false);

        // Act
        ResponseEntity<Map<String, Object>> response = authController.verifyToken(authHeader);

        // Assert
        assertTrue(response.getStatusCode().is4xxClientError());
        assertNull(response.getBody());

        verify(jwtUtil, times(1)).validateToken(validToken);
        verify(jwtUtil, never()).extractEmail(anyString());
        verify(userRepository, never()).findByEmail(anyString());
    }

    @Test
    @DisplayName("Verify token for non-existent user should return unauthorized")
    void verifyToken_WithNonexistentUser_ReturnsUnauthorized() {
        // Arrange
        String authHeader = "Bearer " + validToken;
        when(jwtUtil.validateToken(anyString())).thenReturn(true);
        when(jwtUtil.extractEmail(anyString())).thenReturn("test@example.com");
        when(userRepository.findByEmail(anyString())).thenReturn(null);

        // Act
        ResponseEntity<Map<String, Object>> response = authController.verifyToken(authHeader);

        // Assert
        assertTrue(response.getStatusCode().is4xxClientError());
        assertNull(response.getBody());

        verify(jwtUtil, times(1)).validateToken(validToken);
        verify(jwtUtil, times(1)).extractEmail(validToken);
        verify(userRepository, times(1)).findByEmail("test@example.com");
    }

    @Test
    @DisplayName("Verify token with invalid auth header should return unauthorized")
    void verifyToken_WithInvalidAuthHeader_ReturnsUnauthorized() {
        // Act with null header
        ResponseEntity<Map<String, Object>> nullResponse = authController.verifyToken(null);
        // Assert
        assertTrue(nullResponse.getStatusCode().is4xxClientError());
        assertNull(nullResponse.getBody());

        // Act with invalid header format
        ResponseEntity<Map<String, Object>> invalidResponse = authController.verifyToken("InvalidHeader");
        // Assert
        assertTrue(invalidResponse.getStatusCode().is4xxClientError());
        assertNull(invalidResponse.getBody());
    }

    @Test
    @DisplayName("Verify token should handle exceptions")
    void verifyToken_WithExceptionThrown_ReturnsServerError() {
        // Arrange
        String authHeader = "Bearer " + validToken;
        when(jwtUtil.validateToken(anyString())).thenThrow(new RuntimeException("Token validation error"));

        // Act
        ResponseEntity<Map<String, Object>> response = authController.verifyToken(authHeader);

        // Assert
        assertTrue(response.getStatusCode().is5xxServerError());
        assertNull(response.getBody());

        verify(jwtUtil, times(1)).validateToken(validToken);
    }
}