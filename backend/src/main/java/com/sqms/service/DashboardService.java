package com.sqms.service;

import com.sqms.dto.DashboardStatsResponse;
import com.sqms.entity.AppointmentStatus;
import com.sqms.entity.QueueStatus;
import com.sqms.entity.Role;
import com.sqms.repository.AppointmentRepository;
import com.sqms.repository.DoctorRepository;
import com.sqms.repository.QueueRepository;
import com.sqms.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.*;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final UserRepository userRepository;
    private final DoctorRepository doctorRepository;
    private final AppointmentRepository appointmentRepository;
    private final QueueRepository queueRepository;

    public DashboardStatsResponse getDashboardStats() {
        LocalDate today = LocalDate.now();

        List<Map<String, Object>> dailyPatients = new ArrayList<>();
        for (int i = 6; i >= 0; i--) {
            LocalDate date = today.minusDays(i);
            Map<String, Object> item = new HashMap<>();
            item.put("date", date.toString());
            item.put("count", appointmentRepository.countByAppointmentDate(date));
            dailyPatients.add(item);
        }

        List<Map<String, Object>> weeklyAppointments = new ArrayList<>();
        String[] days = {"Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"};
        for (int i = 0; i < 7; i++) {
            LocalDate date = today.minusDays(6 - i);
            Map<String, Object> item = new HashMap<>();
            item.put("day", days[date.getDayOfWeek().getValue() - 1]);
            item.put("count", appointmentRepository.countByAppointmentDate(date));
            weeklyAppointments.add(item);
        }

        List<Map<String, Object>> doctorPerformance = doctorRepository.findAll().stream()
                .map(doctor -> {
                    Map<String, Object> item = new HashMap<>();
                    item.put("name", doctor.getName());
                    item.put("appointments", appointmentRepository.countByDoctorIdAndAppointmentDate(
                            doctor.getId(), today));
                    return item;
                }).toList();

        List<Map<String, Object>> queueTrends = new ArrayList<>();
        for (int i = 6; i >= 0; i--) {
            LocalDate date = today.minusDays(i);
            Map<String, Object> item = new HashMap<>();
            item.put("date", date.toString());
            item.put("count", appointmentRepository.countByAppointmentDateAndStatus(
                    date, AppointmentStatus.IN_QUEUE));
            queueTrends.add(item);
        }

        return DashboardStatsResponse.builder()
                .totalPatients(userRepository.countByRole(Role.PATIENT))
                .totalDoctors(doctorRepository.count())
                .todayAppointments(appointmentRepository.countByAppointmentDate(today))
                .completedAppointments(appointmentRepository.countByAppointmentDateAndStatus(
                        today, AppointmentStatus.COMPLETED))
                .activeQueues(queueRepository.countByStatus(QueueStatus.WAITING))
                .dailyPatients(dailyPatients)
                .weeklyAppointments(weeklyAppointments)
                .doctorPerformance(doctorPerformance)
                .queueTrends(queueTrends)
                .build();
    }
}
