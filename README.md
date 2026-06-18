# Smart Queue Management System (SQMS)

A full-stack hospital queue management system built with **Spring Boot 3** and **React + Vite**.

## Features

- **Patient Portal**: Register, book appointments, track queue in real-time, view history
- **Doctor Portal**: View schedule, manage queue, mark appointments complete
- **Admin Dashboard**: Analytics with Chart.js, manage doctors/schedules, generate PDF/Excel reports
- **Real-Time Updates**: WebSocket-powered live queue tracking
- **JWT Authentication**: Secure role-based access (Patient, Doctor, Admin)
- **Email Notifications**: Appointment confirmations, cancellations, OTP password reset
- **Dark Mode**: Theme toggle across dashboards

## Tech Stack

| Layer | Technologies |
|-------|-------------|
| Backend | Java 17, Spring Boot 3, Spring Security, JWT, JPA/Hibernate, WebSocket, OpenPDF, Apache POI |
| Frontend | React 19, Vite, Tailwind CSS, Material UI Icons, Framer Motion, Chart.js, React Query |
| Database | H2 (dev) / MySQL (production) |

## Project Structure

```
SQMS/
├── backend/
│   └── src/main/java/com/sqms/
│       ├── controller/    # REST API endpoints
│       ├── service/       # Business logic
│       ├── repository/    # Data access
│       ├── entity/        # JPA entities
│       ├── dto/           # Request/Response objects
│       ├── security/      # JWT authentication
│       ├── websocket/     # Real-time queue updates
│       ├── config/        # Security, WebSocket, data seeding
│       └── exception/     # Global error handling
└── frontend/
    └── src/
        ├── pages/         # Landing, Auth, Patient, Doctor, Admin pages
        ├── components/    # Reusable UI components
        ├── layouts/       # Dashboard layout with sidebar
        ├── services/      # API client (Axios)
        ├── contexts/      # Auth & Theme providers
        └── routes/        # React Router configuration
```

## Getting Started

### Prerequisites

- Java 17+
- Maven 3.8+
- Node.js 18+
- MySQL 8+ (optional, H2 used by default)

### Backend

```bash
cd backend
mvn spring-boot:run
```

Server starts at `http://localhost:8080`

H2 Console: `http://localhost:8080/h2-console` (JDBC URL: `jdbc:h2:mem:sqmsdb`)

### Frontend

```bash
cd frontend
npm install
npm run dev
```

App runs at `http://localhost:5173`

### MySQL Configuration

Uncomment MySQL settings in `backend/src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/sqms?createDatabaseIfNotExist=true
spring.datasource.username=root
spring.datasource.password=yourpassword
```

Comment out the H2 datasource lines.

For manual MySQL setup, run `backend/sql/mysql-schema.sql` in MySQL Workbench (do not place it in `src/main/resources` — Spring Boot would try to run it automatically).

## Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@sqms.com | admin123 |
| Doctor | sarah@hospital.com | doctor123 |
| Patient | patient@sqms.com | patient123 |

## API Endpoints

### Authentication
- `POST /api/auth/register` - Patient registration
- `POST /api/auth/login` - Login (returns JWT)
- `POST /api/auth/forgot-password` - Send OTP
- `POST /api/auth/reset-password` - Reset with OTP

### Doctors
- `GET /api/doctors` - List/search doctors
- `POST /api/doctors` - Create doctor (Admin)
- `PUT /api/doctors/{id}` - Update doctor
- `DELETE /api/doctors/{id}` - Delete doctor

### Appointments
- `POST /api/appointments` - Book appointment
- `GET /api/appointments` - List appointments
- `PUT /api/appointments/cancel/{id}` - Cancel appointment

### Queue
- `GET /api/queue/status/{appointmentId}` - Queue status
- `GET /api/queue/current?doctorId=` - Current queue
- `POST /api/queue/serve-next?doctorId=` - Serve next patient

### Reports
- `GET /api/reports/daily` - Daily statistics
- `GET /api/reports/weekly` - Weekly statistics
- `GET /api/reports/pdf` - Download PDF report
- `GET /api/reports/excel` - Download Excel report

### WebSocket
- `ws://localhost:8080/ws/queue?doctorId={id}` - Live queue updates

## Queue Token Format

```
DOC-2026-001
DOC-2026-002
DOC-2026-003
```

## Waiting Time Algorithm

```
waitingTime = patientsAhead × averageConsultationTime (default: 5 minutes)
```

## Color Palette

| Color | Hex |
|-------|-----|
| Primary | #2563EB |
| Secondary | #14B8A6 |
| Accent | #8B5CF6 |
| Success | #22C55E |
| Warning | #F59E0B |
| Danger | #EF4444 |

## License

Academic project for coursework purposes.
