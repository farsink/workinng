<template>
  <dialog ref="modal" class="modal modal-bottom sm:modal-middle">
    <div class="modal-box bg-base-200 border border-base-content/10">
      <h3 class="font-bold text-lg mb-6 text-base-content">Add Time Entry</h3>
      
      <div class="flex gap-4 justify-center mb-8">
        <div class="flex flex-col items-center">
          <label class="text-base-content/60 text-sm mb-2">Start Time</label>
          <input 
            type="time" 
            v-model="startTime" 
            class="input input-bordered input-lg w-full max-w-xs text-center font-mono bg-base-content/5 border-base-content/10 text-base-content focus:border-primary"
          />
        </div>
        <div class="flex flex-col items-center">
          <label class="text-base-content/60 text-sm mb-2">End Time</label>
          <input 
            type="time" 
            v-model="endTime" 
            class="input input-bordered input-lg w-full max-w-xs text-center font-mono bg-base-content/5 border-base-content/10 text-base-content focus:border-primary"
          />
        </div>
      </div>

      <div class="modal-action">
        <form method="dialog">
          <button class="btn btn-ghost text-base-content/60 mr-2">Cancel</button>
          <button class="btn btn-primary text-base-100 hover:brightness-110 px-8 border-none" @click="save">Save</button>
        </form>
      </div>
    </div>
    <form method="dialog" class="modal-backdrop bg-black/60">
      <button>close</button>
    </form>
  </dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const modal = ref<HTMLDialogElement | null>(null)
const startTime = ref('09:00')
const endTime = ref('17:00')

const emit = defineEmits<{
  (e: 'save', entry: { start: string, end: string }): void
}>()

const open = () => {
  modal.value?.showModal()
}

const save = () => {
  emit('save', {
    start: startTime.value,
    end: endTime.value
  })
}

defineExpose({
  open
})
</script>
