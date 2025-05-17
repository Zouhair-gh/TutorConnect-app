package ma.tutorconnect.tutorconnect.dto;

public class UpdateRoomDto {
    private String name;
    private Integer capacity;
    private Double amount;
    private String startDate;
    private String endDate;

    public String getName() {
        return name;
    }

    public Integer getCapacity() {
        return capacity;
    }

    public String getStartDate() {
        return startDate;
    }

    public Double getAmount() {
        return amount;
    }

    public String getEndDate() {
        return endDate;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setAmount(Double amount) {
        this.amount = amount;
    }

    public void setCapacity(Integer capacity) {
        this.capacity = capacity;
    }

    public void setStartDate(String startDate) {
        this.startDate = startDate;
    }

    public void setEndDate(String endDate) {
        this.endDate = endDate;
    }
}
