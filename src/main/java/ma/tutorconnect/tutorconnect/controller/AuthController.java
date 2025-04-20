package ma.tutorconnect.tutorconnect.controller;

import ma.tutorconnect.tutorconnect.dto.LoginRequest;
import ma.tutorconnect.tutorconnect.entity.User;
import ma.tutorconnect.tutorconnect.repository.UserRepository;
import ma.tutorconnect.tutorconnect.security.JwtUtil;
import ma.tutorconnect.tutorconnect.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
@RestController
@RequestMapping("/api")
public class AuthController {

    @Autowired
    private AuthService authService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/login")
    public String login(@RequestBody LoginRequest request) throws Exception {
        try {
            System.out.println("Login attempt for: " + request.getEmail());

            // Find the user
            User user = userRepository.findByEmail(request.getEmail());
            System.out.println("User found: " + (user != null));

            if (user == null) {
                throw new Exception("User not found with email: " + request.getEmail());
            }

            // Check password
            boolean matches = passwordEncoder.matches(request.getPassword(), user.getPassword());
            System.out.println("Password matches: " + matches);

            if (!matches) {
                throw new Exception("Password doesn't match for user: " + request.getEmail());
            }

            // Generate token
            String token = jwtUtil.generateToken(user.getEmail());
            System.out.println("Token generated: " + (token != null && !token.isEmpty()));

            return token;
        } catch (Exception e) {
            System.err.println("Authentication error: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<Map<String, String>> logout(@RequestHeader("Authorization") String authHeader) {
        try {
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return ResponseEntity.status(401).build();
            }

            String token = authHeader.substring(7);


            // Since JWT tokens are stateless, we typically handle logout client-side
            // But for extra security, we could implement a token blacklist

            Map<String, String> response = new HashMap<>();
            response.put("message", "Successfully logged out");

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "Logout failed");
            return ResponseEntity.status(500).body(errorResponse);
        }
    }

    @GetMapping("/verifyToken")
    public ResponseEntity<Map<String, Object>> verifyToken(@RequestHeader("Authorization") String authHeader) {
        try {
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return ResponseEntity.status(401).build();
            }

            String token = authHeader.substring(7);
            if (!jwtUtil.validateToken(token)) {
                return ResponseEntity.status(401).build();
            }

            String email = jwtUtil.extractEmail(token);
            User user = userRepository.findByEmail(email);

            if (user == null) {
                return ResponseEntity.status(401).build();
            }

            Map<String, Object> response = new HashMap<>();
            response.put("email", user.getEmail());
            response.put("username", user.getUsername());
            response.put("role", user.getRole());

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }
}