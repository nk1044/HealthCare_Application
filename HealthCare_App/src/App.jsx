import { useState } from 'react'
import {RouterProvider, createBrowserRouter} from 'react-router-dom'
import Home from './Pages/Home';
import Layout from './Pages/Layout';
import Login from './Pages/Login';
import Register from './Pages/Register';
import FrontPage from './Pages/Dashboard';
import ResetPassword from './Pages/ResetPassword';
import Dashboard from './Pages/Dashboard';
import Profile from './Pages/Profile';
import Settings from './Pages/Settings';
import Services from './Pages/Services';
import About from './Pages/About';
import Contact from './Pages/Contact';
import QueuePage from './Pages/QueuePage';
import AddToQueue from './Pages/AddToQueue';
import VideoCall from './Pages/VideoCall';
import Auth from './Components/Auth';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {path: '', element: <Home />, children: [
        {path: '', element: <Dashboard />},
        {path: '/user/profile', element: <Auth> <Profile /> </Auth>},
        {path: '/user/settings', element: <Auth> <Settings /> </Auth>},
        {path: '/about', element: <About />},
        {path: '/services', element: <Services />},
        {path: '/contact', element: <Contact />},
        {path: '/queue-page' ,element: <Auth> <QueuePage/> </Auth>},
        {path: '/add-to-queue' ,element: <Auth> <AddToQueue/> </Auth>},
        {path: '/video-call' ,element: <Auth> <VideoCall/> </Auth>},
      ]},
      {path: 'login-user', element: <Login />},
      {path: 'register-user', element: <Register />},
      {path: 'reset-user-password', element: <Auth> <ResetPassword /> </Auth>},
    ]
  }
])

function App() {

  return (
    <>
    <RouterProvider router={router} />
  </>
  )
}

export default App
