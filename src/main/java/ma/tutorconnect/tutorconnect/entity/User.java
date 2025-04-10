package ma.tutorconnect.tutorconnect.entity;

import jakarta.persistence.*;
import ma.tutorconnect.tutorconnect.enums.RoleEnum;
import org.hibernate.boot.model.source.spi.InheritanceType;

@Entity
//@Inheritance(strategy = InheritanceType.JOINED)

public class User {
    @Id
    @GeneratedValue
    private Long id;

    private String firstName;
    private String lastName;
    private String email;
    private String username;
    private String password;

    @Enumerated(EnumType.STRING)
    private RoleEnum role;



}
