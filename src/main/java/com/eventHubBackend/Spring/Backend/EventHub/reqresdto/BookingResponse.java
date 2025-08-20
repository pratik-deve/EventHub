package com.eventHubBackend.Spring.Backend.EventHub.reqresdto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BookingResponse {
    private Long bookingId;
    private String message;
}

