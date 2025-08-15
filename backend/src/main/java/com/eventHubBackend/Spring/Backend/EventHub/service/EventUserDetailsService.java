package com.eventHubBackend.Spring.Backend.EventHub.service;

import com.eventHubBackend.Spring.Backend.EventHub.repository.UserRepo;
import com.eventHubBackend.Spring.Backend.EventHub.model.User;
import com.eventHubBackend.Spring.Backend.EventHub.principles.UserPrinciple;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;


@Service
public class EventUserDetailsService implements UserDetailsService {


    @Autowired
    private UserRepo repo;

    @Override
    public UserDetails loadUserByUsername(String UsernameOrEmail) throws UsernameNotFoundException {

        User user = repo.findByUsername(UsernameOrEmail);
        if(user == null) user = repo.findByEmail(UsernameOrEmail);


        if(user == null){
            throw new UsernameNotFoundException("User Not Found 404");
        }

        return new UserPrinciple(user);

    }
}
