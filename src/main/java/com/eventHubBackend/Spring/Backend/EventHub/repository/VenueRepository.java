package com.eventHubBackend.Spring.Backend.EventHub.repository;

import com.eventHubBackend.Spring.Backend.EventHub.model.Venue;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface VenueRepository extends JpaRepository<Venue, Long> {
    boolean existsByName(String name);


    @Query("SELECT v FROM Venue v WHERE LOWER(v.name) = LOWER(:name) AND LOWER(v.address) = LOWER(:address)")
    Optional<Venue> findByNameAndAddressIgnoreCase(String name, String address);

}
