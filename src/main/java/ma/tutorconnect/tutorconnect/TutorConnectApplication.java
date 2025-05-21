package ma.tutorconnect.tutorconnect;

import jakarta.annotation.PostConstruct;
import ma.tutorconnect.tutorconnect.config.FileStorageProperties;
import ma.tutorconnect.tutorconnect.entity.User;
import ma.tutorconnect.tutorconnect.enums.RoleEnum;
import ma.tutorconnect.tutorconnect.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;

@SpringBootApplication
@EnableConfigurationProperties({
        FileStorageProperties.class
})
public class TutorConnectApplication {

    public static void main(String[] args) {
        SpringApplication.run(TutorConnectApplication.class, args);
    }

    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    //@Bean
    public CommandLineRunner addInitialAdmin(UserRepository userRepository, BCryptPasswordEncoder encoder) {
        return args -> {
            String tutorEmail = "zouhairghaouri@gmail.com";
            if (userRepository.findByEmail(tutorEmail) == null) {
                User Tutor = new User();

                Tutor.setEmail(tutorEmail);
                Tutor.setPassword(encoder.encode("123456789"));
                Tutor.setFirstName("Admin");
                Tutor.setLastName("Root");
                Tutor.setRole(RoleEnum.ADMIN);

                userRepository.save(Tutor);
                System.out.println("✅ Tutor user created!");
            } else {
                System.out.println("ℹ️ Tutor user already exists.");
            }
        };
    }

}

