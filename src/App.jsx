import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import EnquiriesPage from './pages/EnquiriesPage';
import GalleryAdminPage from './pages/GalleryAdminPage';
import TeamAdminPage from './pages/TeamAdminPage';
import InternshipsAdminPage from './pages/InternshipsAdminPage';
import CoursesAdminPage from './pages/CoursesAdminPage';
import SettingsPage from './pages/SettingsPage';
import { getEnquiries, getCollectionItems } from './services/adminService';
import { initFirebase } from './firebase';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('yukti_admin_auth') === 'true';
  });

  const [activeTab, setActiveTab] = useState('dashboard');
  const [enquiries, setEnquiries] = useState([]);
  const [stats, setStats] = useState({
    enquiriesCount: 0,
    newEnquiriesCount: 0,
    photosCount: 0,
    videosCount: 0,
    teamCount: 0,
    internshipsCount: 0,
    coursesCount: 0
  });
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadAllData = async () => {
    try {
      setIsRefreshing(true);
      const [
        fetchedEnquiries, 
        photos, 
        videos, 
        team, 
        roles, 
        courses
      ] = await Promise.all([
        getEnquiries().catch(() => []),
        getCollectionItems('gallery_photos', 'createdAt', 'desc').catch(() => []),
        getCollectionItems('gallery_videos', 'createdAt', 'desc').catch(() => []),
        getCollectionItems('team_members', 'order', 'asc').catch(() => []),
        getCollectionItems('internship_roles', 'createdAt', 'desc').catch(() => []),
        getCollectionItems('courses', 'createdAt', 'desc').catch(() => [])
      ]);

      setEnquiries(fetchedEnquiries);
      const newCount = fetchedEnquiries.filter(e => (e.status || 'new') === 'new').length;

      setStats({
        enquiriesCount: fetchedEnquiries.length,
        newEnquiriesCount: newCount,
        photosCount: photos.length,
        videosCount: videos.length,
        teamCount: team.length,
        internshipsCount: roles.length,
        coursesCount: courses.length
      });
    } catch (err) {
      console.error('Error loading admin overview data:', err);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadAllData();
      // Auto-refresh enquiries every 45 seconds
      const interval = setInterval(loadAllData, 45000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  const handleLogout = () => {
    localStorage.removeItem('yukti_admin_auth');
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return <LoginPage onLogin={() => setIsAuthenticated(true)} />;
  }

  const getPageMeta = () => {
    switch (activeTab) {
      case 'dashboard':
        return { title: 'Dashboard Overview', subtitle: 'Live telemetry and website metrics' };
      case 'enquiries':
        return { title: 'Enquiries & Lead Management', subtitle: 'Manage submissions from website forms' };
      case 'gallery':
        return { title: 'Photo & Video Gallery', subtitle: 'Upload and edit gallery media' };
      case 'team':
        return { title: 'Meet the Team', subtitle: 'Executive leadership, faculty & mentors' };
      case 'internships':
        return { title: 'Internships & Careers', subtitle: 'Job openings and student technology tracks' };
      case 'courses':
        return { title: 'Course Management', subtitle: 'Add dynamic IT courses and syllabus tracks' };
      case 'settings':
        return { title: 'Configuration & Keys', subtitle: 'Firebase Firestore & Cloudinary credentials' };
      default:
        return { title: 'Admin Center', subtitle: '' };
    }
  };

  const meta = getPageMeta();

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-800 font-sans">
      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLogout={handleLogout}
        newEnquiriesCount={stats.newEnquiriesCount}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        <Header
          title={meta.title}
          subtitle={meta.subtitle}
          onRefresh={loadAllData}
          isRefreshing={isRefreshing}
        />

        <main className="flex-1 overflow-y-auto pb-12">
          {activeTab === 'dashboard' && (
            <DashboardPage
              stats={stats}
              setActiveTab={setActiveTab}
              enquiries={enquiries}
            />
          )}

          {activeTab === 'enquiries' && (
            <EnquiriesPage
              enquiries={enquiries}
              onRefresh={loadAllData}
              isLoading={isRefreshing}
            />
          )}

          {activeTab === 'gallery' && (
            <GalleryAdminPage />
          )}

          {activeTab === 'team' && (
            <TeamAdminPage />
          )}

          {activeTab === 'internships' && (
            <InternshipsAdminPage />
          )}

          {activeTab === 'courses' && (
            <CoursesAdminPage />
          )}

          {activeTab === 'settings' && (
            <SettingsPage onConfigUpdated={loadAllData} />
          )}
        </main>
      </div>
    </div>
  );
}
