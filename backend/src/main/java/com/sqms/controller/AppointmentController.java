package com.sqms.controller;

import com.sqms.dto.ApiResponse;
import com.sqms.dto.AppointmentRequest;
import com.sqms.dto.AppointmentResponse;
import com.sqms.service.AppointmentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/appointments")
@RequiredArgsConstructor
public class AppointmentController {

    private final AppointmentService appointmentService;

    @PostMapping
    public ResponseEntity<ApiResponse<AppointmentResponse>> bookAppointment(
            @Valid @RequestBody AppointmentRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Appointment booked", appointmentService.bookAppointment(request)));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<AppointmentResponse>>> getAppointments(
            @RequestParam(required = false) Long patientId,
            @RequestParam(required = false) Long doctorId) {
        if (patientId == null && doctorId == null) {
            return ResponseEntity.ok(ApiResponse.success(appointmentService.getMyAppointments()));
        }
        return ResponseEntity.ok(ApiResponse.success(appointmentService.getAppointments(patientId, doctorId)));
    }

    @PutMapping("/cancel/{id}")
    public ResponseEntity<ApiResponse<AppointmentResponse>> cancelAppointment(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(appointmentService.cancelAppointment(id)));
    }

    @PutMapping("/complete/{id}")
    public ResponseEntity<ApiResponse<AppointmentResponse>> completeAppointment(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(appointmentService.completeAppointment(id)));
    }
}
