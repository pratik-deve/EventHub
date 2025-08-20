package com.eventHubBackend.Spring.Backend.EventHub.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(
        name = "tickets",
        uniqueConstraints = @UniqueConstraint(name = "uq_ticket_event_seat", columnNames = {"event_id","seat_number"})
)
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class Ticket {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "seat_number", nullable = false)
    private String seatNumber;

    @Column(nullable = false)
    private Double price;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "booking_id", nullable = false)
    private Booking booking;

    // NEW: direct link for uniqueness constraint & fast lookups
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "event_id", nullable = false)
    private Event event;
}
