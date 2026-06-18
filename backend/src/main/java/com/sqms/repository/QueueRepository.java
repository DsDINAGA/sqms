package com.sqms.repository;

import com.sqms.entity.QueueEntry;
import com.sqms.entity.QueueStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface QueueRepository extends JpaRepository<QueueEntry, Long> {
    Optional<QueueEntry> findByAppointmentId(Long appointmentId);
    List<QueueEntry> findByAppointmentDoctorIdAndStatusOrderByPositionAsc(Long doctorId, QueueStatus status);
    Optional<QueueEntry> findFirstByAppointmentDoctorIdAndStatusOrderByPositionAsc(Long doctorId, QueueStatus status);
    long countByStatus(QueueStatus status);
    List<QueueEntry> findByAppointmentDoctorIdOrderByTokenNumberAsc(Long doctorId);
}
