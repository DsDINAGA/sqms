package com.sqms.controller;

import com.sqms.dto.ApiResponse;
import com.sqms.dto.ScheduleRequest;
import com.sqms.dto.ScheduleResponse;
import com.sqms.service.ScheduleService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/schedules")
@RequiredArgsConstructor
public class ScheduleController {

    private final ScheduleService scheduleService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<ScheduleResponse>>> getSchedules(
            @RequestParam(required = false) Long doctorId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        if (doctorId != null) {
            return ResponseEntity.ok(ApiResponse.success(scheduleService.getSchedulesByDoctor(doctorId, date)));
        }
        return ResponseEntity.ok(ApiResponse.success(scheduleService.getAllSchedules(date)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<ScheduleResponse>> createSchedule(
            @Valid @RequestBody ScheduleRequest request) {
        return ResponseEntity.ok(ApiResponse.success(scheduleService.createSchedule(request)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<ScheduleResponse>> updateSchedule(
            @PathVariable Long id, @Valid @RequestBody ScheduleRequest request) {
        return ResponseEntity.ok(ApiResponse.success(scheduleService.updateSchedule(id, request)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteSchedule(@PathVariable Long id) {
        scheduleService.deleteSchedule(id);
        return ResponseEntity.ok(ApiResponse.success("Schedule deleted", null));
    }
}
