package ma.tutorconnect.tutorconnect.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import ma.tutorconnect.tutorconnect.enums.RoleEnum;

import java.sql.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateUserDto {
    private String firstName;
    private String lastName;
    private String email;
    private String password;
    private String cin;
    private String phoneNumber;
    private Date birthDate;
    private String gender;
    private String username;
    private RoleEnum role;

    // Fields specific to Tutor
    private String specialites;

    // Fields specific to Staff
    private String bibliographie;
    private String specialiter;
    private Integer nbrAnneeExp;

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setPassword(String password) {
        this.password = password;
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

    public void setSpecialites(String specialites) {
        this.specialites = specialites;
    }

    public void setBibliographie(String bibliographie) {
        this.bibliographie = bibliographie;
    }

    public void setSpecialiter(String specialiter) {
        this.specialiter = specialiter;
    }

    public void setNbrAnneeExp(Integer nbrAnneeExp) {
        this.nbrAnneeExp = nbrAnneeExp;
    }

    public String getFirstName() {
        return firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public String getPassword() {
        return password;
    }

    public String getEmail() {
        return email;
    }

    public String getCin() {
        return cin;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public Date getBirthDate() {
        return birthDate;
    }

    public String getGender() {
        return gender;
    }

    public String getUsername() {
        return username;
    }

    public RoleEnum getRole() {
        return role;
    }

    public String getSpecialites() {
        return specialites;
    }

    public String getBibliographie() {
        return bibliographie;
    }

    public String getSpecialiter() {
        return specialiter;
    }

    public Integer getNbrAnneeExp() {
        return nbrAnneeExp;
    }
}