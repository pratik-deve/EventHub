package com.eventHubBackend.Spring.Backend.EventHub.repository;


import com.eventHubBackend.Spring.Backend.EventHub.model.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {

}

