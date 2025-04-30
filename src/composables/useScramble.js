import { ref } from "vue";
import { randomScrambleForEvent } from "https://cdn.cubing.net/v0/js/cubing/scramble";

export function useScramble() {
  const scramble = ref("")

  const getScramble = async () => {
    const scrmblObj = await randomScrambleForEvent("333");
    scramble.value = scrmblObj.toString();
  };

  const updateTwistyPlayer = () => {
    const twistyPlayers = document.querySelectorAll("twisty-player");
    twistyPlayers.forEach((player) => {
      player.alg = scramble.value;
    });
  };

  return{
    scramble, 
    getScramble,
    updateTwistyPlayer
  }
}