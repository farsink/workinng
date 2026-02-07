<template>
  <dialog ref="modal" class="modal modal-bottom sm:modal-middle">
    <!-- Modal Box: Dark theme, bottom sheet rounded top corners -->
    <div class="modal-box bg-[#121212] border-t border-white/10 p-0 overflow-hidden h-[90vh] sm:h-auto sm:max-h-[90vh] sm:rounded-2xl rounded-t-2xl shadow-2xl">
      
      <!-- Drag Handle -->
      <div class="w-full flex justify-center pt-3 pb-1 bg-[#121212]">
        <div class="w-12 h-1.5 rounded-full bg-[#3A3A3C]"></div>
      </div>

      <!-- Content -->
      <div class="h-full overflow-y-auto">
        <TimeEntryForm :initial-data="initialData" :selected-date="selectedDate" @save="handleSave" />
      </div>

    </div>
    
    <!-- Backdrop -->
    <form method="dialog" class="modal-backdrop bg-black/60 backdrop-blur-sm">
      <button>close</button>
    </form>
  </dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import TimeEntryForm from '@/components/TimeEntryForm.vue';

const modal = ref<HTMLDialogElement | null>(null);
const initialData = ref<any>(null);

const props = defineProps<{
  selectedDate?: string
}>()

const emit = defineEmits<{
  (e: 'save', entry: any): void
}>();

const open = (data?: any) => {
  initialData.value = data || null;
  modal.value?.showModal();
};

const handleSave = (entry: any) => {
  emit('save', entry);
  modal.value?.close();
};

defineExpose({
  open
});
</script>
