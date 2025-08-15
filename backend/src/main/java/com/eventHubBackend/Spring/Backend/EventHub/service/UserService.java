package com.eventHubBackend.Spring.Backend.EventHub.service;


import com.eventHubBackend.Spring.Backend.EventHub.repository.UserRepo;
import com.eventHubBackend.Spring.Backend.EventHub.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    @Autowired
    private UserRepo repo;

    private BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(12);


    public User saveUser(User user){
        user.setPassword(encoder.encode(user.getPassword()));
        repo.save(user);
        return user;
    }

    public List<User> getUsers(){
        return repo.findAll();
    }

}
