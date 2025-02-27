import { Storage } from "aws-amplify";
import uuid from "react-native-uuid";

export const uploadToS3 = async (uri, fileType = "image", onProgress) => {
  try {
    const response = await fetch(uri);
    const blob = await response.blob();

    const extension = fileType === "audio" ? "m4a" : "jpg";
    const filename = `${uuid.v4()}.${extension}`;

    const result = await Storage.put(filename, blob, {
      contentType: fileType === "audio" ? "audio/m4a" : "image/jpeg",
      progressCallback(progress) {
        const percentUploaded = progress.loaded / progress.total;
        if (onProgress) onProgress(percentUploaded);
      },
    });

    return result.key;
  } catch (error) {
    console.error("Upload to S3 failed", error);
    throw error;
  }
};
