package ma.tutorconnect.tutorconnect.entity;


import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Entity

public class Participant extends User{
    @OneToMany(mappedBy = "participant")
    private List<Deliverable> deliverables;

    @Setter
    @Getter
    @OneToMany(mappedBy = "participant")
    private List<Payment> payments;


}
