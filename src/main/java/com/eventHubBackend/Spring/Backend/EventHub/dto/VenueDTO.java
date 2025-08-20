package com.eventHubBackend.Spring.Backend.EventHub.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VenueDTO {
    private Long id;
    private String name;
    private String address;
}
