package com.sqms.websocket;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.sqms.dto.QueueStatusResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArrayList;

@Component
@RequiredArgsConstructor
public class QueueWebSocketHandler extends TextWebSocketHandler {

    private final ObjectMapper objectMapper;
    private final Map<Long, List<WebSocketSession>> doctorSessions = new ConcurrentHashMap<>();

    @Override
    public void afterConnectionEstablished(WebSocketSession session) {
        String doctorIdParam = getDoctorId(session);
        if (doctorIdParam != null) {
            Long doctorId = Long.parseLong(doctorIdParam);
            doctorSessions.computeIfAbsent(doctorId, k -> new CopyOnWriteArrayList<>()).add(session);
        }
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) {
        doctorSessions.values().forEach(sessions -> sessions.remove(session));
    }

    public void broadcastQueueUpdate(Long doctorId, List<QueueStatusResponse> queue) {
        doctorSessions.getOrDefault(doctorId, List.of()).forEach(session -> {
            try {
                if (session.isOpen()) {
                    session.sendMessage(new TextMessage(objectMapper.writeValueAsString(queue)));
                }
            } catch (IOException e) {
                // ignore send failures
            }
        });
    }

    private String getDoctorId(WebSocketSession session) {
        String query = session.getUri() != null ? session.getUri().getQuery() : null;
        if (query != null && query.contains("doctorId=")) {
            return query.split("doctorId=")[1].split("&")[0];
        }
        return null;
    }
}
