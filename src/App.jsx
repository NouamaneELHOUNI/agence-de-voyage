import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Index, Login, ForgetPassword, Dashboard, Setting } from '@/pages'
import Layout from "@/layout/Layout";
import PrivateRoute from "@/routes/PrivateRoute";
import PublicRoute from "@/routes/PublicRoute";

function App() {
  return (
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
      </Routes>
    </Router>
  )
}

export default App