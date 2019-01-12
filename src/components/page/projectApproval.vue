<template>
  <div class="sateBox">
    <!--
        搜索条件
    -->
    <div class="searchBox workingContent">
      <div style="margin-bottom: .1rem;">
        <div class="title" style="width: .9rem; float: left; height: .42rem; line-height: .42rem; font-size: .12rem;">
          审批状态：
        </div>
        <div class="workingPar">
          <div class="workingChild" :class="{'stateActives':0 === approvalStates}" @click="stateType(0)">
            <div class="childText">
              待审批
            </div>
          </div>
          <div class="workingChild" :class="{'stateActives':1 === approvalStates}" @click="stateType(1)">
            <div class="childText">
              审批通过
            </div>
          </div>
          <div class="workingChild" :class="{'stateActives':2 === approvalStates}" @click="stateType(2)">
            <div class="childText">
              审批驳回
            </div>
          </div>
        </div>
      </div>
      <div>
        <div class="title" style="width: .9rem; float: left; height: .42rem; line-height: .42rem; font-size: .12rem;">
          项目类型：
        </div>
        <div class="workingPar">
          <div class="workingChild" :class="{'stateActives': item.id == projectTypeIds}"
               v-for="(item, index) in proList" @click="buildType(item.id, index)">
            <div class="childText">
              {{item.name}}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!--
        列表
    -->
    <el-table
      class="table"
      :data="listData"
      border
      stripe
      v-loading="loading"
    >
      <el-table-column
        label="项目名称"
        min-width="15%"
        :show-overflow-tooltip="true"
        align="center">
        <template scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="项目类型"
        align="center"
        min-width="10%"
        :show-overflow-tooltip="true">
        <template scope="scope">
          <span>{{ scope.row.projecttypename }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="所属分公司"
        align="center"
        min-width="10%"
        :show-overflow-tooltip="true">
        <template scope="scope">
          <span>{{ scope.row.sunitname }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="项目经理"
        align="center"
        min-width="10%"
        :show-overflow-tooltip="true">
        <template scope="scope">
          <span>{{ scope.row.projectmanagername }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="所在城市"
        align="center"
        min-width="15%"
        :show-overflow-tooltip="true">
        <template scope="scope">
          <span>{{ scope.row.address }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="开工日期"
        align="center"
        min-width="10%"
        :show-overflow-tooltip="true">
        <template scope="scope">
          <span>{{ scope.row.startdate }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="竣工日期"
        align="center"
        min-width="10%"
        :show-overflow-tooltip="true">
        <template scope="scope">
          <span>{{ scope.row.completiondate }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="审批状态"
        align="center"
        min-width="10%"
        :show-overflow-tooltip="true">
        <template scope="scope">
          <span>{{ scope.row.approvalstates }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" min-width="10%">
        <template scope="scope">
          <el-button
            v-show="scope.row.approvalstates === '待审批'"
            size="small"
            type="text"
            @click="handleWork(scope.row)">审批
          </el-button>
          <el-button
            style="margin: 0;"
            v-show="scope.row.approvalstates === '已通过' || scope.row.approvalstates === '已驳回'"
            size="small"
            type="text"
            @click="handleLook(scope.row)">详情
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
        审批dialog
    -->
    <el-dialog :close-on-press-escape="false" title="项目审批" :before-close="cancelState" :visible.sync="approvalVisible"
               :close-on-click-modal="false">
      <el-form :model="dataForm" label-width="1.3rem" :rules="dataFormRules" ref="dataForm">
        <div class="projectBoxForSelf">
          <el-form-item class="lookStyleForDiv" label="项目名称:" style="width: 50%; float: left;">
            <el-input size="small" disabled v-model="dataForm.name"></el-input>
          </el-form-item>
          <el-form-item class="lookStyleForDiv" label="所属分公司:" style="width: 50%; float: right;">
            <el-input size="small" disabled v-model="dataForm.unit.name"></el-input>
          </el-form-item>
          <el-form-item class="lookStyleForDiv placeLook" label="项目地址:" style="width: 50%; float: left;">
            <el-input size="small" disabled v-model="dataForm.szd"></el-input>
          </el-form-item>
          <el-form-item class="lookStyleForDiv" label="开发商名称:" style="width: 50%; float: right;">
            <el-input size="small" disabled v-model="dataForm.developerName"></el-input>
          </el-form-item>
          <el-form-item class="lookFormFindStyle" label="项目类型:" style="width: 50%; float: left;">
            <el-select disabled style="height: .4rem !important; width: 100%;" v-model="dataForm.projectTypeId"
                       size="small" placeholder="请选择班组">
              <el-option
                v-for="item in proList"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </div>
        <div class="dataBox">
          <el-form-item class="lookStyleForDiv" label="开工日期:" style="width: 50%; float: left;">
            <el-input size="small" disabled v-model="dataForm.startDate"></el-input>
          </el-form-item>
          <el-form-item class="lookStyleForDiv" label="竣工日期:" style="width: 50%; float: right;">
            <el-input size="small" disabled v-model="dataForm.completionDate"></el-input>
          </el-form-item>
          <el-form-item class="lookStyleForDiv" label="楼栋数:" style="width: 50%; float: left;">
            <el-input size="small" disabled v-model="dataForm.buildNum"></el-input>
          </el-form-item>
          <el-form-item class="lookStyleForDiv" label="户数:" style="width: 50%; float: right;">
            <el-input size="small" disabled v-model="dataForm.householdNum"></el-input>
          </el-form-item>
          <el-form-item class="lookStyleForDiv" label="在建面积:" style="width: 50%; float: left;">
            <el-input size="small" disabled v-model="dataForm.area"></el-input>
          </el-form-item>
        </div>
        <el-form-item class="lookFormFindStyle" label="项目描述:">
          <el-input size="small" class="textareaOverflow" type="textarea" :autosize="true" disabled
                    v-model="dataForm.projectDescribe" resize="none" :rows=4></el-input>
        </el-form-item>
        <div class="adminBox">
          <div style="width: 100%; float: right; border-bottom: 1px solid #ccc;margin-left: 3%; margin-bottom: 20px;">
            项目经理信息
          </div>
          <el-form-item class="lookStyleForDiv" label="用户名:" style="width:100%; float: right;">
            <el-input size="small" disabled v-model="dataForm.projectManager.loginname"></el-input>
          </el-form-item>
          <el-form-item class="lookStyleForDiv" label="系统管理员姓名:" style="width: 100%; float: right;">
            <el-input size="small" disabled v-model="dataForm.projectManager.username"></el-input>
          </el-form-item>
          <el-form-item class="lookStyleForDiv" label="联系方式:" style="width: 100%; float: left;">
            <el-input size="small" disabled v-model="dataForm.projectManager.phone"></el-input>
          </el-form-item>
        </div>
        <div class="doBox">
          <el-form-item label="审批状态">
            <el-radio-group size="small" v-model="approvalStatesA">
              <el-radio label="1">通过</el-radio>
              <el-radio label="2">驳回</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item v-show="approvalStatesA == 2" label="驳回原因" prop="approvalNote">
            <el-input size="small" :autosize="true" class="textareaOverflow" type="textarea"
                      v-model="dataForm.approvalNote" resize="none" :rows=4 placeholder="驳回原因"></el-input>
          </el-form-item>
        </div>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button size="medium" @click.native="cancelState">取消</el-button>
        <el-button size="medium" type="primary" @click.native="submitState">提交</el-button>
      </div>
    </el-dialog>

    <!--
        详情dialog
    -->
    <el-dialog :close-on-press-escape="false" title="项目审批" :before-close="cancelLook" :visible.sync="lookVisible"
               :close-on-click-modal="false">
      <el-form class="lookFormFindStyle" :model="dataForm" label-width="1.3rem" ref="dataForm">
        <div class="projectBoxForSelf">
          <el-form-item class="lookStyleForDiv" label="项目名称:" style="width: 50%; float: left;">
            <el-input size="small" disabled v-model="dataForm.name"></el-input>
          </el-form-item>
          <el-form-item class="lookStyleForDiv" label="所属分公司:" style="width: 50%; float: right;">
            <el-input size="small" disabled v-model="dataForm.unit.name"></el-input>
          </el-form-item>
          <el-form-item class="lookStyleForDiv placeLook" label="项目地址:" style="width: 50%; float: left;">
            <el-input size="small" disabled v-model="dataForm.szd"></el-input>
          </el-form-item>
          <el-form-item class="lookStyleForDiv" label="开发商名称:" style="width: 50%; float: right;">
            <el-input disabled v-model="dataForm.developerName"></el-input>
          </el-form-item>
          <el-form-item class="lookStyleForDiv" label="项目类型:" style="width: 50%; margin: 0;">
            <el-select disabled style="height: .4rem !important; width: 100%;" v-model="dataForm.projectTypeId"
                       size="small" placeholder="请选择班组">
              <el-option
                v-for="item in proList"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </div>
        <div class="dataBox">
          <el-form-item class="lookStyleForDiv" label="开工日期:" style="width: 50%; float: left;">
            <el-input size="small" disabled v-model="dataForm.startDate"></el-input>
          </el-form-item>
          <el-form-item class="lookStyleForDiv" label="竣工日期:" style="width: 50%; float: right;">
            <el-input size="small" disabled v-model="dataForm.completionDate"></el-input>
          </el-form-item>
          <el-form-item class="lookStyleForDiv" label="楼栋数:" style="width: 50%; float: left;">
            <el-input size="small" disabled v-model="dataForm.buildNum"></el-input>
          </el-form-item>
          <el-form-item class="lookStyleForDiv" label="户数:" style="width: 50%; float: right;">
            <el-input size="small" disabled v-model="dataForm.householdNum"></el-input>
          </el-form-item>
          <el-form-item class="lookStyleForDiv" label="在建面积:" style="width: 50%; float: left;">
            <el-input size="small" disabled v-model="dataForm.area"></el-input>
          </el-form-item>
        </div>
        <el-form-item class="textarea lookStyleForDiv" label="项目描述:">
          <el-input type="textarea" :autosize="true" disabled v-model="dataForm.projectDescribe" resize="none"
                    :rows=4></el-input>
        </el-form-item>
        <div class="adminBox">
          <div style="width: 100%; float: right; border-bottom: 1px solid #ccc;margin-left: 3%; margin-bottom: 20px;">
            项目经理信息
          </div>
          <el-form-item class="lookStyleForDiv" label="用户名:" style="width: 100%; float: right;">
            <el-input size="small" disabled v-model="dataForm.projectManager.loginname"></el-input>
          </el-form-item>
          <el-form-item class="lookStyleForDiv" label="系统管理员姓名:" style="width: 100%; float: right;">
            <el-input size="small" disabled v-model="dataForm.projectManager.username"></el-input>
          </el-form-item>
          <el-form-item class="lookStyleForDiv" label="联系方式:" style="width: 100%; float: left;">
            <el-input size="small" disabled v-model="dataForm.projectManager.phone"></el-input>
          </el-form-item>
        </div>
        <div class="doBox" v-show="!dataForm.states">
          <el-form-item class="lookStyleForDiv" label="驳回原因:" prop="approvalNote">
            <el-input size="small" class="textareaOverflow" :autosize="true" disabled type="textarea"
                      v-model="dataForm.approvalNote" resize="none" :rows=4></el-input>
          </el-form-item>
        </div>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button size="medium" @click.native="cancelLook">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import {getSateList, getProjcetList, searchSateList, setState, getCompanyList} from '../../api/api';
  import myCallback from "../../../static/common/callback"
  export default {
    data() {
      return {
        companyId: '',
        // 列表页数据
        listData: [],
        currentPage: 1,
        totalNum: 0,
        pageSize: 10,

        thisNowPage: 1,

        // 项目类型表
        proList: '',

        // 审批状态筛选的数组
        approvalStates: [],
        // 审批状态选中
        stateTypeArr: [{'bok': ''}, {'bok': ''}, {'bok': ''}],

        // 项目类型选中
        buildTypeArr: [],
        // 项目类型筛选数组
        projectTypeIds: [],

        loading: true,

        // 审批
        approvalVisible: false,
        // 查看详情
        lookVisible: false,

        // 数据
        dataForm: {
          address: '',
          unit: {
            address: ''
          },
          projectCommissioner: {
            loginname: ''
          },
          projectManager: {
            loginname: ''
          }
        },

        dataFormRules: {
          approvalNote: [
            {required: true, message: '驳回原因不能为空!', trigger: 'blur'}
          ]
        },

        // 驳回是否通过
        approvalStates: '',
        // 驳回原因
        approvalNote: '',
        approvalStatesA: '1',

        // 查看
        lookVisible: false,

        // 现在的id
        nowId: ''
      }
    },
    props: {
      project: {
        type: Object
      }
    },
    mounted() {
      var parmas = {
        'search.unitId': this.companyId,
        'search.approvalStates': this.approvalStates,
        'search.projectTypeIds': this.projectTypeIds,
        'pageNum': this.thisNowPage,
        'pageSize': this.pageSize
      };
      this.getList(parmas);
      this.getProList();
    },
    watch: {
      project: {
        handler: function (val, oldval) {
          this.companyId = val.projectId;
          this.contentState = 0;
          var parmas = {
            'search.unitId': this.companyId,
            'search.approvalStates': this.approvalStates,
            'search.projectTypeIds': this.projectTypeIds,
            'pageNum': this.thisNowPage,
            'pageSize': this.pageSize
          };
          this.getList(parmas);
        },
        deep: true
      },
    },
    methods: {
      // 获取列表
      getList(val) {
        getSateList(val).then((res) => {
          this.loading = false;
          if (res.data.code == 0) {
            this.listData = res.data.data.list;
            for (var i = 0; i < this.listData.length; i++) {
              if (this.listData[i].approvalstates == 0) {
                this.listData[i].approvalstates = '待审批';
              } else if (this.listData[i].approvalstates == 1) {
                this.listData[i].approvalstates = '已通过';
              } else {
                this.listData[i].approvalstates = '已驳回';
              }
              //this.listData[i].szd = this.listData[i].provincename + this.listData[i].cityname + this.listData[i].countyname;
              this.listData[i].szd = this.listData[i].address;
            }
            this.totalNum = res.data.data.totalCount;
          }else {
            myCallback.call(this,res);
            // this.$notify.error({
            //   title: '获取列表失败',
            //   message: res.data.msg,
            //   offset: 100
            // });
          }
        })
      },

      // 获取项目类型列表
      getProList() {
        getProjcetList().then((res) => {
          this.proList = res.data.data;
          for (var i = 0; i < this.proList.length; i++) {
            this.buildTypeArr.push({
              id: '',
              index: i
            })
          }
        })
      },

      // 审批状态点击
      stateType(val) {
        this.loading = true;
        if (this.approvalStates === val) {
          this.approvalStates = '';
        } else {
          this.approvalStates = val;
        }
        this.thisNowPage = 1;
        var parmas = {
          'search.unitId': this.companyId,
          'search.approvalStates': this.approvalStates,
          'search.projectTypeIds': this.projectTypeIds,
          'pageNum': this.thisNowPage,
          'pageSize': this.pageSize
        };
        this.getList(parmas);
      },

      // 项目类型点击
      buildType(id, index) {
        this.loading = true;
        if (this.projectTypeIds === id) {
          this.projectTypeIds = '';
        } else {
          this.projectTypeIds = id;
        }
        this.thisNowPage = 1;
        var parmas = {
          'search.unitId': this.companyId,
          'search.approvalStates': this.approvalStates,
          'search.projectTypeIds': this.projectTypeIds,
          'pageNum': this.thisNowPage,
          'pageSize': this.pageSize
        };
        this.getList(parmas);
      },

      // 改变页数
      handleCurrentChange(val) {
        this.thisNowPage = val;
        var parmas = {
          'search.unitId': this.companyId,
          'search.approvalStates': this.approvalStates,
          'search.projectTypeIds': this.projectTypeIds,
          'pageNo': this.thisNowPage,
          'pageSize': this.pageSize
        };
        this.getList(parmas);
      },
      handleSizeChange(val) {
        this.pageSize = val;
        var parmas = {
          'search.unitId': this.companyId,
          'search.approvalStates': this.approvalStates,
          'search.projectTypeIds': this.projectTypeIds,
          'pageNum': this.thisNowPage,
          'pageSize': this.pageSize
        };
        this.getList(parmas);
      },

      // 审批
      handleWork(val) {
        var parmas = {
          projectId: val.id
        }
        this.nowId = val.id;
        searchSateList(parmas).then((res) => {
          this.dataForm = res.data.data;
          // this.dataForm.szd = this.dataForm.province.name + this.dataForm.city.name + this.dataForm.county.name + this.dataForm.address;
          this.dataForm.szd = this.dataForm.address;
        })
        this.approvalVisible = true;
      },

      // 详情
      handleLook(val) {
        var parmas = {
          projectId: val.id
        };
        this.nowId = val.id;
        searchSateList(parmas).then((res) => {
          this.dataForm = res.data.data;
          // this.dataForm.szd = this.dataForm.province.name + this.dataForm.city.name + this.dataForm.county.name + this.dataForm.address;
          this.dataForm.szd = this.dataForm.address;
          this.lookVisible = true;
        })
      },
      cancelLook() {
        this.lookVisible = false;
        this.$refs['dataForm'].resetFields();
      },

      // 提交
      submitState() {
        if (this.approvalStatesA !== '') {
          var parmas = {
            projectId: this.nowId,
            approvalStates: this.approvalStatesA,
            approvalNote: this.dataForm.approvalNote
          }
          if (this.approvalStatesA == 1) {
            this.dataForm.approvalNote = ' ';
          }
          this.$refs.dataForm.validate((valid) => {
            if (valid) {
              this.approvalVisible = false;
              setState(parmas).then((res) => {
                if (res.data.code == 0) {
                  myCallback.call(this,res);
                  // this.$notify.success({
                  //   type: 'success',
                  //   title: '操作成功!'
                  // });
                  var parmas = {
                    'search.unitId': this.companyId,
                    'search.approvalStates': this.approvalStates,
                    'search.projectTypeIds': this.projectTypeIds,
                    'pageNum': this.thisNowPage,
                    'pageSize': this.pageSize
                  };
                  this.getList(parmas);
                  this.approvalStates = '';
                  this.$refs['dataForm'].resetFields();
                } else {
                  myCallback.call(this,res);
                  // this.$notify.error({
                  //   message: res.data.msg,
                  //   offset: 100
                  // });
                }
              })
            }
          })
        } else {
          // this.$message({
          //   type: 'error',
          //   message: '请选择审批状态!'
          // });
          myCallback.call(this,res);
          // this.$notify.error({
          //   title: '状态!',
          //   message: '请选择审批状态!',
          //   // offset: 100
          // });
        }
      },
      // 取消
      cancelState() {
        this.approvalVisible = false;
        this.approvalStates = '';
        this.approvalStatesA = '1';
        this.$refs['dataForm'].resetFields();
        this.dataForm = {
          address: '',
          unit: {
            address: ''
          },
          projectCommissioner: {
            loginname: ''
          },
          projectManager: {
            loginname: ''
          }
        }
      },
    }
  }
</script>
<style scoped>
  .sateBox {
    font-size: 0rem;
  }
  .sateBox .searchBox {
    margin-bottom: .2rem;
  }

  .sateBox .workingClass .btn {
    border-radius: .2rem;
  }

  .sateBox .workingPar {
    overflow: hidden;
    position: relative;
    top: -.06rem;
    width: calc(100% - 1rem);
  }

  .sateBox .workingChild {
    height: .25rem;
    border: 1px solid #409efe;
    cursor: pointer;
    border-radius: .2rem;
    float: left;
    font-size: .12rem;
    text-align: center;
    line-height: .25rem;
    margin-right: .15rem;
    margin-top: .15rem;
    position: relative;
    color: #409efe;
  }

  .sateBox .childText {
    padding-left: .25rem;
    padding-right: .25rem;
  }

  .sateBox .stateActives {
    color: #fff;
    background: #409efe;
  }

  .sateBox .pageCurrent {
    position: relative;
    top: .15rem;
    float: right;
    right: .3rem;
  }

  .sateBox .projectBoxForSelf {
    overflow: hidden;
  }

  .dataBox {
    overflow: hidden;
  }

  .adminBox {
    overflow: hidden;
  }

  .lookFormFindStyle .el-form-item {
    margin: 0 auto;
  }
</style>
<style>
  .sateBox .placeLook .el-input__inner {
    text-overflow: ellipsis;
    display: -webkit-box; /** 对象作为伸缩盒子模型显示 **/
    -webkit-box-orient: vertical; /** 设置或检索伸缩盒对象的子元素的排列方式 **/
    -webkit-line-clamp: 1; /** 显示的行数 **/
    overflow: hidden; /** 隐藏超出的内容 **/
  }

  .sateBox .textarea .el-form-item__content {
    width: 80%;
    overflow: hidden;
    float: right;
  }

  .sateBox .lookFormFindStyle .el-textarea.is-disabled .el-textarea__inner {
    background: #fff;
    border: none;
    color: #5C6471;
    margin-left: 0;
    padding: 0;
    font-size: .12rem;
    margin-top: .11rem;
    width: 100%;
    max-height: .60rem;
  }

  .sateBox .lookFormFindStyle .el-textarea {
    overflow: hidden;
    height: 100%;
  }

  .sateBox .lookFormFindStyle .textarea .el-form-item__content {
    margin: 0 !important;
    height: 100%;
    float: left;
  }

  .sateBox .lookFormFindStyle .textarea .el-form-item__label {
    float: left;
  }

  .sateBox .lookStyleForDiv .el-textarea.is-disabled .el-textarea__inner {
    font-size: .13rem;
    color: #5C6471 !important;
    font-family: "Helvetica Neue", Helvetica, "microsoft yahei", arial, STHeiTi, sans-serif;
  }

  .sateBox .lookFormFindStyle .textarea .el-form-item__content {
    width: calc(100% - 1.3rem);
    float: right;
  }
</style>
