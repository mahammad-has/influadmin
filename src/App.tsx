import { useState } from 'react'
import reactLogo from './assets/react.svg'
import './App.css'
import { BrowserRouter, Route, Router, Routes } from 'react-router-dom'
import { Login } from './containers/Login'
import { ColorScheme, ColorSchemeProvider, MantineProvider } from '@mantine/core'
import { theme } from './theme'
import { Dashboard } from './containers/Dashboard'
import { Orders } from './containers/Orders'
import { Users } from './containers/Users'
import { Reports } from './containers/Reports'
import { Admin } from './containers/Admin'
import { AuthProvider } from './provider/AuthProvider'
import { NotificationsProvider } from '@mantine/notifications'
import ItemReports from './containers/Reports/items'
import ItemReportDetails from './containers/Reports/items/ItemReportDetails'
import CommentReports from './containers/Reports/comments'
import UserReports from './containers/Reports/users'
import InfluencerReports from './containers/Reports/influencers'
import UserReportDetails from './containers/Reports/users/UserReportDetails'
import CommentReportDetails from './containers/Reports/comments/CommentReportDetails'
import ReportPages from './Components/ReportPages'
import InfluencerReportDetails from './containers/Reports/influencers/InfluencerReportDetails'

function App() {
  const [colorScheme, setColorScheme] = useState<ColorScheme>('dark');
  const toggleColorScheme = (value?: ColorScheme) =>
    setColorScheme(value || (colorScheme === 'dark' ? 'light' : 'dark'));
  return (

    <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
      <MantineProvider theme={{ colorScheme }}>
        <NotificationsProvider>
          <BrowserRouter>
            <AuthProvider>
              <Routes>
                <Route path='/'>
                  <Route index element={<Login />} />
                  <Route path="dashboard" element={<Dashboard />}>
                    <Route index element={<ReportPages />} />
                    <Route path="orders" element={<Orders />} />
                    <Route path='users' element={<Users />} />
                    <Route path='reports'>
                      <Route path='items'  >
                        <Route index element={<ItemReports />} />
                        <Route path=':id' element={<ItemReportDetails />} />
                      </Route>
                      <Route path='comments'  >
                        <Route index element={<CommentReports />} />
                        <Route path=':id' element={<CommentReportDetails />} />
                      </Route>
                      <Route path='users'  >
                        <Route index element={<UserReports />} />
                        <Route path=':id' element={<UserReportDetails />} />
                      </Route>
                      <Route path='influencers'  >
                        <Route index element={<InfluencerReports />} />
                        <Route path=':id' element={<InfluencerReportDetails />} />
                      </Route>
                    </Route>
                    <Route path='admins' element={<Admin />} />
                  </Route>
                </Route>
              </Routes>
            </AuthProvider>
          </BrowserRouter>
        </NotificationsProvider>
      </MantineProvider>
    </ColorSchemeProvider>
  )
}

export default App
