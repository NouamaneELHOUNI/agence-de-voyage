import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Index, Login, ForgetPassword, Dashboard, Setting, NotFound404 } from '@/pages'
import Layout from "@/layout/Layout";
import PrivateRoute from "@/routes/PrivateRoute";
import PublicRoute from "@/routes/PublicRoute";
import { ThemeProvider } from '@/hooks/useTheme'

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route element={<PublicRoute />}>
            <Route path='/' element={<Index />} />
            <Route path='/login' element={<Login />} />
            <Route path='/forget-password' element={<ForgetPassword />} />
          </Route>
          <Route element={<Layout />}>
            {/* Private routes */}
            <Route element={<PrivateRoute />}>
              <Route path='/dashboard' element={<Dashboard />} />
              <Route path='/setting' element={<Setting />} />
            </Route>
          </Route>
          {/* 404 Not Found route */}
          <Route path="*" element={<NotFound404 />} />
        </Routes>
      </Router>
    </ThemeProvider>
  )
}

export default App