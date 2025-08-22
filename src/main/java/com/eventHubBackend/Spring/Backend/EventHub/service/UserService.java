package com.eventHubBackend.Spring.Backend.EventHub.service;

import com.eventHubBackend.Spring.Backend.EventHub.model.User;
import com.eventHubBackend.Spring.Backend.EventHub.repository.UserRepo;
import com.eventHubBackend.Spring.Backend.EventHub.reqresdto.EventResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;

@Service
public class UserService {

    @Autowired
    private UserRepo repo;

    @Autowired
    private EventService eventService;

    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(12);

    public User saveUser(User user) {
        user.setPassword(encoder.encode(user.getPassword()));
        return repo.save(user);
    }

    public List<User> getUsers() {
        return repo.findAll();
    }

    @Transactional
    public void addEvent(String username, Long eventId) {
        User user = repo.findByUsername(username);
        if (!user.getLikedEventId().contains(eventId)) {
            user.getLikedEventId().add(eventId);
            repo.save(user);
        }
    }

    @Transactional
    public void removeEvent(String username, Long eventId) {
        User user = repo.findByUsername(username);
        if (user.getLikedEventId().contains(eventId)) {
            user.getLikedEventId().remove(eventId);
            repo.save(user);
        }
    }

    public List<EventResponse> getLikedEvents(String username) {
        User user = repo.findByUsername(username);
        Set<Long> eventIds = user.getLikedEventId();
        return eventService.getEventsByIds(eventIds);
    }

    @Transactional
    public void addProfileUrl(String username, String url) {
        User user = repo.findByUsername(username);
        user.setProfilePicUrl(url);
        repo.save(user);
    }

    public String getUserImage(String username) {
        User user = repo.findByUsername(username);
        return user.getProfilePicUrl();
    }
}
