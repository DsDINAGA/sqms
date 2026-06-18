package com.sqms.dto;

import lombok.Builder;
import lombok.Data;

import java.util.List;
import java.util.Map;

@Data
@Builder
public class DashboardStatsResponse {
    private long totalPatients;
    private long totalDoctors;
    private long todayAppointments;
    private long completedAppointments;
    private long activeQueues;
    private List<Map<String, Object>> dailyPatients;
    private List<Map<String, Object>> weeklyAppointments;
    private List<Map<String, Object>> doctorPerformance;
    private List<Map<String, Object>> queueTrends;
}
