package ma.tutorconnect.tutorconnect.service;

import ma.tutorconnect.tutorconnect.dto.CreateRoomDto;
import ma.tutorconnect.tutorconnect.dto.NotificationDto;
import ma.tutorconnect.tutorconnect.dto.RoomRenewalRequestDto;
import ma.tutorconnect.tutorconnect.entity.Room;
import ma.tutorconnect.tutorconnect.entity.Tutor;
import ma.tutorconnect.tutorconnect.repository.DemandRepository;
import ma.tutorconnect.tutorconnect.repository.RoomRepository;
import ma.tutorconnect.tutorconnect.repository.TutorRepository;
import ma.tutorconnect.tutorconnect.service.Impl.RoomServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;

import java.sql.Date;
import java.time.LocalDate;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class RoomServiceImplTest {

    @Mock
    private RoomRepository roomRepository;
    @Mock
    private TutorRepository tutorRepository;
    @Mock
    private DemandRepository demandRepository;
    @Mock
    private NotificationService notificationService;

    @InjectMocks
    private RoomServiceImpl roomService;

    private Tutor tutor;
    private Room room;

    @BeforeEach
    void setUp() {
        tutor = new Tutor();
        tutor.setId(1L);
        tutor.setFirstName("John");
        tutor.setLastName("Doe");
        tutor.setEmail("john.doe@example.com");

        room = new Room();
        room.setId(10L);
        room.setName("Math Class");
        room.setCapacity(30);
        room.setStartDate(Date.valueOf(LocalDate.now()));
        room.setEndDate(Date.valueOf(LocalDate.now().plusDays(1)));
        room.setAmount(200L);
        room.setTutor(tutor);
    }

    @Test
    void testCreateRoom() {
        CreateRoomDto dto = new CreateRoomDto();
        dto.setTutorId(1L);
        dto.setName("Science");
        dto.setCapacity(25);
        dto.setStartDate(Date.valueOf(LocalDate.of(2025, 6, 1)));
        dto.setEndDate(Date.valueOf(LocalDate.of(2025, 6, 2)));
        dto.setAmount(150L);

        when(tutorRepository.findById(1L)).thenReturn(Optional.of(tutor));
        when(roomRepository.save(any(Room.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Room created = roomService.createRoom(dto);

        assertNotNull(created);
        assertEquals("Science", created.getName());
        assertEquals(25, created.getCapacity());
        assertEquals(dto.getStartDate(), created.getStartDate());
        assertEquals(dto.getEndDate(), created.getEndDate());
        assertEquals(150L, created.getAmount());
        assertEquals(tutor, created.getTutor());

        verify(tutorRepository).findById(1L);
        verify(roomRepository).save(created);
    }

    @Test
    void testRenewRoom() {
        RoomRenewalRequestDto renewalDto = new RoomRenewalRequestDto();
        renewalDto.setRoomId(10L);
        // setNewEndDate expects a String
        renewalDto.setNewEndDate("2025-07-01");
        renewalDto.setCapacity(35);
        renewalDto.setAmount(180.0);

        when(roomRepository.findById(10L)).thenReturn(Optional.of(room));

        roomService.renewRoom(renewalDto);

        ArgumentCaptor<Room> roomCaptor = ArgumentCaptor.forClass(Room.class);
        verify(roomRepository).save(roomCaptor.capture());
        Room saved = roomCaptor.getValue();
        assertEquals(Date.valueOf(LocalDate.of(2025, 7, 1)), saved.getEndDate());
        assertEquals(35, saved.getCapacity());
        assertEquals(180L, saved.getAmount());

        // Verify notification sent
        verify(notificationService).sendNotification(eq(1L), any(NotificationDto.class));
    }
}
