<template>
  <div class="min-h-full bg-[#121212] text-white font-sans p-6 pb-24 relative flex flex-col">
    <!-- header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold mb-1 track-tight">Log Work</h1>
      <p class="text-[#8E8E93] text-lg">{{ formattedDate }}</p>
    </div>

    <!-- Time Selection Area -->
    <div class="grid grid-cols-2 gap-8 mb-8">
      <!-- Start Time -->
      <div class="flex flex-col items-center">
        <label class="text-[#8E8E93] text-xs font-bold tracking-[0.15em] mb-4">START TIME</label>
        <div class="flex items-center gap-2">
           <!-- Hours -->
           <div class="h-32 w-16 overflow-y-auto snap-y snap-mandatory no-scrollbar text-center relative pointer-events-auto scroll-smooth" ref="startHourRef">
              <div class="h-10"></div> <!-- Spacer -->
              <div 
                v-for="h in 24" 
                :key="`sh-${h-1}`"
                @click="setStartTime(h-1, startMinute)"
                class="snap-center h-12 flex items-center justify-center text-2xl font-medium transition-all duration-200 cursor-pointer active:scale-95 hover:scale-110"
                :class="(h-1) === startHour ? 'text-[#ECD500] text-3xl font-bold scale-110' : 'text-[#3A3A3C] hover:text-white'"
              >
                {{ formatNumber(h-1) }}
              </div>
              <div class="h-10"></div> <!-- Spacer -->
           </div>

           <span class="text-[#3A3A3C] text-2xl mb-1">:</span>

           <!-- Minutes -->
           <div class="h-32 w-16 overflow-y-auto snap-y snap-mandatory no-scrollbar text-center relative pointer-events-auto scroll-smooth" ref="startMinuteRef">
              <div class="h-10"></div> <!-- Spacer -->
              <div 
                v-for="m in minuteOptions" 
                :key="`sm-${m}`"
                @click="setStartTime(startHour, m)"
                class="snap-center h-12 flex items-center justify-center text-2xl font-medium transition-all duration-200 cursor-pointer active:scale-95 hover:scale-110"
                :class="m === startMinute ? 'text-[#ECD500] text-3xl font-bold scale-110' : 'text-[#3A3A3C] hover:text-white'"
              >
                {{ formatNumber(m) }}
              </div>
              <div class="h-10"></div> <!-- Spacer -->
           </div>
        </div>
      </div>

      <!-- End Time -->
      <div class="flex flex-col items-center">
        <label class="text-[#8E8E93] text-xs font-bold tracking-[0.15em] mb-4">END TIME</label>
         <div class="flex items-center gap-2">
           <!-- Hours -->
           <div class="h-32 w-16 overflow-y-auto snap-y snap-mandatory no-scrollbar text-center relative pointer-events-auto scroll-smooth" ref="endHourRef">
              <div class="h-10"></div> <!-- Spacer -->
              <div 
                v-for="h in 24" 
                :key="`eh-${h-1}`"
                @click="setEndTime(h-1, endMinute)"
                class="snap-center h-12 flex items-center justify-center text-2xl font-medium transition-all duration-200 cursor-pointer active:scale-95 hover:scale-110"
                :class="(h-1) === endHour ? 'text-[#ECD500] text-3xl font-bold scale-110' : 'text-[#3A3A3C] hover:text-white'"
              >
                {{ formatNumber(h-1) }}
              </div>
              <div class="h-10"></div> <!-- Spacer -->
           </div>

           <span class="text-[#3A3A3C] text-2xl mb-1">:</span>

           <!-- Minutes -->
           <div class="h-32 w-16 overflow-y-auto snap-y snap-mandatory no-scrollbar text-center relative pointer-events-auto scroll-smooth" ref="endMinuteRef">
              <div class="h-10"></div> <!-- Spacer -->
              <div 
                v-for="m in minuteOptions" 
                :key="`em-${m}`"
                @click="setEndTime(endHour, m)"
                class="snap-center h-12 flex items-center justify-center text-2xl font-medium transition-all duration-200 cursor-pointer active:scale-95 hover:scale-110"
                :class="m === endMinute ? 'text-[#ECD500] text-3xl font-bold scale-110' : 'text-[#3A3A3C] hover:text-white'"
              >
                {{ formatNumber(m) }}
              </div>
              <div class="h-10"></div> <!-- Spacer -->
           </div>
        </div>
      </div>
    </div>

    <!-- Arrow Indicator (Visual only) -->
    <div class="absolute top-[170px] left-1/2 -translate-x-1/2 text-[#3A3A3C]">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6">
        <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
      </svg>
    </div>

    <!-- Total Duration & Info -->
    <div class="flex flex-col items-center mb-10">
      <span class="text-[#8E8E93] text-xs font-bold tracking-[0.15em] mb-2 uppercase">Total Duration</span>
      <div class="flex items-center gap-3">
        <span class="text-5xl font-bold text-white tracking-tight">
          {{ formattedDuration }}
        </span>
        <span v-if="overtimeAmount && overtimeAmount > 0" class="bg-blue-500/20 text-blue-400 text-sm font-bold px-2 py-1 rounded-md">
          +{{ formatOvertime(overtimeAmount) }}
        </span>
      </div>
      <span v-if="isOvernight" class="text-[#8E8E93] text-sm mt-2 flex items-center gap-1">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-4 h-4">
          <path fill-rule="evenodd" d="M7.455 2.004a.75.75 0 01.26.77 7 7 0 009.958 7.967.75.75 0 011.067.853A8.5 8.5 0 116.647 1.921a.75.75 0 01.808.083z" clip-rule="evenodd" />
        </svg>
        Overnight work detected
      </span>
    </div>

    <!-- Overtime Toggle -->
    <div class="bg-[#1C1C1E] rounded-2xl p-5 mb-8 flex items-center justify-between">
      <div>
        <h3 class="text-white font-semibold text-lg">Overtime</h3>
        <p class="text-[#8E8E93] text-sm">Mark this entry as overtime</p>
      </div>
      
      <!-- Custom Toggle -->
      <div class="bg-[#2C2C2E] p-1 rounded-lg flex items-center relative h-10 w-32 cursor-pointer transition-all active:scale-95" @click="toggleOvertime">
         <div class="absolute top-1 bottom-1 w-[calc(50%-4px)] bg-[#3A3A3C] rounded-md transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] shadow-sm"
              :class="isOvertime ? 'left-[calc(50%+2px)]' : 'left-1'"></div>
         <div class="flex-1 z-10 text-center text-sm font-semibold transition-colors duration-300"
              :class="!isOvertime ? 'text-white' : 'text-[#8E8E93]'">No</div>
         <div class="flex-1 z-10 text-center text-sm font-semibold transition-colors duration-300"
              :class="isOvertime ? 'text-white' : 'text-[#8E8E93]'">Yes</div>
      </div>
    </div>

    <!-- Notes -->
    <div class="mb-8 flex-1">
      <label class="block text-[#8E8E93] text-xs font-bold tracking-[0.15em] mb-4 pl-1 uppercase">
        Notes (Optional)
      </label>
      <div class="bg-[#1C1C1E] rounded-lg p-1">
          <textarea 
            v-model="notes" 
            class="textarea textarea-ghost w-full min-h-[100px] text-lg text-white placeholder-[#3A3A3C] focus:bg-transparent focus:outline-none focus:border-none resize-none px-4 py-3 transition-all duration-200 focus:scale-[1.01]" 
            placeholder="What did you work on today?"
          ></textarea>
      </div>
    </div>

    <!-- Save Button -->
    <div class="mt-auto">
      <button 
        @click="saveEntry"
        class="btn bg-[#ECD500] hover:bg-[#D4BE00] text-black border-none w-full text-lg font-bold rounded-2xl h-14 flex items-center justify-center gap-2 transform transition-all duration-150 active:scale-95 hover:-translate-y-0.5"
      >
        Save Entry
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-6 h-6">
          <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
        </svg>
      </button>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick, onMounted } from 'vue';

const props = defineProps<{
  initialData?: any;
  selectedDate?: string;
}>();

const emit = defineEmits(['save', 'cancel']);

// Session ID (if editing)
const entryId = ref<string | null>(null);

// Date state
const date = ref(new Date());
const formattedDate = computed(() => {
  return date.value.toLocaleDateString('en-US', { weekday: 'short', day: '2-digit', month: 'short' });
});

// Time Pickers state
const startHour = ref(9);
const startMinute = ref(0);
const endHour = ref(17);
const endMinute = ref(0); 
const minuteOptions = [0, 15, 30, 45];

// Refs for scroll containers
const startHourRef = ref<HTMLElement | null>(null);
const startMinuteRef = ref<HTMLElement | null>(null);
const endHourRef = ref<HTMLElement | null>(null);
const endMinuteRef = ref<HTMLElement | null>(null);

// Other form state
const isOvertime = ref(false);
const notes = ref('');

// Logic
const setStartTime = (h: number, m: number) => {
  startHour.value = h;
  startMinute.value = m;
};

const setEndTime = (h: number, m: number) => {
  endHour.value = h;
  endMinute.value = m;
};

const toggleOvertime = () => {
    isOvertime.value = !isOvertime.value;
}

// Derived state
const isOvernight = computed(() => {
  const startTotal = startHour.value * 60 + startMinute.value;
  const endTotal = endHour.value * 60 + endMinute.value;
  return endTotal < startTotal;
});

const calculatedDurationMinutes = computed(() => {
    const startTotal = startHour.value * 60 + startMinute.value;
    let endTotal = endHour.value * 60 + endMinute.value;
    
    if (isOvernight.value) {
        endTotal += 24 * 60; // Add 24 hours
    }
    
    return endTotal - startTotal;
});

const formattedDuration = computed(() => {
    const totalMinutes = calculatedDurationMinutes.value;
    const h = Math.floor(totalMinutes / 60);
    const m = totalMinutes % 60;
    return `${String(h).padStart(2, '0')}h ${String(m).padStart(2, '0')}m`;
});

const overtimeAmount = computed(() => {
    const totalMinutes = calculatedDurationMinutes.value;
    const standardDayMinutes = 8 * 60; // 8 hours
    if (totalMinutes > standardDayMinutes) {
        return totalMinutes - standardDayMinutes;
    }
    return 0;
});

const formatOvertime = (minutes: number) => {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    if (h > 0) return `${h}h ${m}m`;
    return `${m}m`;
}

// Helpers
const formatNumber = (n: number) => String(n).padStart(2, '0');

const scrollToSelected = () => {
    // Each item is 48px high (h-12). 
    // We want to center it, so we need to account for container height too, 
    // but the spacer logic simplifies it to just index * 48
    
    // Helper to scroll a container
    const scrollContainer = (container: HTMLElement | null, index: number) => {
        if (!container) return;
        container.scrollTop = index * 48;
    };

    scrollContainer(startHourRef.value, startHour.value);
    scrollContainer(startMinuteRef.value, minuteOptions.indexOf(startMinute.value));
    
    scrollContainer(endHourRef.value, endHour.value);
    scrollContainer(endMinuteRef.value, minuteOptions.indexOf(endMinute.value));
};

// Save
const saveEntry = () => {
    const totalHours = calculatedDurationMinutes.value / 60;
    
    emit('save', {
        id: entryId.value, // Include ID if editing
        date: date.value.toISOString().split('T')[0],
        startTime: `${formatNumber(startHour.value)}:${formatNumber(startMinute.value)}`,
        endTime: `${formatNumber(endHour.value)}:${formatNumber(endMinute.value)}`,
        hoursWorked: totalHours,
        tasks: notes.value,
        isWeekend: isOvertime.value,
        autoGenerated: false,
        modifiedAt: Date.now()
    });
};

const hydrate = (data: any) => {
    if (!data) {
        // Reset form for new entry (completely blank)
        entryId.value = null;
        
        // Use selectedDate if provided, otherwise use today
        if (props.selectedDate) {
            date.value = new Date(props.selectedDate);
        } else {
            date.value = new Date();
        }
        
        const now = new Date();
        // Default to a 1-hour slot starting now or at 17:00 if it's "mostly after 17"
        const currentHour = now.getHours();
        startHour.value = currentHour >= 17 ? currentHour : 9;
        startMinute.value = 0;
        endHour.value = startHour.value + 1;
        endMinute.value = 0;
        notes.value = '';
        isOvertime.value = false;
        return;
    } else if (!data.id) {
        // New entry with pre-calculated times (Draft mode)
        entryId.value = null; // Ensure ID is null so it saves as new
        
        if (props.selectedDate) {
            date.value = new Date(props.selectedDate);
        }

        // Hydrate times from draft data if available
        if (data.startTime) {
            const d = new Date(data.startTime);
            startHour.value = d.getHours();
            startMinute.value = d.getMinutes();
        }
        
        if (data.endTime) {
            const d = new Date(data.endTime);
            endHour.value = d.getHours();
            endMinute.value = d.getMinutes();
        }

        // Reset other fields
        notes.value = '';
        isOvertime.value = false;
        return; 
    }
    
    entryId.value = data.id || null;
    
    if (data.startTime) {
        const d = new Date(data.startTime);
        startHour.value = d.getHours();
        startMinute.value = d.getMinutes();
    }
    
    if (data.endTime) {
        const d = new Date(data.endTime);
        endHour.value = d.getHours();
        endMinute.value = d.getMinutes();
    }
    
    if (data.tasks) {
        notes.value = data.tasks;
    }
    
    if (data.isOvertime !== undefined) {
        isOvertime.value = data.isOvertime;
    }
}

// Watch for initialData changes - ALWAYS call hydrate to reset form state
watch(() => props.initialData, (newData) => {
    hydrate(newData)
    // Scroll to position after DOM update
    nextTick(() => {
        scrollToSelected();
    });
}, { immediate: true })
;

onMounted(() => {
    // Initial scroll
    nextTick(() => {
        scrollToSelected();
    });
});

</script>

<style scoped>
/* Hidden scrollbar utilities */
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
