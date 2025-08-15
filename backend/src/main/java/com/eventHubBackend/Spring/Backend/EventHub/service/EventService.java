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

import java.util.List;

@Service
@RequiredArgsConstructor
public class EventService {

    @Autowired
    EventRepository eventRepository;

    @Autowired
    VenueRepository venueRepository;

    public EventResponse createEvent(EventRequest request) {
        Venue venue = venueRepository.findById(request.venueId())
                .orElseThrow(() -> new ResourceNotFoundException("Venue not found with id: " + request.venueId()));

        Event event = Event.builder()
                .title(request.title())
                .description(request.description())
                .dateTime(request.dateTime())
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

        Venue venue = venueRepository.findById(request.venueId())
                .orElseThrow(() -> new ResourceNotFoundException("Venue not found with id: " + request.venueId()));

        event.setTitle(request.title());
        event.setDescription(request.description());
        event.setDateTime(request.dateTime());
        event.setVenue(venue);

        return mapToResponse(eventRepository.save(event));
    }

    public void deleteEvent(Long id) {
        if (!eventRepository.existsById(id)) {
            throw new ResourceNotFoundException("Event not found with id: " + id);
        }
        eventRepository.deleteById(id);
    }

    private EventResponse mapToResponse(Event event) {
        return new EventResponse(
                event.getId(),
                event.getTitle(),
                event.getDescription(),
                event.getDateTime(),
                event.getVenue().getName()
        );
    }
}
