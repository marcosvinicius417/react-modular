import { Route, Routes } from "react-router-dom";
import Home from "../modules/home/views/Home";

const AppRoutes: React.FC = () => {
  // const { isLoggedIn } = useAuth();

  return (
    <Routes>
      <Route path="/" element={<Home />} />

      {/* <Route
          path="/autenticacao/login-usuario-externo"
          element={
            <RestrictedRoute isAuthenticated={isLoggedIn}>
              <LoginExternoPage />
            </RestrictedRoute>
          }
        /> */}

      {/* <Route
          path="/gestao-conhecimento/*"
          element={
            <ProtectedRoute isAuthenticated={isLoggedIn}>
              <GestaoConhecimentoLayout />
            </ProtectedRoute>
          }
        /> */}

      {/* <Route
          path="/sistema-gestao-integrada/*"
          element={
            <ProtectedRoute isAuthenticated={isLoggedIn}>
              <SistemaGestaoIntegradaLayout />
            </ProtectedRoute>
          }
        /> */}

      {/* <Route
          path="/empresa-terceirizada/*"
          element={
            <ProtectedRoute isAuthenticated={isLoggedIn}>
              <EmpresaTerceirizadaLayout />
            </ProtectedRoute>
          }
        /> */}

      {/* <Route
          path="/relatorios/*"
          element={
            <ProtectedRoute isAuthenticated={isLoggedIn}>
              <RelatoriosLayout />
            </ProtectedRoute>
          }
        /> */}
    </Routes>
  );
};

export default AppRoutes;
