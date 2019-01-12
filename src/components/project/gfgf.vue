<template>
  <div ref="content" style="width: 100%;height: 100%;overflow: auto">
    <div style="width: 600px;height: 860px;border: 1px solid #000;margin-left: 30px;margin-top: 10px;">
      <div
        style="width: 100%;height: 40px;line-height: 40px;border-bottom: 1px solid #000;text-align: center;font-weight: bold;font-size: 16px;">
        进场产业工人资料卡
      </div>
      <div v-if="data.id" style="width: 600px;height: 740px;font-size: 14px;">
        <div style="line-height: 30px; text-align: center;">项目名称: <span>{{data.project.name}}</span></div>
        <ul style="width: 605px;">
          <li
            style="float: left;width: 25%;height: 30px;line-height: 30px;text-align: center;border: 1px solid #000;margin-top: -1px;margin-left: -1px;box-sizing: border-box;font-weight: bold">
            姓名
          </li>
          <li
            style="float: left;width: 25%;height: 30px;line-height: 30px;text-align: center;border: 1px solid #000;margin-top: -1px;margin-left: -1px;box-sizing: border-box;font-size: 12px;">
            {{data.workerMan.name}}
          </li>
          <li
            style="float: left;width: 25%;height: 30px;line-height: 30px;text-align: center;border: 1px solid #000;margin-top: -1px;margin-left: -1px;box-sizing: border-box;font-weight: bold">
            进场时间
          </li>
          <li
            style="float: left;width: 25%;height: 30px;line-height: 30px;text-align: center;border: 1px solid #000;margin-top: -1px;margin-left: -1px;box-sizing: border-box;font-size: 12px;">
            {{data.workerManInDate}}
          </li>
          <li
            style="float: left;width: 25%;height: 30px;line-height: 30px;text-align: center;border: 1px solid #000;margin-top: -1px;margin-left: -1px;box-sizing: border-box;font-weight: bold">
            班组
          </li>
          <li
            style="float: left;width: 25%;height: 30px;line-height: 30px;text-align: center;border: 1px solid #000;margin-top: -1px;margin-left: -1px;box-sizing: border-box;font-size: 12px;">
            {{data.workerMan.workerTeam.name}}
          </li>
          <li
            style="float: left;width: 25%;height: 30px;line-height: 30px;text-align: center;border: 1px solid #000;margin-top: -1px;margin-left: -1px;box-sizing: border-box;font-weight: bold">
            工种
          </li>
          <li
            style="float: left;width: 25%;height: 30px;line-height: 30px;text-align: center;border: 1px solid #000;margin-top: -1px;margin-left: -1px;box-sizing: border-box;font-size: 12px;">
            {{data.workerMan ? data.workerMan.workerManWorkExtends[0].workClass.name : ''}}&nbsp;-&nbsp;{{data.workerMan
            ? data.workerMan.workerManWorkExtends[0].workType.name : ''}}
          </li>
          <li
            style="float: left;width: 151px;height: 30px;line-height: 30px;text-align: center;border: 1px solid #000;margin-top: -1px;margin-left: -1px;box-sizing: border-box;font-weight: bold">
            住址
          </li>
          <li
            style="float: left;width: 452px;height: 30px;line-height: 30px;text-align: center;border: 1px solid #000;margin-top: -1px;margin-left: -1px;box-sizing: border-box;font-size: 12px;">
            {{data.workerMan.address}}
          </li>
          <li
            style="float: left;width: 25%;height: 30px;line-height: 30px;text-align: center;border: 1px solid #000;margin-top: -1px;margin-left: -1px;box-sizing: border-box;font-weight: bold">
            身份证号
          </li>
          <li
            style="float: left;width: 25%;height: 30px;line-height: 30px;text-align: center;border: 1px solid #000;margin-top: -1px;margin-left: -1px;box-sizing: border-box;font-size: 12px;">
            {{data.workerMan.idCardNo}}
          </li>
          <li
            style="float: left;width: 25%;height: 30px;line-height: 30px;text-align: center;border: 1px solid #000;margin-top: -1px;margin-left: -1px;box-sizing: border-box;font-weight: bold">
            联系方式
          </li>
          <li
            style="float: left;width: 25%;height: 30px;line-height: 30px;text-align: center;border: 1px solid #000;margin-top: -1px;margin-left: -1px;box-sizing: border-box;font-size: 12px;">
            {{data.workerMan.tel}}
          </li>
          <li
            style="float: left;width: 25%;height: 30px;line-height: 30px;text-align: center;border: 1px solid #000;margin-top: -1px;margin-left: -1px;box-sizing: border-box;font-weight: bold">
            紧急联系方式
          </li>
          <li
            style="float: left;width: 25%;height: 30px;line-height: 30px;text-align: center;border: 1px solid #000;margin-top: -1px;margin-left: -1px;box-sizing: border-box;font-size: 12px;">
            {{data.workerMan.emergencyContactTel}}
          </li>
          <li
            style="float: left;width: 25%;height: 30px;line-height: 30px;text-align: center;border: 1px solid #000;margin-top: -1px;margin-left: -1px;box-sizing: border-box;font-weight: bold">
            出生日期
          </li>
          <li
            style="float: left;width: 25%;height: 30px;line-height: 30px;text-align: center;border: 1px solid #000;margin-top: -1px;margin-left: -1px;box-sizing: border-box;font-size: 12px;">
            {{data.workerMan.birthDate}}
          </li>
          <li
            style="float: left;width: 25%;height: 30px;line-height: 30px;text-align: center;border: 1px solid #000;margin-top: -1px;margin-left: -1px;box-sizing: border-box;font-weight: bold">
            薪资标准
          </li>
          <li
            style="float: left;width: 25%;height: 30px;line-height: 30px;text-align: center;border: 1px solid #000;margin-top: -1px;margin-left: -1px;box-sizing: border-box;font-size: 12px;">
            {{data.calculationOfSalary ? data.calculationOfSalary : ''}}{{data.calculationOfSalaryNote}}
          </li>
          <li
            style="float: left;width: 25%;height: 30px;line-height: 30px;text-align: center;border: 1px solid #000;margin-top: -1px;margin-left: -1px;box-sizing: border-box;font-weight: bold">
            血型
          </li>
          <li
            style="float: left;width: 25%;height: 30px;line-height: 30px;text-align: center;border: 1px solid #000;margin-top: -1px;margin-left: -1px;box-sizing: border-box;font-size: 12px;">
            {{data.workerMan.bloody}}
          </li>
          <li
            style="float: left;width: 151px;height: 60px;line-height: 60px;text-align: center;border: 1px solid #000;margin-top: -1px;margin-left: -1px;box-sizing: border-box;font-weight: bold">
            备注
          </li>
          <li
            style="float: left;width: 452px;height: 60px;line-height: 30px;text-align: center;border: 1px solid #000;margin-top: -1px;margin-left: -1px;box-sizing: border-box;font-size: 12px;"></li>
          <li style="clear: both;"></li>
        </ul>
        <div style="">
          <p
            style="line-height: 30px;text-align: center;font-size: 16px;font-weight: bold;border-bottom: 1px solid #000;margin-bottom: 10px;">
            身份证复印件</p>
          <div style="width: 450px;position: relative;margin:0 auto;">
            <img src="../../assets/sfz_z.png" alt="">
            <span style="position: absolute;left: 82px;top: 28px;">{{data.workerMan.name}}</span>
            <span style="position: absolute;left: 82px;top: 62px;">{{data.workerMan.sex}}</span>
            <span style="position: absolute;left: 186px;top: 62px;">{{data.workerMan.nation}}</span>
            <span style="position: absolute;left: 82px;top: 98px;">{{data.workerMan.birthDate.slice(0, 4)}}</span>
            <span style="position: absolute;left: 160px;top: 98px;">{{data.workerMan.birthDate.slice(5, 7)}}</span>
            <span style="position: absolute;left: 210px;top: 98px;">{{data.workerMan.birthDate.slice(8, 10)}}</span>
            <span
              style="position: absolute;left: 82px;top: 131px;display: inline-block;width: 158px;">{{data.workerMan.address}}</span>
            <span style="position: absolute;left: 144px;top: 200px;">{{data.workerMan.idCardNo}}</span>
            <img style="position: absolute;left: 286px;top: 30px;" v-if="data.workerMan.idCardPhotoId" width="115"
                 :src="`/workerman/fileupload/pageShowFile?fid=${data.workerMan.idCardPhotoId}`" alt="">
          </div>
          <div style="width: 450px;position: relative;margin:0 auto;">
            <img src="../../assets/sfz_f.png" alt="">
            <span style="position: absolute;left: 166px;top: 143px;">{{data.workerMan.idCardOrg}}</span>
            <span
              style="position: absolute;left: 166px;top: 168px;">{{ data.workerMan.isSuedData ? data.workerMan.isSuedData.slice(0, 4) : ''}}</span>
            <span
              style="position: absolute;left: 197px;top: 168px;">-{{data.workerMan.isSuedData ? data.workerMan.isSuedData.slice(5, 7) : ''}}</span>
            <span
              style="position: absolute;left: 218px;top: 168px;">-{{data.workerMan.isSuedData ? data.workerMan.isSuedData.slice(8, 10) : ''}}</span>
            <span style="position: absolute;left: 240px;top: 166px;">至</span>
            <span
              style="position: absolute;left: 260px;top: 168px;">{{data.workerMan.idCardValidata ? data.workerMan.idCardValidata.slice(0, 4) : ''}}</span>
            <span
              style="position: absolute;left: 291px;top: 168px;">-{{data.workerMan.idCardValidata ? data.workerMan.idCardValidata.slice(5, 7) : ''}}</span>
            <span
              style="position: absolute;left: 311px;top: 168px;">-{{data.workerMan.idCardValidata ? data.workerMan.idCardValidata.slice(8, 10) : ''}}</span>
          </div>
        </div>
      </div>
    </div>
    <el-button v-if="show" style="margin-left: 550px;margin-top: 20px" size="small" type="primary" @click="print">打印
    </el-button>
  </div>
</template>
<script type="text/ecmascript-6">
  import {getManTeamAndProjectInfo} from '../../api/projectapi'

  export default {
    props: {},
    watch: {},
    data() {
      return {
        data: {},
        show: true,
      }
    },
    created() {
    },
    components: {},
    mounted() {
      var self = this;
      this.$nextTick(function () {
        var data = {
          projectId: this.$route.query.projectId,
          workerManId: this.$route.query.workerManId,
          workerTeamId: this.$route.query.workerTeamId
        }
        getManTeamAndProjectInfo(data).then((res) => {
          if (!res) {
            return;
          }
          console.log(res)
          if (res.data.code == 0) {
            this.data = res.data.data;
            if (this.data.calculationOfSalary == 1) {
              this.data.calculationOfSalary = '按小时'
            }
            if (this.data.calculationOfSalary == 2) {
              this.data.calculationOfSalary = '按日'
            }
            if (this.data.calculationOfSalary == 3) {
              this.data.calculationOfSalary = '按月'
            }
            if (this.data.calculationOfSalary == 4) {
              this.data.calculationOfSalary = '绩效'
            }
            if (this.data.workerMan.bloody == 'A') {
              this.data.workerMan.bloody = 'A型'
            }
            if (this.data.workerMan.bloody == 'B') {
              this.data.workerMan.bloody = 'B型'
            }
            if (this.data.workerMan.bloody == 'AB') {
              this.data.workerMan.bloody = 'AB型'
            }
            if (this.data.workerMan.bloody == 'O') {
              this.data.workerMan.bloody = 'O型'
            }
            if (this.data.workerMan.bloody == 'other') {
              this.data.workerMan.bloody = '其他'
            }


            if (this.data.workerMan.sex == 1) {
              this.data.workerMan.sex = '男'
            }
            if (this.data.workerMan.sex == 0) {
              this.data.workerMan.sex = '女'
            }

          }
        })

        if (!!window.ActiveXObject || "ActiveXObject" in window) {
          self.remove_ie_header_and_footer();
        }
      })
    },
    methods: {
      print() {
        this.show = false;
        var self = this;
        setTimeout(function () {
          window.print()

        }, 0)
        setTimeout(function () {
          self.show = true;
        }, 5000)

      },
      remove_ie_header_and_footer() {
        var hkey_path;
        hkey_path = "HKEY_CURRENT_USER\\Software\\Microsoft\\Internet Explorer\\PageSetup\\";
        try {
          var RegWsh = new ActiveXObject("WScript.Shell");
          RegWsh.RegWrite(hkey_path + "header", "");
          RegWsh.RegWrite(hkey_path + "footer", "");
        } catch (e) {
          console.log(e)
        }
      }
    },
  }
</script>
<style scoped>
</style>
