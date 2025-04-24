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

  //  @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
<<<<<<< HEAD



    public CommandLineRunner addInitialAdmin(UserRepository userRepository, BCryptPasswordEncoder encoder) {
        return args -> {
            String adminEmail = "tutor@example.com";
            if (userRepository.findByEmail(adminEmail) == null) {
                User admin = new User();

                admin.setEmail(adminEmail);
                admin.setPassword(encoder.encode("123456789"));
                admin.setFirstName("Tuteur");
                admin.setLastName("TUTOR");
                admin.setRole(RoleEnum.TUTOR);

                userRepository.save(admin);
                System.out.println("✅ TUTOR user created!");
            } else {
                System.out.println("ℹ️ TUTOR user already exists.");
=======
      //@Bean
    public CommandLineRunner addInitialAdmin(UserRepository userRepository, BCryptPasswordEncoder encoder) {
        return args -> {
            String tutorEmail = "tutor@gmail.com";
            if (userRepository.findByEmail(tutorEmail) == null) {
                User Tutor = new User();

                Tutor.setEmail(tutorEmail);
                Tutor.setPassword(encoder.encode("123456789"));
                Tutor.setFirstName("Tutor");
                Tutor.setLastName("Root");
                Tutor.setRole(RoleEnum.TUTOR);

                userRepository.save(Tutor);
                System.out.println("✅ Tutor user created!");
            } else {
                System.out.println("ℹ️ Tutor user already exists.");
>>>>>>> d68b1313215433c27bda65dc545d418208562eaf
            }
        };
    }
}
