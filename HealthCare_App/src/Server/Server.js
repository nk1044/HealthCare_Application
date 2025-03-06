import axios from "axios";

axios.defaults.withCredentials = true;

const backend_url = String(import.meta.env.VITE_BACKEND_URI);
// `${backend_url}/api/users/google-login`


const GoogleAuthLogin = async (response) => {
  const { credential } = response;
  console.log("credential:- ", credential);
  try {
    const data = await axios.post(
      `${backend_url}/api/users/google-auth`,
      { token: credential }
    );
    // console.log(data?.data?.user);
    return data?.data?.user;
  } catch (err) {
    console.log('Google authentication failed or user already exists', err);
  }

};

const LoginUser = async (data) => {
  try {
    const response = await axios.post(`${backend_url}/api/users/login-user`, { ...data }, { withCredentials: true });
    // console.log("login data:- ", response);
    return response?.data?.user;
  } catch (err) {
    console.log('LoginUser failed', err);
    return { status: 400, error: err?.response?.data?.message };
  }
}

const RegisterUser = async (data) => {
  try {
    const response = await axios.post(`${backend_url}/api/users/register-user`, { ...data }, { withCredentials: true });
    // console.log("register data:- ", response);
    return response?.data?.user;
  } catch (err) {
    console.log('RegisterUser failed', err);
  }
}

const LogOut = async () => {
  try {
    const data = await axios.get(`${backend_url}/api/users/logout-user`, { withCredentials: true });
    // console.log("logout data:- ", data);
    return data;
  } catch (err) {
    console.log('Logout failed', err);
  }
}

const GetCurrentUser = async () => {
  try {
    const response = await axios.get(`${backend_url}/api/users/get-current-user`, { withCredentials: true });
    // console.log("current user data:- ", response);
    return response?.data?.user;
  } catch (error) {
    console.log('GetCurrentUser failed', error?.response?.data?.message);
    return null;
  }
}

const GetHomePageData = async () => {
  try {
    const response = await axios.get(`${backend_url}/api/home/dashboard`, { withCredentials: true });
    // console.log("home page data:- ", response);
    return response?.data;
  } catch (err) {
    console.log('GetHomePageData failed', err);
  }
}

const GetAboutPageData = async () => {
  try {
    const response = await axios.get(`${backend_url}/api/home/about`, { withCredentials: true });
    // console.log("about page data:- ", response);
    return response?.data
      ;
  } catch (err) {
    console.log('GetAboutPageData failed', err);
  }
}

const GetServicesPageData = async () => {
  try {
    const response = await axios.get(`${backend_url}/api/home/services`, { withCredentials: true });
    // console.log("services page data:- ", response);
    return response?.data;
  } catch (err) {
    console.log('GetServicesPageData failed', err);
  }
}

const AddEntryToQueue = async (data) => {
  try {
    const response = await axios.post(`${backend_url}/api/queue/add-entry-to-queue`, { ...data }, { withCredentials: true });
    // console.log("queue data:- ", response);
    return response?.data?.roomID;
  } catch (err) {
    console.log('AddToQueue failed', err);
  }
}

// const GetQueueData = async () => {
//   try {
//     const response = await axios.get(`${backend_url}/api/queue/get-queue`, { withCredentials: true });
//     // console.log("queue data:- ", response);
//     return response?.data;
//   } catch (err) {
//     console.log('GetQueueData failed', err?.response?.data?.message);
//   }
// }

const getDataByUser = async (data) => {
  try {
    const response = await axios.get(`${backend_url}/api/queue/get-user-queue/${data}`, { withCredentials: true });
    // console.log(response.data);
    return response?.data;
  } catch (err) {
    console.log('GetHomePageData failed', err);
    return null;
  }
}

const DeleteQueueEntry = async (data) => {
    try {
      const response = await axios.post(`${backend_url}/api/queue/delete-entry-from-queue`, data ,  { withCredentials: true });
      // console.log(response.data);
      return response?.data;
    } catch (error) {
      console.log(error);
      return null;
    }
}


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
  // GetQueueData,
  getDataByUser,
  DeleteQueueEntry
};