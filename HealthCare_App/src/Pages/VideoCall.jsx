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
  }, [location]);

  useEffect(() => {

    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream;
    } else if (remoteStream) {
      pendingRemoteStream.current = remoteStream;
    }
  }, [remoteStream]);

  useEffect(() => {
    if (remoteVideoRef.current && pendingRemoteStream.current) {
      remoteVideoRef.current.srcObject = pendingRemoteStream.current;
      pendingRemoteStream.current = null;
    }
  }, []);

  useEffect(() => {
    if (!roomId || !userId) {
      return;
    }
    setLoading(true);

    const initMedia = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });

        setLocalStream(stream);

        setTimeout(() => {
          if (localVideoRef.current) {
            localVideoRef.current.srcObject = stream;
            localVideoRef.current.play().catch(e => console.error("Error playing local video:", e));
          } else {
            console.warn("Local video ref not available yet");
          }
        }, 100);

        // Store references to tracks for mute/unmute operations
        audioTrackRef.current = stream.getAudioTracks()[0];
        videoTrackRef.current = stream.getVideoTracks()[0];

        socket.emit("join-room", { roomId, userId });

        // Initialize WebRTC Peer Connection
        peerConnection.current = new RTCPeerConnection({
          iceServers: [
            { urls: "stun:stun.l.google.com:19302" },
            { urls: "stun:stun1.l.google.com:19302" },
            { urls: "stun:stun2.l.google.com:19302" }
          ]
        });

        // Add local stream tracks to peer connection
        stream.getTracks().forEach((track) => {
          peerConnection.current.addTrack(track, stream);
        });

        // When receiving remote stream
        peerConnection.current.ontrack = (event) => {
          if (event.streams && event.streams[0]) {
            const stream = event.streams[0];
            setRemoteStream(stream);

            // Safely handle setting srcObject
            if (remoteVideoRef.current) {
              remoteVideoRef.current.srcObject = stream;
            } else {
              pendingRemoteStream.current = stream;
            }
          } else {
            console.warn("Received track event without streams");
          }
        };

        // When ICE candidate is generated
        peerConnection.current.onicecandidate = (event) => {
          if (event.candidate) {
            socket.emit("ice-candidate", { roomId, candidate: event.candidate });
          }
        };

        // Listen for user connections
        socket.on("user-connected", async ({ userId }) => {
          try {
            // Create and send offer when a new user connects
            const offer = await peerConnection.current.createOffer();
            await peerConnection.current.setLocalDescription(offer);
            socket.emit("offer", { roomId, offer });
          } catch (err) {
            console.error("Error creating offer:", err);
          }
        });

        // Listen for WebRTC signaling messages
        socket.on("offer", async ({ offer }) => {
          try {
            if (peerConnection.current) {
              if (peerConnection.current.signalingState !== "have-local-offer") {
                await peerConnection.current.setRemoteDescription(new RTCSessionDescription(offer));
                const answer = await peerConnection.current.createAnswer();
                await peerConnection.current.setLocalDescription(answer);

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
          try {
            if (peerConnection.current) {
              if (peerConnection.current.signalingState === "have-local-offer") {
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
          try {
            if (candidate && peerConnection.current) {
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
      socket.off("user-connected");
      socket.off("offer");
      socket.off("answer");
      socket.off("ice-candidate");

      // Stop all tracks before closing connection
      if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
      }

      if (peerConnection.current) {
        peerConnection.current.close();
        peerConnection.current = null;
      }
    };
  }, [roomId, userId]);

  // Toggle audio mute
  const toggleAudio = () => {
    if (localStream) {
      const newMuteState = !isAudioMuted;

      // Get all audio tracks and set their enabled state
      const audioTracks = localStream.getAudioTracks();
      if (audioTracks.length > 0) {
        audioTracks.forEach(track => {
          track.enabled = !newMuteState;
        });

        // Store reference to the main audio track
        if (audioTracks[0]) {
          audioTrackRef.current = audioTracks[0];
        }
      } else {
        console.warn("No audio tracks found in stream");
      }

      setIsAudioMuted(newMuteState);
    } else {
      console.warn("Cannot toggle audio - no local stream available");
    }
  };

  // Toggle video
  // Toggle video function
  const toggleVideo = () => {
    if (videoTrackRef.current) {
      const newVideoState = !isVideoOff;
      videoTrackRef.current.enabled = !newVideoState;

      // If we're turning video back on, ensure the video shows up in the local video element
      if (!newVideoState && localVideoRef.current && localStream) {
        // Make sure the srcObject is set correctly
        if (localVideoRef.current.srcObject !== localStream) {
          localVideoRef.current.srcObject = localStream;
        }

        // Try to play the video
        localVideoRef.current.play().catch(e => console.error("Error playing local video:", e));
      }

      setIsVideoOff(newVideoState);
    }
  };
  useEffect(() => {
    // When the video is turned back on after being off
    if (!isVideoOff && localStream && localVideoRef.current) {

      // Ensure the video track is enabled
      const videoTracks = localStream.getVideoTracks();
      if (videoTracks.length > 0) {
        videoTracks.forEach(track => {
          track.enabled = true;
        });
      }

      // Reset the video element's source
      localVideoRef.current.srcObject = null;
      setTimeout(() => {
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = localStream;
          localVideoRef.current.play().catch(e => console.error("Error playing local video:", e));
        }
      }, 100);
    }
  }, [isVideoOff, localStream]);

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
    console.log(user.role);

    if (user.role == 'user') {
      navigate('/add-to-queue');
    } else {
      navigate('/queue-page')
    }
  };

  return (
    <div className="h-screen w-full flex flex-col bg-gradient-to-b from-slate-900 to-slate-800 text-white p-4 sm:p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-4 px-2">
        <div className="flex items-center">
          <div className="bg-blue-500 w-3 h-3 rounded-full mr-2 animate-pulse"></div>
          <span className="font-medium text-blue-100">Live Meeting</span>
        </div>
        <div className="text-sm text-gray-400 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:flex-row gap-4 relative">
        {/* Remote Video (Main) */}
        <div className="flex-1 rounded-2xl overflow-hidden bg-slate-950 border border-slate-700 shadow-xl relative">
          {remoteStream ? (
            <div className="w-full h-full flex items-center justify-center bg-black">
              <video
                autoPlay
                playsInline
                ref={remoteVideoRef}
                className="w-full h-full max-h-[70vh] max-w-4xl object-contain mx-auto"
                style={{ aspectRatio: '16/9' }}
              />
            </div>
          ) : (
            <div className="h-[70vh] flex flex-col items-center justify-center p-8">
              <div className="w-24 h-24 bg-slate-800 rounded-full flex items-center justify-center mb-6">
                <svg className="w-12 h-12 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-slate-300 mb-2">Waiting for Connection</h3>
              <p className="text-slate-400 text-center max-w-md">
                Your meeting room is ready. Waiting for other participants to join...
              </p>
              <div className="flex gap-2 mt-8">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          )}
        </div>

      </div>

      {/* Local Video - Mobile & Tablet (visible only on smaller screens) */}
      <div className="absolute top-4 right-4 w-32 h-48 sm:w-40 sm:h-56 rounded-xl overflow-hidden border-2 border-blue-500/30 bg-slate-800 shadow-lg">
        {localStream && !isVideoOff ? (
          <video
            autoPlay
            playsInline
            muted
            ref={localVideoRef}
            className="w-full h-full object-cover transform scale-x-[-1]"
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full w-full">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-blue-500/80 flex items-center justify-center text-slate-900 text-xl font-bold">
              {userId?.charAt(0).toUpperCase() || 'Y'}
            </div>
            <p className="mt-2 text-slate-300 text-sm font-medium">{userId || 'You'}</p>
          </div>
        )}

        {/* Status indicators for mobile */}
        <div className="absolute bottom-2 left-2 flex gap-1.5">
          <div className={`w-5 h-5 rounded-full flex items-center justify-center ${isAudioMuted ? 'bg-red-500' : 'bg-green-500'}`}>
            {isAudioMuted ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-2.5 w-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" strokeDasharray="2 2" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-2.5 w-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            )}
          </div>
          <div className={`w-5 h-5 rounded-full flex items-center justify-center ${isVideoOff ? 'bg-red-500' : 'bg-green-500'}`}>
            {isVideoOff ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-2.5 w-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-2.5 w-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            )}
          </div>
        </div>
      </div>

      {/* Control Buttons Bar */}
      <div className="h-20 mt-4 rounded-2xl bg-slate-800/80 backdrop-blur-sm border border-slate-700 p-4 flex justify-center items-center gap-4">
        <button
          onClick={toggleAudio}
          className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${isAudioMuted ? 'bg-red-500 text-white hover:bg-red-600' : 'bg-slate-700 text-white hover:bg-slate-600'
            }`}
          title={isAudioMuted ? "Unmute" : "Mute"}
        >
          {isAudioMuted ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" strokeDasharray="2 2" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
          )}
        </button>

        <button
          onClick={endCall}
          className="w-16 h-12 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-full shadow-lg transition duration-200 flex items-center justify-center"
          title="End Call"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M5 3a2 2 0 00-2 2v1c0 8.284 6.716 15 15 15h1a2 2 0 002-2v-3.28a1 1 0 00-.684-.948l-4.493-1.498a1 1 0 00-1.21.502l-1.13 2.257a11.042 11.042 0 01-5.516-5.517l2.257-1.128a1 1 0 00.502-1.21L9.228 3.683A1 1 0 008.279 3H5z" />
          </svg>
        </button>

        <button
          onClick={toggleVideo}
          className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${isVideoOff ? 'bg-red-500 text-white hover:bg-red-600' : 'bg-slate-700 text-white hover:bg-slate-600'
            }`}
          title={isVideoOff ? "Turn Video On" : "Turn Video Off"}
        >
          {isVideoOff ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          )}
        </button>

        <button
          className="w-12 h-12 rounded-full bg-slate-700 text-white hover:bg-slate-600 flex items-center justify-center transition-all"
          title="Share Screen"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </button>

        <button
          className="w-12 h-12 rounded-full bg-slate-700 text-white hover:bg-slate-600 flex items-center justify-center transition-all"
          title="Settings"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default VideoCall;