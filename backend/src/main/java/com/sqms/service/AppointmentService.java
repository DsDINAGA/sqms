package com.sqms.service;

import com.sqms.dto.AppointmentRequest;
import com.sqms.dto.AppointmentResponse;
import com.sqms.entity.*;
import com.sqms.exception.BadRequestException;
import com.sqms.exception.ResourceNotFoundException;
import com.sqms.repository.AppointmentRepository;
import com.sqms.websocket.QueueWebSocketHandler;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.Year;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final DoctorService doctorService;
    private final ScheduleService scheduleService;
    private final QueueService queueService;
    private final NotificationService notificationService;
    private final AuthService authService;
    private final QueueWebSocketHandler webSocketHandler;

    @Transactional
    public AppointmentResponse bookAppointment(AppointmentRequest request) {
        User patient = authService.getCurrentUser();
        Doctor doctor = doctorService.findDoctor(request.getDoctorId());
        Schedule schedule = scheduleService.findSchedule(request.getScheduleId());

        if (schedule.getStatus() != ScheduleStatus.AVAILABLE) {
            throw new BadRequestException("Time slot is not available");
        }

        long count = appointmentRepository.countByDoctorIdAndAppointmentDate(
                doctor.getId(), schedule.getDate());
        String queueToken = generateQueueToken(doctor.getId(), (int) count + 1);

        Appointment appointment = Appointment.builder()
                .patient(patient)
                .doctor(doctor)
                .schedule(schedule)
                .appointmentDate(schedule.getDate())
                .status(AppointmentStatus.SCHEDULED)
                .queueToken(queueToken)
                .build();

        schedule.setStatus(ScheduleStatus.BOOKED);
        appointment = appointmentRepository.save(appointment);
        queueService.createQueueEntry(appointment);

        notificationService.createNotification(
                patient,
                "Appointment Booked",
                "Your appointment with Dr. " + doctor.getName() + " is confirmed. Token: " + queueToken
        );

        notificationService.sendEmail(
                patient.getEmail(),
                "Appointment Confirmation",
                "Dear " + patient.getName() + ",\n\nYour appointment is booked.\nToken: " + queueToken
                        + "\nDate: " + schedule.getDate() + "\nTime: " + schedule.getStartTime()
        );

        webSocketHandler.broadcastQueueUpdate(doctor.getId(), queueService.getCurrentQueue(doctor.getId()));
        return toResponse(appointment);
    }

    public List<AppointmentResponse> getAppointments(Long patientId, Long doctorId) {
        List<Appointment> appointments;
        if (patientId != null) {
            appointments = appointmentRepository.findByPatientId(patientId);
        } else if (doctorId != null) {
            appointments = appointmentRepository.findByDoctorId(doctorId);
        } else {
            appointments = appointmentRepository.findAll();
        }
        return appointments.stream().map(this::toResponse).toList();
    }

    public List<AppointmentResponse> getMyAppointments() {
        User user = authService.getCurrentUser();
        if (user.getRole() == Role.ADMIN) {
            return getAppointments(null, null);
        }
        if (user.getRole() == Role.DOCTOR) {
            Doctor doctor = doctorService.findDoctorByUserId(user.getId());
            return getAppointments(null, doctor.getId());
        }
        return getAppointments(user.getId(), null);
    }

    @Transactional
    public AppointmentResponse cancelAppointment(Long id) {
        Appointment appointment = findAppointment(id);
        User currentUser = authService.getCurrentUser();

        if (!appointment.getPatient().getId().equals(currentUser.getId())
                && currentUser.getRole() != Role.ADMIN) {
            throw new BadRequestException("Not authorized to cancel this appointment");
        }

        if (appointment.getStatus() == AppointmentStatus.COMPLETED) {
            throw new BadRequestException("Cannot cancel completed appointment");
        }

        appointment.setStatus(AppointmentStatus.CANCELLED);
        appointment.getSchedule().setStatus(ScheduleStatus.AVAILABLE);
        appointmentRepository.save(appointment);

        notificationService.createNotification(
                appointment.getPatient(),
                "Appointment Cancelled",
                "Your appointment with Dr. " + appointment.getDoctor().getName() + " has been cancelled."
        );

        webSocketHandler.broadcastQueueUpdate(appointment.getDoctor().getId(),
                queueService.getCurrentQueue(appointment.getDoctor().getId()));
        return toResponse(appointment);
    }

    @Transactional
    public AppointmentResponse completeAppointment(Long id) {
        Appointment appointment = findAppointment(id);
        appointment.setStatus(AppointmentStatus.COMPLETED);
        appointmentRepository.save(appointment);
        queueService.completeQueueEntry(appointment.getId());
        webSocketHandler.broadcastQueueUpdate(appointment.getDoctor().getId(),
                queueService.getCurrentQueue(appointment.getDoctor().getId()));
        return toResponse(appointment);
    }

    public Appointment findAppointment(Long id) {
        return appointmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found"));
    }

    private String generateQueueToken(Long doctorId, int sequence) {
        return String.format("DOC-%d-%03d", Year.now().getValue(), sequence);
    }

    private AppointmentResponse toResponse(Appointment appointment) {
        return AppointmentResponse.builder()
                .id(appointment.getId())
                .patientId(appointment.getPatient().getId())
                .patientName(appointment.getPatient().getName())
                .doctorId(appointment.getDoctor().getId())
                .doctorName(appointment.getDoctor().getName())
                .specialization(appointment.getDoctor().getSpecialization())
                .scheduleId(appointment.getSchedule().getId())
                .appointmentDate(appointment.getAppointmentDate())
                .startTime(appointment.getSchedule().getStartTime())
                .endTime(appointment.getSchedule().getEndTime())
                .status(appointment.getStatus())
                .queueToken(appointment.getQueueToken())
                .createdAt(appointment.getCreatedAt())
                .build();
    }
}
