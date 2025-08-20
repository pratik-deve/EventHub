package com.eventHubBackend.Spring.Backend.EventHub.reqresdto;

import com.eventHubBackend.Spring.Backend.EventHub.model.enums.EventCategories;
import lombok.*;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EventResponse {
    private Long id;
    private String title;
    private String description;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private String venueAddress;
    private EventCategories eventCategories;
}

