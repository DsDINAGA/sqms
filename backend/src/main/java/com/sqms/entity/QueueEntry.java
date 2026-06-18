package com.sqms.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "queue")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class QueueEntry {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "appointment_id", nullable = false)
    private Appointment appointment;

    @Column(name = "token_number", nullable = false)
    private Integer tokenNumber;

    @Column(nullable = false)
    private Integer position;

    @Column(name = "estimated_time")
    private Integer estimatedTime;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private QueueStatus status;
}
