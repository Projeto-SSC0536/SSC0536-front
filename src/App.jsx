import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import Header from "./components/Header";
import "./App.css";
import Layout from "./components/layout";
import ItemPage from "./pages/ItemPage";
import AssetsPage from "./pages/AssetsPage";
import NewAssetsPage from "./pages/NewAssetPage";
import AlmoxarifadoPage from "./pages/AlmoxarifadoPage";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/home" element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            } />
            <Route element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }>
              <Route path="/patrimonios" element={<AssetsPage />} />
              <Route path="/:patrimonios/:item" element={<ItemPage />} />
              <Route path="/:patrimonios/novo" element={<NewAssetsPage />} />
              <Route path="/almoxarifado" element={<AlmoxarifadoPage />} />
              <Route path="/:almoxarifado/:item" element={<ItemPage />} />
            </Route>
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
