package ma.tutorconnect.tutorconnect.dto;

import ma.tutorconnect.tutorconnect.enums.DemandStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

public class DemandDto {

    @Data
    @NoArgsConstructor
    public static class Request {
        private String fullName;
        private String email;
        private String phone;
        private String purpose;
        private String experience;
        private String message;

        public Request(String fullName, String email, String phone, String purpose, String experience, String message) {
            this.fullName = fullName;
            this.email = email;
            this.phone = phone;
            this.purpose = purpose;
            this.experience = experience;
            this.message = message;
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

        public String getPurpose() {
            return purpose;
        }

        public String getExperience() {
            return experience;
        }

        public String getMessage() {
            return message;
        }

        public void setFullName(String fullName) {
            this.fullName = fullName;
        }

        public void setPhone(String phone) {
            this.phone = phone;
        }

        public void setEmail(String email) {
            this.email = email;
        }

        public void setPurpose(String purpose) {
            this.purpose = purpose;
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

        public Response(Long id, String fullName, String email, String phone, String purpose, String experience,
                        String message, DemandStatus status, LocalDateTime createdAt, LocalDateTime processedAt) {
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

        public String getPurpose() {
            return purpose;
        }

        public String getExperience() {
            return experience;
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

        public void setPurpose(String purpose) {
            this.purpose = purpose;
        }

        public void setExperience(String experience) {
            this.experience = experience;
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
