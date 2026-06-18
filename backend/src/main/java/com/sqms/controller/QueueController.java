package com.sqms.controller;

import com.sqms.dto.ApiResponse;
import com.sqms.dto.QueueStatusResponse;
import com.sqms.service.QueueService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/queue")
@RequiredArgsConstructor
public class QueueController {

    private final QueueService queueService;

    @GetMapping("/current")
    public ResponseEntity<ApiResponse<List<QueueStatusResponse>>> getCurrentQueue(
            @RequestParam Long doctorId) {
        return ResponseEntity.ok(ApiResponse.success(queueService.getCurrentQueue(doctorId)));
    }

    @GetMapping("/token/{token}")
    public ResponseEntity<ApiResponse<QueueStatusResponse>> getByToken(@PathVariable String token) {
        return ResponseEntity.ok(ApiResponse.success(queueService.getQueueStatusByToken(token)));
    }

    @GetMapping("/status/{appointmentId}")
    public ResponseEntity<ApiResponse<QueueStatusResponse>> getStatus(@PathVariable Long appointmentId) {
        return ResponseEntity.ok(ApiResponse.success(queueService.getQueueStatus(appointmentId)));
    }

    @PostMapping("/serve-next")
    public ResponseEntity<ApiResponse<QueueStatusResponse>> serveNext(@RequestParam Long doctorId) {
        return ResponseEntity.ok(ApiResponse.success(queueService.serveNext(doctorId)));
    }
}
