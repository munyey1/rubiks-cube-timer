export function calculateAverage(num, solves) {
  if (solves.length < num) {
    return "N/A";
  } else {
    // Get the last n times
    // Remove the max and min times
    // Calculate the average of the remaining times

    const parseTime = (time) => {
      if (time.includes("(+)")) {
        return time.replace("(+)", "");
      }
      if (time === "DNF") {
        return 0;
      }
      return time;
    };

    const times = solves.slice(-num).map((solve) => parseTime(solve.time));
    // Get the max time
    // Add plus 2 and dnf checking
    const max = Math.max(...times);
    // Get the minimum time
    const min = Math.min(...times);
    const sum = times.reduce((acc, time) => acc + Number(time), 0);
    const average = ((sum - max - min) / (times.length - 2)).toFixed(2);
    return average;
  }
}
