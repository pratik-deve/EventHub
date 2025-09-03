package com.eventHubBackend.Spring.Backend.EventHub.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Value("${spring.mail.username}")
    private String myMail;

    @Autowired
    private JavaMailSender mailSender;

    public void sendVerificationEmail(String to, String token) {
        String subject = "Verify your account";
        String verificationUrl = "http://localhost:3000/verify?token=" + token;
        String body = "Click the link to verify your account: " + verificationUrl;

        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(myMail);
        message.setTo(to);
        message.setSubject(subject);
        message.setText(body);

        mailSender.send(message);
    }
}
