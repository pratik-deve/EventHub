package com.eventHubBackend.Spring.Backend.EventHub.service;

import com.eventHubBackend.Spring.Backend.EventHub.dto.VenueDTO;
import com.eventHubBackend.Spring.Backend.EventHub.reqresdto.VenueRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface VenueService {
    VenueDTO createVenue(VenueRequest venueRequest);
    VenueDTO updateVenue(Long id, VenueRequest venueRequest);
    VenueDTO getVenueById(Long id);
    Page<VenueDTO> getAllVenues(Pageable pageable);
    void deleteVenue(Long id);
}
