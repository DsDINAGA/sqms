package com.sqms.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class AppointmentRequest {
    @NotNull
    private Long doctorId;
    @NotNull
    private Long scheduleId;
}
