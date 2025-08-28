package com.eventHubBackend.Spring.Backend.EventHub.repository;

import com.eventHubBackend.Spring.Backend.EventHub.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;


@Repository
public interface UserRepo extends JpaRepository<User, Integer> {

    User findByUsername(String username);

    User findByEmail(String email);

}
