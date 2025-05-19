import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Index, Login, ForgetPassword, Dashboard, Setting, NotFound404, 
  Clients, AddClient, EditClient, ShowClient, 
  Flights, AddFlight, EditFlight, ShowFlight, 
  Hotels, AddHotel, EditHotel, ShowHotel,
  Packages, AddPackage, EditPackage, ShowPackage,
  Services, AddService, EditService, ShowService,
  Agencies, AddAgency, EditAgency, ShowAgency
} from '@/pages'
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
              <Route path='/dashboard/settings' element={<Setting />} />
              {/* Client Module */}
              <Route path='/dashboard/clients' element={<Clients />} />
              <Route path='/dashboard/clients/add' element={<AddClient />} />
              <Route path='/dashboard/clients/edit/:id' element={<EditClient />} />
              <Route path='/dashboard/clients/:id' element={<ShowClient />} />

              {/* Flight Module */}
              <Route path='/dashboard/flights' element={<Flights />} />
              <Route path='/dashboard/flights/add' element={<AddFlight />} />
              <Route path='/dashboard/flights/edit/:id' element={<EditFlight />} />
              <Route path='/dashboard/flights/show/:id' element={<ShowFlight />} />

              {/* Hotel Module */}
              <Route path='/dashboard/hotels' element={<Hotels />} />
              <Route path='/dashboard/hotels/add' element={<AddHotel />} />
              <Route path='/dashboard/hotels/edit/:id' element={<EditHotel />} />
              <Route path='/dashboard/hotels/show/:id' element={<ShowHotel />} />

              {/* Package Module */}
              <Route path='/dashboard/packages' element={<Packages />} />
              <Route path='/dashboard/packages/add' element={<AddPackage />} />
              <Route path='/dashboard/packages/edit/:id' element={<EditPackage />} />
              <Route path='/dashboard/packages/show/:id' element={<ShowPackage />} />

              {/* Service Module */}
              <Route path='/dashboard/services' element={<Services />} />
              <Route path='/dashboard/services/add' element={<AddService />} />
              <Route path='/dashboard/services/edit/:id' element={<EditService />} />
              <Route path='/dashboard/services/show/:id' element={<ShowService />} />

              {/* Agency Module */}
              <Route path='/dashboard/agencies' element={<Agencies />} />
              <Route path='/dashboard/agencies/add' element={<AddAgency />} />
              <Route path='/dashboard/agencies/edit/:id' element={<EditAgency />} />
              <Route path='/dashboard/agencies/show/:id' element={<ShowAgency />} />
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