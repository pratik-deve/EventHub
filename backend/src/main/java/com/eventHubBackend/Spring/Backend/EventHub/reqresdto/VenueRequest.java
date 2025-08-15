package com.eventHubBackend.Spring.Backend.EventHub.reqresdto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VenueRequest {

    @NotBlank(message = "Venue name is required")
    private String name;

    @NotBlank(message = "Venue address is required")
    private String address;
}
