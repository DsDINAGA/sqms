package com.sqms.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class DoctorResponse {
    private Long id;
    private String name;
    private String specialization;
    private String qualification;
    private String contact;
    private String availability;
    private Long userId;
}
