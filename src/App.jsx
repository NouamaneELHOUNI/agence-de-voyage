import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Index, Login, ForgetPassword } from '@/pages'
function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Index />} />
        <Route path='/login' element={<Login />} />
        <Route path='/forget-password' element={<ForgetPassword />} />
      </Routes>
    </Router>
  )
}

export default App