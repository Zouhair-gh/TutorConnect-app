package ma.tutorconnect.tutorconnect.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class Payment {
    @Id
    @GeneratedValue
    private Long id;

    private String paid;

    @ManyToOne
    private Participant participant;
}