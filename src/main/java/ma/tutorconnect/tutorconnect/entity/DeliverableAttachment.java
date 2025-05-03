package ma.tutorconnect.tutorconnect.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class DeliverableAttachment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String fileName;

    private String fileType;

    private String fileUrl;



    @ManyToOne
    @JoinColumn(name = "deliverable_id")
    private Deliverable deliverable;

    public Long getId() {
        return id;
    }

    public String getFileName() {
        return fileName;
    }

    public String getFileType() {
        return fileType;
    }

    public String getFileUrl() {
        return fileUrl;
    }

    public Deliverable getDeliverable() {
        return deliverable;
    }
    public void setId(Long id) {
        this.id = id;
    }
    public void setFileName(String fileName) {
        this.fileName = fileName;
    }
    public void setFileType(String fileType) {
        this.fileType = fileType;
    }
    public void setFileUrl(String fileUrl) {
        this.fileUrl = fileUrl;
    }
    public void setDeliverable(Deliverable deliverable) {
        this.deliverable = deliverable;
    }


}
