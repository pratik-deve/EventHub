package com.eventHubBackend.Spring.Backend.EventHub.model;

import com.eventHubBackend.Spring.Backend.EventHub.model.enums.Role;
import jakarta.persistence.*;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.HashSet;
import java.util.Set;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 50)
    private String username;

    @Column
    private String fullname;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false, unique = true, length = 100)
    private String email;

    @Column
    private String profilePicUrl;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private Role role = Role.USER;


    @ElementCollection
    @CollectionTable(name = "user_liked_events", joinColumns = @JoinColumn(name = "user_id"))
    @Column(name = "event_id")
    private Set<Long> likedEventId = new HashSet<>();




    @PrePersist
    public void setDefaultFullName() {
        if (fullname == null || fullname.isEmpty()) {
            fullname = username;
        }
    }


}
