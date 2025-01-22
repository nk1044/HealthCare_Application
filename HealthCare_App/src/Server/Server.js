import axios from "axios";

axios.defaults.withCredentials = true;

const backend_url = String(import.meta.env.VITE_BACKEND_URI);
// `${backend_url}/api/users/google-login`


const GoogleAuthLogin = async (response) => {
  const { credential } = response;
  try {
    const data = await axios.post(
      `${backend_url}/api/users/google-auth`,
      { token: credential },
      { withCredentials: true }
    );
    // console.log(data?.data?.user);
    return data?.data?.user;
  } catch (err) {
    console.log('Google authentication failed or user already exists', err);
  }

};

const LogOut = async () => {
  try {
    const data = await axios.get(`${backend_url}/api/users/logout-user`, { withCredentials: true });
    // console.log("logout data:- ", data);
    return data;
  } catch (err) {
    console.log('Logout failed', err);
  }
}

const GetHomePageData = async () => {
  try {
    const response = await axios.get(`${backend_url}/`, { withCredentials: true });
    // console.log("home page data:- ", response);
    return response?.data;
  } catch (err) {
    console.log('GetHomePageData failed', err);
  }
}

const GetAboutPageData = async () => {
  try {
    const response = await axios.get(`${backend_url}/about/`, { withCredentials: true });
    // console.log("about page data:- ", response);
    return response?.data?.aboutpage_team
    ;
  } catch (err) {
    console.log('GetAboutPageData failed', err);
  }
}

const GetServicesPageData = async () => {
  try {
    const response = await axios.get(`${backend_url}/services/`, { withCredentials: true });
    // console.log("services page data:- ", response);
    return response?.data?.services;
  } catch (err) {
    console.log('GetServicesPageData failed', err);
  }
}



export {
  GetHomePageData,
  GoogleAuthLogin,
  LogOut,
  GetAboutPageData,
  GetServicesPageData
};