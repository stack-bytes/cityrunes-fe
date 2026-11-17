import { supabase } from "@/lib/supabase";

const RPC_TIMEOUT_MS = 8000;

export const NETWORK_MESSAGE =
  "Cannot connect to the server. Check your connection.";

export const toErrorMessage = (error: unknown): string =>
  error instanceof Error ? error.message : NETWORK_MESSAGE;

export const callRpc = async <T>(
  name: string,
  args?: Record<string, unknown>
): Promise<T> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), RPC_TIMEOUT_MS);

  try {
    const { data, error } = await supabase
      .rpc(name, args)
      .abortSignal(controller.signal);

    if (error) {
      throw new Error(error.code ? error.message : NETWORK_MESSAGE);
    }

    if (data === null || data === undefined) {
      throw new Error(`The server returned no data for ${name}`);
    }

    return data as T;
  } finally {
    clearTimeout(timeoutId);
  }
};
