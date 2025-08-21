package com.eventHubBackend.Spring.Backend.EventHub.service;

import com.eventHubBackend.Spring.Backend.EventHub.reqresdto.EventRequest;
import com.eventHubBackend.Spring.Backend.EventHub.reqresdto.EventResponse;
import com.eventHubBackend.Spring.Backend.EventHub.exception.ResourceNotFoundException;
import com.eventHubBackend.Spring.Backend.EventHub.model.Event;
import com.eventHubBackend.Spring.Backend.EventHub.model.Venue;
import com.eventHubBackend.Spring.Backend.EventHub.repository.EventRepository;
import com.eventHubBackend.Spring.Backend.EventHub.repository.VenueRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class EventService {

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private VenueRepository venueRepository;

    public EventResponse createEvent(EventRequest request) {
        Venue venue = venueRepository.findById(request.getVenueId())
                .orElseThrow(() -> new ResourceNotFoundException("Venue not found with id: " + request.getVenueId()));

        // Check for overlapping events at the same venue
        boolean hasConflict = !eventRepository.findOverlappingEvents(
                request.getVenueId(),
                request.getStartTime(),
                request.getEndTime()
        ).isEmpty();

        if (hasConflict) {
            throw new IllegalStateException("Venue already booked for the given time slot");
        }

        Event event = Event.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .startTime(request.getStartTime())
                .endTime(request.getEndTime())
                .venue(venue)
                .build();

        Event saved = eventRepository.save(event);
        return mapToResponse(saved);
    }

    public List<EventResponse> getAllEvents() {
        return eventRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public EventResponse getEventById(Long id) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with id: " + id));
        return mapToResponse(event);
    }

    public EventResponse updateEvent(Long id, EventRequest request) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with id: " + id));

        Venue venue = venueRepository.findById(request.getVenueId())
                .orElseThrow(() -> new ResourceNotFoundException("Venue not found with id: " + request.getVenueId()));

        // Check for conflicts excluding the current event
        boolean hasConflict = eventRepository.findOverlappingEvents(
                request.getVenueId(),
                request.getStartTime(),
                request.getEndTime()
        ).stream().anyMatch(e -> !e.getId().equals(id));

        if (hasConflict) {
            throw new IllegalStateException("Venue already booked for the given time slot");
        }

        event.setTitle(request.getTitle());
        event.setDescription(request.getDescription());
        event.setStartTime(request.getStartTime());
        event.setEndTime(request.getEndTime());
        event.setVenue(venue);

        return mapToResponse(eventRepository.save(event));
    }

    public void deleteEvent(Long id) {
        if (!eventRepository.existsById(id)) {
            throw new ResourceNotFoundException("Event not found with id: " + id);
        }
        eventRepository.deleteById(id);
    }


    public List<EventResponse> getEventsByIds(Set<Long> eventIds) {

        return eventIds.stream()
                .map(eventRepository::findById)
                .flatMap(Optional::stream)
                .map(this::mapToResponse)
                .toList();
    }

    private EventResponse mapToResponse(Event event) {

        return new EventResponse(
                event.getId(),
                event.getTitle(),
                event.getDescription(),
                event.getStartTime(),
                event.getEndTime(),
                event.getVenue().getAddress(),
                event.getEventCategory()
        );
    }
}
