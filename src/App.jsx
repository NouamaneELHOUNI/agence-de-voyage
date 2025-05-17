import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { 
   
  Login, 
  ForgetPassword, 
  Dashboard, 
  Setting, 
  NotFound404, 
  Clients, 
  AddClient, 
  EditClient, 
  ShowClient,
  Users,
  AddUser,
  EditUser,
  ShowUser
} from '@/pages'
import AboutPage from '@/pages/landing'
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
            <Route path='/login' element={<Login />} />
            <Route path='/forget-password' element={<ForgetPassword />} />
            <Route path='/about' element={<AboutPage />} />
          </Route>
          <Route element={<Layout />}>
            {/* Private routes */}
            <Route element={<PrivateRoute />}>
              <Route path='/dashboard' element={<Dashboard />} />
              
              {/* Client routes */}
              <Route path='/clients' element={<Clients />} />
              <Route path='/clients/add' element={<AddClient />} />
              <Route path='/clients/edit/:id' element={<EditClient />} />
              <Route path='/clients/show/:id' element={<ShowClient />} />
              
              {/* User management routes */}
              <Route path='/users' element={<Users />} />
              <Route path='/users/add' element={<AddUser />} />
              <Route path='/users/edit/:id' element={<EditUser />} />
              <Route path='/users/show/:id' element={<ShowUser />} />
              
              <Route path='/setting' element={<Setting />} />
            </Route>
          </Route>
          {/* Landing page route */}
          <Route path="/" element={<AboutPage />} />
          {/* 404 Not Found route */}
          <Route path="*" element={<NotFound404 />} />
        </Routes>
      </Router>
      <Toaster />
    </ThemeProvider>
  )
}

export default App