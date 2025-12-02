This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.


# API Specification (Updated for Merged Users & JSONB Breaks)

## 1. Auth & User Management

### POST /auth/register
Create tenant + first admin user (`can_login = true`).

### POST /auth/login
Authenticate user and return JWT token.

### POST /auth/logout

### GET /auth/me
Return the currently authenticated user.

---

## 2. Tenant APIs

### GET /tenants
List all tenants (super admin only).

### GET /tenants/:id
Get tenant details.

### PATCH /tenants/:id
Update tenant name or plan.

---

## 3. User / Employee Management

Employees are now **users** with `is_employee = true`  
Login users have `can_login = true`.

### POST /users
Create a user or employee.

**Example Body**
```json
{
  "full_name": "John Doe",
  "phone": "9876543210",
  "email": "john@example.com",
  "can_login": false,
  "role": "mechanic",
  "joining_date": "2025-01-12",
  "base_salary": 20000,
  "hourly_rate": 200,
  "manager_id": "uuid"
}
```

### GET /users
Query filters:
- is_employee=true/false
- can_login=true/false
- role
- active=true/false

### GET /users/:id
Get user profile.

### PATCH /users/:id
Update user details.

### DELETE /users/:id
Soft delete (sets `deleted_at`).

### PATCH /users/:id/activate

### PATCH /users/:id/deactivate

---

## 4. Working Days Management

### PATCH /users/:id/working-days
Update working days.

**Body**
```json
{
  "working_days": ["MON", "TUE", "WED", "THU", "FRI"]
}
```

### GET /users/:id/working-days

---

## 5. Attendance Sessions

### POST /attendance/check-in
Create attendance session.

**Body**
```json
{
  "user_id": "uuid",
  "check_in_time": "2025-12-01T09:45:00Z"
}
```

### POST /attendance/check-out
Complete session and compute totals.

### GET /attendance/session/:id
Return a single session including its breaks JSON.

### GET /attendance/sessions
Query filters:
- user_id
- date range
- incomplete only
- pagination

---

## 6. Break API (JSONB Based)

### POST /attendance/break/start
Start a break.

**Body**
```json
{
  "session_id": "uuid",
  "start": "2025-12-01T13:00:00Z"
}
```

### POST /attendance/break/end
End last break.

**Body**
```json
{
  "session_id": "uuid",
  "end": "2025-12-01T13:30:00Z"
}
```

### GET /attendance/session/:id/breaks
Return the `breaks` array.

---

## 7. Reports & Salary

### GET /reports/attendance/user/:user_id
Get attendance summary for one user.

### GET /reports/attendance
Global attendance summary.

### GET /reports/salary/:user_id
Salary calculation for a single user.

### GET /reports/salary
Salary report for all users.

---

## 8. Admin Tools

### POST /attendance/fix-session
Fix incorrect session times.

### POST /attendance/fix-break
Fix break entry inside JSON array.

### POST /users/bulk-upload
Bulk upload user/employee data.

### POST /reports/export
Export attendance/salary reports.
