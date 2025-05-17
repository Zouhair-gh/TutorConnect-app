package ma.tutorconnect.tutorconnect.dto;

import java.time.LocalDate;

public class RoomDTO {
    private Long id;
    private String name;
    private int capacity;
    private double amount;
    private LocalDate startDate;
    private LocalDate endDate;

    // Constructors
    public RoomDTO() {}

    public RoomDTO(Long id, String name, int capacity, double amount,
                   LocalDate startDate, LocalDate endDate) {
        this.id = id;
        this.name = name;
        this.capacity = capacity;
        this.amount = amount;
        this.startDate = startDate;
        this.endDate = endDate;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public int getCapacity() { return capacity; }
    public void setCapacity(int capacity) { this.capacity = capacity; }
    public double getAmount() { return amount; }
    public void setAmount(double amount) { this.amount = amount; }
    public LocalDate getStartDate() { return startDate; }
    public void setStartDate(LocalDate startDate) { this.startDate = startDate; }
    public LocalDate getEndDate() { return endDate; }
    public void setEndDate(LocalDate endDate) { this.endDate = endDate; }
}