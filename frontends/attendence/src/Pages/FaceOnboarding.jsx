import React, { useRef, useEffect, useState } from "react";
import * as faceapi from "face-api.js";
import { Button, Typography, TextField, Box, Snackbar, Alert } from "@mui/material";

function FaceOnboarding() {
  const videoRef = useRef();
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [capturing, setCapturing] = useState(false);
  const [employeeName, setEmployeeName] = useState("");
  const [capturedDescriptors, setCapturedDescriptors] = useState([]);

  // Snackbar state
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "info" });

  const showNotification = (message, severity = "info") => {
    setSnackbar({ open: true, message, severity });
  };

  // Load face-api models
  useEffect(() => {
    const loadModels = async () => {
      const MODEL_URL = process.env.PUBLIC_URL + "/models";
      await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
      await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
      await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL);
      setModelsLoaded(true);
      showNotification("Models loaded successfully", "success");
    };
    loadModels();
  }, []);

  // Start webcam
  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        if (videoRef.current) videoRef.current.srcObject = stream;
      })
      .catch(() => showNotification("Error accessing webcam", "error"));
  }, []);

  // Capture face descriptor
  const captureFace = async () => {
    if (!modelsLoaded) return showNotification("Models not loaded yet!", "warning");
    if (!employeeName) return showNotification("Enter employee name first!", "warning");

    setCapturing(true);

    const detection = await faceapi
      .detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceDescriptor();

    if (!detection) {
      setCapturing(false);
      return showNotification("No face detected. Try again.", "error");
    }

    const descriptorArray = Array.from(detection.descriptor);
    setCapturedDescriptors((prev) => [...prev, descriptorArray]);

    setCapturing(false);
    showNotification(`Face captured! Total: ${capturedDescriptors.length + 1}`, "success");
  };

  // Download JSON
  const downloadDescriptors = () => {
    if (!employeeName) return showNotification("Enter employee name first!", "warning");
    if (capturedDescriptors.length === 0) return showNotification("No captures yet!", "warning");

    const data = { name: employeeName, descriptors: capturedDescriptors };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${employeeName}_descriptors.json`;
    a.click();
    URL.revokeObjectURL(url);

    showNotification("Descriptors downloaded!", "success");
  };

  // Reset all data
  const resetOnboarding = () => {
    setEmployeeName("");
    setCapturedDescriptors([]);
    showNotification("Onboarding reset", "info");
  };

  return (
    <Box sx={{ textAlign: "center", p: 2 }}>
      <Typography variant="h5" gutterBottom>
        Face Onboarding
      </Typography>

      <Box>
        <TextField
          label="Employee Name"
          value={employeeName}
          onChange={(e) => setEmployeeName(e.target.value)}
          size="small"
          sx={{ mb: 2 }}
        />
      </Box>

      <video
        ref={videoRef}
        autoPlay
        muted
        width={320}
        height={240}
        style={{ border: "2px solid gray", borderRadius: 8 }}
      />

      <Box sx={{ mt: 2 }}>
        <Button variant="contained" color="primary" onClick={captureFace} disabled={capturing}>
          {capturing ? "Capturing..." : "Capture Face"}
        </Button>

        <Button
          variant="outlined"
          color="secondary"
          sx={{ ml: 1 }}
          onClick={downloadDescriptors}
        >
          Download JSON
        </Button>

        <Button
          variant="outlined"
          color="warning"
          sx={{ ml: 1 }}
          onClick={resetOnboarding}
        >
          Reset
        </Button>
      </Box>

      <Typography variant="body2" sx={{ mt: 1 }}>
        Captured: {capturedDescriptors.length}
      </Typography>

      {/* Snackbar notification */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default FaceOnboarding;
