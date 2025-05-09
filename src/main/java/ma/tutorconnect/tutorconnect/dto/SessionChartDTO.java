package ma.tutorconnect.tutorconnect.dto;

import java.util.List;

public class SessionChartDTO {
    private String period;
    private long count;

    public SessionChartDTO(String period, long count) {
        this.period = period;
        this.count = count;
    }

    public String getPeriod() {
        return period;
    }

    public void setPeriod(String period) {
        this.period = period;
    }

    public long getCount() {
        return count;
    }

    public void setCount(long count) {
        this.count = count;
    }
}




