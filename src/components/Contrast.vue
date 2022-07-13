<template>
  <el-container>
    <el-main>
      <div v-if="isInclude1 === true" class="floatFrame">
        <span class="s-1" />
        <span class="s-2" />
        <span class="s-3" />
        <span class="s-4" />
        <div id="chartContrast1" :style="{width: '880px', height: '500px',fontSize:'25px', margin:'60px 0px 0px 100px', top:'25px'}"></div>
        <div :style="{margin:'60px 0px 0px 300px'}"></div>
      </div>
      <div v-if="isInclude2 === true" class="floatFrame">
        <span class="s-1" />
        <span class="s-2" />
        <span class="s-3" />
        <span class="s-4" />
        <div id="chartContrast2" :style="{width: '880px', height: '500px',fontSize:'25px', margin:'60px 0px 0px 100px', top:'25px'}"></div>
        <div :style="{margin:'60px 0px 0px 300px'}"></div>
      </div>
      <div v-if="isInclude3 === true" class="floatFrame">
        <span class="s-1" />
        <span class="s-2" />
        <span class="s-3" />
        <span class="s-4" />
        <div id="chartContrast3" :style="{width: '880px', height: '500px',fontSize:'25px', margin:'60px 0px 0px 100px', top:'25px'}"></div>
        <div :style="{margin:'60px 0px 0px 300px'}"></div>
      </div>
    </el-main>
  </el-container>
</template>

<script>
import * as echarts from "echarts";

export default {
  name: "Contrast.vue",
  props: ['chosenDataContrast','dataOfCheckContrast', 'typeOfOptionsContrast'],
  data(){
    return {
      typeName: [],
      typeOrder: [],  // 来决定画哪几张对比图
      indexOrder: [],
      timeData: [],
      increaseBug: [],
      shutBug: [],
      pictureFirst: [],
      isInclude1: false,
      indexOrder2: [],
      peopleData: [],
      createBug: [],
      finishBug: [],
      shutBug2: [],
      pictureSecond: [],
      isInclude2: false,
      indexOrder3: [],
      countData: [],
      emergencyBug: [],
      priorityBug: [],
      pictureThird: [],
      isInclude3: false
    }
  },
  // 初始化数据
  created() {
    let i, j;
    // 按照后端提供的i，相应地对应报表名称
    for(i=0;i<this.dataOfCheckContrast.length;i++){
      for(j=0;j<this.typeOfOptionsContrast.length;j++){
        if(this.dataOfCheckContrast[i] === this.typeOfOptionsContrast[j].id){
          this.typeOrder.push(this.dataOfCheckContrast[i]);
          this.typeName.push(this.typeOfOptionsContrast[j].name);
          break;
        }
      }
    }
    if(this.typeOrder.includes(3) && this.typeOrder.includes(4)){
      this.isInclude1 = true;
      this.indexOrder.push(this.typeOrder.indexOf(3));
      this.indexOrder.push(this.typeOrder.indexOf(4));
      this.timeData.push('日期');

      for(let i=0;i<this.chosenDataContrast[this.indexOrder[0]].arr.map(element => element.string).length;i++){
        this.timeData.push(this.chosenDataContrast[this.indexOrder[0]].arr.map(element => element.string)[i]);
      }
      this.increaseBug.push('每天新增bug数');
      for(let i=0;i<this.chosenDataContrast[this.indexOrder[0]].arr.map(element => element.num).length;i++){
        this.increaseBug.push(this.chosenDataContrast[this.indexOrder[0]].arr.map(element => element.num)[i]);
      }
      this.shutBug.push('每日关闭bug数');
      for(let i=0,j=0;j<this.chosenDataContrast[this.indexOrder[1]].arr.map(element => element.num).length;i++,j++){
        if(this.chosenDataContrast[this.indexOrder[1]].arr.map(element => element.string)[j] === this.chosenDataContrast[this.indexOrder[0]].arr.map(element => element.string)[i]){
          this.shutBug.push(this.chosenDataContrast[this.indexOrder[1]].arr.map(element => element.num)[j]);
        }
        else{
          this.shutBug.push(0);
          j = j - 1;
        }
      }
      this.pictureFirst.push(this.timeData);
      this.pictureFirst.push(this.increaseBug);
      this.pictureFirst.push(this.shutBug);
    }
    if(this.typeOrder.includes(5) && this.typeOrder.includes(6) && this.typeOrder.includes(7)){
      this.isInclude2 = true;
      this.indexOrder2.push(this.typeOrder.indexOf(5));
      this.indexOrder2.push(this.typeOrder.indexOf(6));
      this.indexOrder2.push(this.typeOrder.indexOf(7));
      this.peopleData.push('成员');
      this.peopleData.push('高延泽','蒋浩','汪锦超','王熠闻','杨崇屾','郑泽毅','朱安哲');

      this.createBug.push('每人创建bug数');
      for(let i=1,j=0;j<this.peopleData.length - 1;i++,j++){
        if(this.chosenDataContrast[this.indexOrder2[0]].arr.map(element => element.string)[j] == null){
          for(;j<this.peopleData.length - 1;j++){
            this.createBug.push(0);
          }
          break;
        }
        if(this.chosenDataContrast[this.indexOrder2[0]].arr.map(element => element.string)[j] === this.peopleData[i]){
          this.createBug.push(this.chosenDataContrast[this.indexOrder2[0]].arr.map(element => element.num)[j]);
        }
        else{
          this.createBug.push(0);
          j = j - 1;
        }
      }

      this.finishBug.push('每人完成bug数');
      for(let i=1, j=0;j<this.peopleData.length - 1;i++,j++){
        if(this.chosenDataContrast[this.indexOrder2[1]].arr.map(element => element.string)[j] == null){
          for(;j<this.peopleData.length - 1;j++){
            this.finishBug.push(0);
          }
          break;
        }
        if(this.chosenDataContrast[this.indexOrder2[1]].arr.map(element => element.string)[j] === this.peopleData[i]){
          this.finishBug.push(this.chosenDataContrast[this.indexOrder2[1]].arr.map(element => element.num)[j]);
        }
        else{
          this.finishBug.push(0);
          j = j - 1;
        }
      }
      this.shutBug2.push('每人关闭bug数');
      for(let i=1, j=0;j<this.peopleData.length - 1;i++,j++){
        if(this.chosenDataContrast[this.indexOrder2[2]].arr.map(element => element.string)[j] == null){
          for(;j<this.peopleData.length - 1;j++){
            this.shutBug2.push(0);
          }
          break;
        }
        if(this.chosenDataContrast[this.indexOrder2[2]].arr.map(element => element.string)[j] === this.peopleData[i]){
          this.shutBug2.push(this.chosenDataContrast[this.indexOrder2[2]].arr.map(element => element.num)[j]);
        }
        else{
          this.shutBug2.push(0);
          j = j - 1;
        }
        console.log(this.shutBug2);
      }
      this.pictureSecond.push(this.peopleData);
      this.pictureSecond.push(this.createBug);
      this.pictureSecond.push(this.finishBug);
      this.pictureSecond.push(this.shutBug2);
    }
    if(this.typeOrder.includes(9) && this.typeOrder.includes(10)){
      this.isInclude3 = true;
      this.indexOrder3.push(this.typeOrder.indexOf(9));
      this.indexOrder3.push(this.typeOrder.indexOf(10));
      this.countData.push('类型');
      this.countData.push('1','2','3','4','5');

      this.emergencyBug.push('紧急程度统计bug数');
      for(let i=1,j=0;j<this.countData.length - 1;i++,j++){
        if(this.chosenDataContrast[this.indexOrder3[0]].arr.map(element => element.string)[j] == null){
          for(;j<this.countData.length - 1;j++){
            this.emergencyBug.push(0);
          }
          break;
        }
        if(this.chosenDataContrast[this.indexOrder3[0]].arr.map(element => element.string)[j] === parseInt(this.countData[i])){
          this.emergencyBug.push(this.chosenDataContrast[this.indexOrder3[0]].arr.map(element => element.num)[j]);
        }
        else{
          this.emergencyBug.push(0);
          j = j - 1;
        }
      }

      this.priorityBug.push('优先级统计bug数');
      for(let i=1, j=0;j<this.countData.length - 1;i++,j++){

        if(this.chosenDataContrast[this.indexOrder3[1]].arr.map(element => element.string)[j] == null) {
          for (; j < this.countData.length - 1; j++) {
            this.priorityBug.push(0);
          }
          break;
        }
        if(this.chosenDataContrast[this.indexOrder3[1]].arr.map(element => element.string)[j] === parseInt(this.countData[i])){
          this.priorityBug.push(this.chosenDataContrast[this.indexOrder3[1]].arr.map(element => element.num)[j]);
        }

        else{
          this.priorityBug.push(0);
          j = j - 1;
        }
      }

      this.pictureThird.push(this.countData);
      this.pictureThird.push(this.emergencyBug);
      this.pictureThird.push(this.priorityBug);
    }
  },
  // 向后端发起请求，拿到数据后做一些业务处理
  mounted () {
    this.$nextTick(()=>{
      this.initEcharts1();
    })
    this.$nextTick(()=>{
      this.initEcharts2();
    })
    this.$nextTick(()=>{
      this.initEcharts3();
    })
  },
  methods:{
    initEcharts1(){
      let myChart = echarts.init(document.getElementById('chartContrast1'));
      let _this = this;
      setTimeout(function () {
        let option = {
          title: {
            text: '每日新增、关闭bug数对比图',
            left: '50%',
            textAlign: 'center'
          },
          legend: {
            orient: 'vertical',
            left: 'left'
          },
          tooltip: {
            trigger: 'axis',
            showContent: true
          },
          dataset: {
            source: _this.pictureFirst,
          },
          xAxis: {type: 'category'},
          yAxis: {gridIndex: 0},
          grid: {top: '50%'},
          series: [
            {
              type: 'line',
              smooth: true,
              seriesLayoutBy: 'row',
              emphasis: {focus: 'series'}
            },
            {
              type: 'line',
              smooth: true,
              seriesLayoutBy: 'row',
              emphasis: {focus: 'series'}
            },
            {
              type: 'pie',
              id: 'pie',
              radius: '30%',
              center: ['50%', '25%'],
              emphasis: {
                focus: 'self'
              },
              encode: {
                itemName: _this.timeData[0],
                value: _this.timeData[1],
                tooltip: _this.timeData[1]
              }
            }
          ]
        };
        myChart.on('updateAxisPointer', function (event) {
            const xAxisInfo = event.axesInfo[0];
            if (xAxisInfo) {
              const dimension = xAxisInfo.value + 1;
              myChart.setOption({
                series: {
                  id: 'pie',
                  label: {
                    formatter: '{b}: {@[' + dimension + ']} ({d}%)'
                  },
                  encode: {
                    value: dimension,
                    tooltip: dimension
                  }
                }
              });
            }
          });
          myChart.setOption(option);
      })
    },

    initEcharts2(){
      let myChart = echarts.init(document.getElementById('chartContrast2'));
      let _this = this;
      setTimeout(function () {
        let option = {
          title: {
            text: '每成员创建、完成、关闭的bug数对比图',
            left: '50%',
            textAlign: 'center'
          },
          legend: {
            orient: 'vertical',
            left: 'left'
          },
          tooltip: {
            trigger: 'axis',
            showContent: true
          },
          dataset: {
            source: _this.pictureSecond,
          },
          xAxis: {type: 'category'},
          yAxis: {gridIndex: 0},
          grid: {top: '50%'},
          series: [
            {
              type: 'line',
              smooth: true,
              seriesLayoutBy: 'row',
              emphasis: {focus: 'series'}
            },
            {
              type: 'line',
              smooth: true,
              seriesLayoutBy: 'row',
              emphasis: {focus: 'series'}
            },
            {
              type: 'line',
              smooth: true,
              seriesLayoutBy: 'row',
              emphasis: {focus: 'series'}
            },
            {
              type: 'pie',
              id: 'pie',
              radius: '30%',
              center: ['50%', '25%'],
              emphasis: {
                focus: 'self'
              },
              encode: {
                itemName: _this.peopleData[0],
                value: _this.peopleData[1],
                tooltip: _this.peopleData[1]
              }
            }
          ]
        };
        myChart.on('updateAxisPointer', function (event) {
          const xAxisInfo = event.axesInfo[0];
          if (xAxisInfo) {
            const dimension = xAxisInfo.value + 1;
            myChart.setOption({
              series: {
                id: 'pie',
                label: {
                  formatter: '{b}: {@[' + dimension + ']} ({d}%)'
                },
                encode: {
                  value: dimension,
                  tooltip: dimension
                }
              }
            });
          }
        });
        myChart.setOption(option);
      })
    },

    initEcharts3() {
      let myChart = echarts.init(document.getElementById('chartContrast3'));
      let _this = this;
      setTimeout(function () {
        let option = {
          title: {
            text: '按紧急程度、优先级统计bug数对比图',
            left: '50%',
            textAlign: 'center'
          },
          legend: {
            orient: 'vertical',
            left: 'left'
          },
          tooltip: {
            trigger: 'axis',
            showContent: true
          },
          dataset: {
            source: _this.pictureThird,
          },
          xAxis: {type: 'category'},
          yAxis: {gridIndex: 0},
          grid: {top: '50%'},
          series: [
            {
              type: 'line',
              smooth: true,
              seriesLayoutBy: 'row',
              emphasis: {focus: 'series'}
            },
            {
              type: 'line',
              smooth: true,
              seriesLayoutBy: 'row',
              emphasis: {focus: 'series'}
            },
            {
              type: 'pie',
              id: 'pie',
              radius: '30%',
              center: ['50%', '25%'],
              emphasis: {
                focus: 'self'
              },
              encode: {
                itemName: _this.countData[0],
                value: _this.countData[1],
                tooltip: _this.countData[1]
              }
            }
          ]
        };
        myChart.on('updateAxisPointer', function (event) {
          const xAxisInfo = event.axesInfo[0];
          if (xAxisInfo) {
            const dimension = xAxisInfo.value + 1;
            myChart.setOption({
              series: {
                id: 'pie',
                label: {
                  formatter: '{b}: {@[' + dimension + ']} ({d}%)'
                },
                encode: {
                  value: dimension,
                  tooltip: dimension
                }
              }
            });
          }
        });
        myChart.setOption(option);
      })
    }
  }
}
</script>

<style scoped>

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
