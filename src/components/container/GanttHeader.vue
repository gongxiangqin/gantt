<template>
  <table
    ref="ganttHeaderRef"
    class="xg-gantt-header"
    :style="{ height: `${$param.headerHeight}px` }"
    cellpadding="0"
    cellspacing="0"
    border="0"
  >
    <colgroup>
      <template v-for="(c, i) in dateList[1]" :key="i">
        <col
          :width="`${getGanttUnitColumnWidth(
            c.date.date,
            i === 0
              ? 'after'
              : i === dateList[1].length - 1
              ? 'before'
              : undefined
          )}px`"
        />
      </template>
    </colgroup>

    <thead>
      <tr v-if="phaseList && phaseList.length">
        <th
          v-for="(phase, index) in phaseList"
          :key="index"
          :colspan="calcPhaseColspan(phase)"
          class="xg-gantt-header-cell phase-header"
          :style="{
            'border-color': $styleBox.borderColor,
            color: $styleBox.headerStyle?.textColor,
            backgroundColor:
              $styleBox.headerStyle?.bgColor || $styleBox.primaryColor
          }"
        >
          {{ phase.name }}
        </th>
      </tr>
      <tr v-for="(r, trIndex) in dateList" :key="trIndex">
        <th
          v-for="(c, i) in r"
          :key="i"
          :class="[
            'xg-gantt-header-cell',
            {
              highlight:
                $styleBox.highlightDate &&
                trIndex === dateList.length - 1 &&
                ['day', 'hour'].includes(ganttHeader.unit) &&
                ($param.hoverItem?.start.isSame(c.date, ganttHeader.unit) ||
                  $param.hoverItem?.end.isSame(c.date, ganttHeader.unit))
            },
            { 'xg-gantt-header-cell__each': trIndex !== 0 }
          ]"
          :style="{
            'border-color': $styleBox.borderColor,
            color: $styleBox.headerStyle?.textColor,
            backgroundColor:
              $styleBox.headerStyle?.bgColor || $styleBox.primaryColor
          }"
          :colspan="c.colSpan"
          :rowspan="c.rowSpan"
        >
          {{ c.label }}
        </th>
      </tr>
    </thead>
  </table>
</template>

<script lang="ts" setup>
import useData from '@/composables/useData';
import useGanttWidth from '@/composables/useGanttWidth';
import useStyle from '@/composables/useStyle';
import useParam from '@/composables/useParam';
import useElement from '@/composables/useElement';
import { onMounted, onUpdated, ref, watch } from 'vue';
import useGanttHeader from '@/composables/useGanttHeader';
import usePhases from '@/composables/usePhases'; // 新增阶段数据
import { PhaseItem } from '@/models/data/phases';

const { $param } = useParam();
const { $styleBox } = useStyle();
const { dateList } = useData();
const { getGanttUnitColumnWidth } = useGanttWidth();
const { ganttHeaderRef, updateHeaderHeight } = useElement();
const { ganttHeader } = useGanttHeader();
const { $phases } = usePhases(); // 获取阶段数据
const phaseList = ref<PhaseItem[]>([]);
onMounted(updateHeaderHeight);
onUpdated(updateHeaderHeight);

watch(
  () => $phases?.phases,
  newVal => {
    if (newVal) {
      phaseList.value = newVal;
      console.log('阶段数据已更新', phaseList.value);
      // nextTick(updateHeaderHeight); // 强制更新布局
    }
  },
  { immediate: true, deep: true }
);

// 计算阶段占据的列数
const calcPhaseColspan = (phase: PhaseItem) => {
  console.log('计算阶段占据的列数', phase);
  const startIndex = ganttHeader.datesByUnit.findIndex(
    d =>
      d.compareTo(phase.startDate) === 'r' ||
      d.compareTo(phase.startDate) === 'e'
  );
  const endIndex = ganttHeader.datesByUnit.findIndex(
    d =>
      d.compareTo(phase.endDate) === 'r' || d.compareTo(phase.endDate) === 'e'
  );
  // endIndex = endIndex;
  return endIndex - startIndex;
};
</script>

<style lang="scss">
.xg-gantt-header {
  width: 100%;
  table-layout: fixed;
  border-collapse: separate;
  top: 0;
  position: sticky;
  z-index: 10;
  white-space: nowrap;
  overflow: hidden;

  .xg-gantt-header-cell {
    overflow: hidden;
    text-overflow: ellipsis;
    vertical-align: middle;
    text-align: center;
    position: relative;
    box-sizing: border-box;
    border-bottom: 1px solid #e5e5e5;
    border-right: 1px solid #e5e5e5;
    font-size: 14px;
  }

  .xg-gantt-header-cell__each {
    font-size: 12px;
    word-wrap: break-word;
  }

  .highlight {
    filter: brightness(1.2);
  }
}
// 新增阶段样式
.phase-header {
  font-weight: bold;
  // border-bottom: 2px solid #666 !important;
}
</style>
