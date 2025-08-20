package com.eventHubBackend.Spring.Backend.EventHub.reqresdto;


import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BookingRequest {
    private Long userId;
    private Long eventId;
}
