package com.sqms.repository;

import com.sqms.entity.Appointment;
import com.sqms.entity.AppointmentStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    List<Appointment> findByPatientId(Long patientId);
    List<Appointment> findByDoctorId(Long doctorId);
    List<Appointment> findByDoctorIdAndAppointmentDate(Long doctorId, LocalDate date);
    List<Appointment> findByAppointmentDate(LocalDate date);
    List<Appointment> findByStatus(AppointmentStatus status);
    long countByAppointmentDate(LocalDate date);
    long countByAppointmentDateAndStatus(LocalDate date, AppointmentStatus status);
    Optional<Appointment> findByQueueToken(String queueToken);
    long countByDoctorIdAndAppointmentDate(Long doctorId, LocalDate date);
}
