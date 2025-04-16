import { ref } from "vue";

import { supabase } from "../supabase";

export function useSolveManager() {
  const times = ref([])

  const getLastTime = async (userId) => {
    const { data, error } = await supabase
      .from("solves")
      .select("*")
      .eq("user_id", userId)
      .order("id", { ascending: false })
      .limit(1);
    if (error) {
      console.error("Error fetching last time", error);
    } else {
      return data;
    }
  };

  const getTimes = async (userId) => {
    const { data, error } = await supabase
      .from("solves")
      .select("*")
      .eq("user_id", userId);
    if (error) {
      console.error("Error fetching times", error);
    } else {
      times.length = 0; // Clear the array first
      times.push(...data); // Push new data into the empty array
    }
  };

  const insertTimes = async (isStopped, userId, time, scramble) => {
    if (!isStopped.value) return;
    console.log("Inserting times", isStopped.value);
    const { error } = await supabase.from("solves").insert([
      {
        user_id: userId,
        time: time,
        scramble: scramble,
      },
    ]);
    if (error) {
      console.error("Error inserting times", error);
    }
  };

  const plus2 = async () => {
    const time = props.times[props.times.length - 1].time;
    if (time == "DNF") {
      return;
    } else {
      // Add 2 seconds to the last time
      // Format: time + 2(+)
      // Update the time in the database
      const plustwo = Number(time);
      props.times[props.times.length - 1].time = (plustwo + 2).toFixed(2);
      props.times[props.times.length - 1].time += "(+)";
      const solve = await getLastTime();
      const { error } = await supabase
        .from("solves")
        .update({
          time: props.times[props.times.length - 1].time,
          plus_two: true,
        })
        .eq("id", solve[0].id);
      if (error) {
        console.error("Error updating plus two", error);
      }
    }
  };

  const dnf = async () => {
    props.times[props.times.length - 1].time = "DNF";
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
    times,
    getLastTime,
    getTimes,
    insertTimes,
    plus2, 
    dnf,
  }
}
