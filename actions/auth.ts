import { supabase } from "@/lib/supabase";
import { User, UserRow } from "@/types/user";
import { mapUserRow } from "@/utils/userMapper";
import { isAuthApiError } from "@supabase/supabase-js";

const INVALID_CREDENTIALS_MESSAGE = "Invalid email or password.";
const PROFILE_MISSING_MESSAGE = "Your profile could not be loaded.";
const NETWORK_MESSAGE = "Cannot connect to the server. Check your connection.";

const toErrorMessage = (error: unknown): string => {
  if (error instanceof Error && error.message === PROFILE_MISSING_MESSAGE) {
    return PROFILE_MISSING_MESSAGE;
  }
  if (isAuthApiError(error) && error.status >= 400 && error.status < 500) {
    return INVALID_CREDENTIALS_MESSAGE;
  }
  return NETWORK_MESSAGE;
};

export const signInWithEmail = async (
  email: string,
  password: string
): Promise<User> => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (error) {
      throw error;
    }

    const { data: row, error: profileError } = await supabase
      .from("users")
      .select("id, username, email, avatar_url, coins, created_at")
      .eq("id", data.user.id)
      .single();

    if (profileError || !row) {
      await supabase.auth.signOut({ scope: "local" });
      throw new Error(PROFILE_MISSING_MESSAGE);
    }

    return mapUserRow(row as UserRow);
  } catch (error) {
    throw new Error(toErrorMessage(error));
  }
};
