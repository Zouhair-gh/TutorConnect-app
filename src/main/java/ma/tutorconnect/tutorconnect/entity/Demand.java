package ma.tutorconnect.tutorconnect.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import ma.tutorconnect.tutorconnect.enums.DemandStatus;

import java.time.LocalDateTime;

@Entity
@Table(name = "demands")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Demand {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String fullName;
    private String email;
    private String phone;
    private String purpose;
    private String experience;
    private String message;

    @Enumerated(EnumType.STRING)
    private DemandStatus status = DemandStatus.PENDING;

    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime processedAt;

    // Add demand type for better categorization
    private String demandType; // "ROOM_CREATION", "ROOM_RENEWAL", "TUTOR_ACCOUNT"

    // Relations can be added here if needed
    // For example, if a demand is approved and a user account is created:
    // @OneToOne(mappedBy = "demand")
    // private User user;
    public String getDemandType() {
        return demandType;
    }

    public void setDemandType(String demandType) {
        this.demandType = demandType;
    }
    public Long getId() {
        return id;
    }

    public String getFullName() {
        return fullName;
    }

    public String getEmail() {
        return email;
    }

    public String getPhone() {
        return phone;
    }

    public String getExperience() {
        return experience;
    }

    public String getPurpose() {
        return purpose;
    }

    public String getMessage() {
        return message;
    }

    public DemandStatus getStatus() {
        return status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getProcessedAt() {
        return processedAt;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public void setPurpose(String purpose) {
        this.purpose = purpose;
    }

    public void setExperience(String experience) {
        this.experience = experience;
    }

    public void setProcessedAt(LocalDateTime processedAt) {
        this.processedAt = processedAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public void setStatus(DemandStatus status) {
        this.status = status;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}