package com.eventHubBackend.Spring.Backend.EventHub.reqresdto;


import lombok.Data;
import lombok.NonNull;

@Data
public class LoginRequest {

    @NonNull
    private String login; // This can be either username or email both works

    @NonNull
    private String password;
}
