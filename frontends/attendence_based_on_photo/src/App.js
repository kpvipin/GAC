import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Routes, Route, Navigate  } from "react-router-dom";
import { ROUTES } from "./routes";
import PrivateRoute from "./Components/PrivateRoute";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
           {/* Default redirect */}
          <Route path="/" element={<Navigate to="/employees/attendence" replace />} />
          {ROUTES.map(({ path, element, isPublic }) => (
            <Route
              key={path}
              path={path}
              element={isPublic ? element : <PrivateRoute>{element}</PrivateRoute>}
            />
          ))}
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
