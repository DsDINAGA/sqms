package com.sqms.repository;

import com.sqms.entity.Notification;
import com.sqms.entity.NotificationStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByUserIdOrderByCreatedAtDesc(Long userId);
    long countByUserIdAndStatus(Long userId, NotificationStatus status);
}
