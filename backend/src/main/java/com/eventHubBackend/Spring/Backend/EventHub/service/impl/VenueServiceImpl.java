package com.eventHubBackend.Spring.Backend.EventHub.service.impl;

import com.eventHubBackend.Spring.Backend.EventHub.dto.VenueDTO;
import com.eventHubBackend.Spring.Backend.EventHub.reqresdto.VenueRequest;
import com.eventHubBackend.Spring.Backend.EventHub.exception.ResourceNotFoundException;
import com.eventHubBackend.Spring.Backend.EventHub.model.Venue;
import com.eventHubBackend.Spring.Backend.EventHub.repository.VenueRepository;
import com.eventHubBackend.Spring.Backend.EventHub.service.VenueService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class VenueServiceImpl implements VenueService {

    //@Autowired new recommended approach not using this annotate we require constructor injection
    private final VenueRepository venueRepository;

    public VenueServiceImpl(VenueRepository venueRepository) {
        this.venueRepository = venueRepository;
    }

    @Override
    public VenueDTO createVenue(VenueRequest venueRequest) {
        venueRepository.findByNameAndAddressIgnoreCase(
                venueRequest.getName().trim(),
                venueRequest.getAddress().trim()
        ).ifPresent(existing -> {
            throw new IllegalArgumentException(
                    "Venue with the same name and address already exists."
            );
        });

        Venue venue = Venue.builder()
                .name(venueRequest.getName().trim())
                .address(venueRequest.getAddress().trim())
                .build();

        return toDTO(venueRepository.save(venue));
    }

    @Override
    public VenueDTO updateVenue(Long id, VenueRequest venueRequest) {
        Venue venue = venueRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Venue not found with ID " + id));

        venue.setName(venueRequest.getName());
        venue.setAddress(venueRequest.getAddress());

        return toDTO(venueRepository.save(venue));
    }

    @Override
    public VenueDTO getVenueById(Long id) {
        Venue venue = venueRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Venue not found with ID " + id));

        return toDTO(venue);
    }

    @Override
    public Page<VenueDTO> getAllVenues(Pageable pageable) {
        return venueRepository.findAll(pageable).map(this::toDTO);
    }

    @Override
    public void deleteVenue(Long id) {
        Venue venue = venueRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Venue not found with ID " + id));

        venueRepository.delete(venue);
    }

    private VenueDTO toDTO(Venue venue) {
        return VenueDTO.builder()
                .id(venue.getId())
                .name(venue.getName())
                .address(venue.getAddress())
                .build();
    }
}
