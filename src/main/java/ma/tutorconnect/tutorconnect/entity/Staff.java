package ma.tutorconnect.tutorconnect.entity;

import jakarta.persistence.Entity;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Staff extends User {
    private String bibliographie;
    private String specialiter;
    private int nbrAnneeExp;

}
