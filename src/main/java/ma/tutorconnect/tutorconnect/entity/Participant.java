package ma.tutorconnect.tutorconnect.entity;


import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;

@Entity

public class Participant extends User{
   // @OneToMany(mappedBy = "participant")
    //private List<Deliverable> deliverables;

   // @OneToMany(mappedBy = "participant")
   // private List<Payment> payments;
}
