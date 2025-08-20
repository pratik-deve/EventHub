package com.eventHubBackend.Spring.Backend.EventHub.model;

import com.eventHubBackend.Spring.Backend.EventHub.model.enums.BookingStatus;
import com.eventHubBackend.Spring.Backend.EventHub.model.enums.EventCategories;
import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;



@Entity
@Table(
        name = "events",
        indexes = {
                @Index(name = "idx_events_venue_time", columnList = "venue_id,start_time,end_time")
        }
)
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class Event {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 150)
    private String title;

    @Column(length = 500)
    private String description;

    @Column(nullable = false)
    private double price;

    @Column(name = "start_time", nullable = false)
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime startTime;

    @Column(name = "end_time", nullable = false)
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime endTime;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "venue_id", nullable = false)
    private Venue venue;

    @OneToMany(mappedBy = "event", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Booking> bookings;



    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private EventCategories eventCategory = EventCategories.GENERAL;
}
