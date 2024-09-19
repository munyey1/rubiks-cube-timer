import { supabase } from "../supabase";
import { ref } from "vue";

export async function GetTimes(userId) {
  const { data, error } = await supabase
    .from("solves")
    .select("*")
    .eq("user_id", userId);
  if (error) {
    console.error(error);
    return [];
  }
  return data;
}