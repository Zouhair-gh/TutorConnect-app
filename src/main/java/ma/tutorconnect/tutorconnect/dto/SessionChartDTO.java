package ma.tutorconnect.tutorconnect.dto;

import java.util.List;

public class SessionChartDTO {
    private String period; // date or month label
    private Long count;    // number of sessions

    public SessionChartDTO(String period, Long count) {
        this.period = period;
        this.count = count;
    }

    // Getters and setters
    public String getPeriod() { return period; }
    public void setPeriod(String period) { this.period = period; }
    public Long getCount() { return count; }
    public void setCount(Long count) { this.count = count; }


}




