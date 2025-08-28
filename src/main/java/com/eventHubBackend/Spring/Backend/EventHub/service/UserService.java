package com.eventHubBackend.Spring.Backend.EventHub.service;

import com.eventHubBackend.Spring.Backend.EventHub.BeanUtils.UpdateUtil;
import com.eventHubBackend.Spring.Backend.EventHub.jwt.JwtService;
import com.eventHubBackend.Spring.Backend.EventHub.model.User;
import com.eventHubBackend.Spring.Backend.EventHub.principles.UserPrinciple;
import com.eventHubBackend.Spring.Backend.EventHub.repository.UserRepo;
import com.eventHubBackend.Spring.Backend.EventHub.reqresdto.EventResponse;
import com.eventHubBackend.Spring.Backend.EventHub.reqresdto.UserRequest;
import com.eventHubBackend.Spring.Backend.EventHub.reqresdto.UserResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
public class UserService {

    @Autowired
    private UserRepo repo;

    @Autowired
    private EventService eventService;

    @Autowired
    private JwtService jwtService;

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

    public  UserResponse getUserResponse(String username) {

        User userDetails = repo.findByUsername(username);

        return UserResponse.builder()
                .username(userDetails.getUsername())
                .email(userDetails.getEmail())
                .roles(userDetails.getRole())
                .fullname(userDetails.getFullname())
                .profilePicUrl(userDetails.getProfilePicUrl())
                .id(userDetails.getId())
                .build();
    }

    @Transactional
    public User updateUser(Integer userId, UserRequest userRequest, UserPrinciple userDetails) {

        User user = repo.findById(userDetails.getId()).orElseThrow(() -> new RuntimeException("User not found 404"));


        if(userRequest.getFullname() != null) user.setFullname(userRequest.getFullname());
        if(userRequest.getUsername() != null) user.setUsername(userRequest.getUsername());
        if(userRequest.getEmail() != null) user.setEmail(userRequest.getEmail());

        User updatedUser = repo.save(user);

      return updatedUser;


    }
}
