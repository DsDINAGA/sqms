package com.sqms.service;

import com.lowagie.text.*;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import com.sqms.entity.AppointmentStatus;
import com.sqms.entity.Role;
import com.sqms.repository.AppointmentRepository;
import com.sqms.repository.DoctorRepository;
import com.sqms.repository.QueueRepository;
import com.sqms.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ReportService {

    private final UserRepository userRepository;
    private final DoctorRepository doctorRepository;
    private final AppointmentRepository appointmentRepository;
    private final QueueRepository queueRepository;

    public Map<String, Object> getDailyReport() {
        LocalDate today = LocalDate.now();
        Map<String, Object> report = new HashMap<>();
        report.put("date", today.toString());
        report.put("totalPatients", userRepository.countByRole(Role.PATIENT));
        report.put("totalAppointments", appointmentRepository.countByAppointmentDate(today));
        report.put("completedAppointments", appointmentRepository.countByAppointmentDateAndStatus(
                today, AppointmentStatus.COMPLETED));
        report.put("activeQueues", queueRepository.count());
        return report;
    }

    public Map<String, Object> getWeeklyReport() {
        LocalDate today = LocalDate.now();
        LocalDate weekStart = today.minusDays(6);
        Map<String, Object> report = new HashMap<>();
        report.put("weekStart", weekStart.toString());
        report.put("weekEnd", today.toString());
        report.put("totalDoctors", doctorRepository.count());

        long weeklyTotal = 0;
        long weeklyCompleted = 0;
        for (int i = 0; i < 7; i++) {
            LocalDate date = weekStart.plusDays(i);
            weeklyTotal += appointmentRepository.countByAppointmentDate(date);
            weeklyCompleted += appointmentRepository.countByAppointmentDateAndStatus(
                    date, AppointmentStatus.COMPLETED);
        }
        report.put("totalAppointments", weeklyTotal);
        report.put("completedAppointments", weeklyCompleted);
        report.put("queueStatistics", queueRepository.count());
        return report;
    }

    public byte[] generatePdfReport() throws DocumentException {
        Map<String, Object> daily = getDailyReport();
        Map<String, Object> weekly = getWeeklyReport();

        ByteArrayOutputStream out = new ByteArrayOutputStream();
        Document document = new Document(PageSize.A4);
        PdfWriter.getInstance(document, out);
        document.open();

        Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 18);
        Font headerFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 12);

        document.add(new Paragraph("Smart Queue Management System", titleFont));
        document.add(new Paragraph("Hospital Report", titleFont));
        document.add(Chunk.NEWLINE);

        document.add(new Paragraph("Daily Report - " + daily.get("date"), headerFont));
        PdfPTable dailyTable = new PdfPTable(2);
        dailyTable.setWidthPercentage(100);
        addTableRow(dailyTable, "Total Patients", String.valueOf(daily.get("totalPatients")));
        addTableRow(dailyTable, "Today's Appointments", String.valueOf(daily.get("totalAppointments")));
        addTableRow(dailyTable, "Completed", String.valueOf(daily.get("completedAppointments")));
        addTableRow(dailyTable, "Active Queues", String.valueOf(daily.get("activeQueues")));
        document.add(dailyTable);
        document.add(Chunk.NEWLINE);

        document.add(new Paragraph("Weekly Report", headerFont));
        PdfPTable weeklyTable = new PdfPTable(2);
        weeklyTable.setWidthPercentage(100);
        addTableRow(weeklyTable, "Period", weekly.get("weekStart") + " to " + weekly.get("weekEnd"));
        addTableRow(weeklyTable, "Total Doctors", String.valueOf(weekly.get("totalDoctors")));
        addTableRow(weeklyTable, "Weekly Appointments", String.valueOf(weekly.get("totalAppointments")));
        addTableRow(weeklyTable, "Completed", String.valueOf(weekly.get("completedAppointments")));
        document.add(weeklyTable);

        document.close();
        return out.toByteArray();
    }

    public byte[] generateExcelReport() throws Exception {
        Map<String, Object> daily = getDailyReport();
        Workbook workbook = new XSSFWorkbook();
        Sheet sheet = workbook.createSheet("Daily Report");

        Row header = sheet.createRow(0);
        header.createCell(0).setCellValue("Metric");
        header.createCell(1).setCellValue("Value");

        String[][] data = {
                {"Date", String.valueOf(daily.get("date"))},
                {"Total Patients", String.valueOf(daily.get("totalPatients"))},
                {"Today's Appointments", String.valueOf(daily.get("totalAppointments"))},
                {"Completed Appointments", String.valueOf(daily.get("completedAppointments"))},
                {"Active Queues", String.valueOf(daily.get("activeQueues"))}
        };

        for (int i = 0; i < data.length; i++) {
            Row row = sheet.createRow(i + 1);
            row.createCell(0).setCellValue(data[i][0]);
            row.createCell(1).setCellValue(data[i][1]);
        }

        sheet.autoSizeColumn(0);
        sheet.autoSizeColumn(1);

        ByteArrayOutputStream out = new ByteArrayOutputStream();
        workbook.write(out);
        workbook.close();
        return out.toByteArray();
    }

    private void addTableRow(PdfPTable table, String key, String value) {
        table.addCell(new PdfPCell(new Phrase(key)));
        table.addCell(new PdfPCell(new Phrase(value)));
    }
}
