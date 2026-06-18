package com.sqms.dto;

import com.sqms.entity.QueueStatus;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class QueueStatusResponse {
    private Long queueId;
    private Long appointmentId;
    private Integer currentServing;
    private String yourToken;
    private Integer tokenNumber;
    private Integer patientsAhead;
    private Integer estimatedWaitingMinutes;
    private Integer progressPercent;
    private QueueStatus status;
    private String doctorName;
}
