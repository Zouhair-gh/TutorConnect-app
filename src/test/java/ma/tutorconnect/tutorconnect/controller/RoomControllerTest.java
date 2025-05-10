package ma.tutorconnect.tutorconnect.controller;

import ma.tutorconnect.tutorconnect.dto.*;
import ma.tutorconnect.tutorconnect.entity.Room;
import ma.tutorconnect.tutorconnect.entity.Tutor;
import ma.tutorconnect.tutorconnect.service.RoomService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.sql.Date;
import java.time.LocalDate;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@SpringBootTest
class RoomControllerTest {

    private static final Long TEST_ROOM_ID = 1L;
    private static final Long TEST_TUTOR_ID = 1L;
    private static final String TEST_ROOM_NAME = "Test Room";
    private static final int TEST_CAPACITY = 10;
    private static final Long TEST_AMOUNT = 1000L;

    @Mock
    private RoomService roomService;

    @InjectMocks
    private RoomController roomController;

    private CreateRoomDto createRoomDto;
    private Room room;
    private RoomWithParticipantsDTO roomWithParticipantsDTO;
    private DemandRoomDto demandRoomDto;
    private List<Room> rooms;

    @BeforeEach
    void setUp() {
        // Test data initialization
        createRoomDto = new CreateRoomDto();
        createRoomDto.setId(TEST_ROOM_ID);
        createRoomDto.setName(TEST_ROOM_NAME);
        createRoomDto.setCapacity(TEST_CAPACITY);
        createRoomDto.setStartDate(Date.valueOf(LocalDate.now()));
        createRoomDto.setEndDate(Date.valueOf(LocalDate.now().plusDays(30)));
        createRoomDto.setAmount(TEST_AMOUNT);
        createRoomDto.setTutorId(TEST_TUTOR_ID);

        room = new Room();
        room.setId(TEST_ROOM_ID);
        room.setName(TEST_ROOM_NAME);
        room.setCapacity(TEST_CAPACITY);
        room.setStartDate(Date.valueOf(LocalDate.now()));
        room.setEndDate(Date.valueOf(LocalDate.now().plusDays(30)));
        room.setAmount(TEST_AMOUNT);

        Tutor tutor = new Tutor();
        tutor.setId(TEST_TUTOR_ID);
        tutor.setEmail("tutor@example.com");
        room.setTutor(tutor);
        room.setParticipants(Collections.emptyList());

        ParticipantDTO participantDTO = new ParticipantDTO(1L, "John", "Doe", "john.doe@example.com");
        roomWithParticipantsDTO = new RoomWithParticipantsDTO(createRoomDto, Collections.singletonList(participantDTO));

        demandRoomDto = new DemandRoomDto();
        demandRoomDto.setName(TEST_ROOM_NAME);
        demandRoomDto.setCapacity(TEST_CAPACITY);
        demandRoomDto.setStartDate(Date.valueOf(LocalDate.now()));
        demandRoomDto.setEndDate(Date.valueOf(LocalDate.now().plusDays(30)));
        demandRoomDto.setAmount(TEST_AMOUNT);
        demandRoomDto.setTutorId(TEST_TUTOR_ID);

        rooms = Arrays.asList(room);
    }

    @Test
    @DisplayName("Create room - Success")
    void createRoom_ShouldReturnCreatedRoom() {
        when(roomService.saveRoom(any(CreateRoomDto.class))).thenReturn(room);

        ResponseEntity<Room> response = roomController.createRoom(createRoomDto);

        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(TEST_ROOM_ID, response.getBody().getId());
        assertEquals(TEST_ROOM_NAME, response.getBody().getName());
        verify(roomService).saveRoom(createRoomDto);
    }

    @Test
    @DisplayName("Create room - Invalid data")
    void createRoom_WithInvalidData_ShouldThrowException() {
        CreateRoomDto invalidDto = new CreateRoomDto();
        when(roomService.saveRoom(any(CreateRoomDto.class)))
                .thenThrow(new IllegalArgumentException("Invalid data"));

        assertThrows(IllegalArgumentException.class,
                () -> roomController.createRoom(invalidDto));

        verify(roomService).saveRoom(invalidDto);
    }

    @Test
    @DisplayName("Get all rooms - Success")
    void getAllRooms_ShouldReturnListOfRooms() {
        when(roomService.getAllRooms()).thenReturn(rooms);

        List<Room> result = roomController.getAllRooms();

        assertNotNull(result);
        assertFalse(result.isEmpty());
        assertEquals(1, result.size());
        assertEquals(TEST_ROOM_ID, result.get(0).getId());
        verify(roomService).getAllRooms();
    }

    @Test
    @DisplayName("Get my rooms - Success")
    void getMyRooms_ShouldReturnListOfRoomsForCurrentTutor() {
        when(roomService.getRoomsByCurrentTutor()).thenReturn(rooms);

        List<Room> result = roomController.getMyRooms();

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(TEST_ROOM_ID, result.get(0).getId());
        verify(roomService).getRoomsByCurrentTutor();
    }

    @Test
    @DisplayName("Get room by ID - Success")
    void getRoomById_ShouldReturnRoomWithParticipants() {
        when(roomService.getRoomWithParticipants(TEST_ROOM_ID)).thenReturn(roomWithParticipantsDTO);

        ResponseEntity<RoomWithParticipantsDTO> response = roomController.getRoomById(TEST_ROOM_ID);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(TEST_ROOM_ID, response.getBody().getRoom().getId());
        assertEquals(1, response.getBody().getParticipants().size());
        verify(roomService).getRoomWithParticipants(TEST_ROOM_ID);
    }

    @Test
    @DisplayName("Get room by ID - Not found")
    void getRoomById_WhenNotFound_ShouldThrowException() {
        when(roomService.getRoomWithParticipants(99L))
                .thenThrow(new RuntimeException("Room not found"));

        assertThrows(RuntimeException.class,
                () -> roomController.getRoomById(99L));

        verify(roomService).getRoomWithParticipants(99L);
    }
}