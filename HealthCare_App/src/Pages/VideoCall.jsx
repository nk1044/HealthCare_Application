import React, { useState, useEffect, useRef, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import { useUser } from "../Store/zustand";

// Function to extract query params
const getQueryParams = () => {
  const params = new URLSearchParams(window.location.search);
  return params.get("roomID");
};

const socket = io(String(import.meta.env.VITE_BACKEND_URI));

const VideoCall = () => {
  const [roomId, setRoomId] = useState(""); // Initialize roomID as an empty string
  const location = useLocation(); // Use useLocation hook to access the URL search params
  const navigate = useNavigate();
  const user = useUser(useCallback(state => state.user, []));
  const userId = user?.name;

  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [loading, setLoading] = useState(true);
  const peerConnection = useRef(null);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const audioTrackRef = useRef(null);
  const videoTrackRef = useRef(null);

  // Add this ref to store the stream until the ref is ready
  const pendingRemoteStream = useRef(null);

  // Effect to update roomID whenever the location changes
  useEffect(() => {
    const roomFromURL = getQueryParams();
    if (roomFromURL) {
      setRoomId(roomFromURL);
      console.log("Room ID set from URL:", roomFromURL);
    } else {
      console.warn("No roomID found in URL");
    }
    
    // Force re-render of video elements on navigation/mount
    if (localVideoRef.current) {
      const currentSrc = localVideoRef.current.srcObject;
      if (currentSrc) {
        localVideoRef.current.srcObject = null;
        setTimeout(() => {
          if (localVideoRef.current) {
            localVideoRef.current.srcObject = currentSrc;
          }
        }, 200);
      }
    }
  }, [location]); // This runs whenever location changes (e.g., after navigation)

  // Effect to handle remoteVideoRef being ready
  useEffect(() => {
    console.log("Remote stream changed:", !!remoteStream);
    
    if (remoteVideoRef.current && remoteStream) {
      console.log("Setting remote video srcObject");
      remoteVideoRef.current.srcObject = remoteStream;
    } else if (remoteStream) {
      console.log("Remote video ref not ready, storing stream for later");
      pendingRemoteStream.current = remoteStream;
    }
  }, [remoteStream]);

  // Check if pendingRemoteStream can be applied after remoteVideoRef is available
  useEffect(() => {
    if (remoteVideoRef.current && pendingRemoteStream.current) {
      console.log("Applying pending remote stream to now-available ref");
      remoteVideoRef.current.srcObject = pendingRemoteStream.current;
      pendingRemoteStream.current = null;
    }
  }, []);

  useEffect(() => {
    if (!roomId || !userId) {
      console.log("Waiting for roomId and userId to be available");
      return;
    }
    
    console.log(`Initializing call with roomId: ${roomId} and userId: ${userId}`);
    setLoading(true);

    const initMedia = async () => {
      try {
        console.log("Requesting user media");
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });

        console.log("Local stream obtained:", stream.id);
        setLocalStream(stream);

        // Ensure local video is displayed correctly
        console.log("Local video tracks:", stream.getVideoTracks().length > 0 ? "available" : "missing");
        
        // Force a small delay to ensure DOM is ready
        setTimeout(() => {
          if (localVideoRef.current) {
            console.log("Setting local video srcObject");
            localVideoRef.current.srcObject = stream;
            // Try to manually play the video
            localVideoRef.current.play().catch(e => console.error("Error playing local video:", e));
          } else {
            console.warn("Local video ref not available yet");
          }
        }, 100);

        // Store references to tracks for mute/unmute operations
        audioTrackRef.current = stream.getAudioTracks()[0];
        videoTrackRef.current = stream.getVideoTracks()[0];

        console.log("Joining room:", roomId);
        socket.emit("join-room", { roomId, userId });

        // Initialize WebRTC Peer Connection
        console.log("Initializing peer connection");
        peerConnection.current = new RTCPeerConnection({
          iceServers: [
            { urls: "stun:stun.l.google.com:19302" },
            { urls: "stun:stun1.l.google.com:19302" },
            { urls: "stun:stun2.l.google.com:19302" }
          ]
        });

        // Add local stream tracks to peer connection
        console.log("Adding local tracks to peer connection");
        stream.getTracks().forEach((track) => {
          console.log(`Adding track: ${track.kind}`);
          peerConnection.current.addTrack(track, stream);
        });

        // When receiving remote stream
        peerConnection.current.ontrack = (event) => {
          console.log("Remote track received:", event.track.kind);
          console.log("Remote streams:", event.streams.length);
          
          if (event.streams && event.streams[0]) {
            const stream = event.streams[0];
            console.log("Setting remote stream:", stream.id);
            setRemoteStream(stream);
            
            // Safely handle setting srcObject
            if (remoteVideoRef.current) {
              console.log("Remote video ref available, setting srcObject directly");
              remoteVideoRef.current.srcObject = stream;
            } else {
              console.log("Remote video ref not available, storing stream for later");
              pendingRemoteStream.current = stream;
            }
          } else {
            console.warn("Received track event without streams");
          }
        };

        // When ICE candidate is generated
        peerConnection.current.onicecandidate = (event) => {
          if (event.candidate) {
            console.log("Sending ICE candidate");
            socket.emit("ice-candidate", { roomId, candidate: event.candidate });
          }
        };

        // Connection state changes
        peerConnection.current.onconnectionstatechange = () => {
          console.log("Connection state:", peerConnection.current.connectionState);
        };

        peerConnection.current.oniceconnectionstatechange = () => {
          console.log("ICE connection state:", peerConnection.current.iceConnectionState);
        };

        // Listen for user connections
        socket.on("user-connected", async ({ userId }) => {
          console.log(`User ${userId} connected, creating offer`);
          try {
            // Create and send offer when a new user connects
            const offer = await peerConnection.current.createOffer();
            await peerConnection.current.setLocalDescription(offer);
            console.log("Sending offer");
            socket.emit("offer", { roomId, offer });
          } catch (err) {
            console.error("Error creating offer:", err);
          }
        });

        // Listen for WebRTC signaling messages
        socket.on("offer", async ({ offer }) => {
          console.log("Received offer");
          try {
            if (peerConnection.current) {
              if (peerConnection.current.signalingState !== "have-local-offer") {
                console.log("Setting remote description from offer");
                await peerConnection.current.setRemoteDescription(new RTCSessionDescription(offer));
                
                console.log("Creating answer");
                const answer = await peerConnection.current.createAnswer();
                
                console.log("Setting local description");
                await peerConnection.current.setLocalDescription(answer);
                
                console.log("Sending answer");
                socket.emit("answer", { roomId, answer });
              } else {
                console.warn("Already have local offer, ignoring received offer");
              }
            } else {
              console.error("Peer connection not initialized");
            }
          } catch (err) {
            console.error("Error handling offer:", err);
          }
        });

        socket.on("answer", async ({ answer }) => {
          console.log("Received answer");
          try {
            if (peerConnection.current) {
              if (peerConnection.current.signalingState === "have-local-offer") {
                console.log("Setting remote description from answer");
                await peerConnection.current.setRemoteDescription(new RTCSessionDescription(answer));
              } else {
                console.warn(`Cannot set remote answer in signaling state: ${peerConnection.current.signalingState}`);
              }
            } else {
              console.error("Peer connection not initialized");
            }
          } catch (err) {
            console.error("Error handling answer:", err);
          }
        });

        socket.on("ice-candidate", async ({ candidate }) => {
          console.log("Received ICE candidate");
          try {
            if (candidate && peerConnection.current) {
              console.log("Adding ICE candidate");
              await peerConnection.current.addIceCandidate(new RTCIceCandidate(candidate));
            }
          } catch (err) {
            console.error("Error adding ICE candidate:", err);
          }
        });

        setLoading(false);
      } catch (err) {
        console.error("Error accessing media devices:", err);
        setLoading(false);
      }
    };

    initMedia();

    return () => {
      // Clean up
      console.log("Cleaning up VideoCall component");
      socket.off("user-connected");
      socket.off("offer");
      socket.off("answer");
      socket.off("ice-candidate");

      // Stop all tracks before closing connection
      if (localStream) {
        console.log("Stopping local stream tracks");
        localStream.getTracks().forEach(track => track.stop());
      }

      if (peerConnection.current) {
        console.log("Closing peer connection");
        peerConnection.current.close();
        peerConnection.current = null;
      }
    };
  }, [roomId, userId]);

  // Toggle audio mute
  const toggleAudio = () => {
    if (audioTrackRef.current) {
      const newMuteState = !isAudioMuted;
      audioTrackRef.current.enabled = !newMuteState;
      setIsAudioMuted(newMuteState);
      console.log(`Audio ${newMuteState ? 'muted' : 'unmuted'}`);
    }
  };

  // Toggle video
  const toggleVideo = () => {
    if (videoTrackRef.current) {
      const newVideoState = !isVideoOff;
      videoTrackRef.current.enabled = !newVideoState;
      setIsVideoOff(newVideoState);
      console.log(`Video ${newVideoState ? 'off' : 'on'}`);
    }
  };

  // End call function
  const endCall = () => {
    console.log("Ending call");
    
    // Stop all tracks
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
    }

    // Close peer connection
    if (peerConnection.current) {
      peerConnection.current.close();
      peerConnection.current = null;
    }

    // Leave room
    socket.emit("leave-room", { roomId, userId });

    // Clear streams
    setLocalStream(null);
    setRemoteStream(null);

    // Reset state
    setIsAudioMuted(false);
    setIsVideoOff(false);
    
    // Navigate back to home or another page
    navigate('/');
  };
 
  return (
    <div className="h-screen w-full flex flex-col justify-center items-center bg-gray-900 text-white sm:p-6 py-6">
      <h2 className="text-3xl font-bold mb-3 text-blue-400">Room: {roomId}</h2>

      <div className="flex relative justify-center items-center gap-6 w-full h-full">
        {/* Local Video */}
        <div className="absolute sm:top-2 right-2 bottom-20 sm:w-56 sm:h-56 w-44 h-48 border-4 border-blue-500 rounded-xl overflow-hidden bg-gray-800 flex justify-center items-center shadow-lg">
          {localStream && (
            <video
              autoPlay
              playsInline
              muted
              ref={localVideoRef}
              className={`w-full h-full object-cover transform scale-x-[-1] ${isVideoOff ? 'hidden' : ''}`}
              style={{ display: isVideoOff ? 'none' : 'block' }}
              onLoadedMetadata={(e) => {
                console.log("Local video metadata loaded");
                e.target.play().catch(err => console.error("Error playing after metadata loaded:", err));
              }}
            ></video>
          )}
          {(!localStream || isVideoOff) && (
            <div className="flex flex-col items-center justify-center h-full w-full bg-gray-800">
              <div className="w-24 h-24 rounded-full bg-blue-400 flex items-center justify-center text-gray-800 text-3xl font-bold">
                {userId?.charAt(0).toUpperCase()}
              </div>
              <p className="mt-2 text-gray-300 font-bold">{userId || 'You'}</p>
            </div>
          )}
        </div>

        {/* Remote Video */}
        <div className="w-full h-full sm:border-4 border-1 sm:border-green-500 border-gray-700 rounded-xl overflow-hidden bg-neutral-950 flex justify-center items-center shadow-lg">
          {remoteStream && (
            <video 
              autoPlay 
              playsInline
              ref={remoteVideoRef} 
              className="w-full h-full object-cover"
            ></video>
          )}
          {!remoteStream && (
            <div className="flex flex-col items-center justify-center p-4">
              <div className="animate-pulse mb-4">
                <svg className="w-16 h-16 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                </svg>
              </div>
              <p className="text-gray-300 text-3xl p-3 text-center font-bold">Waiting for another participant to join...</p>
            </div>
          )}
        </div>

        {/* Control Buttons */}
        <div className="absolute bottom-2 w-full flex justify-center gap-4">
          <button
            onClick={toggleAudio}
            className={`flex items-center justify-center w-12 h-12 rounded-full shadow-lg transition duration-200 ${isAudioMuted ? 'bg-red-500 text-white' : 'bg-gray-200 text-black'}`}
            title={isAudioMuted ? "Unmute" : "Mute"}
          >
            {isAudioMuted ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            )}
          </button>

          <button
            onClick={endCall}
            className="flex items-center justify-center w-16 h-12 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-full shadow-lg transition duration-200"
            title="End Call"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M5 3a2 2 0 00-2 2v1c0 8.284 6.716 15 15 15h1a2 2 0 002-2v-3.28a1 1 0 00-.684-.948l-4.493-1.498a1 1 0 00-1.21.502l-1.13 2.257a11.042 11.042 0 01-5.516-5.517l2.257-1.128a1 1 0 00.502-1.21L9.228 3.683A1 1 0 008.279 3H5z" />
            </svg>
          </button>

          <button
            onClick={toggleVideo}
            className={`flex items-center justify-center w-12 h-12 rounded-full shadow-lg transition duration-200 ${isVideoOff ? 'bg-red-500 text-white' : 'bg-gray-200 text-black'}`}
            title={isVideoOff ? "Turn Video On" : "Turn Video Off"}
          >
            {isVideoOff ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoCall;