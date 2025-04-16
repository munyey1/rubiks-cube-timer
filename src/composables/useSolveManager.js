import { ref } from "vue";

import { supabase } from "../supabase";

export function useSolveManager(userId) {
  const user_Id = userId
  const timess = ref([])

  const getLastTimee = async () => {
    const { data, error } = await supabase
      .from("solves")
      .select("*")
      .eq("user_id", user_Id)
      .order("id", { ascending: false })
      .limit(1);
    if (error) {
      console.error("Error fetching last time", error);
    } else {
      return data;
    }
  };

  const getTimess = async () => {
    const { data, error } = await supabase
      .from("solves")
      .select("*")
      .eq("user_id", user_Id);
    if (error) {
      console.error("Error fetching times", error);
    } else {
      timess.value.length = 0; // Clear the array first
      timess.value.push(...data); // Push new data into the empty array
    }
  };

  const insertTimess = async (isStopped, time, scramble) => {
    if (!isStopped.value) return;
    console.log("Inserting times", isStopped.value);
    const { error } = await supabase.from("solves").insert([
      {
        user_id: user_Id,
        time: time,
        scramble: scramble,
      },
    ]);
    if (error) {
      console.error("Error inserting times", error);
    }
  };

  const plus22 = async () => {
    const time = timess.value[timess.value.length - 1].time;
    if (time == "DNF") {
      return;
    } else {
      // Add 2 seconds to the last time
      // Format: time + 2(+)
      // Update the time in the database
      const plustwo = Number(time);
      timess.value[timess.value.length - 1].time = (plustwo + 2).toFixed(2);
      timess.value[timess.value.length - 1].time += "(+)";
      const solve = await getLastTime();
      const { error } = await supabase
        .from("solves")
        .update({
          time: timess.value[timess.value.length - 1].time,
          plus_two: true,
        })
        .eq("id", solve[0].id);
      if (error) {
        console.error("Error updating plus two", error);
      }
    }
  };

  const dnff = async () => {
    timess.value[timess.value.length - 1].time = "DNF";
    const solve = await getLastTime();
    const { error } = await supabase
      .from("solves")
      .update({ time: "DNF", dnf: true })
      .eq("id", solve[0].id);
    if (error) {
      console.error("Error updating DNF", error);
    }
  };

  return{
    timess,
    getLastTimee,
    getTimess,
    insertTimess,
    plus22, 
    dnff,
  }
}
