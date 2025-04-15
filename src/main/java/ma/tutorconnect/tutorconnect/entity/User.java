package ma.tutorconnect.tutorconnect.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import ma.tutorconnect.tutorconnect.enums.RoleEnum;

import java.sql.Date;


@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Inheritance(strategy = InheritanceType.JOINED)
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String firstName;
    private String lastName;
    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;
    private String cin;
    private String phoneNumber;

    @Temporal(TemporalType.DATE)
    private Date birthDate;

    private String gender;
    @Column(nullable = true, unique = true)
    private String username;

    @Enumerated(EnumType.STRING)
    private RoleEnum role;

    private boolean isAdmin;

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public void setCin(String cin) {
        this.cin = cin;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public void setBirthDate(Date birthDate) {
        this.birthDate = birthDate;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public void setRole(RoleEnum role) {
        this.role = role;
    }

    public void setAdmin(boolean admin) {
        isAdmin = admin;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getUsername() {
        return username;
    }

    public RoleEnum getRole() {
        return role;
    }

    public boolean isAdmin() {
        return isAdmin;
    }
}
