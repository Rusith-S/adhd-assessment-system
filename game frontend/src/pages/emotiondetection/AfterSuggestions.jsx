/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-unescaped-entities */
import { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import background from "./../../assets/public/background.png";

const AfterSuggestions = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [modalType, setModalType] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [previewURL, setPreviewURL] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [recording, setRecording] = useState(false);
  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const recordedChunksRef = useRef([]);

  // Open modal for each mode
  const openVideoModal = () => {
    setModalType("video");
  };

  const openCameraModal = () => {
    setModalType("camera");
  };

  // Reset states and stop camera stream if needed
  const closeModal = () => {
    setModalType(null);
    setSelectedVideo(null);
    setPreviewURL(null);
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
  };

  // Handle file selection in video mode
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedVideo(file);
      setPreviewURL(URL.createObjectURL(file));
    }
  };

  // General upload function for both file and camera videos
  const handleUpload = async (videoFile) => {
    if (!videoFile) {
      Swal.fire("Oops!", "No video available to upload.", "warning");
      return;
    }

    setUploading(true);
    const token = localStorage.getItem("token");
    if (!token) {
      Swal.fire(
        "Error",
        "Authentication token not found. Please log in.",
        "error"
      );
      setUploading(false);
      return;
    }

    const formData = new FormData();
    formData.append("video", videoFile);

    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}game/gaming-emotions/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Upload Response:", response.data);
      Swal.fire({
        title: "Success!",
        text: "Video uploaded successfully!",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });
      setTimeout(() => {
        navigate(`/records-after-suggestion/${id}`);
      }, 2000);
      closeModal();
    } catch (error) {
      Swal.fire(
        "Upload Failed",
        "Something went wrong, please try again.",
        "error"
      );
      console.error("Upload Error:", error);
    } finally {
      setUploading(false);
    }
  };

  // Function to start recording video from the camera for 5 seconds
  const startCameraRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      recordedChunksRef.current = [];
      const options = { mimeType: "video/webm;codecs=vp9" };
      const mediaRecorder = new MediaRecorder(stream, options);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordedChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(recordedChunksRef.current, {
          type: "video/webm",
        });
        // Automatically upload the recorded video
        handleUpload(blob);
      };

      mediaRecorder.start();
      setRecording(true);
      // Stop recording after 5 seconds
      setTimeout(() => {
        mediaRecorder.stop();
        setRecording(false);
        // Stop camera stream tracks
        if (videoRef.current && videoRef.current.srcObject) {
          const tracks = videoRef.current.srcObject.getTracks();
          tracks.forEach((track) => track.stop());
        }
      }, 5000);
    } catch (error) {
      console.error("Camera error:", error);
      Swal.fire("Error", "Unable to access camera.", "error");
      closeModal();
    }
  };

  // Start camera recording when "camera" modal is opened
  useEffect(() => {
    if (modalType === "camera") {
      startCameraRecording();
    }
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach((track) => track.stop());
      }
    };
  }, [modalType]);

  return (
    <div
      className="min-h-screen bg-gray-100 p-10 flex justify-center items-center "
      style={{
        backgroundImage: `url(${background})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Main container with two buttons */}
      <div className="bg-white bg-opacity-50 backdrop-blur-lg p-10 rounded-2xl shadow-xl w-full max-w-4xl text-center mb-20">
        <h1 className="text-2xl font-bold mb-6 text-gray-700">
          Emotion Detection After Activity
        </h1>
        <div className="flex justify-center space-x-4">
          <button
            onClick={openCameraModal}
            className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded"
          >
            Detect Using Camera
          </button>
          <button
            onClick={openVideoModal}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded"
          >
            Detect Using Video
          </button>
        </div>
      </div>

      {/* Modal Popup */}
      {modalType && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          {/* Modal overlay */}
          <div
            className="absolute inset-0 bg-black opacity-50"
            onClick={closeModal}
          ></div>
          <div className="bg-white rounded-lg shadow-lg z-50 p-6 max-w-lg w-full">
            {modalType === "video" ? (
              // Modal for "Detect Using Video"
              <div className="flex flex-col items-center">
                <h2 className="text-xl font-bold mb-4 text-gray-700">
                  Upload Your Video
                </h2>
                {previewURL && (
                  <video className="w-full h-40 border mb-4" controls>
                    <source src={previewURL} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                )}
                <input
                  type="file"
                  accept="video/*"
                  onChange={handleFileChange}
                  className="mb-4 w-full px-3  border rounded-md cursor-pointer"
                />
                <button
                  onClick={() => handleUpload(selectedVideo)}
                  className={`w-full px-4 py-2 text-white rounded-md flex justify-center items-center ${
                    uploading
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700"
                  }`}
                  disabled={uploading}
                >
                  {uploading ? (
                    <>
                      <svg
                        className="animate-spin h-5 w-5 mr-2 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v8H4z"
                        ></path>
                      </svg>
                      Uploading...
                    </>
                  ) : (
                    "Upload Video"
                  )}
                </button>
              </div>
            ) : (
              // Modal for "Detect Using Camera"
              <div className="flex flex-col items-center">
                <h2 className="text-xl font-bold mb-4 text-gray-700">
                  Recording from Camera
                </h2>
                <video
                  ref={videoRef}
                  className="w-full h-80 border mb-4"
                  autoPlay
                  muted
                />
                {recording && (
                  <p className="text-gray-600 mb-4">
                    Recording... Please wait 5 seconds.
                  </p>
                )}
                {!recording && !uploading && (
                  <button
                    onClick={closeModal}
                    className="w-full px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded"
                  >
                    Close
                  </button>
                )}
                {uploading && (
                  <div className="flex justify-center items-center">
                    <svg
                      className="animate-spin h-5 w-5 mr-2 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8H4z"
                      ></path>
                    </svg>
                    Uploading...
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AfterSuggestions;
