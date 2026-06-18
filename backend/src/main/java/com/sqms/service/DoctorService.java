package com.sqms.service;

import com.sqms.dto.DoctorRequest;
import com.sqms.dto.DoctorResponse;
import com.sqms.entity.Doctor;
import com.sqms.entity.Role;
import com.sqms.entity.User;
import com.sqms.exception.BadRequestException;
import com.sqms.exception.ResourceNotFoundException;
import com.sqms.repository.DoctorRepository;
import com.sqms.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DoctorService {

    private final DoctorRepository doctorRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public List<DoctorResponse> getAllDoctors(String search) {
        List<Doctor> doctors = search != null && !search.isBlank()
                ? doctorRepository.findByNameContainingIgnoreCase(search)
                : doctorRepository.findAll();
        return doctors.stream().map(this::toResponse).toList();
    }

    public DoctorResponse getDoctorById(Long id) {
        return toResponse(findDoctor(id));
    }

    @Transactional
    public DoctorResponse createDoctor(DoctorRequest request) {
        User user = null;
        if (request.getEmail() != null && !request.getEmail().isBlank()) {
            if (userRepository.existsByEmail(request.getEmail())) {
                throw new BadRequestException("Email already exists");
            }
            user = User.builder()
                    .name(request.getName())
                    .email(request.getEmail())
                    .phone(request.getContact())
                    .password(passwordEncoder.encode(
                            request.getPassword() != null ? request.getPassword() : "doctor123"))
                    .role(Role.DOCTOR)
                    .build();
            userRepository.save(user);
        }

        Doctor doctor = Doctor.builder()
                .name(request.getName())
                .specialization(request.getSpecialization())
                .qualification(request.getQualification())
                .contact(request.getContact())
                .availability(request.getAvailability())
                .user(user)
                .build();

        return toResponse(doctorRepository.save(doctor));
    }

    @Transactional
    public DoctorResponse updateDoctor(Long id, DoctorRequest request) {
        Doctor doctor = findDoctor(id);
        doctor.setName(request.getName());
        doctor.setSpecialization(request.getSpecialization());
        doctor.setQualification(request.getQualification());
        doctor.setContact(request.getContact());
        doctor.setAvailability(request.getAvailability());
        return toResponse(doctorRepository.save(doctor));
    }

    @Transactional
    public void deleteDoctor(Long id) {
        Doctor doctor = findDoctor(id);
        if (doctor.getUser() != null) {
            userRepository.delete(doctor.getUser());
        }
        doctorRepository.delete(doctor);
    }

    public Doctor findDoctor(Long id) {
        return doctorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found"));
    }

    public Doctor findDoctorByUserId(Long userId) {
        return doctorRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor profile not found"));
    }

    private DoctorResponse toResponse(Doctor doctor) {
        return DoctorResponse.builder()
                .id(doctor.getId())
                .name(doctor.getName())
                .specialization(doctor.getSpecialization())
                .qualification(doctor.getQualification())
                .contact(doctor.getContact())
                .availability(doctor.getAvailability())
                .userId(doctor.getUser() != null ? doctor.getUser().getId() : null)
                .build();
    }
}
