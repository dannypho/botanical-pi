import { useState } from 'react';
import { LoginPage } from './components/LoginPage';
import { Dashboard } from './components/Dashboard';
import { Signup } from './components/SignupPage';

export default function App() {
  const [page, setPage] = useState<"login" | "signup" | "dashboard">("login");

  return (
    <>
      {page === "login" && (
        <LoginPage
          onLogin={() => setPage("dashboard")}
          goToSignup={() => setPage("signup")}   // ✅ ADD THIS
        />
      )}

      {page === "signup" && (
        <Signup
          onSignup={() => setPage("dashboard")}
          goToLogin={() => setPage("login")}     // ✅ ADD THIS
        />
      )}

      {page === "dashboard" && (
        <Dashboard
          onLogout={() => setPage("login")}
        />
      )}
    </>
  );
}