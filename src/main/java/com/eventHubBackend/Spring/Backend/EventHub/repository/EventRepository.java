package com.eventHubBackend.Spring.Backend.EventHub.repository;

import com.eventHubBackend.Spring.Backend.EventHub.model.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {
    @Query("SELECT e FROM Event e WHERE e.venue.id = :venueId " +
            "AND ((:start < e.endTime) AND (:end > e.startTime))")
    List<Event> findOverlappingEvents(@Param("venueId") Long venueId,
                                      @Param("start") LocalDateTime start,
                                      @Param("end") LocalDateTime end);
}

