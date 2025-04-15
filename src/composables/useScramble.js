import { ref } from "vue";
import { randomScrambleForEvent } from "https://cdn.cubing.net/v0/js/cubing/scramble";

export function useScramble() {
  const scramblee = ref("")

  const getScramblee = async () => {
    const scrmblObj = await randomScrambleForEvent("333");
    scramblee.value = scrmblObj.toString();
  };

  const updateTwistyPlayerr = () => {
    const twistyPlayers = document.querySelectorAll("twisty-player");
    twistyPlayers.forEach((player) => {
      player.alg = scramblee.value;
    });
  };

  return{
    scramblee, 
    getScramblee,
    updateTwistyPlayerr
  }
}