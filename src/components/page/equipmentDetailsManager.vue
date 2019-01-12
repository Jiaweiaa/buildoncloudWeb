<template>
  <div class="eqdetilM">
    <!--
        添加按钮
    -->
    <el-button class="btn" size="medium" type="primary" @click="clickAdd">创建设备信息</el-button>

    <!--
        搜索盒子
    -->
    <div class="searchBox">
      <div class="search">
        <p style="width: 100px;">设备唯一标识：</p>
        <el-input
          placeholder="请输入设备唯一标识"
          size="small"
          class="searchInput"
          v-model="search_name">
        </el-input>
      </div>
      <div class="search">
        <p>厂家名称：</p>
        <el-input
          placeholder="请输入厂家名称"
          size="small"
          class="searchInput"
          v-model="search_contact">
        </el-input>
      </div>
      <el-button class="searchBtn" style="right: 1rem;" size="small" icon="el-icon-refresh" @click='clear'>重置
      </el-button>
      <el-button class="searchBtn" :loading="loading" type="primary" size="small" icon="el-icon-search" @click='search'>
        搜索
      </el-button>
    </div>

    <!--
     新增用户
    -->
    <el-dialog :close-on-press-escape="false" title="创建设备信息" :before-close="cencelBtn" :visible.sync="addVisible"
               :close-on-click-modal="false">
      <el-form :model="addForm" label-width="95px" :rules="addFormRules" ref="addForm">
        <el-form-item label="所属公司" prop="useUnitId">
          <el-select size="small" class="select" filterable v-model="addForm.useUnitId" placeholder="请选择所属公司"
                     @change="changeCom">
            <el-option
              v-for="item in workerList"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="设备唯一标识" prop="uniqueIdentity">
          <el-input size="small" v-model="addForm.uniqueIdentity" placeholder="请输入设备唯一标识"
                    auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="设备型号" prop="equipmentModelId">
          <el-select size="small" class="select" filterable v-model="addForm.equipmentModelId" placeholder="请选择设备型号">
            <el-option
              v-for="item in compNoList"
              :label="item.equipmentModelName"
              :value="item.equipmentModelId">
            </el-option>
          </el-select>
        </el-form-item>
        <!--<el-form-item label="入场项目" prop="inProjectIds">-->
        <!--<el-select size="small" class="select" filterable v-model="addForm.inProjectIds" multiple placeholder="请选择入场项目">-->
        <!--<el-option-->
        <!--v-for="item in compyList"-->
        <!--:label="item.name"-->
        <!--:value="item.id">-->
        <!--</el-option>-->
        <!--</el-select>-->
        <!--</el-form-item>-->

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
      stripe
      border
      v-loading="loading"
      style="width: 100%">
      <el-table-column
        label="设备唯一标识"
        align="center">
        <template scope="scope">
          <span @click="show(scope.row)"
                style="color: #409EFF; width:100%; height: 100%; display: block; cursor: pointer;">{{ scope.row.uniqueIdentity ? scope.row.uniqueIdentity : ''}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="设备型号"
        align="center">
        <template scope="scope">
          <span>{{ scope.row.equipmentModelName ? scope.row.equipmentModelName : ''}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="生产厂家"
        align="center">
        <template scope="scope">
          <span>{{ scope.row.manufacturerName ? scope.row.manufacturerName : '' }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="在用项目"
        align="center">
        <template scope="scope">
          <span>{{ scope.row['project_names'] ? scope.row.project_names : '' | upReplace }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="设备是否在线"
        align="center">
        <template scope="scope">
          <span>{{ scope.row['isOnline'] ? '在线' : '离线' }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="当前固件版本"
        align="center">
        <template scope="scope">
          <span>{{ scope.row.currentVersion ? scope.row.currentVersion : '' }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="设备禁用原因"
        align="center">
        <template scope="scope">
          <span>{{ scope.row.note ? scope.row.note : '' }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="创建日期"
        align="center">
        <template scope="scope">
          <span>{{ scope.row.equipmentOpAt ? scope.row.equipmentOpAt : ''}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" width="170" label="操作">
        <template scope="scope">
          <el-button
            size="small"
            type="text"
            @click="handleEdit(scope.row)">编辑
          </el-button>
          <el-button
            size="small"
            type="text"
            @click="handleSee(scope.row.equipmentId)">日志
          </el-button>
          <el-button
            v-show="showIsOk"
            v-if="scope.row.disabled"
            size="small"
            @click="deleteManager(scope.row)">启用</el-button>
          <el-button
            v-show="showIsOk"
            size="small"
            v-else
            type="danger"
            @click="deleteManager(scope.row)">禁用</el-button>
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
       修改
    -->
    <el-dialog :close-on-press-escape="false" title="编辑设备信息" :before-close="editCancelBtn" :visible.sync="editVisible">
      <el-form :model="editForm" label-width="95px" :rules="editFormRules" ref="editForm">
        <el-form-item label="所属公司" prop="useUnitId">
          <el-select size="small" class="select" filterable v-model="editForm.useUnitId" placeholder="请选择所属公司"
                     @change="changeComEdit">
            <el-option
              v-for="item in workerList"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="设备唯一标识" prop="uniqueIdentity">
          <el-input size="small" v-model="editForm.uniqueIdentity" placeholder="请输入设备唯一标识"
                    auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="设备型号" prop="equipmentModelId">
          <el-select size="small" class="select" filterable v-model="editForm.equipmentModelId" placeholder="请选择设备型号">
            <el-option
              v-for="item in compNoList"
              :label="item.equipmentModelName"
              :value="item.equipmentModelId">
            </el-option>
          </el-select>
        </el-form-item>
        <!--<el-form-item label="入场项目" prop="inProjectIds" >-->
        <!--<el-select size="small" class="select" id="errorClass" filterable v-model="checkedIds" multiple placeholder="请选择入场项目" @change="cahangeType">-->
        <!--<el-option-->
        <!--v-for="item in compyList"-->
        <!--:label="item.name"-->
        <!--:value="item.id">-->
        <!--</el-option>-->
        <!--</el-select>-->
        <!--<div class="el-form-item__error" v-show="isHave">请输入入场项目</div>-->
        <!--</el-form-item>-->

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="medium" @click.native="editCancelBtn">取消</el-button>
        <el-button size="medium" type="primary" @click.native="editBtn">保存</el-button>
      </div>
    </el-dialog>

    <!--
        查看
     -->
    <el-dialog :close-on-press-escape="false" title="查看设备信息" :visible.sync="showVisible" :close-on-click-modal="false">
      <el-form class="lookFormFindStyle" :model="editForm" label-width="95px" ref="editForm">
        <el-form-item class="lookStyleForDiv" label="所属公司:" prop="useUnitId">
          <div>{{editForm.unitName}}</div>
        </el-form-item>
        <el-form-item class="lookStyleForDiv" label="设备唯一标识:" prop="SN">
          <div>{{editForm.uniqueIdentity}}</div>
        </el-form-item>
        <el-form-item class="lookStyleForDiv" label="生产厂家:" prop="SN">
          <div>{{editForm.manufacturerName}}</div>
        </el-form-item>
        <el-form-item class="lookStyleForDiv" label="设备型号:" prop="equipmentModelId">
          <div>{{editForm.equipmentModelName}}</div>
        </el-form-item>
        <el-form-item class="lookStyleForDiv" label="在用项目:" prop="equipmentModelId">
          <div>{{editForm.project_names | upReplace}}</div>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="medium" @click.native="ok">关闭</el-button>
      </div>
    </el-dialog>


    <!-- 查看设备日志 -->
    <el-dialog class="logStyle" title="设备日志列表" :visible.sync="logsVisible" :close-on-click-modal="false"
               :close-on-press-escape="false">
      <el-table stripe v-loading="logsLoading" element-loading-text="拼命加载中"
                :data="logsData"
                style="margin-bottom: 20px;"
                border>
        <el-table-column
          label="日志名字"
          :show-overflow-tooltip="true"
          align="center">
          <template scope="scope">
            <span>{{ scope.row.name ? scope.row.name : ''}}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="日志大小"
          :show-overflow-tooltip="true"
          align="center">
          <template scope="scope">
            <span>{{ scope.row.fileSize ? scope.row.fileSize : ''}} kb</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作">
          <template scope="scope">
            <el-button
              size="small"
              type="text"
              @click="logsDownload(scope.row)">日志下载
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>
<script>
  import {
    getShowLogs,
    getMentList,
    addMent,
    editMent,
    deleteMent,
    getUserCompany,
    getMentByPro,
    getEquipList,
    editOneMent,
    checkSn
  } from '../../api/api';
  import {allBranchList} from '../../api/projectapi'
  import myCallback from "../../../static/common/callback"
  export default {
    mounted() {
      let parmas = {
        'search.unitId': this.companyId,
        'search.uniqueIdentity': this.search_name,
        'search.manufacturerName': this.search_contact,
        'pageNo': this.thisNowPage,
        'pageSize': this.pageSize
      }
      this.getListNo();
      this.getCompany();
      this.getList(parmas);
    },
    created() {
      this.companyId = this.project.projectId;
      this.addForm.useUnitId = this.companyId;
      var parmas = {
        unitId: this.companyId
      };
      getMentByPro(parmas).then((res) => {
        this.compyList = res.data.data;
      })
      this.showIsOk = window.sessionStorage.getItem('isTopAdmin');
    },
    props: {
      //项目id
      project: {
        type: Object
      }
    },
    watch: {
      project: {
        handler: function (val, oldVal) {
          this.companyId = val.projectId;
          this.addForm.useUnitId = this.companyId;
          this.search();
          var parmas = {
            unitId: this.companyId
          };
          getMentByPro(parmas).then((res) => {
            this.compyList = res.data.data;
          })
        },
        deep: true
      },
    },
    data() {
      // 查看校验
      var validaName = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入设备唯一标识！'));
        } else if (!/^[^\s]+$/.test(value)) {
          callback(new Error('设备型号不能带有空格！'));
        } else {
          var parmas = {
            uniqueIdentity: value
          }
          checkSn(parmas).then((res) => {
            if (res.data.code == 0) {
              callback();
            } else {
              callback(new Error(res.data.msg));
            }
          })
        }
      };

      // 编辑校验
      var validaEdName = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入设备唯一标识！'));
        } else if (!/^[^\s]+$/.test(value)) {
          callback(new Error('设备型号不能带有空格！'));
        } else {
          var parmas = {
            uniqueIdentity: value,
            id: this.editForm.id
          }
          checkSn(parmas).then((res) => {
            if (res.data.code == 0) {
              callback();
            } else {
              callback(new Error(res.data.msg));
            }
          })
        }
      };
      return {
        // 查看权限
        showIsOk: false,

        // 日志
        logsVisible: false,
        logsLoading: true,
        logsData: [],


        isHave: false,
        showVisible: false,
        // 列表页数据
        listData: [],
        currentPage: 1,
        totalNum: 0,
        pageSize: 10,

        thisNowPage: 1,

        loading: true,

        //checkedId
        checkedIds: [],

        // search
        search_name: '',
        search_contact: '',
        search_contactTel: '',

        // 公司列表
        workerList: '',
        // 设备型号列表
        compNoList: '',
        // 入场项目
        compyList: '',
        // 点击更改现在的数据
        editNowData: '',

        // 新增弹出层数据
        addVisible: false,
        addForm: {
          useUnitId: '',
          equipmentModelId: '',
          uniqueIdentity: '',
          inProjectIds: []
        },
        addFormRules: {
          useUnitId: [
            {required: true, message: '请选择所属分公司!', trigger: 'change'}
          ],
          equipmentModelId: [
            {required: true, message: '请选择设备型号!', trigger: 'change'}
          ],
          uniqueIdentity: [
            {required: true, validator: validaName, trigger: 'blur'},
            {min: 1, max: 50, message: '设备SN最大长度不能超过50个字符', trigger: 'blur'}
          ],
          inProjectIds: [
            {required: true, type: 'array', message: '请选择入场项目!', trigger: 'change'}
          ]
        },

        // 修改弹出层数据
        editVisible: false,
        editForm: {
          useUnitId: '',
          equipmentModelId: '',
          uniqueIdentity: '',
          inProjectIds: [],
          equipmentModel: {
            manufacturer: {
              name: ''
            }
          }

        },
        editFormRules: {
          useUnitId: [
            {required: true, message: '请选择所属分公司!', trigger: 'change'}
          ],
          equipmentModelId: [
            {required: true, message: '请选择设备型号!', trigger: 'change'}
          ],
          uniqueIdentity: [
            {required: true, validator: validaEdName, trigger: 'blur'},
            {min: 1, max: 50, message: '设备SN最大长度不能超过50个字符!', trigger: 'blur'}
          ],
          inProjectIds: [
            {required: true, type: 'array', message: '请选择入场项目!', trigger: 'blur'}
          ]
        }
      }
    },
    methods: {
      // 日志
      handleSee(id) {
        let parmas = {
          'equipmentId': id
        }
        getShowLogs(parmas).then((res) => {
          if (res.data.code == 0) {
            this.logsData = res.data.data.data;
            this.logsLoading = false;
            this.logsVisible = true;
          } else {
            myCallback.call(this,res);
            // this.$notify.error({
            //   title: '失败',
            //   message: res.data.msg,
            //   offset: 100
            // });
          }
        })
      },

      // 日志下载
      logsDownload(row) {
        window.open('/workerman/equipment/downloadLog?equipmentLogId=' + row.id, '日志下载');
      },

      // 查看
      show(row) {
        this.editForm = Object.assign({}, row)
        this.showVisible = true;
      },
      // 查看关闭
      ok() {
        this.showVisible = false;
        this.$refs['editForm'].resetFields();
      },

      // 获取公司列表
      getCompany() {
        allBranchList().then((res) => {
          this.workerList = res.data.data;
        })
      },
      // 获取设备型号
      getListNo() {
        var parmas = {
          pageSize: '999'
        }
        getEquipList(parmas).then((res) => {
          this.compNoList = res.data.data.list;
        })
      },
      // 获取公司
      changeCom(val) {
        var parmas = {
          unitId: val
        };
        getMentByPro(parmas).then((res) => {
          this.compyList = res.data.data;
        })
        this.addForm.inProjectIds = [];
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
            addMent(parmas).then((res) => {
              if (res.data.code == '0') {
                myCallback.call(this,res);
                // this.$notify.success({
                //   title: '添加成功',
                //   // message: res.data.msg,
                //   // offset: 100
                // });
                let parmas = {
                  'search.unitId': this.companyId,
                  'search.uniqueIdentity': this.search_name,
                  'search.manufacturerName': this.search_contact,
                  'pageNo': this.thisNowPage,
                  'pageSize': this.pageSize
                }
                this.getList(parmas);
                this.$refs['addForm'].resetFields();
              } else {
                myCallback.call(this);
                // this.$notify.error({
                //   title: '添加失败',
                //   message: res.data.msg,
                //   offset: 100
                // });
                this.$refs['addForm'].resetFields();
              }
            })
          }
        });
      },

      // 搜索
      search() {
        this.thisNowPage = 1;
        let parmas = {
          'search.unitId': this.companyId,
          'search.uniqueIdentity': this.search_name,
          'search.manufacturerName': this.search_contact,
          'pageNo': this.thisNowPage,
          'pageSize': this.pageSize
        }
        this.loading = true;
        this.getList(parmas);
      },
      // 重置
      clear() {
        this.search_name = '';
        this.search_contact = '';
      },

      // 获取列表
      getList(val) {
        getMentList(val).then((res) => {
          this.loading = false;
          if (res.data.code == 0) {
            this.listData = res.data.data.list;
            for (var i = 0; i < this.listData.length; i++) {
              this.listData[i].equipmentOpAt = this.getMyDate(this.listData[i].equipmentOpAt * 1000);
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
          'search.unitId': this.companyId,
          'search.uniqueIdentity': this.search_name,
          'search.manufacturerName': this.search_contact,
          'pageNo': this.thisNowPage,
          'pageSize': this.pageSize
        }
        this.getList(parmas);
      },
      handleSizeChange(val) {
        this.pageSize = val;
        let parmas = {
          'search.unitId': this.companyId,
          'search.uniqueIdentity': this.search_name,
          'search.manufacturerName': this.search_contact,
          'pageNo': this.thisNowPage,
          'pageSize': this.pageSize
        }
        this.getList(parmas);
      },

      changeComEdit(val) {
        var parmas = {
          unitId: val
        };
        this.checkedIds = [];
        getMentByPro(parmas).then((res) => {
          this.compyList = res.data.data;
        })
      },
      // 点击编辑
      handleEdit(row) {
        var parmas = {
          id: row.equipmentId
        }
        editOneMent(parmas).then((res) => {
          this.editForm = res.data.data;
          var arr = []
          for (var i = 0; i < res.data.data.projects.length; i++) {
            arr.push(res.data.data.projects[i].id)
          }
          this.checkedIds = arr;
          this.editForm.inProjectIds = this.checkedIds;
          this.editVisible = true;
//                    var parmas = {
//                        id: res.data.data.useUnitId
//                    };
//                    getMentByPro(parmas).then((res) => {
//                        this.compyList = res.data.data;
//                    })
        })
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
            let parmas = Object.assign({}, this.editForm);
            var data = {
              id: parmas.id,
              useUnitId: parmas.useUnitId,
              equipmentModelId: parmas.equipmentModelId,
              uniqueIdentity: parmas.uniqueIdentity,
              inProjectIds: this.checkedIds
            }
            editMent(data).then((res) => {
              if (res.data.code == '0') {
                myCallback.call(this,res);
                // this.$notify.success({
                //   title: '修改成功',
                //   // message: res.data.msg,
                //   // offset: 100
                // });
                let parmas = {
                  'search.unitId': this.companyId,
                  'search.uniqueIdentity': this.search_name,
                  'search.manufacturerName': this.search_contact,
                  'pageNo': this.thisNowPage,
                  'pageSize': this.pageSize
                }
                this.getList(parmas);
              } else {
                myCallback.call(this,res);
                // this.$notify.error({
                //   title: '修改失败',
                //   message: res.data.msg,
                //   offset: 100
                // });
              }
              this.checkedIds = [];
              this.editVisible = false;
              this.$refs['editForm'].resetFields();
              this.editForm = {
                useUnitId: '',
                equipmentModelId: '',
                SN: '',
                equipmentModel: {
                  manufacturer: {
                    name: ''
                  }
                },
                inProjectIds: []
              }
            });
//                        if(this.checkedIds.length == 0) {
//                            this.isHave = true;
//                            var oBj = document.getElementById('errorClass');
//                            oBj.style.border = '1px solid #f56c6c';
//                            return ;
//                        }else {
//                            this.isHave = false;
//                            var oBj = document.getElementById('errorClass');
//                            oBj.style.border = '1px solid #67c23a';
//                        }
          }
        });
      },

      cahangeType() {
        if (this.checkedIds.length == 0) {
          this.isHave = true;
          var oBj = document.getElementById('errorClass');
          oBj.style.border = '1px solid #f56c6c';
        } else {
          this.isHave = false;
          var oBj = document.getElementById('errorClass');
          oBj.style.border = '1px solid #67c23a';
        }
      },

      doFunManager(parmas) {
        deleteMent(parmas).then((res) => {
          if (res.data.code == '0') {
            let parmas = {
              'search.unitId': this.companyId,
              'search.uniqueIdentity': this.search_name,
              'search.manufacturerName': this.search_contact,
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
      },

      // 禁用设备
      deleteManager(row) {
        if(row.disabled) {
          this.$confirm('此操作将启动设备, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            var parmas = {
              id: row.equipmentId,
              note: '',
              disabled: !row.disabled
            }
            this.doFunManager(parmas)
          })
        }else {
          this.$prompt('禁用原因', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消'
          }).then(({ value }) => {
            var parmas = {
              id: row.equipmentId,
              note: value,
              disabled: !row.disabled
            }
            this.doFunManager(parmas)
          })
        }
      }
    }
  }
</script>
<style>
  .eqdetilM {
    font-size: 0rem;
  }
  .eqdetilM .lookStyleForDiv div {
    font-size: .12rem;
    color: #5C6471;
  }

  .eqdetilM .btn {
    border-radius: .2rem;
    margin-bottom: .3rem;
  }

  .eqdetilM .pageCurrent {
    position: relative;
    top: .15rem;
    float: right;
    right: .3rem;
  }

  .eqdetilM .select {
    width: 100%;
  }

  .eqdetilM .searchBox {
    width: 100%;
    overflow: hidden;
    position: relative;
    margin-bottom: .15rem;
  }

  .eqdetilM .search {
    /*width: 350px;*/
    height: .5rem;
    line-height: .5rem;
    float: left;
    margin-right: .1rem;
  }

  .eqdetilM .search p {
    float: left;
    /*width: .7rem;*/
    height: .5rem;
    line-height: .5rem;
    font-size: .14rem;
    text-align: center;
  }

  .eqdetilM .search .searchInput {
    float: left;
    width: 2.1rem;
  }

  .eqdetilM .searchBtn {
    position: absolute;
    right: 0;
    top: .1rem;
  }

  .logStyle .el-dialog__body {
    overflow: hidden;
  }
</style>
