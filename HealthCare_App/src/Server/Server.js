import axios from "axios";
import { useUser } from '../Store/zustand.js';

axios.defaults.withCredentials = true;

const backend_url = String(import.meta.env.VITE_BACKEND_URI);

axios.interceptors.request.use(
  (config) => {
    const token = useUser.getState().token;
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const handleAuthResponse = (response) => {
  if (response?.data?.cookie) {
    const token = response.data.cookie;
    useUser.setState((state) => ({
      ...state,
      token: token 
    }));
    return response.data.user ?? null;
  }
  return null;
};

const GoogleAuthLogin = async (response) => {
  const { credential } = response;
  try {
    const data = await axios.post(
      `${backend_url}/api/users/google-auth`,
      { token: credential }
    );
    return handleAuthResponse(data);
  } catch (err) {
    console.log('Google authentication failed or user already exists', err);
    throw err;
  }
};

const LoginUser = async (data) => {
  try {
    const response = await axios.post(
      `${backend_url}/api/users/login-user`, 
      { ...data }, 
      { withCredentials: true }
    );
    console.log(response.data);
    
    return handleAuthResponse(response);
  } catch (err) {
    console.log('LoginUser failed', err);
    return { status: 400, error: err?.response?.data?.message };
  }
};

const RegisterUser = async (data) => {
  try {
    const response = await axios.post(
      `${backend_url}/api/users/register-user`, 
      { ...data }, 
      { withCredentials: true }
    );
    
    return handleAuthResponse(response);
  } catch (err) {
    console.log('RegisterUser failed', err);
    throw err;
  }
};

const LogOut = async () => {
  try {
    const data = await axios.get(
      `${backend_url}/api/users/logout-user`, 
      { withCredentials: true }
    );
    
    return data;
  } catch (err) {
    console.log('Logout failed', err);
    throw err;
  }
};

const GetCurrentUser = async () => {
  try {
    const response = await axios.get(
      `${backend_url}/api/users/get-current-user`, 
      { withCredentials: true }
    );
    
    return response?.data?.user;
  } catch (error) {
    console.log('GetCurrentUser failed', error?.response?.data?.message);
    return null;
  }
};

const GetHomePageData = async () => {
  try {
    const response = await axios.get(
      `${backend_url}/api/home/dashboard`, 
      { withCredentials: true }
    );
    
    return response?.data;
  } catch (err) {
    console.log('GetHomePageData failed', err);
    throw err;
  }
};

const GetAboutPageData = async () => {
  try {
    const response = await axios.get(
      `${backend_url}/api/home/about`, 
      { withCredentials: true }
    );
    
    return response?.data;
  } catch (err) {
    console.log('GetAboutPageData failed', err);
    throw err;
  }
};

const GetServicesPageData = async () => {
  try {
    const response = await axios.get(
      `${backend_url}/api/home/services`, 
      { withCredentials: true }
    );
    
    return response?.data;
  } catch (err) {
    console.log('GetServicesPageData failed', err);
    throw err;
  }
};

const AddEntryToQueue = async (data) => {
  try {
    const response = await axios.post(
      `${backend_url}/api/queue/add-entry-to-queue`, 
      { ...data }, 
      { withCredentials: true }
    );
    
    return response?.data?.roomID;
  } catch (err) {
    console.log('AddToQueue failed', err);
    throw err;
  }
};

const getDataByUser = async (data) => {
  try {
    const response = await axios.get(
      `${backend_url}/api/queue/get-user-queue/${data}`, 
      { withCredentials: true }
    );
    
    return response?.data;
  } catch (err) {
    console.log('GetHomePageData failed', err);
    return null;
  }
};

const DeleteQueueEntry = async (data) => {
  try {
    const response = await axios.post(
      `${backend_url}/api/queue/delete-entry-from-queue`, 
      data, 
      { withCredentials: true }
    );
    
    return response?.data;
  } catch (error) {
    console.log(error);
    return null;
  }
};

const getAllDoctor = async () =>{
  try {
    const response = await axios.get(
      `${backend_url}/api/queue/get-all-doctors`, 
      { withCredentials: true }
    );
    // console.log(response?.data);
    return response?.data.doctors; 
  } catch (error) {
    console.log(error);
    return null
  }
}

// Export all functions
export {
  GetHomePageData,
  GoogleAuthLogin,
  LoginUser,
  RegisterUser,
  LogOut,
  GetCurrentUser,
  GetAboutPageData,
  GetServicesPageData,
  AddEntryToQueue,
  getDataByUser,
  DeleteQueueEntry,
  getAllDoctor
};