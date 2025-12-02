import * as faceapi from "face-api.js";

export const loadAllDescriptors = () => {
    const context = require.context("../Faces", false, /\.json$/);
    return context.keys().map((file) => {
        const data = context(file);
        return new faceapi.LabeledFaceDescriptors(
            data.name,
            data.descriptors.map(d => new Float32Array(d))
        );
    });
};