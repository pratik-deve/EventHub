package com.eventHubBackend.Spring.Backend.EventHub.reqresdto;


import java.time.LocalDateTime;

import jakarta.validation.constraints.*;
import lombok.*;


@Data
@NoArgsConstructor @AllArgsConstructor @Builder

public class EventRequest {
    @NotBlank @Size(max = 150) private String title;
    @Size(max = 500) private String description;
    @NotBlank private Long venueId;
    @NotNull private LocalDateTime startTime;
    @NotNull private LocalDateTime endTime;
}

