## The Problem
A developer builds a website, mobile app, or even a CLI and needs to collect user data, such as bug reports. Normally, this requires building a custom backend to receive those submissions and a UI to manage them. It’s a lot of overhead for a simple task, and the developer is frustrated 🥴.

## The Solution
**AnyPost** allows developers to create an endpoint that accepts any `POST` request instantly. You are only responsible for building your beautiful UI; AnyPost handles the data. It accepts any request `body` with zero field configuration required. AnyPost also includes a sleek dashboard where you can view submissions and export them as CSV.

#### Tech Stack
- **Spring Boot**
- **MongoDB**
- **Next.js + shadcn/ui**

### Key Features (cuurent 1.0 MVP)
- **Secure API:** JWT Authentication integrated with Spring Security.
- **Project Organization:** Use projects to structure multiple forms; each form is associated with a specific project (up to 3 projects).
- **Unique Endpoints:** Each form features a unique endpoint that accepts `POST` requests with a non-empty body. Forms can be activated or deactivated at any time.
- **Comprehensive Dashboard:** Includes project/form navigation, integration instructions, CRUD operations, and analytics for the last 7 days.
- **Advanced Submissions Table:** Features a robust filtering system and built-in pagination for easy data management, and of course data can be exported as csv.

### How to run
Comming soon
