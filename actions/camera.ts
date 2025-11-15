// compareImage.ts
import { environment } from "@/environment";

export interface ImageInput {
  uri: string;
  width?: number;
  height?: number;
  format?: string;
}

export interface SimilarityCandidate {
  url: string;
  similarity: number;
}

export interface CompareImageResponse {
  chosenReferenceUrl: string;
  similarity: number;
  thresholdHint: number;
  allCandidates: SimilarityCandidate[];
}

export const compareImage = async (
  image: ImageInput,
  location: string,
  description: string
): Promise<CompareImageResponse> => {
  try {
    const formData = new FormData();

    formData.append("location", location);
    formData.append("description", description);

    const imageFile = {
      uri: image.uri,
      type: "image/jpeg",
      name: "photo.jpg",
    } as any;

    formData.append("image", imageFile);

    const response = await fetch(`${environment.apiUrl}/verify-location`, {
      method: "POST",
      body: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: CompareImageResponse = await response.json();
    return data;
  } catch (error) {
    console.error("Error comparing image:", error);
    throw error;
  }
};
