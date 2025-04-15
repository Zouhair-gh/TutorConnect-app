package ma.tutorconnect.tutorconnect.service;

import ma.tutorconnect.tutorconnect.repository.UserRepository;
import ma.tutorconnect.tutorconnect.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import ma.tutorconnect.tutorconnect.dto.LoginRequest;
import ma.tutorconnect.tutorconnect.entity.User;

import java.util.Optional;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    public String login(LoginRequest request) throws Exception {
        if (request.getEmail() == null || request.getPassword() == null) {
            throw new Exception("Email and password are required");
        }


        User user = userRepository.findByEmail(request.getEmail());
        if (user == null) {
            throw new Exception("Invalid credentials");
        }


        if (user.getPassword() == null || !passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new Exception("Invalid credentials");
        }


        return jwtUtil.generateToken(user.getEmail());
    }
}