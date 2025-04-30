<script setup>
const props = defineProps({
  scramble: String,
  isInspection: Boolean,
  isRunning: Boolean,
  elapsedTime: String,
})

const emit = defineEmits(["get-scramble", "plus-2", "dnf", "sm-touch"])

</script>

<template>
  <div className="flex flex-col items-center justify-center">
    <h1 className="text-2xl mb-6">{{ scramble }}</h1>
    <h2 className="text-5xl mt-36 z-10" v-if="!isInspection && !isRunning">
      Inspection:
    </h2>
    <h2
      className="text-5xl lg:mt-36 mt-20 z-10"
      v-if="isRunning || isInspection"
    >
      Time:
    </h2>
    <h2 @click="emit('smTouch')" className="text-5xl mb-28 z-10 cursor-pointer">
      {{ elapsedTime }} seconds
    </h2>
    <button className="btn mt-4" @click="emit('get-scramble')" :disabled="isRunning">
      Change Scramble
    </button>
    <div className="mt-12">
      <button className="btn w-20" @click="emit('plus-2')" :disabled="isRunning">
        +2
      </button>
      <button className="btn w-20" @click="emit('dnf')" :disabled="isRunning">
        DNF
      </button>
    </div>
  </div>
</template>
