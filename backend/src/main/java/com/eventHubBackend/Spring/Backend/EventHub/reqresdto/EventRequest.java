package com.eventHubBackend.Spring.Backend.EventHub.reqresdto;


import java.time.LocalDateTime;

public record EventRequest(
        String title,
        String description,
        LocalDateTime dateTime,
        Long venueId
) {}

