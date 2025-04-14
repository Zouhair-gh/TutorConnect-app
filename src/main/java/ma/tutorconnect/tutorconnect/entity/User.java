package ma.tutorconnect.tutorconnect.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import ma.tutorconnect.tutorconnect.enums.RoleEnum;
import org.hibernate.boot.model.source.spi.InheritanceType;

import java.sql.Date;


@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor

public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String firstName;
    private String lastName;
    private String email;
    private String cin;
    private String phoneNumber;

    @Temporal(TemporalType.DATE)
    private Date birthDate;

    private String gender;
    private String username;
    private String password;

    @Enumerated(EnumType.STRING)
    private RoleEnum role;

    private boolean isAdmin;
}
