package com.eventHubBackend.Spring.Backend.EventHub.reqresdto;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserResponse {
    private  String username;
    private String email;
    private Object roles;
}
