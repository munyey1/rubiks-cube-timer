import { ref } from "vue";
import { supabase } from "../supabase";

const solveManagers = new Map();

export function useSolveManager(userId) {
  if (solveManagers.has(userId)) {
    return solveManagers.get(userId);
  }

  const times = ref([]);

  const getLastTime = async () => {
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

  const getTimes = async () => {
    const { data, error } = await supabase
      .from("solves")
      .select("*")
      .eq("user_id", userId);
    if (error) {
      console.error("Error fetching times", error);
    } else {
      times.value.length = 0; // Clear the array first
      times.value.push(...data); // Push new data into the empty array
    }
  };

  const insertTimes = async (isStopped, time, scramble) => {
    console.log(isStopped, time, scramble);
    if (!isStopped) return;
    console.log("Inserting times", isStopped);
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
    const time = times.value[times.value.length - 1].time;
    if (time == "DNF") {
      return;
    } else {
      // Add 2 seconds to the last time
      // Format: time + 2(+)
      // Update the time in the database
      const plustwo = Number(time);
      times.value[times.value.length - 1].time = (plustwo + 2).toFixed(2);
      times.value[times.value.length - 1].time += "(+)";
      const solve = await getLastTime();
      const { error } = await supabase
        .from("solves")
        .update({
          time: times.value[times.value.length - 1].time,
          plus_two: true,
        })
        .eq("id", solve[0].id);
      if (error) {
        console.error("Error updating plus two", error);
      }
    }
  };

  const dnf = async () => {
    times.value[times.value.length - 1].time = "DNF";
    const solve = await getLastTime();
    const { error } = await supabase
      .from("solves")
      .update({ time: "DNF", dnf: true })
      .eq("id", solve[0].id);
    if (error) {
      console.error("Error updating DNF", error);
    }
  };

  const solveManager = {
    times,
    getLastTime,
    getTimes,
    insertTimes,
    plus2,
    dnf,
  };

  solveManagers.set(userId, solveManager);
  return solveManager;
}
