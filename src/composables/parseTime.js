export const parseTime = (time) => {
  if (time.includes("(+)")) {
    return time.replace("(+)", "");
  }
  if (time === "DNF") {
    return 0;
  }
  return time;
};
