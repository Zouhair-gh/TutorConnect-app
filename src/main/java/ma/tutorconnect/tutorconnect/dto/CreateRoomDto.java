package ma.tutorconnect.tutorconnect.dto;

import java.sql.Date;

public class CreateRoomDto {
    private Long id;
    private String name;
    private int capacity;
    private Date startDate;
    private Date endDate;
    private Long amount;
    private Long tutorId;

    // Default constructor
    public CreateRoomDto() {
    }

    // Constructor without tutorId (for backward compatibility)
    public CreateRoomDto(Long id, String name, int capacity, Date startDate, Date endDate, Long amount) {
        this(id, name, capacity, startDate, endDate, amount, null);
    }

    // Full constructor with all parameters
    public CreateRoomDto(Long id, String name, int capacity, Date startDate, Date endDate, Long amount, Long tutorId) {
        this.id = id;
        this.name = name;
        this.capacity = capacity;
        this.startDate = startDate;
        this.endDate = endDate;
        this.amount = amount;
        this.tutorId = tutorId;
    }

    // Getters and setters...
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public int getCapacity() { return capacity; }
    public void setCapacity(int capacity) { this.capacity = capacity; }
    public Date getStartDate() { return startDate; }
    public void setStartDate(Date startDate) { this.startDate = startDate; }
    public Date getEndDate() { return endDate; }
    public void setEndDate(Date endDate) { this.endDate = endDate; }
    public Long getAmount() { return amount; }
    public void setAmount(Long amount) { this.amount = amount; }
    public Long getTutorId() { return tutorId; }
    public void setTutorId(Long tutorId) { this.tutorId = tutorId; }
}