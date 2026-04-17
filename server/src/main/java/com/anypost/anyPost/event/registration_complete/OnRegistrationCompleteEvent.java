package com.anypost.anyPost.event.registration_complete;

import org.springframework.context.ApplicationEvent;

import com.anypost.anyPost.entity.User;

import lombok.Getter;


@Getter
public class OnRegistrationCompleteEvent extends ApplicationEvent {
    private final User user;

    public OnRegistrationCompleteEvent(User user) {
        super(user);
        this.user = user;
    }
}
