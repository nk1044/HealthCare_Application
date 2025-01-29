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

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {path: '', element: <Home />, children: [
        {path: '', element: <Dashboard />},
        {path: '/user/profile', element: <Profile />},
        {path: '/user/settings', element: <Settings />},
        {path: '/about', element: <About />},
        {path: '/services', element: <Services />},
        {path: '/contact', element: <Contact />},
        {path: '/queue-page' ,element: <QueuePage/>},
        {path: '/add-to-queue' ,element: <AddToQueue/>},
      ]},
      {path: 'login-user', element: <Login />},
      {path: 'register-user', element: <Register />},
      {path: 'reset-user-password', element: <ResetPassword />},
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
