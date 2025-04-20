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

    public String getBibliographie() {
        return bibliographie;
    }

    public String getSpecialiter() {
        return specialiter;
    }

    public int getNbrAnneeExp() {
        return nbrAnneeExp;
    }

    public void setBibliographie(String bibliographie) {
        this.bibliographie = bibliographie;
    }

    public void setSpecialiter(String specialiter) {
        this.specialiter = specialiter;
    }

    public void setNbrAnneeExp(int nbrAnneeExp) {
        this.nbrAnneeExp = nbrAnneeExp;
    }
}
