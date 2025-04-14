package ma.tutorconnect.tutorconnect.service.Impl;

import ma.tutorconnect.tutorconnect.entity.User;
import ma.tutorconnect.tutorconnect.service.UserService;
import org.springframework.stereotype.Service;

import java.util.List;
@Service
public class UserServiceImpl implements UserService {
    @Override
    public List<User> getAllUsers() {
        return List.of();
    }

    @Override
    public User getUserById(Long id) {
        return null;
    }

    @Override
    public User createUser(User user) {
        return null;
    }

    @Override
    public User updateUser(Long id, User user) {
        return null;
    }

    @Override
    public void deleteUser(Long id) {

    }
}
