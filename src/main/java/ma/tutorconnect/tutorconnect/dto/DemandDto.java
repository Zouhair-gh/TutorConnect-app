package ma.tutorconnect.tutorconnect.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import ma.tutorconnect.tutorconnect.enums.DemandStatus;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class DemandDto {

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Request {
        private String fullName;
        private String email;
        private String phone;
        private String purpose;
        private String experience;
        private String message;

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

        public void setEmail(String email) {
            this.email = email;
        }

        public void setPurpose(String purpose) {
            this.purpose = purpose;
        }

        public void setPhone(String phone) {
            this.phone = phone;
        }

        public void setFullName(String fullName) {
            this.fullName = fullName;
        }

        public void setExperience(String experience) {
            this.experience = experience;
        }

        public void setMessage(String message) {
            this.message = message;
        }
    }

    @Data
    @NoArgsConstructor

    public static class Response {
        private Long id;
        private String fullName;
        private String email;
        private String phone;
        private String purpose;
        private String experience;
        private String message;
        private DemandStatus status;
        private LocalDateTime createdAt;
        private LocalDateTime processedAt;
        // Add missing fields
        private String demandType;
        private String roomName;
        private Integer roomCapacity;
        private LocalDate roomStartDate;
        private LocalDate roomEndDate;
        private Double roomAmount;
        private Long tutorId;
        private Long originalRoomId;

        // Constructor should match the fields defined above
        public Response(Long id, String fullName, String email, String phone,
                        String purpose, String experience, String message,
                        DemandStatus status, LocalDateTime createdAt,
                        LocalDateTime processedAt, String demandType,
                        String roomName, Integer roomCapacity, LocalDate roomStartDate,
                        LocalDate roomEndDate, Double roomAmount, Long tutorId,
                        Long originalRoomId) {
            this.id = id;
            this.fullName = fullName;
            this.email = email;
            this.phone = phone;
            this.purpose = purpose;
            this.experience = experience;
            this.message = message;
            this.status = status;
            this.createdAt = createdAt;
            this.processedAt = processedAt;
            this.demandType = demandType;
            this.roomName = roomName;
            this.roomCapacity = roomCapacity;
            this.roomStartDate = roomStartDate;
            this.roomEndDate = roomEndDate;
            this.roomAmount = roomAmount;
            this.tutorId = tutorId;
            this.originalRoomId = originalRoomId;
        }

        public Long getId() {
            return id;
        }

        public String getFullName() {
            return fullName;
        }

        public String getPhone() {
            return phone;
        }

        public String getEmail() {
            return email;
        }

        public String getPurpose() {
            return purpose;
        }

        public String getExperience() {
            return experience;
        }

        public String getMessage() {
            return message;
        }

        public LocalDateTime getCreatedAt() {
            return createdAt;
        }

        public DemandStatus getStatus() {
            return status;
        }

        public LocalDateTime getProcessedAt() {
            return processedAt;
        }

        public String getDemandType() {
            return demandType;
        }

        public String getRoomName() {
            return roomName;
        }

        public Integer getRoomCapacity() {
            return roomCapacity;
        }

        public LocalDate getRoomStartDate() {
            return roomStartDate;
        }

        public LocalDate getRoomEndDate() {
            return roomEndDate;
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

        public void setId(Long id) {
            this.id = id;
        }

        public void setFullName(String fullName) {
            this.fullName = fullName;
        }

        public void setEmail(String email) {
            this.email = email;
        }

        public void setPhone(String phone) {
            this.phone = phone;
        }

        public void setExperience(String experience) {
            this.experience = experience;
        }

        public void setPurpose(String purpose) {
            this.purpose = purpose;
        }

        public void setMessage(String message) {
            this.message = message;
        }

        public void setStatus(DemandStatus status) {
            this.status = status;
        }

        public void setCreatedAt(LocalDateTime createdAt) {
            this.createdAt = createdAt;
        }

        public void setProcessedAt(LocalDateTime processedAt) {
            this.processedAt = processedAt;
        }

        public void setDemandType(String demandType) {
            this.demandType = demandType;
        }

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

        public void setRoomAmount(Double roomAmount) {
            this.roomAmount = roomAmount;
        }

        public void setTutorId(Long tutorId) {
            this.tutorId = tutorId;
        }

        public void setOriginalRoomId(Long originalRoomId) {
            this.originalRoomId = originalRoomId;
        }
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class StatusUpdate {
        private DemandStatus status;

        public DemandStatus getStatus() {
            return status;
        }

        public void setStatus(DemandStatus status) {
            this.status = status;
        }
    }
}