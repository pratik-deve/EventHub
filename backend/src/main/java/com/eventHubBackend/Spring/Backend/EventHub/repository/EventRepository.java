package com.eventHubBackend.Spring.Backend.EventHub.repository;

import com.eventHubBackend.Spring.Backend.EventHub.model.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {
}

