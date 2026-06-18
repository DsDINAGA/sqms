package com.sqms.controller;

import com.sqms.dto.ApiResponse;
import com.sqms.dto.DashboardStatsResponse;
import com.sqms.dto.NotificationResponse;
import com.sqms.service.AuthService;
import com.sqms.service.DashboardService;
import com.sqms.service.NotificationService;
import com.sqms.service.ReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
public class AdminController {

    private final DashboardService dashboardService;
    private final ReportService reportService;
    private final NotificationService notificationService;
    private final AuthService authService;

    @GetMapping("/api/admin/dashboard")
    public ResponseEntity<ApiResponse<DashboardStatsResponse>> getDashboard() {
        return ResponseEntity.ok(ApiResponse.success(dashboardService.getDashboardStats()));
    }

    @GetMapping("/api/reports/daily")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getDailyReport() {
        return ResponseEntity.ok(ApiResponse.success(reportService.getDailyReport()));
    }

    @GetMapping("/api/reports/weekly")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getWeeklyReport() {
        return ResponseEntity.ok(ApiResponse.success(reportService.getWeeklyReport()));
    }

    @GetMapping("/api/reports/pdf")
    public ResponseEntity<byte[]> getPdfReport() throws Exception {
        byte[] pdf = reportService.generatePdfReport();
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=sqms-report.pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdf);
    }

    @GetMapping("/api/reports/excel")
    public ResponseEntity<byte[]> getExcelReport() throws Exception {
        byte[] excel = reportService.generateExcelReport();
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=sqms-report.xlsx")
                .contentType(MediaType.parseMediaType(
                        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                .body(excel);
    }

    @GetMapping("/api/notifications")
    public ResponseEntity<ApiResponse<List<NotificationResponse>>> getNotifications() {
        Long userId = authService.getCurrentUser().getId();
        return ResponseEntity.ok(ApiResponse.success(notificationService.getUserNotifications(userId)));
    }

    @PutMapping("/api/notifications/{id}/read")
    public ResponseEntity<ApiResponse<Void>> markNotificationRead(@PathVariable Long id) {
        notificationService.markAsRead(id);
        return ResponseEntity.ok(ApiResponse.success(null));
    }
}
