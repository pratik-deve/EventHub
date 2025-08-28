package com.eventHubBackend.Spring.Backend.EventHub.reqresdto;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UserRequest {

    private String email;
    private String username;
    private String fullname;
}
