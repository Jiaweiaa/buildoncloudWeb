<template>
  <div class="temporary">
    <!--图片查看-->
    <el-dialog id="photoSee" title="照片" top="30vh" :visible.sync="photoVisible" :close-on-click-modal="false"
               :close-on-press-escape="false">
      <img width="360" v-if="photoVisible"
           :src="`/workerman/accessRecord/showFileByBase64?photoPathByBase64=${photoId}`" alt="">
    </el-dialog>
    <!--使用记录弹层-->
    <el-dialog :close-on-click-modal="false" class="inoutbox" :close-on-press-escape="false" title="临时卡扣使用记录"
               width="70%" :visible.sync="seeVisible">
      <el-form :model="seeMsg" ref="formSee" label-width="150px" class="demo-ruleForm" style="overflow: hidden"
               size="small">
        <el-form-item style="width: 48%;float: left;" label="使用人姓名:">
          <p style="line-height: 34px;">{{seeMsg.name}}</p>
        </el-form-item>
        <el-form-item style="width: 49%;float: left;" label="卡扣编号:">
          <p style="line-height: 34px;">{{seeMsg.id}}</p>
        </el-form-item>
      </el-form>
      <el-table stripe v-loading.body="seeloading" element-loading-text="拼命加载中"
                :data="seetableData"
                border
                style="width: 100%;margin-top: 10px;">
        <el-table-column
          label="进出类型" align="center">
          <template scope="scope">
            <p>{{ scope.row.type }}</p>
          </template>
        </el-table-column>
        <el-table-column label="现场照片" :show-overflow-tooltip="true" align="center">
          <template scope="scope">
            <img style="cursor: pointer" @click="seePhoto(scope.row.livePhotoPathByBase64)" width="100"
                 :src="`/workerman/accessRecord/showFileByBase64?photoPathByBase64=${scope.row.livePhotoPathByBase64}`"
                 alt="">
          </template>
        </el-table-column>
        <el-table-column
          label="是否放行" :show-overflow-tooltip="true" align="center">
          <template scope="scope">
            <p>{{ scope.row.isPass}}</p>
          </template>
        </el-table-column>
        <el-table-column
          label="时间" align="center">
          <template scope="scope">
            <p>{{ scope.row.recordDTIME}}</p>
          </template>
        </el-table-column>
      </el-table>
      <div style="overflow: hidden;padding-bottom: 20px;">
        <el-button style="float: right;margin-top: 10px;margin-left: 10px;" size="small" @click="seeVisible=false">关闭
        </el-button>
        <el-pagination
          style="float: right;margin-top: 10px;"
          @size-change="handleSizeChange2"
          @current-change="handleCurrentChange2"
          :current-page="currentPage2"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="queryForm2.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total2">
        </el-pagination>
      </div>
    </el-dialog>
    <!--创建弹层-->
    <el-dialog :show-close="false" :close-on-click-modal="false" :close-on-press-escape="false" title="创建临时卡扣"
               width="40%" :visible.sync="adddVisible">
      <el-form :model="formAdd" :rules="rulesAdd" ref="formAdd" label-width="150px" class="demo-ruleForm" size="small">
        <el-form-item label="使用项目" prop="unitId">
          <p style="line-height:34px;">{{formProject.name}}</p>
        </el-form-item>
        <el-form-item label="使用人姓名" prop="name">
          <el-input style="width: 200px;" size="small" placeholder="使用人姓名" v-model="formAdd.name"></el-input>
        </el-form-item>
        <el-form-item label="联系方式" prop="tel">
          <el-input style="width: 200px;" size="small" placeholder="联系方式" v-model="formAdd.tel"></el-input>
        </el-form-item>
        <el-form-item label="卡扣编号" prop="rfidCardNo">
          <el-input size="small" :disabled="true" style="width: 200px;" placeholder="卡扣编号"
                    v-model="formAdd.rfidCardNo"></el-input>
          <el-button size="small" style="float: right;" @click="getCardData2">读取卡扣编号</el-button>
        </el-form-item>
        <el-form-item label="身份证号码" prop="idCardNo">
          <el-input style="width: 200px;" size="small" placeholder="身份证号码" v-model="formAdd.idCardNo"></el-input>
        </el-form-item>
        <el-form-item label="用途">
          <el-input style="width: 200px;" size="small" placeholder="用途" v-model="formAdd.entryPurpose"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="resetForm('formAdd')">取 消</el-button>
        <el-button size="small" type="primary" @click="submitForm('formAdd')">确 定</el-button>
      </div>
    </el-dialog>
    <el-button size="small" type="primary" v-if="states!=2" @click="add">创建临时卡扣</el-button>
    <!--查询-->
    <div style="position: relative;">
      <el-form label-width="100px" :model="queryForm" inline ref="queryForm">
        <el-form-item label="使用人姓名：">
          <el-input v-model="queryForm['search.name']" size="small" placeholder="使用人姓名" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="联系方式：">
          <el-input v-model="queryForm['search.tel']" size="small" placeholder="联系方式" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="身份证：">
          <el-input v-model="queryForm['search.idCardNo']" size="small" placeholder="身份证"
                    auto-complete="off"></el-input>
        </el-form-item>
        <el-button style="position: absolute;right: 110px;top: 5px;" size="small" @click="reset" icon="el-icon-refresh">
          重置
        </el-button>
        <el-button style="position: absolute;right: 10px;top: 5px;" size="small" type="primary" icon="el-icon-search"
                   @click="queryListByProjectId">搜索
        </el-button>
      </el-form>
    </div>
    <!--列表-->
    <el-table stripe v-loading="loading" element-loading-text="拼命加载中"
              :data="tableData"
              border
              style="width: 100%;">
      <el-table-column
        label="使用人姓名" align="center">
        <template scope="scope">
          <p>{{ scope.row.name }}</p>
        </template>
      </el-table-column>
      <el-table-column
        label="联系方式" align="center">
        <template scope="scope">
          <p>{{ scope.row.tel}}</p>
        </template>
      </el-table-column>
      <el-table-column
        label="卡扣编号" align="center">
        <template scope="scope">
          <p>{{ scope.row.rfidCardNo}}</p>
        </template>
      </el-table-column>
      <el-table-column
        label="用途" align="center">
        <template scope="scope">
          <p>{{ scope.row.entryPurpose}}</p>
        </template>
      </el-table-column>
      <el-table-column
        label="创建日期" align="center">
        <template scope="scope">
          <p>{{ scope.row.opAt}}</p>
        </template>
      </el-table-column>
      <el-table-column v-if="states!=2" label="操作" align="center" width="180">
        <template scope="scope">
          <el-button size="small" type="text" style="color: red;" @click="handleDelete(scope.row)">废除</el-button>
          <el-button size="small" type="text" @click="see(scope.row)">查看使用记录</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      style="float: right;margin-top: 10px;"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="queryForm.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
  </div>
</template>
<script>
  import {
    addOrUpdate,
    queryListByProjectId,
    remove,
    query
  } from '../../api/projectapi'
  import {} from '../../api/api';

  export default {
    props: {
      formProject: {
        type: Object
      },
      states: {
        type: Number
      }
    },
    data() {
      // 校验使用人名称
      var validateName = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入使用人名称！'));
        } else {
          var reg = /^[\u4e00-\u9fa5]{1,15}$/;
          if (!reg.test(value)) {
            callback(new Error('1-15个汉字'));
          } else {
            callback();
          }
        }
      };
      // 校验身份证
      var validateIdcard = (rule, value, callback) => {
        if (value === '') {
          callback();
        } else {
          var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
          if (!reg.test(value)) {
            callback(new Error('请输入15位或者18位身份证号！'));
          } else {
            callback();
          }
        }
      };
      // 校验手机
      var validatePhone = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入11位手机号！'));
        } else {
          var reg = /^[1]\d{10}$/;
          if (!reg.test(value)) {
            callback(new Error('请输入11位手机号！'));
          } else {
            callback();
          }
        }
      };
      return {
        photoVisible: false,
        photoId: '',
        cardBok: false,
        formLabelWidth: '120px',
        adddVisible: false,
        seeVisible: false,
        formAdd: {
          projectId: this.formProject.id,
          name: '',
          tel: '',
          rfidCardNo: '',
          idCardNo: '',
          entryPurpose: '',
        },
        rulesAdd: {
          name: [
            {required: true, validator: validateName, trigger: 'blur'}
          ],
          tel: [
            {required: true, validator: validatePhone, trigger: 'blur'}
          ],
          rfidCardNo: [
            {required: true, message: '卡扣编号不能为空', trigger: 'blur'}
          ],
          idCardNo: [
            {validator: validateIdcard, trigger: 'blur'}
          ],
        },
        queryForm: {
          projectId: this.formProject.id,
          pageNo: 1,
          pageSize: 10,
          'search.name': '',
          'search.tel': '',
          'search.idCardNo': '',
        },
        tableData: [],
        loading: false,
        seeloading: false,
        //分页
        currentPage: 1,
        total: 1,

        seeMsg: {
          name: '',
          id: ''
        },
        seetableData: [],
        //分页
        currentPage2: 1,
        total2: 1,
        queryForm2: {
          pageNo: 1,
          pageSize: 10,
          'search.cardNO': '',
          'search.type': 0,
          projectId: ''
        }

      }
    },
    created() {
      Date.prototype.Format = function (fmt) { //author: meizz
        var o = {
          "M+": this.getMonth() + 1, //月份
          "d+": this.getDate(), //日
          "h+": this.getHours(), //小时
          "m+": this.getMinutes(), //分
          "s+": this.getSeconds(), //秒
          "q+": Math.floor((this.getMonth() + 3) / 3), //季度
          "S": this.getMilliseconds() //毫秒
        };
        if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o)
          if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
      }
    },
    components: {},
    mounted() {
      this.$nextTick(function () {
        this.queryListByProjectId();
      })
    },
    methods: {
      //查看照片
      seePhoto(val) {
        this.photoId = val;
        this.photoVisible = true;

      },
      //查看使用记录
      see(item) {
        this.seeMsg.name = item.name;
        this.seeMsg.id = item.rfidCardNo;
        this.queryForm2.pageNo = 1;
        this.queryForm2.pageSize = 10;
        this.queryForm2['search.cardNO'] = item.rfidCardNo;
        this.queryForm2.projectId = item.projectId;
        this.seeVisible = true;
        this.query();
      },
      query() {
        this.seeloading = true;
        query(this.queryForm2).then((res) => {
          if (res.data.code == 0) {
            this.seetableData = res.data.data.list;
            for (var i = 0; i < this.seetableData.length; i++) {
              if (this.seetableData[i].type == 'in') {
                this.seetableData[i].type = '进'
              }
              if (this.seetableData[i].type == 'out') {
                this.seetableData[i].type = '出'
              }
              if (this.seetableData[i].isPass) {
                this.seetableData[i].isPass = '是'
              } else {
                this.seetableData[i].isPass = '否'
              }
            }
            this.total2 = res.data.data.totalCount;
            this.seeloading = false;
          } else {
            this.$notify.error({
              title: '获取使用记录失败',
              message: res.data.msg,
              offset: 100
            });
          }
        })
      },
      //创建临时卡扣 按钮
      add() {
        this.formAdd = {
          projectId: this.formProject.id,
          name: '',
          tel: '',
          rfidCardNo: '',
          idCardNo: '',
          entryPurpose: '',
        }
        this.adddVisible = true;
      },
      //确定
      submitForm(formName) {
        var self = this;
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.adddVisible = false;
            var data = this.formAdd;
            addOrUpdate(data).then((res) => {
              if (res.data.code == 0) {
                // self.$message({
                //     type: 'success',
                //     message: '创建成功!'
                // });
                this.$notify.success({
                  title: '创建!',
                  message: '创建成功',
                  offset: 100
                });
                self.$refs[formName].resetFields();
                self.queryListByProjectId();
              } else {
                this.$notify.error({
                  title: '添加失败',
                  message: res.data.msg,
                  offset: 100
                });
              }
            })
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      //取消
      resetForm(formName) {
        this.adddVisible = false;
        this.$refs[formName].resetFields();
      },
      //读取卡扣信息
      getCardData2() {
        var _this = this;
        _this.cardBok = true;

        function createCORS(method, url) {
          var xhr = new XMLHttpRequest();
          if ('withCredentials' in xhr) {
            xhr.open(method, url, true);
          } else if (typeof XDomainRequest != 'undefined') {
            var xhr = new XDomainRequest();
            xhr.open(method, url);
          } else {
            xhr = null;
          }
          return xhr;
        }

        var name;
        var request = createCORS('get', 'https://127.0.0.1:24011/ZKIDROnline/MFCard?OP-DEV=1&CMD-URL=5?' + Math.random());
        if (request) {
          request.onload = function () {
            _this.cardBok = false;
            var data = eval('(' + request.response + ')').data;
            var ret = eval('(' + request.response + ')').ret;
            if (ret == '0') {
              if (data) {
                name = data.name.substr(data.name.length - 1, 1);
                var request2 = createCORS('get', 'https://127.0.0.1:24011/ZKIDROnline/MFCard?OP-DEV=1&CMD-URL=1&iPort=' + name + '?' + Math.random());
                if (request2) {
                  request2.onload = function () {
                    var data2 = eval('(' + request2.response + ')').data;
                    var ret2 = eval('(' + request.response + ')').ret;
                    if (ret2 == '0') {
                      if (data2) {
                        _this.formAdd.rfidCardNo = data2.ICSnr
                      } else {
                        _this.formAdd.rfidCardNo = '';
                        _this.$notify.error({
                          title: '读取信息失败',
                          message: '请查看读卡器是否链接，或联系管理员',
                          offset: 100
                        });
                      }
                    } else {
                      _this.formAdd.rfidCardNo = '';
                      _this.$notify.error({
                        title: '读取信息失败',
                        message: '请查看读卡器是否链接，或联系管理员',
                        offset: 100
                      });
                    }
                  };
                  request2.send();
                }
//                            _this.addForm.name = data.Name;
              } else {
                _this.formAdd.rfidCardNo = '';
                _this.$notify.error({
                  title: '读取信息失败',
                  message: '请查看读卡器是否链接，或联系管理员',
                  offset: 100
                });
              }
            } else {
              _this.$notify.error({
                title: '读取信息失败',
                message: '请查看读卡器是否链接，或联系管理员',
                offset: 100
              });
            }

          };
          request.send();

        }
      },
      //重置
      reset() {
        this.queryForm['search.name'] = '';
        this.queryForm['search.tel'] = '';
        this.queryForm['search.idCardNo'] = '';
      },
      //分页
      //每页条数改变
      handleSizeChange(val) {
        this.queryForm.pageSize = val;
        this.queryListByProjectId();
      },
      handleSizeChange2(val) {
        this.queryForm2.pageSize = val;
        this.query();
      },
      handleCurrentChange2(val) {
        this.queryForm2.pageNo = val;
        this.query();
      },
      //页数改变
      handleCurrentChange(val) {
        this.queryForm.pageNo = val;
        this.queryListByProjectId();
      },
      //查询
      queryListByProjectId() {
        var self = this;
        this.loading = true;
        var data = this.queryForm;
        queryListByProjectId(data).then((res) => {
          if (!res) {
            return;
          }
          if (res.data.code == 0) {
            this.tableData = res.data.data.list;
            for (var i = 0; i < this.tableData.length; i++) {
              this.tableData[i].opAt = this.formatDate(this.tableData[i].opAt)
            }
            this.total = res.data.data.totalCount;
            this.loading = false;
          } else {
            this.loading = false;
            this.$notify.error({
              title: '获取列表失败',
              message: res.data.msg,
              offset: 100
            });
          }
        })
      },
      //废除
      handleDelete(item) {
        var self = this;
        this.$confirm('确定废除该卡扣吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          var data = {
            id: item.id
          }
          remove(data).then((res) => {
            if (res.data.code == 0) {
              // self.$message({
              //     type: 'success',
              //     message: '废除成功!'
              // });
              this.$notify.success({
                title: '废除!',
                message: '废除成功',
                offset: 100
              });
              self.queryListByProjectId();
            } else {
              this.$notify.error({
                title: '废除卡扣失败',
                message: res.data.msg,
                offset: 100
              });
            }
          })
        }).catch(() => {
        });
      },
      //时间戳转化
      formatDate(nS) {
        return new Date(parseInt(nS) * 1000).Format("yyyy-MM-dd");
      }
    },
  }
</script>
<style scoped>
  .temporary {
    min-width: 1000px;
    border-top: 1px solid #eee;
    padding-top: 20px;
    padding-left: 20px;
    padding-right: 20px;
    font-size: 12px;
  }

</style>
<style>
  .temporary .el-form-item__label {
    line-height: 34px;
  }

  #photoSee .el-dialog {
    width: 400px;
  }

  .inoutbox .cell {
    height: auto !important;
    line-height: normal !important;
  }
</style>
