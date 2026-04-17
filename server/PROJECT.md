
## 1. Project Overview
- **Core Purpose:** AnyPost is a form management and submission platform that allows users to create projects, build custom forms within those projects, and collect/manage submissions from external users. It provides a backend API for organizing user-submitted data in a structured, project-based hierarchy.
- **Primary Tech Stack:** Java 17, Spring Boot 4.0.3, Spring Security with JWT authentication, MongoDB (with Spring Data MongoDB), Thymeleaf templates, Lombok, Spring Validation.
- **Architecture Style:** Monolithic RESTful API following a layered MVC architecture with Controller → Service → Repository pattern.

---

## 2. Core Features

### **User Authentication & Authorization**
- **Logic Location:** `AuthenticationController.java`, `UserDetailServiceImpl.java`, `JwtUtil.java` (in security package), `UserRepository.java`
- **Business Value:** Secure user registration, login with JWT-based authentication stored in HTTP-only cookies, email verification workflow, password reset functionality, and session management.

### **Project Management**
- **Logic Location:** `ProjectController.java`, `ProjectService.java`, `ProjectRepository.java`, `Project.java` entity
- **Business Value:** Users can create, read, update, and delete projects with unique names per owner. Projects serve as containers for organizing multiple forms.

### **Form Builder**
- **Logic Location:** `FormController.java`, `FormService.java`, `FormRepository.java`, `Form.java` entity
- **Business Value:** Users can create custom forms within projects, update form configurations, and manage form lifecycle (CRUD operations). Forms are project-scoped and owner-protected.

### **Submission Collection**
- **Logic Location:** `SubmissionController.java`, `SubmissionService.java`, `SubmissionRepository.java`, `Submission.java` entity, `FormController.getFormSubmissions()`
- **Business Value:** External users can submit data to published forms via a public endpoint (`/f/{form_id}`). Form owners can view paginated submissions for their forms.

### **Email Notifications**
- **Logic Location:** `MailService.java`, event listeners in `event/` package (`OnRegistrationCompleteEvent`, `OnPasswordResetEvent`)
- **Business Value:** Automated email delivery for account verification and password reset workflows using Spring's event-driven architecture.

---

## 3. API Surface & Endpoints

| Method | Path | Description | Controller/File |
| :--- | :--- | :--- | :--- |
| POST | `/api/v1/auth/signup` | Register new user account | AuthenticationController.java |
| POST | `/api/v1/auth/signin` | Authenticate user and set JWT cookie | AuthenticationController.java |
| POST | `/api/v1/auth/logout` | Clear authentication cookie | AuthenticationController.java |
| POST | `/api/v1/auth/verify` | Verify email with token | AuthenticationController.java |
| POST | `/api/v1/auth/send-verification-email` | Resend verification email | AuthenticationController.java |
| POST | `/api/v1/auth/forgot-password` | Request password reset | AuthenticationController.java |
| POST | `/api/v1/auth/reset-password` | Reset password with token | AuthenticationController.java |
| GET | `/api/v1/auth/whoami` | Get current authenticated user | AuthenticationController.java |
| GET | `/api/v1/projects` | Fetch all projects for authenticated user | ProjectController.java |
| GET | `/api/v1/projects/{id}` | Get specific project by ID | ProjectController.java |
| POST | `/api/v1/projects` | Create new project | ProjectController.java |
| PUT | `/api/v1/projects/{id}` | Update project details | ProjectController.java |
| DELETE | `/api/v1/projects/{id}` | Delete project | ProjectController.java |
| GET | `/api/v1/projects/{project_id}/forms` | Get all forms in a project | FormController.java |
| GET | `/api/v1/projects/{project_id}/forms/{form_id}` | Get specific form | FormController.java |
| POST | `/api/v1/projects/{project_id}/forms` | Create new form in project | FormController.java |
| PUT | `/api/v1/projects/{project_id}/forms/{form_id}` | Update form configuration | FormController.java |
| DELETE | `/api/v1/projects/{project_id}/forms/{form_id}` | Delete form | FormController.java |
| GET | `/api/v1/projects/{project_id}/forms/{form_id}/submissions` | Get paginated submissions for a form | FormController.java |
| POST | `/f/{form_id}` | Public endpoint to submit form data | SubmissionController.java |

---

## 4. Key Dependencies

- **Spring Boot Starter Web MVC** – RESTful API framework
- **Spring Boot Starter Security** – Authentication and authorization
- **Spring Boot Starter Data MongoDB** – NoSQL database integration
- **JWT (jjwt 0.12.3)** – JSON Web Token generation and validation for stateless authentication
- **Spring Boot Starter Validation** – Bean validation with Jakarta Validation
- **Spring Boot Actuator** – Monitoring and health checks
- **Lombok** – Boilerplate reduction (getters, setters, builders)
- **Spring Boot Starter Thymeleaf** – Templating engine (likely for email templates)
- **Spring Boot Starter WebFlux** – Reactive web client (possibly for external service calls)

---

## 5. Entry Points & Flow

- **Main Entry Point:** `AnyPostApplication.java` – Spring Boot application with `@SpringBootApplication` and `@EnableMongoAuditing` annotations.

- **Standard Request Flow (Authenticated):**
    1. Request arrives with JWT in HTTP-only cookie
    2. Spring Security filter chain validates JWT via `JwtUtil`
    3. Request routed to appropriate `@RestController`
    4. Controller delegates business logic to Service layer (`ProjectService`, `FormService`, etc.)
    5. Service performs authorization checks (e.g., user owns project), validates input
    6. Repository layer interacts with MongoDB via Spring Data MongoDB
    7. Response wrapped in `ApiResponse<T>` DTO and returned to client

- **Public Submission Flow (Unauthenticated):**
    1. External user POSTs to `/f/{form_id}` with form data
    2. `SubmissionController` receives request without authentication
    3. `SubmissionService` validates form existence and stores submission in MongoDB
    4. Confirmation response returned to submitter