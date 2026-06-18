package com.sqms;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class SqmsApplication {

    public static void main(String[] args) {
        SpringApplication.run(SqmsApplication.class, args);
    }
}
