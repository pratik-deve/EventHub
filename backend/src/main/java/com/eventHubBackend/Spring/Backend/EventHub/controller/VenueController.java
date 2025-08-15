package com.eventHubBackend.Spring.Backend.EventHub.controller;

import com.eventHubBackend.Spring.Backend.EventHub.dto.VenueDTO;
import com.eventHubBackend.Spring.Backend.EventHub.reqresdto.VenueRequest;
import com.eventHubBackend.Spring.Backend.EventHub.service.VenueService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/venues")
public class VenueController {

    private final VenueService venueService;

    public VenueController(VenueService venueService) {
        this.venueService = venueService;
    }

    @PostMapping("/addVenue")
    public ResponseEntity<VenueDTO> createVenue(@Valid @RequestBody VenueRequest venueRequest) {
        return ResponseEntity.ok(venueService.createVenue(venueRequest));
    }

    @PutMapping("/{id}")
    public ResponseEntity<VenueDTO> updateVenue(@PathVariable Long id, @Valid @RequestBody VenueRequest venueRequest) {
        return ResponseEntity.ok(venueService.updateVenue(id, venueRequest));
    }

    @GetMapping("/{id}")
    public ResponseEntity<VenueDTO> getVenueById(@PathVariable Long id) {
        return ResponseEntity.ok(venueService.getVenueById(id));
    }

    @GetMapping
    public ResponseEntity<Page<VenueDTO>> getAllVenues(Pageable pageable) {
        return ResponseEntity.ok(venueService.getAllVenues(pageable));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteVenue(@PathVariable Long id) {
        venueService.deleteVenue(id);
        return ResponseEntity.noContent().build();
    }
}
