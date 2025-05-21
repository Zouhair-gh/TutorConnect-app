package ma.tutorconnect.tutorconnect.controller;

import ma.tutorconnect.tutorconnect.dto.CreateRoomDto;
import ma.tutorconnect.tutorconnect.dto.DemandRoomDto;
import ma.tutorconnect.tutorconnect.dto.RoomWithParticipantsDTO;
import ma.tutorconnect.tutorconnect.dto.UpdateRoomDto;
import ma.tutorconnect.tutorconnect.entity.Room;
import ma.tutorconnect.tutorconnect.service.RoomService;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import org.springframework.http.ResponseEntity;


import java.sql.Date;
import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class RoomControllerTest {

    @Mock
    private RoomService roomService;

    @InjectMocks
    private RoomController roomController;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    // ✅ Test de création de salle réussie
    @Test
    public void testCreateRoom_Success() {
        CreateRoomDto dto = new CreateRoomDto();
        dto.setTutorId(1L);

        Room room = new Room();
        room.setId(10L);

        when(roomService.saveRoom(dto)).thenReturn(room);

        ResponseEntity<?> response = roomController.createRoom(dto);

        assertEquals(201, response.getStatusCodeValue());
        assertTrue(((Map<?, ?>) response.getBody()).get("status").equals("success"));
    }


    @Test
    public void testCreateRoom_TutorIdMissing() {
        CreateRoomDto dto = new CreateRoomDto(); // tutorId is null

        ResponseEntity<?> response = roomController.createRoom(dto);

        assertEquals(400, response.getStatusCodeValue());
        assertEquals("Tutor ID is required", response.getBody());
    }


    @Test
    public void testCreateRoom_ServiceReturnsNull() {
        CreateRoomDto dto = new CreateRoomDto();
        dto.setTutorId(1L);

        when(roomService.saveRoom(dto)).thenReturn(null);

        ResponseEntity<?> response = roomController.createRoom(dto);

        assertEquals(500, response.getStatusCodeValue());
        assertTrue(response.getBody().toString().contains("Failed to create room"));
    }



    // ✅ Test getAllRooms
    @Test
    public void testGetAllRooms() {
        List<Room> rooms = List.of(new Room(), new Room());
        when(roomService.getAllRooms()).thenReturn(rooms);

        List<Room> result = roomController.getAllRooms();

        assertEquals(2, result.size());
    }

    // ✅ Test getMyRooms
    @Test
    public void testGetMyRooms() {
        List<Room> rooms = List.of(new Room());
        when(roomService.getRoomsByCurrentTutor()).thenReturn(rooms);

        List<Room> result = roomController.getMyRooms();

        assertEquals(1, result.size());
    }



    // ✅ Test getRoomById
    @Test
    public void testGetRoomById() {
        RoomWithParticipantsDTO roomDTO = new RoomWithParticipantsDTO();
        when(roomService.getRoomWithParticipants(3L)).thenReturn(roomDTO);

        ResponseEntity<RoomWithParticipantsDTO> response = roomController.getRoomById(3L);

        assertEquals(200, response.getStatusCodeValue());
        assertEquals(roomDTO, response.getBody());
    }

    // ✅ Test updateRoom
    @Test
    public void testUpdateRoom() {
        UpdateRoomDto dto = new UpdateRoomDto();
        dto.setName("Java Room");
        dto.setCapacity(25);
        dto.setAmount(1500.0);
        dto.setStartDate("2025-06-01");
        dto.setEndDate("2025-08-01");

        Room updatedRoom = new Room();
        updatedRoom.setId(1L);
        updatedRoom.setName("Java Room");

        when(roomService.updateRoom(eq(1L), any(Room.class))).thenReturn(updatedRoom);

        ResponseEntity<Room> response = roomController.updateRoom(1L, dto);

        assertEquals(200, response.getStatusCodeValue());
        assertEquals("Java Room", response.getBody().getName());
    }
}
