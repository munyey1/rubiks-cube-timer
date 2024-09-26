<style scoped></style>

<template>
  <div>
    <button @click="test">test</button>
  </div>
</template>

<script>
import { ref } from "vue";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
} from "chart.js";
import { Line } from "vue-chartjs";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default {
  props: {
    times: Array,
  },
  components: {
    LineChart: Line,
  },
  /*
  setup() {
    
    const chartData = ref(null);
    const chartOptions = ref({
      responsive: true,
      plugins: {
        legend: {
          display: false,
        },
      },
    });

    const lineTimes = times.map((time) => time.time);
    const lineLabels = times.map((time) => {
      const date = new Date(time.created_at).toISOString();
      return date
    });

    onMounted(() => {
      console.log("mounted");
    });

    return { lineTimes, lineLabels };
  },
  */
  
  methods: {
    test() {
      console.log(this.times);
    },
  }

};
</script>
