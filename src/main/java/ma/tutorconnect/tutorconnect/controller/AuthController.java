package ma.tutorconnect.tutorconnect.controller;

import ma.tutorconnect.tutorconnect.dto.LoginRequest;
import ma.tutorconnect.tutorconnect.entity.User;
import ma.tutorconnect.tutorconnect.repository.UserRepository;
import ma.tutorconnect.tutorconnect.security.JwtUtil;
import ma.tutorconnect.tutorconnect.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

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
}
