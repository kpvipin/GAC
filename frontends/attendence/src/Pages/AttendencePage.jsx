import { Box, Typography, Button } from "@mui/material";
import { useRef, useEffect, useState } from "react";
import SwipeButton from "../Components/Buttons/SwipeButton";
import LiveDateTime from "../Components/Utilities/LiveDateTime";
import * as faceapi from "face-api.js";
import { loadAllDescriptors } from "../Utils/loadDescriptors";

// Import your descriptor JSON
//import vipinData from "../Faces/Vipin_descriptors.json";
import vipinData from "../Faces/Vedika_descriptors.json";

const AttendencePage = () => {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);

    const [status, setStatus] = useState("Detecting face...");
    const [modelsLoaded, setModelsLoaded] = useState(false);
    const [faceMatcher, setFaceMatcher] = useState(null);
    const [recognizedName, setRecognizedName] = useState(null);
    const [isDetecting, setIsDetecting] = useState(true);
    const [cameraStarted, setCameraStarted] = useState(false);

    // Load models + descriptors
    const loadModels = async () => {
        const MODEL_URL = process.env.PUBLIC_URL + "/models";
        try {
            await Promise.all([
                faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
                faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
                faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
            ]);
            const allLabeledDescriptors = loadAllDescriptors();
            setFaceMatcher(new faceapi.FaceMatcher(allLabeledDescriptors, 0.4));
            setModelsLoaded(true)
            console.log("Models + descriptors loaded");
        } catch (error) {
            console.error("Error loading models: ", error);
        }
    };

    // Start webcam
    const startCamera = async () => {
        if (cameraStarted) return;
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: "user" },
                audio: false
            });
            videoRef.current.srcObject = stream;
            videoRef.current.play();
            setCameraStarted(true);
            setIsDetecting(true);
        } catch (error) {
            console.error("Error accessing camera:", error);
        }
    };

    // Detect face every 1 second
    const detectFace = async () => {
        if (!modelsLoaded || !faceMatcher || !isDetecting) return;

        const video = videoRef.current;
        if (!video) return;

        const detections = await faceapi
            .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
            .withFaceLandmarks()
            .withFaceDescriptors();

        if (detections.length === 0) {
            setRecognizedName(null);
            setStatus("DETECTING");
            return;
        }

        const result = faceMatcher.findBestMatch(detections[0].descriptor);

        if (result.label === "unknown") {
            setRecognizedName(null);
            setStatus("UNRECOGNIZED_FACE");
        } else {
            setRecognizedName(result.label);
            setStatus("RECOGNIZED");
            setIsDetecting(false);
        }
    };

    // Handle swipe check-in
    const handleAttendance = async () => {
        if (!recognizedName) return;
        console.log("Attendance marked for:", recognizedName);
        setStatus(`Attendance marked for ${recognizedName}`);
    };

    // Initial setup
    useEffect(() => {
        loadModels();
    }, []);

    // Continuous detection every 1 second
    useEffect(() => {
        if (!modelsLoaded || !isDetecting) return;
        const interval = setInterval(() => {
            detectFace();
        }, 1000);
        return () => clearInterval(interval);
    }, [modelsLoaded, isDetecting]);

    return (
        <Box
            sx={{
                flexDirection: "column",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-around",
                p: 2,
            }}
        >
            {/* Dynamic Welcome */}
            <Typography variant="h4" gutterBottom sx={{ mt: 2 }}>
                {recognizedName ? `Hello ${recognizedName}` : 'Smile'}
            </Typography>

            <Typography variant="subtitle1" gutterBottom>
                <LiveDateTime variant="subtitle1" />
            </Typography>

            {/* Start Scan button before camera */}
            {!cameraStarted && (
                <Button
                    variant="contained"
                    color="primary"
                    sx={{ mt: 4, px: 4, py: 2 }}
                    onClick={startCamera}
                >
                    Start Scan
                </Button>
            )}

            <video
                ref={videoRef}
                width="480"
                height="360"
                autoPlay
                muted
                style={{
                    borderRadius: 4,
                    border: "0px solid #1976d2",
                    display: cameraStarted ? "block" : "none"
                }}
            />
            <canvas ref={canvasRef} style={{ display: "none" }} />
            {cameraStarted && (
                <>
                    <Box sx={{
                        gap: 5, mt: 2,
                        width: "90vw",
                        maxWidth: "360px",
                        mx: "auto"
                    }}>
                        <SwipeButton
                            label="Check In"
                            color="success"
                            disabled={!recognizedName}
                            onSwipe={() => handleAttendance("checkin")}
                        />
                    </Box>
                    <Box sx={{
                        gap: 5, mt: 2,
                        width: "90vw",
                        maxWidth: "360px",
                        mx: "auto"
                    }}>
                        {recognizedName && (
                            <SwipeButton
                                label="Cancel"
                                color="error"
                                onSwipe={() => {
                                    setRecognizedName(null);
                                    setStatus("DETECTING");
                                    setIsDetecting(true); // 👉 Resume detection
                                }}
                            />
                        )}
                    </Box>
                </>
            )}
        </Box>
    );
};

export default AttendencePage;
