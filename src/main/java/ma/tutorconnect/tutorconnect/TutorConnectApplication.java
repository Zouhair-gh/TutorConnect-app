package ma.tutorconnect.tutorconnect;

import ma.tutorconnect.tutorconnect.entity.User;
import ma.tutorconnect.tutorconnect.enums.RoleEnum;
import ma.tutorconnect.tutorconnect.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@SpringBootApplication
public class TutorConnectApplication {

    public static void main(String[] args) {
        SpringApplication.run(TutorConnectApplication.class, args);
    }

    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

  //  @Bean
    public CommandLineRunner addInitialAdmin(UserRepository userRepository, BCryptPasswordEncoder encoder) {
        return args -> {
            String adminEmail = "admin@example.com";
            if (userRepository.findByEmail(adminEmail) == null) {
                User admin = new User();

                admin.setEmail(adminEmail);
                admin.setPassword(encoder.encode("123456789"));
                admin.setFirstName("Admin");
                admin.setLastName("Root");
                admin.setRole(RoleEnum.ADMIN);

                userRepository.save(admin);
                System.out.println("✅ Admin user created!");
            } else {
                System.out.println("ℹ️ Admin user already exists.");
            }
        };
    }
}
