export function calculateAverage(num, solves) {
  if (solves.length < num) {
    return "N/A";
  } else {
    // Get the last n times
    // Remove the max and min times
    // Calculate the average of the remaining times
    const times = solves.slice(-num);
    // Get the max time
    // Add plus 2 and dnf checking
    const max = Math.max(
      ...times.map((time) => {
        if (time.time.includes("(+)")) {
          return time.time.replace("(+)", "");
        }
        if (time.time == "DNF") {
          return 0;
        }
        return time.time;
      })
    );
    // Get the minimum time
    const min = Math.min(
      ...times.map((time) => {
        if (time.time.includes("(+)")) {
          return time.time.replace("(+)", "");
        }
        if (time.time == "DNF") {
          return 0;
        }
        return time.time;
      })
    );
    const sum = times.reduce((acc, time) => {
      if (time.time.includes("(+)")) {
        const plus2 = time.time.replace("(+)", "");
        return acc + Number(plus2);
      }
      if (time.time == "DNF") {
        return acc;
      }
      return acc + Number(time.time);
    }, 0);
    const average = ((sum - max - min) / (times.length - 2)).toFixed(2);
    return average;
  }
}
