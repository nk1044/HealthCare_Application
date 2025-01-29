import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const VideoCall = () => {
  const videoContainerRef = useRef(null);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const [roomID, setRoomID] = useState(""); // Initialize roomID as an empty string
  const location = useLocation(); // Use useLocation hook to access the URL search params
  const navigate = useNavigate();

  // Function to extract query params
  const getQueryParams = () => {
    const params = new URLSearchParams(location.search);
    return params.get("roomID");
  };

  // Effect to update roomID whenever the location changes
  useEffect(() => {
    const roomFromURL = getQueryParams();
    if (roomFromURL) {
      setRoomID(roomFromURL);
    }
  }, [location]); // This runs whenever location changes (e.g., after navigation)

  // Load the Zego script dynamically
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://unpkg.com/@zegocloud/zego-uikit-prebuilt/zego-uikit-prebuilt.js";
    script.async = true;
    script.onload = () => {
      setIsScriptLoaded(true);
    };
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  useEffect(() => {
    if (isScriptLoaded && roomID) {
      initializeVideoCall();
    }
  }, [isScriptLoaded, roomID]); // Initialize video call once both the script and roomID are loaded

  const initializeVideoCall = () => {
    const userID = Math.floor(Math.random() * 10000) + "";
    const userName = "userName" + userID;
    const appID = 753999351;
    const serverSecret = "5d935e5269271e220bc62ca17f3748dc";
    const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(appID, serverSecret, roomID, userID, userName);

    const zp = ZegoUIKitPrebuilt.create(kitToken);
    zp.joinRoom({
      container: videoContainerRef.current,
      sharedLinks: [{
        name: "Personal link",
        url: window.location.protocol + "//" + window.location.host + window.location.pathname + "?roomID=" + roomID,
      }],
      scenario: {
        mode: ZegoUIKitPrebuilt.VideoConference,
      },
      turnOnMicrophoneWhenJoining: true,
      turnOnCameraWhenJoining: true,
      showMyCameraToggleButton: true,
      showMyMicrophoneToggleButton: true,
      showAudioVideoSettingsButton: true,
      showScreenSharingButton: true,
      showTextChat: true,
      showUserList: true,
      maxUsers: 2,
      layout: "Auto",
      showLayoutButton: false,
      oncut: () => {
        console.log("Call has ended, navigating back to dashboard...");
        navigate("/");
      }
    });
  };

  return <div ref={videoContainerRef} style={{ width: "100vw", height: "100vh" }}></div>;
};

export default VideoCall;
