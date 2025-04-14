package ma.tutorconnect.tutorconnect.entity;


import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Tutor extends User{
    private String specialites;

    @OneToMany(mappedBy = "tutor")
    private List<Deliverable> deliverables;

}
