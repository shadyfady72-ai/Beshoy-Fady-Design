import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import HomePage from '@/pages/HomePage';
import ProjectsPage from '@/pages/ProjectsPage';
import ProjectDetailPage from '@/pages/ProjectDetailPage';
import AdminGate from '@/components/admin/AdminGate';
import AdminOverview from '@/pages/admin/AdminOverview';
import AdminProjects from '@/pages/admin/AdminProjects';
import AdminCategories from '@/pages/admin/AdminCategories';
import AdminAbout from '@/pages/admin/AdminAbout';
import AdminServices from '@/pages/admin/AdminServices';
import AdminGallery from '@/pages/admin/AdminGallery';
import AdminContact from '@/pages/admin/AdminContact';
import AdminSettings from '@/pages/admin/AdminSettings';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/project/:slug" element={<ProjectDetailPage />} />
          <Route
            path="/admin"
            element={
              <AdminGate>
                <AdminOverview />
              </AdminGate>
            }
          />
          <Route
            path="/admin/projects"
            element={
              <AdminGate>
                <AdminProjects />
              </AdminGate>
            }
          />
          <Route
            path="/admin/categories"
            element={
              <AdminGate>
                <AdminCategories />
              </AdminGate>
            }
          />
          <Route
            path="/admin/about"
            element={
              <AdminGate>
                <AdminAbout />
              </AdminGate>
            }
          />
          <Route
            path="/admin/services"
            element={
              <AdminGate>
                <AdminServices />
              </AdminGate>
            }
          />
          <Route
            path="/admin/gallery"
            element={
              <AdminGate>
                <AdminGallery />
              </AdminGate>
            }
          />
          <Route
            path="/admin/contact"
            element={
              <AdminGate>
                <AdminContact />
              </AdminGate>
            }
          />
          <Route
            path="/admin/settings"
            element={
              <AdminGate>
                <AdminSettings />
              </AdminGate>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
