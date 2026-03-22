/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import { HomePage } from './pages/HomePage';
import { SearchPage } from './pages/SearchPage';
import { MessagesPage } from './pages/MessagesPage';
import { ChatPage } from './pages/ChatPage';
import { ProfilePage } from './pages/ProfilePage';
import { LocationDetailPage } from './pages/LocationDetailPage';
import { ExcursionDetailPage } from './pages/ExcursionDetailPage';
import { ExperienceDetailPage } from './pages/ExperienceDetailPage';
import { EventDetailPage } from './pages/EventDetailPage';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { OnboardingPage } from './pages/OnboardingPage';
import { AuthPage } from './pages/AuthPage';
import { BecomePartnerPage } from './pages/BecomePartnerPage';
import { ManageGuideProfilePage } from './pages/ManageGuideProfilePage';
import { FavoritesPage } from './pages/FavoritesPage';
import { ManageExcursionsPage } from './pages/ManageExcursionsPage';
import { CreateExcursionPage } from './pages/CreateExcursionPage';
import { ExcursionsPage } from './pages/ExcursionsPage';
import { ExperiencesPage } from './pages/ExperiencesPage';
import { EventsPage } from './pages/EventsPage';
import { SettingsPage } from './pages/SettingsPage';
import { NotificationsPage } from './pages/NotificationsPage';
import { PrivacySecurityPage } from './pages/PrivacySecurityPage';
import { HelpSupportPage } from './pages/HelpSupportPage';
import { GuideProfilePage } from './pages/GuideProfilePage';
import { PlansPage } from './pages/PlansPage';
import { DashboardPage } from './pages/DashboardPage';
import { CreateEventPage } from './pages/CreateEventPage';
import { CreateExperiencePage } from './pages/CreateExperiencePage';
import { ManagePublicationsPage } from './pages/ManagePublicationsPage';
import { PerformancePage } from './pages/PerformancePage';
import { SuggestPlacePage } from './pages/SuggestPlacePage';

function AppRoutes() {
  const { user, isGuest, loading, profile } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#2EC4B6] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Se não estiver autenticado e não for visitante, vai para o onboarding/auth
  if (!user && !isGuest) {
    return (
      <Routes>
        <Route path="/onboarding" element={<OnboardingPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="*" element={<Navigate to="/onboarding" replace />} />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<AppLayout />}>
        <Route index element={<HomePage />} />
        <Route path="search" element={<SearchPage />} />
        <Route path="messages" element={<MessagesPage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="favorites" element={<FavoritesPage />} />
        <Route path="excursions" element={<ExcursionsPage />} />
        <Route path="experiences" element={<ExperiencesPage />} />
        <Route path="events" element={<EventsPage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="notifications" element={<NotificationsPage />} />
        <Route path="privacy" element={<PrivacySecurityPage />} />
        <Route path="support" element={<HelpSupportPage />} />
        <Route path="guide/:id" element={<GuideProfilePage />} />
        <Route path="location/:id" element={<LocationDetailPage />} />
        <Route path="excursion/:id" element={<ExcursionDetailPage />} />
        <Route path="experience/:id" element={<ExperienceDetailPage />} />
        <Route path="event/:id" element={<EventDetailPage />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
      <Route path="/chat/:chatId" element={<ChatPage />} />
      <Route path="/become-partner" element={<BecomePartnerPage />} />
      <Route path="/manage-guide" element={<ManageGuideProfilePage />} />
      <Route path="/manage-excursions" element={<ManageExcursionsPage />} />
      <Route path="/create-excursion" element={<CreateExcursionPage />} />
      <Route path="/create-event" element={<CreateEventPage />} />
      <Route path="/create-experience" element={<CreateExperiencePage />} />
      <Route path="/manage-publications" element={<ManagePublicationsPage />} />
      <Route path="/performance" element={<PerformancePage />} />
      <Route path="/suggest-place" element={<SuggestPlacePage />} />
      <Route path="/plans" element={<PlansPage />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}
