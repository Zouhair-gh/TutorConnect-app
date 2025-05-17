package ma.tutorconnect.tutorconnect.dto;

public class RoomResponseDto {
    private Long id;
    private String name;
    private Integer capacity;
    private Double amount;
    private String startDate;
    private String endDate;

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public Integer getCapacity() {
        return capacity;
    }

    public String getEndDate() {
        return endDate;
    }

    public Double getAmount() {
        return amount;
    }

    public String getStartDate() {
        return startDate;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setCapacity(Integer capacity) {
        this.capacity = capacity;
    }

    public void setAmount(Double amount) {
        this.amount = amount;
    }

    public void setStartDate(String startDate) {
        this.startDate = startDate;
    }

    public void setEndDate(String endDate) {
        this.endDate = endDate;
    }
}
