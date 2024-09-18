import { supabase } from "../supabase";
import { ref } from "vue";

export function GetSolves(session) {
  const times = ref([]);

  const getTimes = async () => {
    const { data, error } = await supabase
      .from("solves")
      .select("*")
      .eq("user_id", session.user.id);
    if (error) {
      console.error(error);
    } else{
      times.value = data;
    }
  };
  return { times, getTimes };
}