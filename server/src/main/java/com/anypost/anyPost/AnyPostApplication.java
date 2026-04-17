package com.anypost.anyPost;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.mongodb.config.EnableMongoAuditing;

import java.util.Locale;

@EnableMongoAuditing
@SpringBootApplication
public class AnyPostApplication {

	public static void main(String[] args) {
        Locale.setDefault(Locale.ENGLISH);
        SpringApplication.run(AnyPostApplication.class, args);
	}

}
