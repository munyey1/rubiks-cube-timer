<script setup>
const props = defineProps({
  scramble: String,
  is3D: Boolean,
})

const emit = defineEmits(["toggle-3d", "update-twisty-player"])

</script>

<template>
  <div
    @click="emit('update-twisty-player')"
    className="flex flex-col items-center justify-center"
  >
    <p className="text-xl">{{ is3D ? "3D" : "2D" }}</p>
    <input
      type="checkbox"
      @click.stop="emit('toggle-3d')"
      defaultChecked
      className="toggle lg:mb-10"
    />
    <twisty-player
      v-show="is3D"
      ref="twistyPlayer"
      background="none"
      controlPanel="none"
      visualization="3D"
    ></twisty-player>
    <twisty-player
      v-show="!is3D"
      ref="twistyPlayer"
      background="none"
      controlPanel="none"
      visualization="2D"
    ></twisty-player>
  </div>
</template>
