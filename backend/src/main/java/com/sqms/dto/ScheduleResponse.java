package com.sqms.dto;

import com.sqms.entity.ScheduleStatus;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
@Builder
public class ScheduleResponse {
    private Long id;
    private Long doctorId;
    private String doctorName;
    private LocalDate date;
    private LocalTime startTime;
    private LocalTime endTime;
    private ScheduleStatus status;
}
