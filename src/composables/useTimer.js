import { ref } from "vue";

export function useTimer(times, insertTimes, refreshScramble) {
  const startTime = ref(0);
  const elapsedTime = ref("0.00");
  const timer = ref(null);
  const isRunning = ref(false);
  const isStopped = ref(true);
  const isInspection = ref(true);

  const inspection = () => {
    startTime.value = 15;
    timer.value = setInterval(() => {
      elapsedTime.value = (startTime.value -= 0.01).toFixed(2).toString();
      isInspection.value = false;
      if (startTime.value <= 0) {
        clearInterval(timer.value);
        stop();
      }
    }, 10);
  };

  const start = () => {
    isStopped.value = false;
    isRunning.value = true;
    startTime.value = Date.now() - elapsedTime.value * 1000;
    timer.value = setInterval(() => {
      elapsedTime.value = ((Date.now() - startTime.value) / 1000)
        .toFixed(2)
        .toString();
    }, 10);
  };

  const stop = () => {
    isStopped.value = true;
    isRunning.value = false;
    isInspection.value = true;

    const date = new Date(Date.now()).toISOString();

    times.value.push({
      time: elapsedTime.value,
      solved_at: date,
      scramble: scramble.value,
    });

    clearInterval(timer.value);
    insertTimes(isStopped.value, elapsedTime.value, scramble.value).then(() => {
      refreshScramble();
    });
  };

  return {
    startTime,
    elapsedTime,
    timer,
    isRunning,
    isStopped,
    isInspection,
    inspection,
    start,
    stop,
  };
}
