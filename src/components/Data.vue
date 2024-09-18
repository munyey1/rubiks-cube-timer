<style scoped>

</style>

<script>
import { randomScrambleForEvent } from "https://cdn.cubing.net/js/cubing/scramble";
import { supabase } from "../supabase";

/*
TODO:

time to do the data side of the app
https://www.chartjs.org/

### 1. **Average Solve Time**
   - **Insight:** The average solve time for a user over a specific period (last week, month, or all time).
   - **How it helps:** Gives users a baseline for their performance and helps track improvement over time.

### 2. **Best Solve Time**
   - **Insight:** The fastest recorded solve time by a user.
   - **How it helps:** Motivates users by highlighting their personal best performance.

### 3. **Worst Solve Time**
   - **Insight:** The slowest solve time by a user.
   - **How it helps:** Helps users identify when they might have faced challenges and encourages analysis of what went wrong.

### 4. **Median Solve Time**
   - **Insight:** The middle value of all solve times, showing the typical performance (less affected by extreme outliers).
   - **How it helps:** Gives a more accurate representation of a user's usual solving time than the average (especially if they have a few very slow/fast solves).

### 5. **Standard Deviation of Solve Times**
   - **Insight:** The variation in a user's solve times.
   - **How it helps:** A low standard deviation indicates consistent solving times, while a high value shows more variability. This insight helps users understand their consistency.

### 6. **Solves Over Time (Trend Analysis)**
   - **Insight:** Track solve times across a period (e.g., daily, weekly, or monthly trends).
   - **How it helps:** Visualizing improvement over time, which is encouraging and can point out periods where users improved quickly or plateaued.

### 7. **Time to Improvement (Progress Rate)**
   - **Insight:** The number of solves or the amount of time between improvements in personal bests (e.g., time between milestones like reducing solve time by 10 seconds).
   - **How it helps:** Helps users see how quickly they're progressing and motivates them to keep practicing.

### 8. **Top 5 or 10 Solve Times**
   - **Insight:** Display the user’s top 5 or 10 best solve times.
   - **How it helps:** Gives users a quick glance at their top performances, useful for seeing if they're improving their best times over a short or long period.

### 10. **Number of Solves Per Day/Week**
   - **Insight:** The number of solves a user completes in a day or week.
   - **How it helps:** Encourages regular practice and helps identify how practice frequency correlates with improvements.

### 13. **Personal Best Over Time**
   - **Insight:** A chart showing how the user’s personal best has improved over time.
   - **How it helps:** A motivating tool to see improvement over the long term, showing when new personal bests were achieved.

### 14. **Average Time by Time of Day**
   - **Insight:** How solve times vary depending on when the user is solving (morning, afternoon, evening).
   - **How it helps:** Some users might perform better at specific times of the day, allowing them to optimize their practice schedule.

### 15. **DNF (Did Not Finish) Rate**
   - **Insight:** The percentage of solves marked as DNF (if applicable).
   - **How it helps:** Users can track how often they fail to complete a solve, which might indicate if they're taking too many risks or struggling with particular cases.

### 16. **Ao5, Ao12, Ao50 (Average of X Solves)**
   - **Insight:** Average of the best 5, 12, or 50 solves, often excluding outliers (e.g., the fastest and slowest solves).
   - **How it helps:** These are standard metrics used in the speedcubing community, giving users a common way to evaluate their performance.

### 17. **Time Reduction Milestones**
   - **Insight:** A timeline or chart showing when users hit specific time targets (e.g., sub-30, sub-25, sub-20 seconds).
   - **How it helps:** Provides users with clear milestones that motivate them to continue improving.

---

### Implementation Tips:
- Use visualizations (charts, graphs) to display trends, averages, and best times over time.
- Allow users to filter insights by date range (e.g., last 7 days, last 30 days) for better control over their performance analysis.
*/

export default {
  props: {
    session: Object,
  },

};
</script>

<template>
  <div className="container min-w-full grid grid-cols-3 mt-10">
    <div className="container flex flex-col items-center">
      test
    </div>
    <div className="container flex flex-col items-center">
      test
    </div>
    <div className="container flex flex-col items-center">
      test
    </div>
  </div>
</template>
