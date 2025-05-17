import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Index, Login, ForgetPassword, Dashboard, Setting, NotFound404, Clients, AddClient, EditClient, ShowClient } from '@/pages'
import Layout from "@/layout/Layout";
import PrivateRoute from "@/routes/PrivateRoute";
import PublicRoute from "@/routes/PublicRoute";
import { ThemeProvider } from '@/hooks/useTheme'
import { Toaster } from '@/components/ui/toaster'

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
              <Route path='/clients' element={<Clients />} />
              <Route path='/clients/add' element={<AddClient />} />
              <Route path='/clients/edit/:id' element={<EditClient />} />
              <Route path='/clients/show/:id' element={<ShowClient />} />
              <Route path='/setting' element={<Setting />} />
            </Route>
          </Route>
          {/* 404 Not Found route */}
          <Route path="*" element={<NotFound404 />} />
        </Routes>
      </Router>
      <Toaster />
    </ThemeProvider>
  )
}

export default App