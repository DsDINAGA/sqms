package com.sqms.repository;

import com.sqms.entity.Schedule;
import com.sqms.entity.ScheduleStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface ScheduleRepository extends JpaRepository<Schedule, Long> {
    List<Schedule> findByDoctorIdAndDate(Long doctorId, LocalDate date);
    List<Schedule> findByDoctorIdAndDateAndStatus(Long doctorId, LocalDate date, ScheduleStatus status);
    List<Schedule> findByDate(LocalDate date);
}
