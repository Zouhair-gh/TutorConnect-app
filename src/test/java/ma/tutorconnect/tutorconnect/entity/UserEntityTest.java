package ma.tutorconnect.tutorconnect.entity;

import ma.tutorconnect.tutorconnect.enums.RoleEnum;
import org.junit.jupiter.api.Test;

import java.sql.Date;

import static org.junit.jupiter.api.Assertions.*;

class UserEntityTest {

    @Test
    void testUserGettersAndSetters() {
        User user = new User();

        Long id = 1L;
        String firstName = "John";
        String lastName = "Doe";
        String email = "john.doe@example.com";
        String password = "securePass123";
        String cin = "AB123456";
        String phoneNumber = "+212612345678";
        Date birthDate = Date.valueOf("1990-01-01");
        String gender = "Male";
        String username = "johndoe";
        RoleEnum role = RoleEnum.TUTOR;
        boolean isAdmin = true;

        user.setId(id);
        user.setFirstName(firstName);
        user.setLastName(lastName);
        user.setEmail(email);
        user.setPassword(password);
        user.setCin(cin);
        user.setPhoneNumber(phoneNumber);
        user.setBirthDate(birthDate);
        user.setGender(gender);
        user.setUsername(username);
        user.setRole(role);
        user.setAdmin(isAdmin);

        assertEquals(id, user.getId());
        assertEquals(firstName, user.getFirstName());
        assertEquals(lastName, user.getLastName());
        assertEquals(email, user.getEmail());
        assertEquals(password, user.getPassword());
        assertEquals(cin, user.getCin());
        assertEquals(phoneNumber, user.getPhoneNumber());
        assertEquals(birthDate, user.getBirthDate());
        assertEquals(gender, user.getGender());
        assertEquals(username, user.getUsername());
        assertEquals(role, user.getRole());
        assertTrue(user.isAdmin());
    }

    @Test
    void testAllArgsConstructor() {
        Date birthDate = Date.valueOf("1995-05-15");

        User user = new User(
                2L,
                "Alice",
                "Smith",
                "alice@example.com",
                "mypassword",
                "CD654321",
                "+212612345999",
                birthDate,
                "Female",
                "alicesmith",
                RoleEnum.PARTICIPANT,
                false
        );

        assertEquals(2L, user.getId());
        assertEquals("Alice", user.getFirstName());
        assertEquals("Smith", user.getLastName());
        assertEquals("alice@example.com", user.getEmail());
        assertEquals("mypassword", user.getPassword());
        assertEquals("CD654321", user.getCin());
        assertEquals("+212612345999", user.getPhoneNumber());
        assertEquals(birthDate, user.getBirthDate());
        assertEquals("Female", user.getGender());
        assertEquals("alicesmith", user.getUsername());
        assertEquals(RoleEnum.PARTICIPANT, user.getRole());
        assertFalse(user.isAdmin());
    }

    @Test
    void testNoArgsConstructor() {
        User user = new User();
        assertNotNull(user);
    }
}
