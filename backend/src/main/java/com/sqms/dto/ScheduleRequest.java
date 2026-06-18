package com.sqms.dto;

import com.sqms.entity.ScheduleStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
public class ScheduleRequest {
    @NotNull
    private Long doctorId;
    @NotNull
    private LocalDate date;
    @NotNull
    private LocalTime startTime;
    @NotNull
    private LocalTime endTime;
    private ScheduleStatus status;
}
