package com.sqms.config;

import com.sqms.entity.*;
import com.sqms.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalTime;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final DoctorRepository doctorRepository;
    private final ScheduleRepository scheduleRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (userRepository.count() > 0) return;

        User admin = User.builder()
                .name("System Admin")
                .email("admin@sqms.com")
                .phone("9999999999")
                .password(passwordEncoder.encode("admin123"))
                .role(Role.ADMIN)
                .build();
        userRepository.save(admin);

        String[][] doctors = {
                {"Dr. Sarah Johnson", "Cardiology", "MD, FACC", "sarah@hospital.com", "Mon-Fri 9AM-5PM"},
                {"Dr. Michael Chen", "Neurology", "MD, PhD", "michael@hospital.com", "Mon-Sat 10AM-4PM"},
                {"Dr. Emily Davis", "Pediatrics", "MD, FAAP", "emily@hospital.com", "Tue-Sat 8AM-3PM"},
                {"Dr. James Wilson", "Orthopedics", "MS Ortho", "james@hospital.com", "Mon-Fri 11AM-6PM"}
        };

        for (String[] d : doctors) {
            User doctorUser = User.builder()
                    .name(d[0])
                    .email(d[3])
                    .phone("8888888888")
                    .password(passwordEncoder.encode("doctor123"))
                    .role(Role.DOCTOR)
                    .build();
            userRepository.save(doctorUser);

            Doctor doctor = Doctor.builder()
                    .name(d[0])
                    .specialization(d[1])
                    .qualification(d[2])
                    .contact(d[3])
                    .availability(d[4])
                    .user(doctorUser)
                    .build();
            doctorRepository.save(doctor);

            LocalDate today = LocalDate.now();
            for (int day = 0; day < 7; day++) {
                LocalDate date = today.plusDays(day);
                LocalTime[] slots = {
                        LocalTime.of(9, 0), LocalTime.of(10, 0), LocalTime.of(11, 0),
                        LocalTime.of(14, 0), LocalTime.of(15, 0), LocalTime.of(16, 0)
                };
                for (LocalTime start : slots) {
                    Schedule schedule = Schedule.builder()
                            .doctor(doctor)
                            .date(date)
                            .startTime(start)
                            .endTime(start.plusHours(1))
                            .status(ScheduleStatus.AVAILABLE)
                            .build();
                    scheduleRepository.save(schedule);
                }
            }
        }

        User patient = User.builder()
                .name("John Patient")
                .email("patient@sqms.com")
                .phone("7777777777")
                .password(passwordEncoder.encode("patient123"))
                .role(Role.PATIENT)
                .build();
        userRepository.save(patient);
    }
}
