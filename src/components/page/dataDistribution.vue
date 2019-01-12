<template>
  <div class="dataDistribution">
    <!--
      地图
    -->
    <div id="myChartMapDistrib" style="margin: 0 auto 20px; " :style="{width:'1200px', height: '500px'}"></div>

    <!--
      类型转换
    -->
    <div style="overflow: hidden; width: 100%; margin-bottom: 20px;">
      <div class="dataTypeChange">
        <p :class="{activeTypeClass : activeTypeChange == 'basicData'}" @click="dataTypeChange('basicData')">基础数据</p>
        <p :class="{activeTypeClass : activeTypeChange == 'numberOfProjects'}"
           @click="dataTypeChange('numberOfProjects')">项目总人数</p>
        <p :class="{activeTypeClass : activeTypeChange == 'projectType'}" @click="dataTypeChange('projectType')">
          项目类型</p>
      </div>
    </div>

    <!--
      基础数据
    -->
    <div v-show="activeTypeChange == 'basicData'">
      <div style="margin: 0 auto;" id="myChartDistrib" :style="{width: '1200px', height: '400px'}"></div>
    </div>
    <!--
      项目总人数
    -->
    <div v-show="activeTypeChange == 'numberOfProjects'">
      <div class="headTable TypeTable">
        <div style="border-right: 1px solid #ebeef5;  width: calc(50% - 1px);">项目名称</div>
        <div>项目人数</div>
      </div>
      <div class="TypeTable" v-for="item in manCountData">
        <div style="border-right: 1px solid #ebeef5;  width: calc(50% - 1px);">{{item.projectName}}</div>
        <div>
          <p>{{item.count}}</p>
          <p class="lineDataStyle">
            <el-progress class="lineData" :show-text="false" :stroke-width="10" :percentage="item.percentage"
                         color="rgba(142, 113, 199, 0.7)"></el-progress>
          </p>
        </div>
      </div>
    </div>
    <!--
     项目类型
    -->
    <div v-show="activeTypeChange == 'projectType'">
      <div style="margin: 0 auto;" id="myChartProType" :style="{width: '1200px', height: '400px'}"></div>
    </div>
  </div>
</template>
<script>
  import {getMapDetail} from '../../api/api';

  export default {
    data() {
      return {
        activeTypeChange: 'basicData',
        mapData: [],

        // 柱状图
        buildingData: [],
        buildedData: [],
        buildCity: [],

        // 列表项目数
        manCountData: [],
        manCountMax: '',

        preData: []
      }
    },
    mounted() {
      // 画图
      this.drawChartsFun();
      window.localStorage.setItem('dataTypeOfPage', 1);
    },
    methods: {
      // 画线形图饼状图方法
      drawChartsFun() {
        getMapDetail().then((res) => {
          // 地图
          this.mapData = res.data.data.mapProjectList;
          for (var i = 0; i < this.mapData.length; i++) {
            this.buildingData.push(this.mapData[i].value);
            this.buildedData.push(this.mapData[i].value2);
            this.buildCity.push(this.mapData[i].name);
          }
          // 地图
          this.myChartMap();
          this.dataSet(res);
        })
      },

      // 设置图
      dataSet(res) {
        // 项目人数
        this.manCountData = res.data.data.manCountByProjectList;
        if (this.manCountData[0]) {
          this.manCountMax = this.manCountData[0].count;
          for (var j = 0; j < this.manCountData.length; j++) {
            this.manCountData[j].percentage = this.manCountData[j].count / this.manCountMax * 100;
          }
        }
        // 饼状图
        this.preData = res.data.data.pieDataList;
        this.drawLine();
        this.drawPre();
      },

      // 类型变更
      dataTypeChange(type) {
        this.activeTypeChange = type;
        if (this.activeTypeChange == 'basicData') {
          // 获取数据然后执行画图
          this.drawLine();
        } else if (this.activeTypeChange == 'numberOfProjects') {

        } else if (this.activeTypeChange == 'projectType') {

        }
      },

      // 地图
      myChartMap() {
        var _this = this;
        // 基于准备好的dom，初始化echarts实例
        let myChart = this.$echarts.init(document.getElementById('myChartMapDistrib'))
        // 绘制图表
        myChart.setOption({
          title: {
            text: '全国项目分布图(在建中)',
            subtext: '数据支持来自善兔科技'
          },
          visualMap: {
            min: 1,
            max: 30,
            text: ['High', 'Low'],
            left: 'right',
            realtime: false,
            inRange: {
              color: ['lightskyblue', 'SlateBlue', 'blue']
            }
          },
          tooltip: {
            trigger: 'item',
            formatter: '{b}<br/>{c} 个项目'
          },
          series: [
            {
              type: 'map',
              mapType: 'china', // 自定义扩展图表类型
              itemStyle: {
                normal: {label: {show: true}},
                emphasis: {label: {show: true}}
              },
              roam: true,
              data: this.mapData
            }
          ]
        });
        myChart.on('click', function (data) {
          var parmas = {
            id: data.data.id
          }
          getMapDetail(parmas).then((res) => {
            if (res.data.code == 0) {
              _this.buildingData = [];
              _this.buildedData = [];
              _this.buildCity = [];
              for (var i = 0; i < res.data.data.mapProjectList.length; i++) {
                _this.buildingData.push(res.data.data.mapProjectList[i].value);
                _this.buildedData.push(res.data.data.mapProjectList[i].value2);
                _this.buildCity.push(res.data.data.mapProjectList[i].name);
              }
              _this.dataSet(res);
            }
          })
        });
      },
      // 柱形图
      drawLine() {
        // 基于准备好的dom，初始化echarts实例
        let myChart = this.$echarts.init(document.getElementById('myChartDistrib'))
        // 绘制图表
        myChart.setOption({
          tooltip: {
            trigger: 'axis'
          },
          legend: {
            data: ['在建', '已交付']
          },
          toolbox: {
            show: true,
          },
          calculable: true,
          xAxis: [
            {
              type: 'category',
              axisLabel: {
                interval: 0,    //强制文字产生间隔
                rotate: 45,     //文字逆时针旋转45°
                textStyle: {    //文字样式
                  color: "black",
                  fontSize: 12,
                  fontFamily: 'Microsoft YaHei'
                }
              },
              data: this.buildCity
            }
          ],
          yAxis: [
            {
              type: 'value'
            }
          ],
          series: [
            {
              name: '在建',
              type: 'bar',
              data: this.buildingData
            },
            {
              name: '已交付',
              type: 'bar',
              data: this.buildedData
            }
          ]
        });
      },
      // 饼状图
      drawPre() {
        // 基于准备好的dom，初始化echarts实例
        let myChart = this.$echarts.init(document.getElementById('myChartProType'))
        // 绘制图表
        myChart.setOption({
          series: [{
            type: 'pie',
            radius: '65%',
            center: ['50%', '50%'],
            selectedMode: 'single',
            data: this.preData,
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }]
        })

      }
    }
  }
</script>
<style scoped>
  .dataDistribution .dataTypeChange {
    position: relative;
    left: 30px;
    width: 270px;
    overflow: hidden;
    z-index: 1;
  }

  .dataDistribution .dataTypeChange p {
    width: 32.9%;
    float: left;
    font-size: 12px;
    background: rgb(44, 50, 68);
    cursor: pointer;
    text-align: center;
    height: 30px;
    line-height: 30px;
    border-right: 1px solid #fff;
    color: #fff;
  }

  .dataDistribution .dataTypeChange .activeTypeClass {
    color: red;
  }

  .dataDistribution .headTable {
    background: #EFF2F7;
    color: #666;
    font-size: 14px !important;
  }

  .dataDistribution .TypeTable {
    width: 1200px;
    margin: 0 auto;
    border: 1px solid #ebeef5;
    overflow: hidden;
    font-size: 13px;
  }

  .dataDistribution .TypeTable div {
    width: 50%;
    float: left;
    text-align: center;
    height: 30px;
    line-height: 30px;
  }

  .dataDistribution .TypeTable div p {
    width: 30px;
    float: left;
    line-height: 30px;
    text-align: center;
    margin-left: 30px;
  }

  .dataDistribution .TypeTable .lineDataStyle {
    width: calc(100% - 130px);
    float: right;
    margin-right: 40px;
  }

  .dataDistribution .TypeTable .lineDataStyle div {
    width: 100%;
  }

  .dataDistribution .lineData {
    margin-top: 10px;
  }
</style>
