package com.eventHubBackend.Spring.Backend.EventHub.reqresdto;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.NonNull;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LoginRequest {

    @NonNull
    private String login; // This can be either username or email both works

    @NonNull
    private String password;
}
