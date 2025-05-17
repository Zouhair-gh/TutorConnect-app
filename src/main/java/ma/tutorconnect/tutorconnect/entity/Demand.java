package ma.tutorconnect.tutorconnect.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import ma.tutorconnect.tutorconnect.enums.DemandStatus;

import java.time.LocalDate;
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

    private String demandType; // "ROOM_CREATION", "ROOM_RENEWAL", "TUTOR_ACCOUNT"

    // For room-related demands
    private String roomName;
    private Integer roomCapacity;
    private LocalDate roomStartDate;
    private LocalDate roomEndDate;
    private Double roomAmount;
    private Long tutorId;
    private Long originalRoomId;
    private Integer renewalDuration;

    public void setRoomName(String roomName) {
        this.roomName = roomName;
    }

    public void setRoomCapacity(Integer roomCapacity) {
        this.roomCapacity = roomCapacity;
    }

    public void setRoomStartDate(LocalDate roomStartDate) {
        this.roomStartDate = roomStartDate;
    }

    public void setRoomEndDate(LocalDate roomEndDate) {
        this.roomEndDate = roomEndDate;
    }

    public void setOriginalRoomId(Long originalRoomId) {
        this.originalRoomId = originalRoomId;
    }

    public void setRoomAmount(Double roomAmount) {
        this.roomAmount = roomAmount;
    }

    public void setTutorId(Long tutorId) {
        this.tutorId = tutorId;
    }

    public void setRenewalDuration(Integer renewalDuration) {
        this.renewalDuration = renewalDuration;
    }

    public String getRoomName() {
        return roomName;
    }

    public Integer getRoomCapacity() {
        return roomCapacity;
    }

    public LocalDate getRoomEndDate() {
        return roomEndDate;
    }

    public LocalDate getRoomStartDate() {
        return roomStartDate;
    }

    public Double getRoomAmount() {
        return roomAmount;
    }

    public Long getTutorId() {
        return tutorId;
    }

    public Long getOriginalRoomId() {
        return originalRoomId;
    }

    public Integer getRenewalDuration() {
        return renewalDuration;
    }

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