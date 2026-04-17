package com.anypost.anyPost.event.reset_password;

import org.springframework.context.ApplicationEvent;

import com.anypost.anyPost.entity.User;

import lombok.Getter;

@Getter
public class OnPasswordResetEvent extends ApplicationEvent {

    private final User user;

    public OnPasswordResetEvent(User user) {
        super(user);
        this.user = user;
    }
}
