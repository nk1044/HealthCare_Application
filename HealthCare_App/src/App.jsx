import { Suspense, lazy } from 'react';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import Layout from './Pages/Layout';
import Auth from './Components/Auth';
import Loading from './Pages/Loading';
import NotFound from './Pages/NotFound';

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
// <Loading/>
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
          { path: '', element: <Suspense fallback={<Loading/>}><Dashboard /></Suspense> },
          { path: '/user/profile', element: <Suspense fallback={<Loading/>}><Auth><Profile /></Auth></Suspense> },
          { path: '/user/settings', element: <Suspense fallback={<Loading/>}><Auth><Settings /></Auth></Suspense> },
          { path: '/about', element: <Suspense fallback={<Loading/>}><About /></Suspense> },
          { path: '/services', element: <Suspense fallback={<Loading/>}><Services /></Suspense> },
          { path: '/contact', element: <Suspense fallback={<Loading/>}><Contact /></Suspense> },
          { path: '/queue-page', element: <Suspense fallback={<Loading/>}><Auth><QueuePage /></Auth></Suspense> },
          { path: '/add-to-queue', element: <Suspense fallback={<Loading/>}><Auth><AddToQueue /></Auth></Suspense> },
        ],
      },
      { path: 'login-user', element: <Suspense fallback={<Loading/>}><Login /></Suspense> },
      { path: 'register-user', element: <Suspense fallback={<Loading/>}><Register /></Suspense> },
      { path: 'reset-user-password', element: <Suspense fallback={<Loading/>}><Auth><ResetPassword /></Auth></Suspense> },
      { path: '/video-call', element: <Suspense fallback={<Loading/>}><Auth><VideoCall /></Auth></Suspense> },
    ],
  },
  { path: '*', element: <NotFound /> },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
