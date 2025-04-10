package ma.tutorconnect.tutorconnect.security;


import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

@Component
public class JwtUtils {
    public String generateToken(Authentication authentication) {
        // il faut impl la logique pour générer un token JWT
        return "dummy-jwt-token";
    }
}