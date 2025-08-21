package com.eventHubBackend.Spring.Backend.EventHub.service;


import com.eventHubBackend.Spring.Backend.EventHub.model.Event;
import com.eventHubBackend.Spring.Backend.EventHub.principles.UserPrinciple;
import com.eventHubBackend.Spring.Backend.EventHub.repository.UserRepo;
import com.eventHubBackend.Spring.Backend.EventHub.model.User;
import com.eventHubBackend.Spring.Backend.EventHub.reqresdto.EventResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class UserService {

    @Autowired
    private UserRepo repo;

    @Autowired
    private EventService eventService;

    private BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(12);


    public User saveUser(User user){
        user.setPassword(encoder.encode(user.getPassword()));
        repo.save(user);
        return user;
    }

    public List<User> getUsers(){
        return repo.findAll();
    }



    private User getCurrentUser(){

        Object userPrinciple = SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        String username;

        if(userPrinciple instanceof UserDetails){
            username = ((UserDetails) userPrinciple).getUsername();
        } else {
            username = userPrinciple.toString();
        }

        return repo.findByUsername(username);
    }


    public void addEvent(Long eventId) {
        User user = getCurrentUser();

        if (!user.getLikedEventId().contains(eventId)) {
            user.getLikedEventId().add(eventId);
            repo.save(user);
        }
    }

    public void removeEvent(Long eventId) {
        User user = getCurrentUser();

        if (user.getLikedEventId().contains(eventId)) {
            user.getLikedEventId().remove(eventId);
            repo.save(user);
        }
    }

    public List<EventResponse> getLikedEvents() {
        User user = getCurrentUser();  // Fetch from SecurityContext or however you're doing it
        Set<Long> eventIds = user.getLikedEventId();
        return eventService.getEventsByIds(eventIds);
    }
}
