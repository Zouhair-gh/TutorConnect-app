package ma.tutorconnect.tutorconnect.config;

import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.event.EventListener;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;

@Configuration
public class FileStorageConfig {
    private final FileStorageProperties fileStorageProperties;

    public FileStorageConfig(FileStorageProperties fileStorageProperties) {
        this.fileStorageProperties = fileStorageProperties;
    }

    @EventListener(ApplicationReadyEvent.class)
    public void init() {
        try {
            Files.createDirectories(Paths.get(fileStorageProperties.getUploadDir()));
            System.out.println("Created upload directory: " + fileStorageProperties.getUploadDir());
        } catch (IOException e) {
            throw new RuntimeException("Could not create upload directory!", e);
        }
    }
}