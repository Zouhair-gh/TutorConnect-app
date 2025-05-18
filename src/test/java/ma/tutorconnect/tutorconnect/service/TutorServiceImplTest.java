package ma.tutorconnect.tutorconnect.service;

import ma.tutorconnect.tutorconnect.dto.CreateRoomDto;
import ma.tutorconnect.tutorconnect.dto.ParticipantDTO;
import ma.tutorconnect.tutorconnect.dto.RoomRenewalRequestDto;
import ma.tutorconnect.tutorconnect.dto.RoomWithParticipantsDTO;
import ma.tutorconnect.tutorconnect.entity.Demand;
import ma.tutorconnect.tutorconnect.entity.Participant;
import ma.tutorconnect.tutorconnect.entity.Room;
import ma.tutorconnect.tutorconnect.entity.Tutor;
import ma.tutorconnect.tutorconnect.enums.DemandStatus;
import ma.tutorconnect.tutorconnect.repository.RoomRepository;
import ma.tutorconnect.tutorconnect.repository.TutorRepository;
import ma.tutorconnect.tutorconnect.repository.DemandRepository;
import ma.tutorconnect.tutorconnect.service.Impl.TutorServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class TutorServiceImplTest {

    private TutorServiceImpl tutorService;

    private RoomRepository roomRepository;
    private TutorRepository tutorRepository;
    private DemandRepository demandRepository;
    private Authentication authentication;
    private SecurityContext securityContext;

    @BeforeEach
    void setUp() {
        roomRepository = mock(RoomRepository.class);
        tutorRepository = mock(TutorRepository.class);
        demandRepository = mock(DemandRepository.class);

        // Setup for SecurityContextHolder mock
        securityContext = mock(SecurityContext.class);
        authentication = mock(Authentication.class);
        SecurityContextHolder.setContext(securityContext);
        when(securityContext.getAuthentication()).thenReturn(authentication);

        tutorService = new TutorServiceImpl(tutorRepository, roomRepository, demandRepository);
    }

    @Test
    void testGetRoomsByTutor() {
        Room room = new Room();
        room.setId(1L);
        room.setName("Room 1");
        room.setCapacity(20);
        room.setStartDate(java.sql.Date.valueOf(LocalDate.now()));
        room.setEndDate(java.sql.Date.valueOf(LocalDate.now().plusDays(1)));
        room.setAmount(100L);

        when(roomRepository.findByTutorId(1L)).thenReturn(List.of(room));

        List<CreateRoomDto> result = tutorService.getRoomsByTutor(1L);

        assertEquals(1, result.size());
        assertEquals("Room 1", result.get(0).getName());
        verify(roomRepository, times(1)).findByTutorId(1L);
    }

    @Test
    void testGetRoomsWithParticipantsByTutor() {
        // Create a tutor
        Tutor tutor = new Tutor();
        tutor.setId(1L);

        // Create participants
        Participant participant1 = new Participant();
        participant1.setId(1L);
        participant1.setFirstName("Amine");
        participant1.setLastName("Maaroufi");
        participant1.setEmail("amine@gmail.com");

        Participant participant2 = new Participant();
        participant2.setId(2L);
        participant2.setFirstName("Zouhair");
        participant2.setLastName("Ghaouri");
        participant2.setEmail("zouhair@gmail.com");

        List<Participant> participants = new ArrayList<>();
        participants.add(participant1);
        participants.add(participant2);

        // Create a room with participants
        Room room = new Room();
        room.setId(1L);
        room.setName("Room 2");
        room.setCapacity(11);
        room.setStartDate(java.sql.Date.valueOf(LocalDate.now()));
        room.setEndDate(java.sql.Date.valueOf(LocalDate.now().plusDays(1)));
        room.setAmount(75L);
        room.setTutor(tutor);
        room.setParticipants(participants);

        when(roomRepository.findByTutorId(1L)).thenReturn(List.of(room));

        // Execute the method
        List<RoomWithParticipantsDTO> result = tutorService.getRoomsWithParticipantsByTutor(1L);

        // Verify
        assertEquals(1, result.size());
        assertEquals(1L, result.get(0).getRoom().getId());
        assertEquals("Room 2", result.get(0).getRoom().getName());

        List<ParticipantDTO> participantDTOs = result.get(0).getParticipants();
        assertEquals(2, participantDTOs.size());
        assertEquals("Amine", participantDTOs.get(0).getFirstName());
        assertEquals("Zouhair", participantDTOs.get(1).getFirstName());

        verify(roomRepository, times(1)).findByTutorId(1L);
    }

    @Test
    void testRequestRoomRenewal_RoomNotFound() {
        // Create test data
        RoomRenewalRequestDto requestDto = new RoomRenewalRequestDto();
        requestDto.setRoomId(999L);
        requestDto.setPurpose("Extension");

        // Mock authentication
        Tutor tutor = new Tutor();
        tutor.setId(1L);
        tutor.setEmail("john.doe@example.com");

        when(authentication.getName()).thenReturn("john.doe@example.com");
        when(tutorRepository.findByEmail("john.doe@example.com")).thenReturn(Optional.of(tutor));
        when(roomRepository.findById(999L)).thenReturn(Optional.empty());

        // Execute the method
        ResponseEntity<?> response = tutorService.requestRoomRenewal(requestDto);

        // Verify
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals("Room not found", response.getBody());

        verify(roomRepository, times(1)).findById(999L);
        verify(demandRepository, never()).save(any(Demand.class));
    }
}