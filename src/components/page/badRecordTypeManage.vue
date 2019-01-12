<template>
  <div class="workingClass">
    <!--
        页面列表
    -->
    <div class="workingContent">
      <div class="workingBody">
        <div id="item.id" class="workingTitle">不良纪录类型</div>
        <div class="workingPar">
          <div id="childs.id" class="workingChild" v-for="item in listData">
            <div class="childText">
              {{item.name}}
            </div>
            <div class="editChildBox">
              <i class="el-icon-edit childEdit" @click="editClick(item)"></i>
              <i class="el-icon-delete childDelete" @click="deleteClick(item.id)"></i>
            </div>
          </div>
          <div class="workingChild addIcon" @click="showWorkingTab()"><i class="el-icon-circle-plus"></i></div>
        </div>
      </div>
    </div>

    <!--
        新增项目类型
    -->
    <el-dialog :close-on-press-escape="false" title="新增不良纪录类型" :visible.sync="addWorkingVisible"
               :close-on-click-modal="false" :before-close="hiddenWorkingTab">
      <el-form :model="addForm" label-width="120px" :rules="addFormRules" ref="addForm">
        <el-form-item label="不良纪录类型名称" prop="name">
          <el-input size="small" v-model="addForm.name" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="medium" @click.native="hiddenWorkingTab">取消</el-button>
        <el-button size="medium" type="primary" @click.native="addWorking">保存</el-button>
      </div>
    </el-dialog>

    <!--
        修改工类
    -->
    <el-dialog :close-on-press-escape="false" title="修改不良纪录类型" :visible.sync="editWorkingVisible"
               :close-on-click-modal="false" :before-close="hiddenWorkingTabEdit">
      <el-form :model="editForm" label-width="120px" :rules="editFormRules" ref="editForm">
        <el-form-item label="不良纪录类型名称" prop="name">
          <el-input size="small" v-model="editForm.name" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="medium" @click.native="hiddenWorkingTabEdit">取消</el-button>
        <el-button size="medium" type="primary" @click.native="editWorking">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import {badRecordList, createBadRecord, editBadRecord, delBadRecord, checkBadRecord} from '../../api/api';
  import myCallback from "../../../static/common/callback"
  export default {
    data() {
      // 校验名称
      var validWorkerName = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入不良纪录类型名称！'));
        } else if (!/^[^\s]+$/.test(value)) {
          callback(new Error('不良纪录类型名称不能带有空格！'));
        } else {
          var parmas = {
            name: value
          }
          checkBadRecord(parmas).then((res) => {
            if (res.data.code == 0) {
              callback()
            } else {
              callback(new Error(res.data.msg))
            }
          })
        }
      };

      // 编辑校验
      var validEdWorkerName = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入不良纪录类型名称！'));
        } else if (!/^[^\s]+$/.test(value)) {
          callback(new Error('不良纪录类型名称不能带有空格！'));
        } else {
          var parmas = {
            id: this.editForm.id,
            name: value
          }
          checkBadRecord(parmas).then((res) => {
            if (res.data.code == 0) {
              callback()
            } else {
              callback(new Error(res.data.msg))
            }
          })
        }
      };

      return {
        // 列表数据
        listData: [],

        // 创建工类表单
        // 创建工类是否显示
        addWorkingVisible: false,
        addForm: {
          name: ''
        },
        addFormRules: {
          name: [
            {required: true, validator: validWorkerName, trigger: 'blur'},
            {min: 1, max: 10, message: '不良纪录类型名称长度不能超过10个字符', trigger: 'blur'}
          ]
        },

        // 修改工类工种
        editWorkingVisible: false,
        editForm: {},
        editFormRules: {
          name: [
            {required: true, validator: validEdWorkerName, trigger: 'blur'},
            {min: 1, max: 10, message: '不良纪录类型名称长度不能超过10个字符', trigger: 'blur'}
          ]
        },
      }
    },
    mounted() {
      this.getList();
    },
    methods: {
      // 获取初始数据
      getList() {
        badRecordList().then((res) => {
          if (!res) {
            return;
          }
          if (res.data.code == 0) {
            this.listData = res.data.data;
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

      // 编辑点击
      editClick(row) {
        this.editForm = Object.assign({}, row);
        this.editWorkingVisible = true;
      },
      hiddenWorkingTabEdit() {
        this.editWorkingVisible = false;
        this.editForm = {};
      },
      editWorking() {
        this.$refs.editForm.validate((valid) => {
          if (valid) {
            let parmas = Object.assign({}, this.editForm);
            editBadRecord(parmas).then((res) => {
              this.editWorkingVisible = false;
              if (res.data.code == '0') {
                this.getList(this.thisNowPage);
                myCallback.call(this,res);
                // this.$notify.success({
                //   title: '修改成功',
                //   // message: res.data.msg,
                //   // offset: 100
                // });
                this.editForm = {};
              } else {
                myCallback.call(this,res);
                // this.$notify.error({
                //   title: '修改失败',
                //   message: res.data.msg,
                //   offset: 100
                // });
                this.editForm = {};
              }
            }).catch((err) => {
              console.log(err)
            })
          }
        });
      },

      // 新增点击
      showWorkingTab() {
        this.addWorkingVisible = true;
      },
      hiddenWorkingTab() {
        this.addWorkingVisible = false;
        this.$refs['addForm'].resetFields();
      },
      addWorking() {
        this.$refs.addForm.validate((valid) => {
          if (valid) {
            let parmas = Object.assign({}, this.addForm);
            createBadRecord(parmas).then((res) => {
              if (res.data.code == '0') {
                this.getList();
                myCallback.call(this,res);
                // this.$notify.success({
                //   title: '新增成功',
                //   // message: res.data.msg,
                //   // offset: 100
                // });
                this.addWorkingVisible = false;
                this.$refs['addForm'].resetFields();
              } else {
                myCallback.call(this,res);
                // this.$notify.error({
                //   title: '新增失败',
                //   message: res.data.msg,
                //   offset: 100
                // });
                this.addWorkingVisible = false;
                this.$refs['addForm'].resetFields();
              }
            }).catch((err) => {
              console.log(err)
            })
          }
        });
      },

      // 删除
      deleteClick(id) {
        this.$confirm('确认删除该不良纪录类型吗?', '提示', {
          type: 'warning'
        }).then(() => {
          let parmas = {'id': id};
          delBadRecord(parmas).then((res) => {
            if (res.data.code == '0') {
              this.getList();
              myCallback.call(this,res);
              // this.$notify.success({
              //   title: '删除成功',
              //   // message: res.data.msg,
              //   // offset: 100
              // });
            } else {
              this.getList();
              myCallback.call(this,res);
              // this.$notify.error({
              //   title: '删除失败',
              //   message: res.data.msg,
              //   offset: 100
              // });
            }
          })
        }).catch(() => {

        })
      }
    }
  }
</script>
<style slop-scope>
  .workingClass {
    position: absolute;
    top: 0;
  }

  .workingClass .btn {
    border-radius: .2rem;
  }

  .workingBody {
    margin-top: .2rem;
    margin-bottom: .2rem;
  }

  .workingBody .workingTitle {
    height: .3rem;
    line-height: .3rem;
    border-bottom: 1px solid #ccc;
    position: relative;
    padding-left: .1rem;
    padding-bottom: .1rem;
    font-size: .23rem;
  }

  .workingBody .editBox {
    position: absolute;
    right: .1rem;
    top: 0;
    height: 100%;
    width: .5rem;
  }

  .workingBody .editBox .titleEdit {
    margin-right: .1rem;
    cursor: pointer;
  }

  .workingBody .editBox .titleDelete {
    cursor: pointer;
  }

  .workingBody .editBox .titleEdit:hover {
    color: #1a97f8;
  }

  .workingBody .editBox .titleDelete:hover {
    color: #1a97f8;
  }

  .workingPar {
    overflow: hidden;
    width: 100%;
  }

  .workingChild {
    height: .25rem;
    border: 1px solid #ccc;
    border-radius: .2rem;
    float: left;
    font-size: .12rem;
    text-align: center;
    line-height: .25rem;
    margin-right: .15rem;
    margin-top: .15rem;
    position: relative;
  }

  .editChildBox {
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    cursor: pointer;
  }

  .childText {
    padding-left: .25rem;
    padding-right: .25rem;
  }

  .editChildBox .childEdit {
    display: none;
    width: calc(50% - .08rem);
    height: 100%;
    position: absolute;
    left: 0;
    top: 50%;
    margin-top: -.075rem;
    text-align: left;
    padding-left: .08rem;
  }

  .editChildBox .childDelete {
    display: none;
    width: calc(50% - .08rem);
    height: 100%;
    position: absolute;
    right: 0;
    top: 50%;
    margin-top: -.075rem;
    text-align: right;
    padding-right: .08rem;
  }

  .editChildBox:hover .childEdit {
    display: block;
  }

  .editChildBox:hover .childDelete {
    display: block;
  }

  .editChildBox .childEdit:hover {
    color: #1a97f8;
  }

  .editChildBox .childDelete:hover {
    color: #1a97f8;
  }

  .addIcon {
    width: .25rem;
    line-height: .29rem;
    font-size: .23rem;
    text-align: center;
    cursor: pointer;
    border: none;
  }
</style>
