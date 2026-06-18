package com.sqms.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class DoctorRequest {
    @NotBlank
    private String name;
    private String specialization;
    private String qualification;
    private String contact;
    private String availability;
    private String email;
    private String password;
}
