<template>
  <el-container>
    <el-main>
      <div v-for="(item,index) in chosenDataPie" :key="index" class="floatFrame">
        <span class="s-1" />
        <span class="s-2" />
        <span class="s-3" />
        <span class="s-4" />
      <el-container>
        <el-aside width="55%">
            <div :id="`chartPie${index}`" :style="{width: '450px', height: '550px',fontSize:'25px', margin:'60px 0px 0px 70px', left:'10px'}"></div>
        </el-aside>
        <el-main width="45%">
            <el-table :data= chosenDataPie[index].arr :cell-style="rowStyle" style="width: 100%; top: 10px" :header-cell-style="rowStyle" :row-class-name="tableRowClassName">
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
require('echarts/lib/component/title');
require('echarts/lib/component/tooltip');
require('echarts/lib/component/legend');
require('echarts/lib/chart/pie');

export default {
  name: "Pie.vue",
  props: ['chosenDataPie','dataOfCheckPie', 'typeOfOptionsPie'],
  data(){
    return{
      typeName: []
    }
  },
  created() {
    let i, j;
    // 按照后端提供的i，相应地对应报表名称
    for(i=0;i<this.dataOfCheckPie.length;i++){
      for(j=0;j<this.typeOfOptionsPie.length;j++){
        if(this.dataOfCheckPie[i] == this.typeOfOptionsPie[j].id){
          this.typeName.push(this.typeOfOptionsPie[j].name);
          break;
        }
      }
    }
  },
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
    initEcharts() {
      this.chosenDataPie.forEach((val,index) => {
        let serviceData = [];
        for(let i=0;i< this.chosenDataPie[index].arr.length;i++){
          let obj=new Object();
          obj.name=this.chosenDataPie[index].arr[i].string;
          obj.value=this.chosenDataPie[index].arr[i].num;
          serviceData[i]=obj;
        }
        let i = 0;
        let myChart = echarts.init(document.getElementById(`chartPie${ index }`));
        let option = {
          title: {
            text: this.typeName[index],
            left: '50%',
            textAlign: 'center'
          },
          tooltip: {
            trigger: 'item'
          },
          legend: {
            orient: 'vertical',
            bottom: 'bottom',
            left: 'center',
            data: serviceData.name,
            top: '80%',
            align: 'left', //图例在左，文字在右
            width: '440',// 这个定义图例的总宽度，
            textStyle: {
              color: 'black',
              width: 130,
              overflow: 'break'
            }
          },
          series: [
            {
              type: 'pie',
              radius: '50%',
              center: ['50%', '42%'],
              data: serviceData,
              itemStyle: {
                normal: {
                  color: function (colors) {
                    let colorList = [
                      '#65B581',
                      '#FFCE34',
                      '#FD665F',
                      '#ffff79',
                      '#ffac27',
                      '#ff4333',
                      '#ffdca7',
                      '#afff79',
                    ];
                    if(colorList[colors.dataIndex] == null){
                      colorList.push(colorList[i]);
                      i = (i + 1) % 8;
                      return colorList[8];
                    }
                    return colorList[colors.dataIndex];
                  }
                },
              }
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
