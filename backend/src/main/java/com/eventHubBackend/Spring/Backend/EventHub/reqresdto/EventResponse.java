package com.eventHubBackend.Spring.Backend.EventHub.reqresdto;

import java.time.LocalDateTime;

public record EventResponse(
        Long id,
        String title,
        String description,
        LocalDateTime dateTime,
        String venueName
) {}
