package ma.tutorconnect.tutorconnect.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Date;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Deliverable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Date startDate;
    private Date endDate;
    private String content;
    private String title;
    private Date deadline;
    private Date dateDepot;
    private String file;

    @ManyToOne
    private Participant participant;

    @ManyToOne
    private Tutor tutor;

}
