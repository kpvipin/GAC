import LoginPage from "./Pages/LoginPage";
import EmployeeAttendencePage from "./Pages/EmployeeAttendencePage";
import EmplpoyeeAddPage from "./Pages/EmployeeAddPage";
import EmplpoyeeDetailPage from "./Pages/EmpoyeeDetailPage";
// Route definitions
export const ROUTES = [
    {
        path: "/login",
        element: <LoginPage />,
        isPublic: true,
    },
    {
        path: "/employees/attendence",
        element: <EmployeeAttendencePage />,
        isPublic: false,
    },
    {
        path: "/employee/:id",
        element: <EmplpoyeeDetailPage />,
        isPublic: false,
    },
    {
        path: "/employees/add",
        element: <EmplpoyeeAddPage />,
        isPublic: false,
    }
];

// Optional helper: public/private filtered routes
export const PUBLIC_ROUTES = ROUTES.filter((r) => r.isPublic);
export const PRIVATE_ROUTES = ROUTES.filter((r) => !r.isPublic);
