package com.anypost.anyPost.repository;


import java.lang.StackWalker.Option;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.anypost.anyPost.entity.User;

@Repository
public interface UserRepository extends MongoRepository<User, String> {

    // User findByUsername(String username);
    // boolean existsByUsername(String username);


    Optional<User> findByVerificationToken(String token);

    Optional<User> findByResetPasswordToken(String token);

    Optional<User> findByEmail(String email);
    Optional<User> existsByEmail(String email);

    
}
