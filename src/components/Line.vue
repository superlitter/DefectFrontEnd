<template>
  <el-container>
    <el-main>
      <div v-for="(item,index) in chosenDataLine" :key="index" class="floatFrame">
        <span class="s-1" />
        <span class="s-2" />
        <span class="s-3" />
        <span class="s-4" />
        <el-container>
          <el-aside width="55%">
            <div :id="`chartLine${index}`" :style="{width: '400px', height: '400px',fontSize:'25px', margin:'60px 0px 0px 100px', left:'10px'}"></div>
          </el-aside>
          <el-main width="45%">
            <el-table :data= chosenDataLine[index].arr :cell-style="rowStyle" style="width: 100%; top: 10px" :header-cell-style="rowStyle" :row-class-name="tableRowClassName">
              <el-table-column prop="string" label="条目" width="195"></el-table-column>
              <el-table-column prop="num" label="值" width="195"></el-table-column>
            </el-table>
          </el-main>
        </el-container>
        <div :style="{margin:'60px 0px 0px 60px'}"></div>
      </div>
    </el-main>
  </el-container>
</template>

<script>
const echarts = require('echarts/lib/echarts');
require('echarts/lib/component/grid');
require('echarts/lib/chart/line');

export default {
  name: "Line.vue",
  props: ['chosenDataLine','dataOfCheckLine', 'typeOfOptionsLine'],
  data(){
    return {
      typeName: []
    }
  },
  // 初始化数据
  created() {
    let i, j;
    // 按照后端提供的i，相应地对应报表名称
    for(i=0;i<this.dataOfCheckLine.length;i++){
      for(j=0;j<this.typeOfOptionsLine.length;j++){
        if(this.dataOfCheckLine[i] == this.typeOfOptionsLine[j].id){
          this.typeName.push(this.typeOfOptionsLine[j].name);
          break;
        }
      }
    }
  },
  // 向后端发起请求，拿到数据后做一些业务处理
  mounted () {
    this.$nextTick(()=>{
      this.initEcharts();
    })
  },
  methods:{
    rowStyle(){
      return 'text-align: center';
    },
    tableRowClassName({row, rowIndex}) {
      if (row.num > 15) {
        return 'warning-row';
      }
      else if (row.num < 8) {
        return 'success-row';
      }
      return 'normal-row';
    },
    initEcharts(){
      this.chosenDataLine.forEach((val,index) => {
        let i = 0;
        let myChart = echarts.init(document.getElementById(`chartLine${index}`));
        let option = {
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            }
          },
          title: {
            text: this.typeName[index],
            left: '50%',
            textAlign: 'center'
          },
          grid: {
            top: '25%',
            left: '0%',
            right: '5%',
            bottom: '10%',
            containLabel: true
          },
          xAxis: {
            data: this.chosenDataLine[index].arr.map(element => element.string),
            axisLine: {
              show: false // 轴线
            },
            axisTick: {
              show: false
            },
            type: 'category',
            axisLabel: {
              interval: 0,
              rotate:-80
            },
          },
          yAxis: {
            type: 'value',
          },
          series: [
            {
              label: {
                show: true, //开启显示
                position: 'top', //在上方显示
                textStyle: { //数值样式
                  color: 'black',
                  fontSize: 12
                }
              },
              data: this.chosenDataLine[index].arr.map(element => element.num),
              type: 'line',
              itemStyle: {
                // borderRadius: [0, 10, 10, 0],
                color: function (params) {
                  // 定义一个颜色数组colorList
                  let colorList = [
                    '#65B581',
                    '#FFCE34',
                    '#FD6999',
                    '#ffff79',
                    '#ffac27',
                    '#ff4333'
                  ];
                  if(colorList[params.dataIndex] == null){
                    colorList.push(colorList[i]);
                    i = (i + 1) % 6;
                    return colorList[6];
                  }
                  return colorList[params.dataIndex];
                }
              },
            }
          ]
        }
        myChart.setOption(option);
      })
    },
  }

}
</script>

<style scoped>

/deep/.el-table::before{
  width: 85% !important;
}

/deep/.el-table .warning-row {
  background: #fde6ef;
}

/deep/.el-table .success-row {
  background: #f0f9eb;
}

/deep/.el-table .normal-row {
  background: oldlace;
}
/deep/.el-card__body, .el-main{
  padding: 10px;
}

.floatFrame {
  overflow: hidden;
  position: relative;
  border: 1px solid rgba(11, 85, 140, 0.5);
}
span {
  position: absolute;
  display: block;
}
.s-1 {
  filter: hue-rotate(0deg);
  top: 0;
  left: 0;
  width: 100%;
  height: 3px;
  background: linear-gradient(90deg, transparent, #3a86ff);
  animation: animate1 4s linear infinite;
}
.s-2 {
  filter: hue-rotate(60deg);
  top: -100%;
  right: 0;
  width: 3px;
  height: 100%;
  background: linear-gradient(180deg, transparent, #3a86ff);
  animation: animate2 4s linear infinite;
  animation-delay: 1s;
}
.s-3 {
  filter: hue-rotate(120deg);
  bottom: 0;
  right: 0;
  width: 100%;
  background: linear-gradient(270deg, transparent, #3a86ff);
  animation: animate3 4s linear infinite;
  animation-delay: 2s;
}
.s-4 {
  filter: hue-rotate(300deg);
  bottom: -100%;
  left: 0;
  width: 3px;
  height: 100%;
  background: linear-gradient(360deg, transparent, #3a86ff);
  animation: animate4 4s linear infinite;
  animation-delay: 3s;
}
@keyframes animate1 {
  0% {
    left: -100%;
  }
  50%,
  100% {
    left: 100%;
  }
}
@keyframes animate2 {
  0% {
    top: -100%;
  }
  50%,
  100% {
    top: 100%;
  }
}
@keyframes animate3 {
  0% {
    right: -100%;
    height: 3px;
  }
  50%,
  100% {
    height: 2px;
    right: 100%;
  }
}
@keyframes animate4 {
  0% {
    bottom: -100%;
  }
  50%,
  100% {
    bottom: 100%;
  }
}
</style>
