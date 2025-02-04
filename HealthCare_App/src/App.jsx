import { Suspense, lazy } from 'react';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import Layout from './Pages/Layout';
import Auth from './Components/Auth';
import Loading from './Pages/Loading';

// Lazy load all pages
const Home = lazy(() => import('./Pages/Home'));
const Login = lazy(() => import('./Pages/Login'));
const Register = lazy(() => import('./Pages/Register'));
const ResetPassword = lazy(() => import('./Pages/ResetPassword'));
const Dashboard = lazy(() => import('./Pages/Dashboard'));
const Profile = lazy(() => import('./Pages/Profile'));
const Settings = lazy(() => import('./Pages/Settings'));
const Services = lazy(() => import('./Pages/Services'));
const About = lazy(() => import('./Pages/About'));
const Contact = lazy(() => import('./Pages/Contact'));
const QueuePage = lazy(() => import('./Pages/QueuePage'));
const AddToQueue = lazy(() => import('./Pages/AddToQueue'));
const VideoCall = lazy(() => import('./Pages/VideoCall'));

// Define router with lazy-loaded components
const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        path: '',
        element: <Suspense fallback={<Loading/>}><Home /></Suspense>,
        children: [
          { path: '', element: <Suspense fallback={<div>Loading...</div>}><Dashboard /></Suspense> },
          { path: '/user/profile', element: <Suspense fallback={<div>Loading...</div>}><Auth><Profile /></Auth></Suspense> },
          { path: '/user/settings', element: <Suspense fallback={<div>Loading...</div>}><Auth><Settings /></Auth></Suspense> },
          { path: '/about', element: <Suspense fallback={<div>Loading...</div>}><About /></Suspense> },
          { path: '/services', element: <Suspense fallback={<div>Loading...</div>}><Services /></Suspense> },
          { path: '/contact', element: <Suspense fallback={<div>Loading...</div>}><Contact /></Suspense> },
          { path: '/queue-page', element: <Suspense fallback={<div>Loading...</div>}><Auth><QueuePage /></Auth></Suspense> },
          { path: '/add-to-queue', element: <Suspense fallback={<div>Loading...</div>}><Auth><AddToQueue /></Auth></Suspense> },
          // { path: '/video-call', element: <Suspense fallback={<div>Loading...</div>}><Auth><VideoCall /></Auth></Suspense> },
        ],
      },
      { path: 'login-user', element: <Suspense fallback={<div>Loading...</div>}><Login /></Suspense> },
      { path: 'register-user', element: <Suspense fallback={<div>Loading...</div>}><Register /></Suspense> },
      { path: 'reset-user-password', element: <Suspense fallback={<div>Loading...</div>}><Auth><ResetPassword /></Auth></Suspense> },
      { path: '/video-call', element: <Suspense fallback={<div>Loading...</div>}><Auth><VideoCall /></Auth></Suspense> },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
