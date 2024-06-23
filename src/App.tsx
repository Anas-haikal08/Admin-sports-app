// src/App.tsx

import React from 'react';
import './shared/styles/crema.less';
import {
  AppContextProvider,
  AppLayout,
  AppLocaleProvider,
  AppThemeProvider,
  AuthRoutes,
} from './domain';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './pages/auth/context/AuthContext';
import SignIn from './pages/auth/sign-in';

import Tab0 from './pages/HomePage';

const AppContent = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      {!isAuthenticated ? (
        <>
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="*" element={<Navigate to="/sign-in" />} />
        </>
      ) : (
        <>

          <Route path="/" element={<AppLayout />}>
            <Route path="*" element={<Tab0 />} />
          </Route>
        </>
      )}
    </Routes>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <AppContextProvider>
        <AuthProvider>
          <AppThemeProvider>
            <AppLocaleProvider>

              <AppContent />

            </AppLocaleProvider>
          </AppThemeProvider>
        </AuthProvider>
      </AppContextProvider>
    </BrowserRouter>
  );
};

export default App;
