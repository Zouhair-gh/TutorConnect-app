package ma.tutorconnect.tutorconnect.dto;

import java.util.List;

public class TutorDashboardDto {
    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private String specialites;
    private List<RoomWithParticipantsDTO> rooms;

    // Default constructor
    public TutorDashboardDto() {
    }

    // Constructor with all parameters
    public TutorDashboardDto(Long id, String firstName, String lastName, String email, String specialites, List<RoomWithParticipantsDTO> rooms) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.specialites = specialites;
        this.rooms = rooms;
    }

    // Getters and setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getSpecialites() {
        return specialites;
    }

    public void setSpecialites(String specialites) {
        this.specialites = specialites;
    }

    public List<RoomWithParticipantsDTO> getRooms() {
        return rooms;
    }

    public void setRooms(List<RoomWithParticipantsDTO> rooms) {
        this.rooms = rooms;
    }
}