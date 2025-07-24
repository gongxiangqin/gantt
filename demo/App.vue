<template>
  <div style="margin: 0 auto; width: 500px">
    <img src="@/assets/logo.png" alt="" width="500" />
  </div>

  <div style="
      display: flex;
      justify-content: center;
      margin-bottom: 10px;
      gap: 10px;
    ">
    <button :style="{ backgroundColor: !isMulti ? 'aqua' : '' }" @click="() => jumpDebug()">
      跳转
    </button>
    <button :style="{ backgroundColor: isMulti ? 'aqua' : '' }" @click="() => (isMulti = true)">
      多页
    </button>
  </div>

  <!-- 已知问题，不要用 v-show 进行切换。 -->
  <!-- 原因：1、加载数据过多，对页面不友好 -->
  <!--      2、内部不会响应变化，导致初次加载未显示的图表数据加载不全（因为组件高度为 0） -->
  <!-- 使用 v-if 可以避免上面问题。但是如果数据量大，每次切换会有等待时间，同样值得解决 -->
  <div v-if="!isMulti" aria-label="单页">
    <div style="height: 400px; padding-bottom: 10px">
      <x-gantt ref="gantt" class="gantt" :data="dataList2" :phases="phases"
            data-id="id" start-key="startDate" end-key="endDate" locale="zh-cn" :slider-into-view="true"
            :bodyStyle="bodyStyle" :unit="unit" :format-gantt-header="unit =='day' ? 'D' : ''" :expand-all="false" primary-color="#f7f7f8"
            :expand-index="1" :show-expand="true" @move-slider="moveSlider" @add-link="onAddLink"
             header-height="55">
            <x-gantt-column prop="name" label="名称" width="140">
            </x-gantt-column>

            <x-gantt-column prop="startDate" label="开始时间" width="100" date-format="YYYY-MM-DD" />
            <x-gantt-column prop="endDate" label="结束时间" width="100" date-format="YYYY-MM-DD" />
            <x-gantt-slider :progress="true" progress-color="#10d353" bg-color="#4195fbaa" :progress-decimal="true"
                :move="true" :linked-resize="false" :resize-left="true" :resize-right="true" height="35%">
                <template v-slot="{ row }">
                    <div v-if="row.progress" style="height: 100%; line-height: normal; color: #fff">
                        {{ (row.progress * 100).toFixed(0) + "%" }}
                    </div>
                </template>
            </x-gantt-slider>
        </x-gantt>
      <!-- <XGantt ref="gantt" :row-height="40" data-id="id" start-key="startDate" end-key="endDate"
        :expand-all="false" :expand-index="0" highlight-date locale="zh-cn" :dark="isDark" :gantt-column-size="colSize"
        :show-checkbox="showCheckbox" :show-weekend="showWeekend" :show-today="showToday" :show-expand="true" :holidays="[
          { date: '2023-8-8', color: 'green' }
        ]" :data="dataList2" :phases="dataList2" :unit="unit" :links="linkList" :draggable="true"
        :header-style="headerStyle" :level-color="levelColor" @row-click="rowClick" @row-dbl-click="rowDblClick"
        @row-checked="rowChecked" @move-slider="moveSlider" @move-progress="moveProgress" @add-link="onAddLink"
        @no-date-error="noDateError">

        <XGanttSlider date-format="MM-dd H:mm:s" empty-data="" :move="handleMove" :resize-left="true"
          :resize-right="true" :linked-resize="true" :progress="useProgress" progress-decimal move-by-unit>
          <template #content="{ row, level }">
            <div v-if="level === 1" class="slider-level-one"></div>
          </template>
        </XGanttSlider>

        <XGanttColumn prop="id" :merge="merge3" width="150">
          <template #default="{ row }">
            <div style="background-color: #ccc; width: 100%">
              {{ row.name }}
            </div>
          </template>
        </XGanttColumn>
      </XGantt> -->
    </div>

    <div>total: {{ dataList.length }}</div>

    <button @click="() => (isDark = !isDark)">
      切换到{{ isDark ? `浅色` : `深色` }}模式
    </button>
    <button @click="handleClickReloadData">重新赋值</button>
    <button @click="handleClickEmpty">清空</button>
    <button @click="handleClickModify">修改</button>
    <button @click="handleClickInsert">插入</button>
    <button @click="handleClickInsertChildren">插入子项</button>
    <button @click="handleClickDelete">删除</button>
    <button @click="handleClickColor">切换颜色</button>
    <button @click="() => (showCheckbox = !showCheckbox)">显示checkbox</button>
    <button @click="() => (showWeekend = !showWeekend)">显示weekend</button>
    <button @click="() => (showToday = !showToday)">显示today</button>
    <button @click="() => (showExpand = !showExpand)">显示expand</button>
    <button @click="() => (draggable = !draggable)">拖拽</button>
    <button @click="setSelected">设置选择</button>
    <button @click="jumpTo">跳转到</button>
    <input type="range" name="" id="" min="20" max="70" v-model="rowHeight1" />
    <div style="display: inline-block">
      选择列宽
      <button @click="() => (colSize = 'small')">小</button>
      <button @click="() => (colSize = 'normal')">中</button>
      <button @click="() => (colSize = 'large')">大</button>
    </div>
    <button @click="changeUnit1">切换单位</button>
    <button @click="() => (useProgress = !useProgress)">使用进度</button>
  </div>

  <div v-else aria-label="多页">
    <div style="padding-bottom: 10px">
      <div style="font-size='12px'">
        该组件展示了传入错误的 slider 参数，渲染出来的效果：
        <em>prop="name" date-format="MM-dd H:mm:ss"</em>
      </div>
      <div style="height: 200px; padding-bottom: 10px">
        <XGantt ref="gantt2" header-height="60" :row-height="rowHeight2" data-id="index" expand-all :dark="isDark2"
          :gantt-column-size="colSize2" :show-checkbox="showCheckbox2" :show-weekend="showWeekend2"
          :show-today="showToday2" :show-expand="showExpand2" :unit="unit2" :data="dataList2" :links="linkList2"
          :header-style="headerStyle2" :body-style="bodyStyle2" :level-color="levelColor2" @row-click="rowClick"
          @row-dbl-click="rowDblClick" @row-checked="rowChecked" @move-slider="moveSlider" @add-link="onAddLink2"
          @no-date-error="noDateError">
          <XGanttSlider prop="name" date-format="MM-dd H:mm:ss" empty-data="" />

          <XGanttColumn prop="index" :merge="merge3">
            <template #default="{ row }">
              <div style="background-color: #ccc; width: 100%">
                {{ row.name }}
              </div>
            </template>
          </XGanttColumn>

          <x-gantt-column prop="endDate" label="自定义标签" width="200" date-format="q yyyy-MM-dd HH:mm:ss" :merge="merge4">
            <template #default="{ row }">
              <span name="end" :style="{ backgroundColor: `#${555}`, color: '#789' }">
                abc - {{ row.endDate }}
              </span>
            </template>
          </x-gantt-column>
        </XGantt>
      </div>

      <div>total: {{ dataList2.length }}</div>

      <button @click="() => (isDark2 = !isDark2)">
        切换到{{ isDark2 ? `浅色` : `深色` }}模式
      </button>
      <button @click="handleClickReloadData2">重新赋值</button>
      <button @click="handleClickEmpty2">清空</button>
      <button @click="handleClickModify2">修改</button>
      <button @click="handleClickInsert2">插入</button>
      <button @click="handleClickInsertChildren2">插入子项</button>
      <button @click="handleClickDelete2">删除</button>
      <button @click="handleClickColor2">切换颜色</button>
      <button @click="() => (showCheckbox2 = !showCheckbox2)">
        显示checkbox
      </button>
      <button @click="() => (showWeekend2 = !showWeekend2)">显示weekend</button>
      <button @click="() => (showToday2 = !showToday2)">显示today</button>
      <button @click="() => (showExpand2 = !showExpand2)">显示expand</button>
      <button @click="setSelected2">设置选择</button>
      <button @click="jumpTo2">跳转到</button>
      <input type="range" name="" id="" min="20" max="70" v-model="rowHeight2" />
      <div style="display: inline-block">
        选择列宽
        <button @click="() => (colSize2 = 'small')">小</button>
        <button @click="() => (colSize2 = 'normal')">中</button>
        <button @click="() => (colSize2 = 'large')">大</button>
      </div>
      <button @click="changeUnit2">切换单位</button>
    </div>

    <div style="padding-bottom: 10px">
      <div style="height: 300px; padding-bottom: 10px">
        <XGantt ref="gantt3" header-height="30" :row-height="rowHeight3" data-id="uid" expand-all :dark="isDark3"
          :gantt-column-size="colSize3" :show-checkbox="showCheckbox3" :show-weekend="showWeekend3"
          :show-today="showToday3" :show-expand="showExpand3" :data="dataList3" :links="linkList3"
          :header-style="headerStyle3" :body-style="bodyStyle3" :level-color="levelColor3" @row-click="rowClick"
          @row-dbl-click="rowDblClick" @row-checked="rowChecked" @move-slider="moveSlider" @add-link="onAddLink3"
          @no-date-error="noDateError">
          <XGanttSlider prop="uid" date-format="MM-dd H:mm:ss" empty-data="" :move="move3" :resize-left="true"
            :resize-right="true" :linked-resize="true" bg-color="lightgreen" />

          <XGanttColumn prop="name" width="150">
            <template #default="{ row }">
              <div>{{ row.uid }} - {{ row.name }}</div>
            </template>
          </XGanttColumn>

          <XGanttColumn prop="ttt.a" column-style="backgroundColor: #cde; padding-left: 10px"
            column-class="test-class" />
        </XGantt>
      </div>

      <div>total: {{ dataList3.length }}</div>

      <button @click="() => (isDark3 = !isDark3)">
        切换到{{ isDark3 ? `浅色` : `深色` }}模式
      </button>
      <button @click="handleClickReloadData3">重新赋值</button>
      <button @click="handleClickEmpty3">清空</button>
      <button @click="handleClickModify3">修改</button>
      <button @click="handleClickInsert3">插入</button>
      <button @click="handleClickInsertChildren3">插入子项</button>
      <button @click="handleClickDelete3">删除</button>
      <button @click="handleClickColor3">切换颜色</button>
      <button @click="handleMoveChange3">可以移动</button>
      <button @click="() => (showCheckbox3 = !showCheckbox3)">
        显示checkbox
      </button>
      <button @click="() => (showWeekend3 = !showWeekend3)">显示weekend</button>
      <button @click="() => (showToday3 = !showToday3)">显示today</button>
      <button @click="() => (showExpand3 = !showExpand3)">显示expand</button>
      <button @click="setSelected3">设置选择</button>
      <button @click="jumpTo3">跳转到</button>
      <input type="range" name="" id="" min="20" max="70" v-model="rowHeight3" />
      <div style="display: inline-block">
        选择列宽
        <button @click="() => (colSize3 = 'small')">小</button>
        <button @click="() => (colSize3 = 'normal')">中</button>
        <button @click="() => (colSize3 = 'large')">大</button>
      </div>
    </div>
  </div>

  <div class="tip-text">按 F12 打开控制台以查看事件输出内容。</div>

  <div class="code-link">
    该页面源代码在
    <a href="https://github.com/jeremyjone/jz-gantt/blob/master/src/App.vue">这里</a>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive } from 'vue';
import demo from './demo.vue';

let INDEX = 1;
let LINK_INDEX = 1;

export default defineComponent({
  name: 'App',

  data() {
    return {
      isMulti: false,
      changeColor: 0,
      isDark: false,
      useProgress: true,
      dataList: [] as any[],
      phases: [] as any[],
      linkList: reactive([]) as any[],
      rowHeight1: 60,
      showCheckbox: true,
      showWeekend: true,
      showToday: true,
      showExpand: true,
      draggable: true,
      levelColor: ['azure', 'cornsilk'] as string[],
      headerStyle: {
        bgColor: '',
        textColor: ''
      } as any,
      bodyStyle: {
        textColor: '',
        todayColor: '',
        weekendColor: ''
        // hoverColor: "#f00",
        // selectColor: "#0f0"
      } as any,
      colSize: 'normal',
      showSettingBtn: true,
      unit: 'week',

      isDark2: false,
      dataList2: reactive([]) as any[],
      linkList2: reactive([]) as any[],
      rowHeight2: 30,
      showCheckbox2: true,
      showWeekend2: true,
      showToday2: true,
      showExpand2: true,
      unit2: 'day',
      levelColor2: ['#123456', '#654321'] as string[],
      headerStyle2: {
        bgColor: '#684',
        textColor: ''
      } as any,
      bodyStyle2: {
        textColor: '',
        todayColor: '',
        weekendColor: ''
        // hoverColor: "#f00",
        // selectColor: "#0f0"
      } as any,
      colSize2: 'large',
      showSettingBtn2: true,

      isDark3: true,
      dataList3: [] as any[],
      linkList3: reactive([]) as any[],
      rowHeight3: 20,
      showCheckbox3: true,
      showWeekend3: true,
      showToday3: true,
      showExpand3: true,
      move3: true,
      levelColor3: ['', '#7A1', '#123'] as string[],
      headerStyle3: {
        bgColor: '#9c5',
        textColor: ''
      } as any,
      bodyStyle3: {
        bgColor: '#491614',
        textColor: 'white',
        todayColor: '',
        weekendColor: '',
        hoverColor: '#f00',
        selectColor: '#501'
      } as any,
      colSize3: 'small',
      showSettingBtn3: true
    };
  },

  created() {

    // 测试数据
    let s = 2;
    let e = 15;
    for (let i = 0; i < 10; i++) {
      if (s > e) {
        let t = s;
        s = e;
        e = t;
      }
      this.dataList.push({
        id: INDEX++,
        plainStarTime: `2023-08-${7} 00:00:00`,
        plainEndTime: `2023-9-${10} 23:59:59`,
        // startTime: `2023-08-${8}`,
        // endTime: `2023-09-${24}`,
        ttt: {
          a: 'aaa',
          b: 'bbb'
        },
        name: '我的数据: ' + INDEX
      });
      if (s > 30) s = 2;
      if (e > 30) e = 5;
    }
    // 二级数据
    for (let i = 0; i < 10; i++) {
      if (s > e) {
        let t = s;
        s = e;
        e = t;
      }
      [0, 1, 3, 4, 5, 7, 9].forEach(index => {
        if (this.dataList[index]['children'] === undefined)
          this.dataList[index]['children'] = [];

        this.dataList[index]['children'].push({
          id: INDEX++,
          plainStarTime: `2023-08-${8}`,
          plainEndTime: `2023-8-${10} 23:59:59`,
          // startTime: `2023-08-${8}`,
          // endTime: `2023-09-${24}`,
          name: '子数据: ' + INDEX,
          ttt: {
            a: 's-aaa',
            b: 's-bbb'
          }
        });
      });
      if (s > 30) s = 2;
      if (e > 30) e = 5;
    }

    let startDate = '2023-08-10';
    let n = 0;
    if (this.unit === 'week') {
      n = 6;
    } else if (this.unit == 'day') {
      //获取startDate为星期数
      n = new Date(startDate).getDay();
    }
    //开始时间减n天
    const startDate2 = new Date(startDate);
    startDate2.setDate(startDate2.getDate() - n);
    startDate = startDate2.toISOString().split('T')[0];
    console.log("startDate=======", startDate);

    // let startDateWeek = moment(startDate).week();

    this.phases = [
      {
        name: '设计阶段',
        startDate: startDate,
        endDate: '2023-08-20 23:59:59'
      },
      {
        name: '开发阶段',
        startDate: '2023-08-21', // 添加startDate
        endDate: '2023-8-27 23:59:59'
      }
    ];

    this.dataList2 = [
      { name: "规划阶段", startDate: "2025-5-01", endDate: "2025-05-31 23:59:59" },
      { name: "概念阶段", startDate: "2025-05-31 23:59:59", endDate: "2025-06-17 23:59:59" },
      { name: "设计阶段", startDate: "2025-06-17 23:59:59", endDate: "2025-08-04 23:59:59" },
      { name: "开发阶段", startDate: "2025-08-04 23:59:59", endDate: "2025-09-28 23:59:59" },
      { name: "EVT阶段", startDate: "2025-09-28 23:59:59", endDate: "2025-10-19 23:59:59" },
      { name: "DVT阶段", startDate: "2025-10-19 23:59:59", endDate: "2025-12-01 23:59:59" },
      { name: "验证阶段", startDate: "2025-12-01 23:59:59", endDate: "2025-12-21 23:59:59" },
      { name: "发布阶段", startDate: "2025-12-21 23:59:59", endDate: "2026-01-18 23:59:59" },
      { name: "在售阶段", startDate: "2026-01-18 23:59:59", endDate: "2026-03-31 23:59:59" }
    ]

    // phases======= [
    //   {"name": "规划阶段", "startDate": "2025-04-19 59:59:59", "endDate": "2025-06-01 59:59:59"}, 
    //   {"name": "概念阶段", "startDate": "2025-06-01 59:59:59", "endDate": "2025-06-15 59:59:59"}, 
    //   {"name": "设计阶段", "startDate": "2025-06-15 59:59:59", "endDate": "2025-08-03 59:59:59"}, 
    //   {"name": "开发阶段", "startDate": "2025-08-03 59:59:59", "endDate": "2025-09-28 59:59:59"}, 
    //   {"name": "EVT阶段", "startDate": "2025-09-28 59:59:59", "endDate": "2025-10-19 59:59:59"}, 
    //   {"name": "DVT阶段", "startDate": "2025-10-19 59:59:59", "endDate": "2025-11-30 59:59:59"}, 
    //   {"name": "验证阶段", "startDate": "2025-11-30 59:59:59", "endDate": "2025-12-21 59:59:59"}, 
    //   {"name": "发布阶段", "startDate": "2025-12-21 59:59:59", "endDate": "2026-01-18 59:59:59"}, 
    //   {"name": "在售阶段", "startDate": "2026-01-18 59:59:59", "endDate": "2026-04-05 59:59:59"}]

    this.phases = [
      { name: "规划阶段", startDate: "2025-04-19 59:59:59", endDate: "2025-06-01 59:59:59" },
      { name: "概念阶段", startDate: "2025-06-01 23:59:59", endDate: "2025-06-15 23:59:59" },
      { name: "设计阶段", startDate: "2025-06-17 23:59:59", endDate: "2025-08-03 23:59:59" },
      { name: "开发阶段", startDate: "2025-08-04 23:59:59", endDate: "2025-09-28 23:59:59" },
      { name: "EVT阶段", startDate: "2025-09-28 23:59:59", endDate: "2025-10-19 23:59:59" },
      { name: "DVT阶段", startDate: "2025-10-19 23:59:59", endDate: "2025-11-30 23:59:59" },
      { name: "验证阶段", startDate: "2025-12-01 23:59:59", endDate: "2025-12-21 23:59:59" },
      { name: "发布阶段", startDate: "2025-12-21 23:59:59", endDate: "2026-01-18 23:59:59" },
      { name: "在售阶段", startDate: "2026-01-18 23:59:59", endDate: "2026-04-05 23:59:59" }
    ]

    // 添加2号数据
    // this.dataList2 = [
    //   {
    //     index: INDEX++,
    //     startDate: '2023-04-28',
    //     endDate: '2023-05-10',
    //     name: '2号数据: 1'
    //   },
    //   {
    //     index: INDEX++,
    //     startDate: '2023-05-11',
    //     endDate: '2023-05-20',
    //     name: '2号数据: 2'
    //   },
    //   {
    //     index: INDEX++,
    //     startDate: '2023-05-21',
    //     endDate: '2023-05-30',
    //     name: '2号数据: 3'
    //   }
    // ];

    // 添加3号数据
    this.dataList3 = [
      {
        uid: INDEX++,
        startDate: '2023-10-01',
        endDate: '2023-10-10',
        name: '3号数据: 1',
        ttt: {
          a: 'aaa1',
          b: 'bbb1'
        }
      },
      {
        uid: INDEX++,
        startDate: '2023-10-11',
        endDate: '2023-10-20',
        name: '3号数据: 2',
        ttt: {
          a: 'aaa2',
          b: 'bbb2'
        }
      },
      {
        uid: INDEX++,
        startDate: '2023-10-21',
        endDate: '2023-10-30',
        name: '3号数据: 3',
        ttt: {
          a: 'aaa3',
          b: 'bbb3'
        }
      },
      {
        uid: 4,
        startDate: '2023-10-31',
        endDate: '2023-11-10',
        name: '3号数据: 4',
        ttt: {
          a: 'aaa4',
          b: 'bbb4'
        }
      }
    ];
  },

  methods: {
    jumpDebug: function () {
      //跳转至 debug 页面
      // this.$router.push('/debug'); 
      // window.location.href = '/demo.html';
      const debugPath = window.location.href.includes('localhost')
        ? '/debug.html'  // 开发环境路径
        : './debug.html'; // 生产环境路径

      window.location.href = '/debug.html';
    },
    rowClick: function (data: any) {
      console.log('click row data:', data);
    },

    rowDblClick: function (data: any) {
      console.log('double click row data:', data);
    },

    rowChecked: function (state: boolean, data: any, list: any[]) {
      console.log('check row:', state, data, list);
    },

    // start 与 end 为旧的日期
    moveSlider: function (data: any[], old: { start: Date; end: Date }) {
      console.log('move slider:', data, old);
    },

    // old 为旧的进度
    moveProgress: function (data: any[], old: number) {
      console.log('move progress:', data, old);
    },

    noDateError: function (date: Date) {
      console.log(`${date}不在范围内`);
    },

    merge3: function (data: any) {
      return data.row.id % 3 !== 0;
    },

    merge4: function (data: any) {
      // return data.row.id % 4 !== 0;
      return false;
    },

    merge5: function (data: any) {
      // return data.row.id % 5 !== 0;
      return false;
    },

    handleMove: function ({
      level
    }: {
      row: any;
      $index: number;
      level: number;
    }) {
      return level !== 1;
    },

    handleClickReloadData: function () {
      let s = 2;
      let e = 15;
      for (let i = 0; i < 50000; i++) {
        if (s > e) {
          let t = s;
          s = e;
          e = t;
        }
        this.dataList.push({
          id: INDEX++,
          startTime: `2020-06-${s++}`,
          endTime: `2020-08-${e++}`,
          ttt: {
            a: 'aaa',
            b: 'bbb'
          },
          name: '我的数据: ' + s
        });
        if (s > 30) s = 2;
        if (e > 30) e = 5;
      }
      // 二级数据
      for (let i = 0; i < 5; i++) {
        if (s > e) {
          let t = s;
          s = e;
          e = t;
        }
        [0, 1, 3, 4, 5, 7, 9].forEach(index => {
          if (this.dataList[index]['children'] === undefined)
            this.dataList[index]['children'] = [];

          this.dataList[index]['children'].push({
            id: INDEX++,
            startTime: `2023-06-${s++}`,
            endTime: `2023-07-${e++}`,
            name: '子数据: ' + s,
            ttt: {
              a: 's-aaa',
              b: 's-bbb'
            }
          });
        });
        if (s > 30) s = 2;
        if (e > 30) e = 5;
      }
      // 三级数据
      for (let i = 0; i < 5; i++) {
        if (s > e) {
          let t = s;
          s = e;
          e = t;
        }
        [0, 2].forEach(index => {
          if (this.dataList[0]['children'][index]['children'] === undefined)
            this.dataList[0]['children'][index]['children'] = [];

          this.dataList[0]['children'][index]['children'].push({
            id: INDEX++,
            startTime: `2023-07-${s++}`,
            endTime: `2023-08-${e++}`,
            name: '孙数据: ' + s,
            ttt: {
              a: 'gs-aaa',
              b: 'gs-bbb'
            }
          });
        });
        if (s > 30) s = 2;
        if (e > 30) e = 5;
      }
    },

    handleClickEmpty: function () {
      this.dataList = [];
    },

    handleClickModify: function () {
      Object.assign(this.dataList[0], {
        startTime: '2020-08-10',
        endTime: '2020-09-21'
      });

      Object.assign(this.dataList[0]['children'][2]['children'][0], {
        startTime: `2020-08-13`,
        endTime: `2020-09-17`,
        name: '孙数据: abcde'
      });
    },

    handleClickInsert: function () {
      // 数组的增减，根级操作直接更新，子级操作需要重新赋值，以促使DOM更新
      // 修改原有数据不需要这样的操作，因为内部使用了Proxy
      this.dataList.unshift({
        id: INDEX++,
        startTime: `2020-08-10`,
        endTime: `2020-09-20`,
        name: '数据: ' + INDEX,
        ttt: {
          a: 's-aaa' + INDEX,
          b: 's-bbb' + INDEX
        }
      });
    },

    handleClickInsertChildren: function () {
      this.dataList[0]['children'].unshift({
        id: INDEX++,
        startTime: `2020-08-15`,
        endTime: `2020-09-13`,
        name: '子数据: ' + INDEX,
        ttt: {
          a: 's-aaa' + INDEX,
          b: 's-bbb' + INDEX
        },
        children: [
          {
            id: INDEX++,
            startTime: `2020-08-21`,
            endTime: `2020-09-5`,
            name: '孙数据: ' + INDEX,
            ttt: {
              a: 's-aaa' + INDEX,
              b: 's-bbb' + INDEX
            }
          }
        ]
      });
      this.dataList = [...this.dataList];
    },

    handleClickDelete: function () {
      // console.log(this.dataList[0]["children"].pop());
      console.log(this.dataList.shift());
    },

    handleClickColor() {
      this.changeColor++;

      if (this.changeColor % 2 !== 0) {
        this.levelColor = ['green', 'yellow', 'red'];

        this.headerStyle = {
          bgColor: 'black',
          textColor: 'lightgrey'
        };

        this.bodyStyle = {
          bgColor: 'grey',
          textColor: 'grey'
        };
      } else {
        this.levelColor = ['azure', 'cornsilk'];
        this.headerStyle = {};
        this.bodyStyle = {};
      }
    },

    changeUnit1() {
      const u = ['month', 'week', 'day', 'hour'];
      this.unit = u[(u.indexOf(this.unit) + 1) % u.length];
      console.log('this.unit', this.unit);
    },

    onAddLink(
      link: any,
      data: { from: any; to: any },
      cb: (link: any) => void
    ) {
      const _link = {
        index: LINK_INDEX++,
        from: link.from,
        to: link.to,
        color: 'green'
      };
      this.linkList.push(_link);

      cb(_link);
    },

    setSelected() {
      (this.$refs.gantt as any).setSelected(this.dataList[0]);
    },

    jumpTo() {
      (this.$refs.gantt as any).jumpToDate();
    },

    setHeaderUnit(unit: 'day' | 'week' | 'month') {
      (this.$refs.gantt as any).setHeaderUnit(unit);
    },

    handleClickReloadData2() {
      this.dataList2 = [
        {
          index: INDEX++,
          startDate: '2023-11-01',
          endDate: '2023-11-10',
          name: '2号数据: reload-1'
        },
        {
          index: INDEX++,
          startDate: '2023-11-11',
          endDate: '2023-11-20',
          name: '2号数据: reload-2'
        },
        {
          index: INDEX++,
          startDate: '2023-11-21',
          endDate: '2023-11-30',
          name: '2号数据: reload-3'
        },
        {
          index: INDEX++,
          startDate: '2023-12-01',
          endDate: '2023-12-10',
          name: '2号数据: reload-4'
        },
        {
          index: INDEX++,
          startDate: '2023-12-11',
          endDate: '2023-12-20',
          name: '2号数据: reload-5'
        },
        {
          index: INDEX++,
          startDate: '2023-12-21',
          endDate: '2023-12-30',
          name: '2号数据: reload-6'
        }
      ];
    },

    handleClickEmpty2() {
      this.dataList2 = [];
    },

    handleClickModify2() {
      Object.assign(this.dataList2[0], {
        startDate: '2023-11-10',
        endDate: '2023-11-20'
      });

      Object.assign(this.dataList2[0], {
        startDate: `2023-11-13`,
        endDate: `2023-11-17`,
        name: '2号孙数据: abcde'
      });
    },

    handleClickInsert2() {
      this.dataList2.unshift({
        index: INDEX++,
        startDate: `2023-06-1`,
        endDate: `2023-06-05`,
        name: '2号数据: ' + INDEX
      });
    },

    handleClickInsertChildren2() {
      if (!this.dataList2[0]['children']) {
        this.dataList2[0]['children'] = [];
      }

      this.dataList2[0]['children'].unshift({
        index: INDEX++,
        startDate: `2023-11-13`,
        endDate: `2023-11-15`,
        name: '2号子数据: ' + INDEX,
        children: [
          {
            index: INDEX++,
            startDate: `2023-11-5`,
            endDate: `2023-11-21`,
            name: '2号孙数据: ' + INDEX
          }
        ]
      });
      this.dataList2 = [...this.dataList2];
    },

    changeUnit2() {
      const u = ['month', 'week', 'day', 'hour'];
      this.unit2 = u[(u.indexOf(this.unit2) + 1) % u.length];
      console.log('this.unit2', this.unit2);
    },

    handleClickDelete2() {
      console.log(this.dataList2.shift());
    },

    handleClickColor2() {
      this.changeColor++;

      if (this.changeColor % 2 !== 0) {
        this.levelColor2 = ['blue', 'pink', 'gray'];

        this.headerStyle2 = {
          bgColor: 'darkgray',
          textColor: 'lightblue'
        };

        this.bodyStyle2 = {
          bgColor: 'lightgray',
          textColor: 'white'
        };
      } else {
        this.levelColor2 = ['#123456', '#654321'];
        this.headerStyle2 = {
          bgColor: '#684',
          textColor: ''
        };
        this.bodyStyle2 = {
          bgColor: '#917',
          textColor: ''
        };
      }
    },

    onAddLink2(
      link: any,
      data: { from: any; to: any },
      cb: (link: any) => void
    ) {
      const _link = {
        index: LINK_INDEX++,
        from: link.from,
        to: link.to,
        color: 'green'
      };
      this.linkList2.push(_link);

      cb(_link);
    },

    setSelected2() {
      (this.$refs.gantt2 as any).setSelected(this.dataList2[0]);
    },

    jumpTo2() {
      (this.$refs.gantt2 as any).jumpToDate();
    },

    setHeaderUnit2(unit: 'day' | 'week' | 'month') {
      (this.$refs.gantt2 as any).setHeaderUnit(unit);
    },

    handleClickReloadData3() {
      this.dataList3 = [
        {
          uid: INDEX++,
          startDate: '2023-11-01',
          endDate: '2023-11-10',
          name: '3号数据: reload-1',
          ttt: {
            a: 'aaa',
            b: 'bbb'
          }
        },
        {
          uid: INDEX++,
          startDate: '2023-11-11',
          endDate: '2023-11-20',
          name: '3号数据: reload-2',
          ttt: {
            a: 'aaa',
            b: 'bbb'
          }
        },
        {
          uid: INDEX++,
          startDate: '2023-11-21',
          endDate: '2023-11-30',
          name: '3号数据: reload-3',
          ttt: {
            a: 'aaa',
            b: 'bbb'
          }
        },
        {
          uid: INDEX++,
          startDate: '2023-12-01',
          endDate: '2023-12-10',
          name: '3号数据: reload-4',
          ttt: {
            a: 'aaa',
            b: 'bbb'
          }
        }
      ];
    },

    handleClickEmpty3() {
      this.dataList3 = [];
    },

    handleClickModify3() {
      Object.assign(this.dataList3[0], {
        startDate: '2023-11-10',
        endDate: '2023-11-20'
      });

      Object.assign(this.dataList3[0], {
        startDate: `2023-11-13`,
        endDate: `2023-11-17`,
        name: '3号孙数据: abcde'
      });
    },

    handleClickInsert3() {
      this.dataList3.unshift({
        uid: INDEX++,
        startDate: `2023-11-10`,
        endDate: `2023-11-20`,
        name: '3号数据: ' + INDEX,
        ttt: {
          a: 'aaa',
          b: 'bbb'
        }
      });
    },

    handleClickInsertChildren3() {
      this.dataList3[0]['children'].unshift({
        uid: INDEX++,
        startDate: `2023-11-12`,
        endDate: `2023-11-15`,
        name: '3号子数据: ' + INDEX,
        ttt: {
          a: 'aaa',
          b: 'bbb'
        },
        children: [
          {
            uid: INDEX++,
            startDate: `2023-11-11`,
            endDate: `2023-11-15`,
            name: '3号孙数据: ' + INDEX,
            ttt: {
              a: 'aaa',
              b: 'bbb'
            }
          }
        ]
      });
      this.dataList3 = [...this.dataList3];
    },

    handleClickDelete3() {
      console.log(this.dataList3.shift());
    },

    handleMoveChange3() {
      this.move3 = !this.move3;
    },

    handleClickColor3() {
      this.changeColor++;

      if (this.changeColor % 2 !== 0) {
        this.levelColor3 = ['purple', 'orange', 'green'];

        this.headerStyle3 = {
          bgColor: 'black',
          textColor: 'brown'
        };

        this.bodyStyle3 = {
          bgColor: 'lightgray',
          textColor: 'white'
        };
      } else {
        this.levelColor3 = ['', '#7A1', '#123'];
        this.headerStyle3 = {
          bgColor: '#9c5',
          textColor: ''
        };
        this.bodyStyle3 = {
          bgColor: '#491614',
          textColor: 'white'
        };
      }
    },

    onAddLink3(
      link: any,
      data: { from: any; to: any },
      cb: (link: any) => void
    ) {
      const _link = {
        index: LINK_INDEX++,
        from: link.from,
        to: link.to,
        color: 'green'
      };
      this.linkList3.push(_link);

      cb(_link);
    },

    setSelected3() {
      (this.$refs.gantt3 as any).setSelected(this.dataList3[0]);
    },

    jumpTo3() {
      (this.$refs.gantt3 as any).jumpToDate();
    },

    setHeaderUnit3(unit: 'day' | 'week' | 'month') {
      (this.$refs.gantt3 as any).setHeaderUnit(unit);
    }
  }
});
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  padding-top: 50px;
  width: 100%;
  height: 100%;
}

.slider-level-one {
  background-color: #123456;
  height: 5px;
  position: relative;
}

.slider-level-one::before {
  content: '';
  position: absolute;
  left: 0px;
  height: 0px;
  width: 0px;
  border-style: solid;
  border-left-width: 0px;
  border-right-width: 5px;
  border-top-width: 5px;
  border-bottom-width: 10px;
  border-left-color: transparent;
  border-top-color: transparent;
  border-bottom-color: transparent;
  border-right-color: #123456;
}

.slider-level-one::after {
  content: '';
  position: absolute;
  right: 0px;
  height: 0px;
  width: 0px;
  border-style: solid;
  border-left-width: 5px;
  border-right-width: 0px;
  border-top-width: 5px;
  border-bottom-width: 10px;
  border-left-color: #123456;
  border-top-color: #123456;
  border-bottom-color: transparent;
  border-right-color: transparent;
}

.tip-text {
  margin-top: 1rem;
  font-size: 1.5rem;
  color: red;
}

.code-link {
  margin-top: 1rem;
  color: red;
  text-decoration: none;
}

.test-class {
  color: red;
}
</style>
