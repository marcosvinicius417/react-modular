import { BrowserRouter as Router } from "react-router-dom";
import "./App.css";
import { AuthProvider } from "./modules/auth/AuthProvider";
import Routes from "./routes/Routes";

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes />
      </Router>
    </AuthProvider>
  );
};

export default App;
