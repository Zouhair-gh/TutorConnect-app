package ma.tutorconnect.tutorconnect.dto;

public class RoomRenewalRequestDto {
    private Long roomId;
    private String demandType;
    private String purpose;
    private String message;
    private String newEndDate;
    private Double amount;
    private Integer capacity;

    // Getters and setters
    public Long getRoomId() { return roomId; }
    public void setRoomId(Long roomId) { this.roomId = roomId; }
    public String getDemandType() { return demandType; }
    public void setDemandType(String demandType) { this.demandType = demandType; }
    public String getPurpose() { return purpose; }
    public void setPurpose(String purpose) { this.purpose = purpose; }
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
    public String getNewEndDate() { return newEndDate; }
    public void setNewEndDate(String newEndDate) { this.newEndDate = newEndDate; }
    public Double getAmount() { return amount; }
    public void setAmount(Double amount) { this.amount = amount; }
    public Integer getCapacity() { return capacity; }
    public void setCapacity(Integer capacity) { this.capacity = capacity; }
}
