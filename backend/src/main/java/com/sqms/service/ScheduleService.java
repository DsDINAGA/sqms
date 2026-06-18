package com.sqms.service;

import com.sqms.dto.ScheduleRequest;
import com.sqms.dto.ScheduleResponse;
import com.sqms.entity.Doctor;
import com.sqms.entity.Schedule;
import com.sqms.entity.ScheduleStatus;
import com.sqms.exception.ResourceNotFoundException;
import com.sqms.repository.ScheduleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ScheduleService {

    private final ScheduleRepository scheduleRepository;
    private final DoctorService doctorService;

    public List<ScheduleResponse> getSchedulesByDoctor(Long doctorId, LocalDate date) {
        List<Schedule> schedules = date != null
                ? scheduleRepository.findByDoctorIdAndDateAndStatus(doctorId, date, ScheduleStatus.AVAILABLE)
                : scheduleRepository.findByDoctorIdAndDate(doctorId, LocalDate.now());
        return schedules.stream().map(this::toResponse).toList();
    }

    public List<ScheduleResponse> getAllSchedules(LocalDate date) {
        List<Schedule> schedules = date != null
                ? scheduleRepository.findByDate(date)
                : scheduleRepository.findAll();
        return schedules.stream().map(this::toResponse).toList();
    }

    @Transactional
    public ScheduleResponse createSchedule(ScheduleRequest request) {
        Doctor doctor = doctorService.findDoctor(request.getDoctorId());
        Schedule schedule = Schedule.builder()
                .doctor(doctor)
                .date(request.getDate())
                .startTime(request.getStartTime())
                .endTime(request.getEndTime())
                .status(request.getStatus() != null ? request.getStatus() : ScheduleStatus.AVAILABLE)
                .build();
        return toResponse(scheduleRepository.save(schedule));
    }

    @Transactional
    public ScheduleResponse updateSchedule(Long id, ScheduleRequest request) {
        Schedule schedule = scheduleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Schedule not found"));
        schedule.setDate(request.getDate());
        schedule.setStartTime(request.getStartTime());
        schedule.setEndTime(request.getEndTime());
        if (request.getStatus() != null) {
            schedule.setStatus(request.getStatus());
        }
        return toResponse(scheduleRepository.save(schedule));
    }

    @Transactional
    public void deleteSchedule(Long id) {
        scheduleRepository.deleteById(id);
    }

    public Schedule findSchedule(Long id) {
        return scheduleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Schedule not found"));
    }

    private ScheduleResponse toResponse(Schedule schedule) {
        return ScheduleResponse.builder()
                .id(schedule.getId())
                .doctorId(schedule.getDoctor().getId())
                .doctorName(schedule.getDoctor().getName())
                .date(schedule.getDate())
                .startTime(schedule.getStartTime())
                .endTime(schedule.getEndTime())
                .status(schedule.getStatus())
                .build();
    }
}
