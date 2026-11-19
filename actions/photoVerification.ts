import { environment } from "@/environment";
import { NETWORK_MESSAGE } from "@/lib/rpc";
import { PhotoVerification } from "@/types/photoVerification";
import { File } from "expo-file-system";

const VERIFY_TIMEOUT_MS = 45000;
const TIMEOUT_MESSAGE = "Photo verification timed out. Try again.";

const postPhoto = async (form: FormData): Promise<Response> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), VERIFY_TIMEOUT_MS);
  try {
    return await fetch(
      `${environment.supabaseUrl}/functions/v1/verify-place-photo`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${environment.supabasePublishableKey}`,
          apikey: environment.supabasePublishableKey,
        },
        body: form,
        signal: controller.signal,
      }
    );
  } catch (error) {
    console.error("Photo verification request failed:", error);
    throw new Error(
      controller.signal.aborted ? TIMEOUT_MESSAGE : NETWORK_MESSAGE
    );
  } finally {
    clearTimeout(timeoutId);
  }
};

export const verifyPlacePhoto = async (
  placeId: string,
  photoUri: string
): Promise<PhotoVerification> => {
  const form = new FormData();
  form.append("placeId", placeId);
  form.append("photo", new File(photoUri));

  const response = await postPhoto(form);
  const body = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(
      body?.error ?? `Photo verification failed (status ${response.status})`
    );
  }
  if (typeof body?.match !== "boolean") {
    throw new Error("Photo verification returned an invalid answer");
  }
  return { placeId: body.placeId, match: body.match, score: body.score };
};
