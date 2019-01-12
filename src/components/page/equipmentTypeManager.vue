<template>
  <!--
      列表页没整
      搜索传参没整
  -->
  <div class="equiM">
    <!--
        添加按钮
    -->
    <el-button class="btn" size="medium" type="primary" @click="clickAdd">创建设备型号</el-button>

    <!--
        搜索盒子
    -->
    <div class="searchBox">
      <div class="search">
        <p>设备型号：</p>
        <el-input
          placeholder="请输入设备型号"
          size="small"
          class="searchInput"
          v-model="search_name">
        </el-input>
      </div>
      <div class="search">
        <p>生产厂家：</p>
        <el-input
          placeholder="请输入生产厂家"
          size="small"
          class="searchInput"
          v-model="search_contact">
        </el-input>
      </div>
      <div class="search">
        <p>设备类型：</p>
        <el-select v-model="search_type" style="width: 200px;" size="small" placeholder="请选择">
          <el-option
            v-for="item in typeEqui"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </div>
      <el-button class="searchBtn" style="right: 1rem;" size="small" icon="el-icon-refresh" @click='clear'>重置
      </el-button>
      <el-button class="searchBtn" :loading="loading" type="primary" size="small" icon="el-icon-search" @click='search'>
        搜索
      </el-button>
    </div>

    <!--
        新增设备
    -->
    <el-dialog :close-on-press-escape="false" title="设置型号信息" :before-close="cencelBtn" :visible.sync="addVisible"
               :close-on-click-modal="false">
      <el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
        <el-form-item label="设备型号" prop="name">
          <el-input size="small" v-model="addForm.name" placeholder="请输入设备型号" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="设备类型" prop="type">
          <el-radio-group size="small" v-model="addForm.type">
            <el-radio label="0">门禁</el-radio>
            <el-radio label="1">LED大屏幕</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="生产厂家" prop="manufacturerId">
          <el-select size="small" class="select" filterable v-model="addForm.manufacturerId" placeholder="请选择生产厂家">
            <el-option
              v-for="item in compData"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注" prop="note">
          <el-input size="small" :autosize="true" class="textareaOverflow" type="textarea" :rows="2"
                    v-model="addForm.note" placeholder="请输入备注" auto-complete="off" resize="none"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="medium" @click.native="cencelBtn">取消</el-button>
        <el-button size="medium" type="primary" @click.native="addBtn">保存</el-button>
      </div>
    </el-dialog>

    <!--
        页面列表
    -->
    <el-table
      class="table"
      :data="listData"
      v-loading="loading"
      border
      stripe
      style="width: 100%">
      <el-table-column
        label="型号名称"
        align="center">
        <template scope="scope">
          <span @click="show(scope.row)"
                style="color: #409EFF; width:100%; height: 100%; display: block; cursor: pointer;">{{ scope.row.equipmentModelName ? scope.row.equipmentModelName : ''}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="生产厂家"
        align="center">
        <template scope="scope">
          <span>{{ scope.row.manufacturerName ? scope.row.manufacturerName : ''}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="设备类型"
        align="center">
        <template scope="scope">
          <span>{{scope.row.equipmentModelType == 1 ? 'LED显示屏' : '门禁'}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="创建日期"
        align="center">
        <template scope="scope">
          <span>{{ scope.row.equipmentModelOpAt ? scope.row.equipmentModelOpAt : ''}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="固件版本号"
        align="center">
        <template scope="scope">
          <span @click="versionClick(scope.row)" style="color: #409EFF; width:100%; height: 100%; display: block; cursor: pointer;">{{ scope.row.version ? scope.row.version : ''}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="200px">
        <template scope="scope">
          <el-button
            size="small"
            type="text"
            @click="handleEdit(scope.row)">编辑
          </el-button>
          <el-button
            size="small"
            type="text"
            @click="handleUpgrade(scope.row)">固件升级
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--
       分页
       current-change  改变当前页的回调
       page-size 每页的数据个数
       total 数据条数总数
       current-page.sync 数据总页
    -->
    <el-pagination
      class="pageCurrent"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page.sync="currentPage"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="totalNum">
    </el-pagination>

    <!--
        修改设备型号名称
    -->
    <el-dialog :close-on-press-escape="false" title="修改设备型号" :before-close="editCancelBtn" :visible.sync="editVisible"
               :close-on-click-modal="false">
      <el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
        <el-form-item label="设备型号" prop="name">
          <el-input size="small" v-model="editForm.name" placeholder="请输入厂家名称" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="设备类型" prop="type">
          <el-radio-group size="small" v-model="editForm.type">
            <el-radio label="0">门禁</el-radio>
            <el-radio label="1">LED大屏幕</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="生产厂家" prop="manufacturerId">
          <el-select size="small" class="select" filterable v-model="editForm.manufacturerId" placeholder="请选择生产厂家">
            <el-option
              v-for="item in compData"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注" prop="note">
          <el-input size="small" :autosize="true" class="textareaOverflow" style="overflow: hidden;" type="textarea"
                    :rows="2" v-model="editForm.note" placeholder="请输入备注" auto-complete="off" resize="none"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="medium" @click.native="editCancelBtn">取消</el-button>
        <el-button size="medium" type="primary" @click.native="editBtn">保存</el-button>
      </div>
    </el-dialog>

    <!--
        固件升级
    -->
    <el-dialog :close-on-press-escape="false" title="固件升级" :before-close="upgradeCancelBtn"
               :visible.sync="UpgradeVisible" :close-on-click-modal="false">
      <el-form :model="upgradeForm" label-width="100px" :rules="upgradeFormRules" ref="upgradeForm">
        <el-form-item label="固件版本号" prop="version">
          <el-input size="small" v-model="upgradeForm.version" placeholder="请输入固件版本号" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="固件文件" style="height: 40px;" prop="firmwareFileKey">
          <el-upload
            size="small"
            v-show="uploadIsOk"
            class="upload-demo"
            ref="upload"
            :action="`/workerman/fileupload/upload?tokenId=${tokenId}&tokenStr=${tokenStr}`"
            :beforeUpload="beforeAvatarUpload"
            :on-success="handleChange"
            :file-list="upgradeForm.tmpFiles"
            :limit="1">
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
          <div v-show="!uploadIsOk">{{fileName}}</div>
        </el-form-item>
        <el-form-item label="升级说明" prop="upgradeNote">
          <el-input size="small" :autosize="true" class="textareaOverflow" type="textarea" :rows="2"
                    v-model="upgradeForm.upgradeNote" placeholder="请输入升级说明" auto-complete="off" resize="none"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="medium" @click.native="upgradeCancelBtn">取消</el-button>
        <el-button size="medium" type="primary" :disabled="uploading" @click.native="upgradeBtn">保存</el-button>
      </div>
    </el-dialog>

    <!--
        查看
     -->
    <el-dialog :close-on-press-escape="false" title="查看设备型号" :visible.sync="showVisible" :close-on-click-modal="false">
      <el-form class="lookFormFindStyle" :model="editForm" label-width="80px" ref="editForm">
        <el-form-item class="lookStyleForDiv" label="设备型号:" prop="name">
          <div class="data">{{editForm.equipmentModelName}}</div>
        </el-form-item>
        <el-form-item class="lookStyleForDiv" label="生产厂家:" prop="manufacturerId">
          <div class="data">{{editForm.manufacturerName}}</div>
        </el-form-item>
        <el-form-item class="lookStyleForDiv" label="备注:" prop="note">
          <div class="data">{{editForm.equipmentModelNote}}</div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="medium" @click.native="ok">关闭</el-button>
      </div>
    </el-dialog>

    <!--
        历史版本
    -->
    <el-dialog :close-on-press-escape="false" title="设备历史版本" :visible.sync="versionVisible" :close-on-click-modal="false">
      <el-table
        class="table"
        :data="listVersion"
        border
        stripe
        style="width: 100%">
        <el-table-column
          label="版本号"
          align="center">
          <template scope="scope">
            <span>{{scope.row.version}}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="版本备注"
          align="center">
          <template scope="scope">
            <span>{{scope.row.upgradeNote}}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="上传时间"
          align="center">
          <template scope="scope">
            <span>{{scope.row.opAt}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="200px">
          <template scope="scope">
            <el-button
              size="small"
              type="text"
              @click="downloadVersion(scope.row)">下载
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button size="medium" @click="versionVisible = false">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import {getEquipList, addEquip, editEquip, deleteEquip, getManuList, upGrade, showFWViewList} from '../../api/api';
  import myCallback from "../../../static/common/callback"
  export default {
    mounted() {
      let parmas = {
        'search.equipmentModelName': this.search_name,
        'search.manufacturerName': this.search_contact,
        'search.equipmentModelType': this.search_type,
        'pageNo': this.thisNowPage,
        'pageSize': this.pageSize
      }
      this.tokenId = window.sessionStorage.getItem('tokenId');
      this.tokenStr = window.sessionStorage.getItem('tokenStr');
      this.getList(parmas);
      this.getCampList();
    },
    data() {
      var validA = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入设备型号！'));
        } else if (!/^[^\s]+$/.test(value)) {
          callback(new Error('设备型号不能带有空格！'));
        } else {
          callback()
        }
      };
      var validB = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入生产厂家！'));
        } else if (!/^[^\s]+$/.test(value)) {
          callback(new Error('生产厂家不能带有空格！'));
        } else {
          callback()
        }
      };

      return {
        listVersion: [],
        versionVisible: false,

        tokenId: '',
        tokenStr: '',
        uploadIsOk: true,
        fileName: '',
        uploading: true,
        // 固件升级开关
        UpgradeVisible: false,
        upgradeFormLook: true,
        upgradeForm: {
          equipmentModelId: '',
          firmwareFileKey: '',
          version: '',
          tmpFiles: [],
          upgradeNote: ''
        },
        upgradeFormRules: {
          firmwareFileKey: {required: true, message: '上传固件zip文件', trigger: 'blur'},
          version: {required: true, message: '请输入固件版本号', trigger: 'blur'},
          upgradeNote: {required: true, message: '请输入升级说明', trigger: 'blur'}
        },
        typeEqui: [
          {
            label: '所有设备类型',
            value: ''
          }, {
            label: '门禁',
            value: '0'
          }, {
            label: 'LED大屏幕',
            value: '1'
          }
        ],

        // 列表页数据
        listData: [],
        currentPage: 1,
        totalNum: 0,
        pageSize: 10,

        thisNowPage: 1,

        // 所有厂家数据
        compData: '',

        loading: true,

        // search
        search_name: '',
        search_contact: '',
        search_type: '',


        // 新增弹出层数据
        addVisible: false,
        addForm: {
          name: '',
          manufacturerId: '',
          note: '',
          // 假数据闸机
          type: '0'
        },
        addFormRules: {
          name: [
            {required: true, validator: validA, trigger: 'blur'},
            {min: 1, max: 50, message: '设备型号最大长度不能超过50个字符', trigger: 'blur'}
          ],
          manufacturerId: [
            {required: true, validator: validB, trigger: 'blur'}
          ],
          type: [
            {required: true, message: '请选择设备类型', trigger: 'blur'}
          ],
          note: [
            {min: 1, max: 200, message: '备注最大长度不能超过200个字符', trigger: 'blur'}
          ]
        },

        // 修改弹出层数据
        editVisible: false,
        showVisible: false,
        editForm: {
          name: '',
          manufacturerId: '',
          type: '0'
        },
        editFormRules: {
          name: [
            {required: true, validator: validA, trigger: 'blur'},
            {min: 1, max: 50, message: '设备型号最大长度不能超过50个字符', trigger: 'blur'}
          ],
          manufacturerId: [
            {required: true, validator: validB, trigger: 'blur'}
          ],
          type: [
            {required: true, message: '请选择设备类型', trigger: 'blur'}
          ],
          note: [
            {min: 1, max: 200, message: '备注最大长度不能超过200个字符', trigger: 'blur'}
          ]
        }
      }
    },
    methods: {
      downloadVersion(data) {
        console.log(data)
        window.open('/workerman/fileupload/download?fileId=' + data.firmwareFileId, '下载版本')
      },
      //时间戳
      getMyDate(str) {
        var oDate = new Date(str),
          oYear = oDate.getFullYear(),
          oMonth = oDate.getMonth() + 1,
          oDay = oDate.getDate(),
          oHour = oDate.getHours(),
          oMin = oDate.getMinutes(),
          oSen = oDate.getSeconds(),
          oTime = oYear + '-' + this.getzf(oMonth) + '-' + this.getzf(oDay) + ' ' + this.getzf(oHour) + ':' + this.getzf(oMin) + ':' + this.getzf(oSen);//最后拼接时间
        return oTime;
      },
      //补0操作
      getzf(num) {
        if (parseInt(num) < 10) {
          num = '0' + num;
        }
        return num;
      },

      // 固件点击
      versionClick(data) {
          let parmas = {
          equipmentId: data.equipmentModelId
        }
        showFWViewList(parmas).then((res) => {
          if(res.data.code == 0) {
            this.versionVisible = true;
            this.listVersion = res.data.data.data;
            for(var i = 0; i < this.listVersion.length; i++) {
              this.listVersion[i].opAt = this.getMyDate(this.listVersion[i].opAt * 1000).substr(0, 10)
            }
          }else {
            myCallback.call(this,res);
            this.versionVisible = false;
          }
        })
      },
      // 上传限制
      beforeAvatarUpload(file) {
        // zip rar tar exe gz
        const isZIP = file.name.substring(file.name.length - 3) === 'zip';
        const isRAR = file.name.substring(file.name.length - 3) === 'rar';
        const isTAR = file.name.substring(file.name.length - 3) === 'tar';
        const isEXE = file.name.substring(file.name.length - 3) === 'exe';
        const isGZ = file.name.substring(file.name.length - 3) === 'gz';
        const isAPK = file.name.substring(file.name.length - 3) === 'apk';


        if (!isZIP && !isRAR && !isTAR && !isEXE && !isGZ && !isAPK) {
          // this.$message({
          //   showClose: true,
          //   message: '只能上传zip,rar,tar,exe,gz,apk等类型的文件',
          //   type: 'warning'
          // });
          this.$notify.info({
            title: '文件!',
            message: "只能上传zip,rar,tar,exe,gz,apk等类型的文件",
            // offset: 100
          });
        }
        return (isZIP || isRAR || isTAR || isEXE || isGZ || isAPK);
      },
      handleChange(response, file, fileList) {
        this.upgradeForm.firmwareFileKey = response.data[0].key;
        this.fileName = response.data[0].filename;
        this.uploadIsOk = false;
        this.uploading = false;
      },
      // 升级控件
      handleUpgrade(value) {
        this.UpgradeVisible = true;
        this.upgradeForm.equipmentModelId = value.equipmentModelId;
      },
      upgradeBtn() {
        this.$refs.upgradeForm.validate((valid) => {
          if (valid) {
            this.UpgradeVisible = false;
            this.loading = true;
            var parmas = Object.assign({}, this.upgradeForm)
            upGrade(parmas).then((res) => {
              if (res.data.code == '0') {
                myCallback.call(this,res);
                // this.$notify.success({
                //   title: '升级成功',
                //   // message: res.data.msg,
                //   // offset: 100
                // });
                let parmas = {
                  'search.equipmentModelName': this.search_name,
                  'search.manufacturerName': this.search_contact,
                  'search.equipmentModelType': this.search_type,
                  'pageNo': this.thisNowPage,
                  'pageSize': this.pageSize
                }
                this.getList(parmas);
              } else {
                myCallback.call(this,res);
                // this.$notify.error({
                //   title: '升级失败',
                //   message: res.data.msg,
                //   offset: 100
                // });
              }
              this.fileName = '';
              this.loading = false;
              this.uploadIsOk = true;
              this.uploading = true;
              this.upgradeForm.tmpFiles = [];
              this.$refs['upgradeForm'].resetFields();
            })
          }
        });
      },
      upgradeCancelBtn() {
        this.upgradeForm.tmpFiles = [];
        this.UpgradeVisible = false;
        this.$refs['upgradeForm'].resetFields();
        this.fileName = '';
        this.uploading = true;
        this.uploadIsOk = true;
      },

      // 获取所有厂家
      getCampList() {
        var parmas = {
          'pageSize': 999
        };
        getManuList(parmas).then((res) => {
          if (res.data.code == 0) {
            this.compData = res.data.data.list;
            this.currentPage = res.data.data.pageNo;
            this.totalNum = res.data.data.totalCount;
          } else {
            myCallback.call(this,res);
            // this.$notify.error({
            //   title: '获取列表失败',
            //   message: res.data.msg,
            //   offset: 100
            // });
          }

        })
      },
      // 序列号时间
      getMyDate(str) {
        var oDate = new Date(str),
          oYear = oDate.getFullYear(),
          oMonth = oDate.getMonth() + 1,
          oDay = oDate.getDate(),
          oHour = oDate.getHours(),
          oMin = oDate.getMinutes(),
          oSen = oDate.getSeconds(),
          oTime = oYear + '-' + this.getzf(oMonth) + '-' + this.getzf(oDay) + ' ' + this.getzf(oHour) + ':' + this.getzf(oMin) + ':' + this.getzf(oSen);//最后拼接时间
        return oTime;
      },
      //补0操作
      getzf(num) {
        if (parseInt(num) < 10) {
          num = '0' + num;
        }
        return num;
      },

      // 点击创建
      clickAdd() {
        this.addVisible = true;
      },
      // 取消提交
      cencelBtn() {
        this.addVisible = false;
        this.$refs['addForm'].resetFields();
      },
      // 确认提交
      addBtn() {
        this.$refs.addForm.validate((valid) => {
          if (valid) {
            var parmas = Object.assign({}, this.addForm);
            this.addVisible = false;
            addEquip(parmas).then((res) => {
              if (res.data.code == '0') {
                myCallback.call(this,res);
                // this.$notify.success({
                //   title: '添加成功',
                //   // message: res.data.msg,
                //   // offset: 100
                // });
                let parmas = {
                  'search.equipmentModelName': this.search_name,
                  'search.manufacturerName': this.search_contact,
                  'search.equipmentModelType': this.search_type,
                  'pageNo': this.thisNowPage,
                  'pageSize': this.pageSize
                }
                this.getList(parmas);
              } else {
                myCallback.call(this,res);
                // this.$notify.error({
                //   title: '添加失败',
                //   message: res.data.msg,
                //   offset: 100
                // });
              }
              this.$refs['addForm'].resetFields();
            })
          }
        });
      },

      // 查看
      show(row) {
        this.editForm = Object.assign({}, row);
        this.showVisible = true;
      },
      ok() {
        this.showVisible = false;
        this.$refs['editForm'].resetFields();
      },

      // 搜索
      search() {
        this.thisNowPage = 1;
        let parmas = {
          'search.equipmentModelName': this.search_name,
          'search.manufacturerName': this.search_contact,
          'search.equipmentModelType': this.search_type,
          'pageNo': this.thisNowPage,
          'pageSize': this.pageSize
        }
        this.loading = true;
        this.getList(parmas);
      },
      clear() {
        this.search_name = '';
        this.search_contact = '';
        this.search_type = '';
      },
      // 获取列表
      getList(val) {
        getEquipList(val).then((res) => {
          this.loading = false;
          if (res.data.code == 0) {
            this.listData = res.data.data.list;
            for (var i = 0; i < this.listData.length; i++) {
              this.listData[i].equipmentModelOpAt = this.getMyDate(this.listData[i].equipmentModelOpAt * 1000)
            }
            this.currentPage = res.data.data.pageNo;
            this.totalNum = res.data.data.totalCount;
          } else {
            myCallback.call(this,res);
            // this.$notify.error({
            //   title: '获取列表失败',
            //   message: res.data.msg,
            //   offset: 100
            // });
          }
        });
      },

      // 列表页数更改
      handleCurrentChange(val) {
        this.thisNowPage = val;
        let parmas = {
          'search.equipmentModelName': this.search_name,
          'search.manufacturerName': this.search_contact,
          'search.equipmentModelType': this.search_type,
          'pageNo': this.thisNowPage,
          'pageSize': this.pageSize
        }
        this.getList(parmas);
      },
      handleSizeChange(val) {
        this.pageSize = val;
        let parmas = {
          'search.equipmentModelName': this.search_name,
          'search.manufacturerName': this.search_contact,
          'search.equipmentModelType': this.search_type,
          'pageNo': this.thisNowPage,
          'pageSize': this.pageSize
        }
        this.getList(parmas);
      },
      // 点击编辑
      handleEdit(row) {

        var arr = Object.assign({}, row);
        this.editForm = {
          'id': row.equipmentModelId,
          'name': arr.equipmentModelName,
          'manufacturerId': arr.manufacturer_id,
          'note': arr.equipmentModelNote,
          'type': arr.equipmentModelType
        }
        this.editVisible = true;
      },
      // 取消编辑提交
      editCancelBtn() {
        this.editVisible = false;
        this.$refs['editForm'].resetFields();
      },
      // 点击提交
      editBtn() {
        this.$refs.editForm.validate((valid) => {
          if (valid) {
            let parmas = Object.assign({
              equipmentModelNote: this.editForm.note
            }, this.editForm);
            editEquip(parmas).then((res) => {
              if (res.data.code == '0') {
                let parmas = {
                  'search.equipmentModelName': this.search_name,
                  'search.manufacturerName': this.search_contact,
                  'search.equipmentModelType': this.search_type,
                  'pageNo': this.thisNowPage,
                  'pageSize': this.pageSize
                }
                this.getList(parmas);
                myCallback.call(this,res);
                // this.$notify.success({
                //   title: '修改成功',
                //   // message: res.data.msg,
                //   // offset: 100
                // });
                this.editVisible = false;
                this.editForm = {};
              } else {
                myCallback.call(this,res);
                // this.$notify.error({
                //   title: '修改失败',
                //   message: res.data.msg,
                //   offset: 100
                // });
                this.editVisible = false;
                this.editForm = {};
              }
            });
          }
        });
      },

      // 删除厂家
      deleteEdit(value) {
        this.$confirm('确认删除该厂家吗?', '提示', {
          type: 'warning'
        }).then(() => {
          var parmas = {
            id: value.id
          }
          deleteEquip(parmas).then((res) => {
            if (res.data.code == '0') {
              let parmas = {
                'search.equipmentModelName': this.search_name,
                'search.manufacturerName': this.search_contact,
                'search.equipmentModelType': this.search_type,
                'pageNo': this.thisNowPage,
                'pageSize': this.pageSize
              }
              this.getList(parmas);
              myCallback.call(this,res);
              // this.$notify.success({
              //   title: '删除成功',
              //   // message: res.data.msg,
              //   // offset: 100
              // });
            } else {
              myCallback.call(this,res);
              // this.$notify.error({
              //   title: '删除失败',
              //   message: res.data.msg,
              //   offset: 100
              // });
            }
          })
        }).catch(() => {
          // this.$message({
          //   type: 'info',
          //   message: '已取消删除'
          // });
          this.$notify.info({
            title: '已取消删除!',
            // offset: 100
          });
        });
      }
    }
  }
</script>
<style>
  .equiM {
    font-size: 0rem;
  }
  .equiM .btn {
    border-radius: .2rem;
    margin-bottom: .3rem;
  }

  .equiM .pageCurrent {
    position: relative;
    top: .15rem;
    float: right;
    right: .3rem;
  }

  .equiM .select {
    width: 100%;
  }

  .equiM .searchBox {
    width: 100%;
    overflow: hidden;
    position: relative;
    margin-bottom: .15rem;
  }

  .equiM .search {
    /*width: 300px;*/
    height: .5rem;
    line-height: .5rem;
    float: left;
    margin-right: .1rem;
  }

  .equiM .search p {
    float: left;
    /*width: 70px;*/
    height: .5rem;
    line-height: .5rem;
    font-size: .14rem;
    text-align: center;
  }

  .equiM .search .searchInput {
    float: left;
    width: 2.1rem;
  }

  .equiM .searchBtn {
    position: absolute;
    right: 0;
    top: .1rem;
  }

  .equiM .lookStyleForDiv .data {
    font-size: .12rem;
    color: #5C6471;
  }

  .equiM .el-upload--text {
    width: 70px;
    border: none;
    height: 40px;
  }

</style>
