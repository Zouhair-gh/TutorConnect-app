package ma.tutorconnect.tutorconnect.dto;

import lombok.Data;

@Data
public class TutorDto {
    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private String specialties;

    public TutorDto(Long id, String firstName, String lastName, String email, String specialites) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.specialties = specialites;
    }


    public Long getId() {
        return id;
    }

    public String getFirstName() {
        return firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public String getEmail() {
        return email;
    }

    public String getSpecialties() {
        return specialties;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public void setSpecialties(String specialties) {
        this.specialties = specialties;
    }
}
