package com.sqms.service;

import com.sqms.dto.QueueStatusResponse;
import com.sqms.entity.*;
import com.sqms.exception.ResourceNotFoundException;
import com.sqms.repository.AppointmentRepository;
import com.sqms.repository.QueueRepository;
import com.sqms.websocket.QueueWebSocketHandler;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class QueueService {

    private final QueueRepository queueRepository;
    private final AppointmentRepository appointmentRepository;
    private final QueueWebSocketHandler webSocketHandler;

    @Value("${queue.average-consultation-minutes:5}")
    private int averageConsultationMinutes;

    @Transactional
    public QueueEntry createQueueEntry(Appointment appointment) {
        List<QueueEntry> existing = queueRepository
                .findByAppointmentDoctorIdOrderByTokenNumberAsc(appointment.getDoctor().getId());

        int nextToken = existing.stream()
                .mapToInt(QueueEntry::getTokenNumber)
                .max()
                .orElse(0) + 1;

        int position = (int) existing.stream()
                .filter(q -> q.getStatus() == QueueStatus.WAITING)
                .count() + 1;

        QueueEntry entry = QueueEntry.builder()
                .appointment(appointment)
                .tokenNumber(nextToken)
                .position(position)
                .estimatedTime(position * averageConsultationMinutes)
                .status(QueueStatus.WAITING)
                .build();

        appointment.setStatus(AppointmentStatus.IN_QUEUE);
        return queueRepository.save(entry);
    }

    public QueueStatusResponse getQueueStatus(Long appointmentId) {
        QueueEntry entry = queueRepository.findByAppointmentId(appointmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Queue entry not found"));

        return buildStatusResponse(entry);
    }

    public QueueStatusResponse getQueueStatusByToken(String token) {
        Appointment appointment = appointmentRepository.findByQueueToken(token)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found for token"));
        return getQueueStatus(appointment.getId());
    }

    public List<QueueStatusResponse> getCurrentQueue(Long doctorId) {
        return queueRepository.findByAppointmentDoctorIdOrderByTokenNumberAsc(doctorId)
                .stream()
                .map(this::buildStatusResponse)
                .toList();
    }

    @Transactional
    public QueueStatusResponse serveNext(Long doctorId) {
        Optional<QueueEntry> next = queueRepository
                .findFirstByAppointmentDoctorIdAndStatusOrderByPositionAsc(doctorId, QueueStatus.WAITING);

        queueRepository.findByAppointmentDoctorIdAndStatusOrderByPositionAsc(doctorId, QueueStatus.SERVING)
                .forEach(q -> {
                    q.setStatus(QueueStatus.COMPLETED);
                    queueRepository.save(q);
                });

        if (next.isPresent()) {
            QueueEntry entry = next.get();
            entry.setStatus(QueueStatus.SERVING);
            queueRepository.save(entry);
            recalculatePositions(doctorId);
            webSocketHandler.broadcastQueueUpdate(doctorId, getCurrentQueue(doctorId));
            return buildStatusResponse(entry);
        }
        return null;
    }

    @Transactional
    public void completeQueueEntry(Long appointmentId) {
        queueRepository.findByAppointmentId(appointmentId).ifPresent(entry -> {
            entry.setStatus(QueueStatus.COMPLETED);
            queueRepository.save(entry);
            recalculatePositions(entry.getAppointment().getDoctor().getId());
        });
    }

    private void recalculatePositions(Long doctorId) {
        List<QueueEntry> waiting = queueRepository
                .findByAppointmentDoctorIdAndStatusOrderByPositionAsc(doctorId, QueueStatus.WAITING);
        int pos = 1;
        for (QueueEntry entry : waiting) {
            entry.setPosition(pos);
            entry.setEstimatedTime(pos * averageConsultationMinutes);
            queueRepository.save(entry);
            pos++;
        }
    }

    private QueueStatusResponse buildStatusResponse(QueueEntry entry) {
        Long doctorId = entry.getAppointment().getDoctor().getId();
        Integer currentServing = queueRepository
                .findByAppointmentDoctorIdAndStatusOrderByPositionAsc(doctorId, QueueStatus.SERVING)
                .stream()
                .map(QueueEntry::getTokenNumber)
                .findFirst()
                .orElseGet(() -> queueRepository
                        .findByAppointmentDoctorIdAndStatusOrderByPositionAsc(doctorId, QueueStatus.COMPLETED)
                        .stream()
                        .map(QueueEntry::getTokenNumber)
                        .max(Comparator.naturalOrder())
                        .orElse(0));

        int patientsAhead = Math.max(0, entry.getTokenNumber() - currentServing - 1);
        if (entry.getStatus() == QueueStatus.SERVING) {
            patientsAhead = 0;
        }

        int estimatedWait = patientsAhead * averageConsultationMinutes;
        int progress = entry.getTokenNumber() > 0
                ? Math.min(100, (currentServing * 100) / entry.getTokenNumber())
                : 0;

        return QueueStatusResponse.builder()
                .queueId(entry.getId())
                .appointmentId(entry.getAppointment().getId())
                .currentServing(currentServing)
                .yourToken(entry.getAppointment().getQueueToken())
                .tokenNumber(entry.getTokenNumber())
                .patientsAhead(patientsAhead)
                .estimatedWaitingMinutes(estimatedWait)
                .progressPercent(progress)
                .status(entry.getStatus())
                .doctorName(entry.getAppointment().getDoctor().getName())
                .build();
    }
}
