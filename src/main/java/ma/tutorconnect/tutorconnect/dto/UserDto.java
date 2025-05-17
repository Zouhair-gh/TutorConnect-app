package ma.tutorconnect.tutorconnect.dto;

import java.time.LocalDate;

public class UserDto {
    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private String username;
    private String role;
    private String phoneNumber;
    private LocalDate birthDate;
    private String gender;
    private String cin;

    // Constructors
    public UserDto() {}

    public UserDto(Long id, String firstName, String lastName, String email,
                   String username, String role, String phoneNumber,
                   LocalDate birthDate, String gender, String cin) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.username = username;
        this.role = role;
        this.phoneNumber = phoneNumber;
        this.birthDate = birthDate;
        this.gender = gender;
        this.cin = cin;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public void setBirthDate(LocalDate birthDate) {
        this.birthDate = birthDate;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public void setCin(String cin) {
        this.cin = cin;
    }

    public Long getId() {
        return id;
    }

    public String getFirstName() {
        return firstName;
    }

    public String getEmail() {
        return email;
    }

    public String getLastName() {
        return lastName;
    }

    public String getUsername() {
        return username;
    }

    public String getRole() {
        return role;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public LocalDate getBirthDate() {
        return birthDate;
    }

    public String getGender() {
        return gender;
    }

    public String getCin() {
        return cin;
    }
// Getters and Setters
    // ...
}