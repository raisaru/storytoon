import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Catalog from './pages/Catalog';
import Reader from './pages/Reader';
import AdminDashboard from './pages/AdminDashboard';
import Footer from './components/Footer';

function App() {
  // const [isAdmin, setIsAdmin] = useState(false);
  // Instead of useState(false), do this:
  const [isAdmin, setIsAdmin] = useState(() => {
    return localStorage.getItem('isAdmin') === 'true';
  });

  return (
    <Router>
      {/* Pass isAdmin state and setter function to Header */}
      <Header isAdmin={isAdmin} setIsAdmin={setIsAdmin} />

      <Routes>
        <Route path="/" element={<Catalog />} />
        <Route path="/read/:id" element={<Reader />} />

        {/* Protect Admin route: If not admin, redirect back to home/catalog */}
        <Route
          path="/admin"
          element={isAdmin ? <AdminDashboard /> : <Navigate to="/" />}
        />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;