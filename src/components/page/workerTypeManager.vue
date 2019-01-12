<template>
  <div class="workingClassa">
    <el-button class="btn" size="medium" type="primary" @click="showWorkingTab(0,'')">创建工类</el-button>

    <!--
        页面列表
    -->
    <div class="workingContent">
      <div class="workingBody" v-for="item in workingList">
        <div id="item.id" class="workingTitle">{{item.name}}
          <div class="editBox">
            <i class="el-icon-edit titleEdit" @click="editClick(0, item.id, item)"></i>
            <i class="el-icon-delete titleDelete" @click="deleteClick(0, item.id)"></i>
          </div>
        </div>
        <div class="workingPar">
          <div id="childs.id" class="workingChild" v-for="childs in item.workTypes">
            <div class="childText">
              {{childs.name}}
            </div>
            <div class="editChildBox">
              <i class="el-icon-edit childEdit" @click="editClick(1, childs.id,  childs)"></i>
              <i class="el-icon-delete childDelete" @click="deleteClick(1,  childs.id)"></i>
            </div>
          </div>
          <div class="workingChild addIcon" @click="showWorkingTab(1,item)"><i class="el-icon-circle-plus"></i></div>
        </div>
      </div>
    </div>

    <!--
        新增工类工种
    -->
    <el-dialog :close-on-press-escape="false" :title="typeTitleAdd" :before-close="hiddenWorkingTab"
               :close-on-click-modal="false" :visible.sync="addWorkingVisible">
      <el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
        <el-form-item :label="typeNameAdd" prop="name">
          <el-input size="small" v-model="addForm.name" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="medium" @click.native="hiddenWorkingTab">取消</el-button>
        <el-button size="medium" type="primary" @click.native="addWorking">保存</el-button>
      </div>
    </el-dialog>


    <!--
        修改工类工种
    -->
    <el-dialog :close-on-press-escape="false" :title="typeTitle" :visible.sync="editWorkingVisible"
               :close-on-click-modal="false">
      <el-form :model="editForm" label-width="80px" :rules="editFormRules" :before-close="hiddenWorkingTabEdit"
               ref="editForm">
        <el-form-item :label="typeName" prop="name">
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
  import {
    getWorkerList,
    addWorkerSys,
    addWorkerType,
    deleteType,
    deleteWorker,
    editType,
    editWorker,
    checkProjectName,
    checkWorkerType,
    checkWorkerClass
  } from '../../api/api';
  import myCallback from "../../../static/common/callback"
  export default {
    data() {
      // 校验名称
      var validWorkerName = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入名称！'));
        } else if (!/^[^\s]+$/.test(value)) {
          callback(new Error('名称不能带有空格！'));
        } else {
          if (this.typeIndexAdd == 0) {
            var parmas = {
              name: value
            }
            checkWorkerClass(parmas).then((res) => {
              if (res.data.code == 0) {
                callback()
              } else {
                callback(new Error(res.data.msg))
              }
            })
          } else {
            var parmas = {
              name: value,
              classId: this.typeParId
            }
            checkWorkerType(parmas).then((res) => {
              if (res.data.code == 0) {
                callback()
              } else {
                callback(new Error(res.data.msg))
              }
            })
          }
        }
      };

      // 编辑校验
      var validEdWorkerName = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入名称！'));
        } else if (!/^[^\s]+$/.test(value)) {
          callback(new Error('名称不能带有空格！'));
        } else {
          if (this.typeIndex == 0) {
            var parmas = {
              name: value,
              classId: this.editForm.id
            }
            checkWorkerClass(parmas).then((res) => {
              if (res.data.code == 0) {
                callback()
              } else {
                callback(new Error(res.data.msg))
              }
            })
          } else {
            var parmas = {
              name: value,
              typeId: this.editForm.id,
              classId: this.editForm.workClassId
            }
            checkWorkerType(parmas).then((res) => {
              if (res.data.code == 0) {
                callback()
              } else {
                callback(new Error(res.data.msg))
              }
            })
          }
        }
      };

      return {
        // 工类
        workingList: '',

        // 创建工类表单
        // 创建工类是否显示
        addWorkingVisible: false,
        addForm: {
          name: ''
        },
        addFormRules: {
          name: [
            {required: true, validator: validWorkerName, trigger: 'blur'},
            {min: 1, max: 10, message: '名称长度不能超过10个字符', trigger: 'blur'}
          ]
        },

        // 修改工类工种
        editWorkingVisible: false,
        editForm: {},
        editFormRules: {
          name: [
            {required: true, validator: validEdWorkerName, trigger: 'blur'},
            {min: 1, max: 10, message: '名称长度不能超过10个字符', trigger: 'blur'}
          ]
        },

        // 新增工类工种 公用、 类别判断 id 顶部名称 内部名称
        typeIndexAdd: '',
        typeIndexIdAdd: '',
        typeTitleAdd: '',
        typeNameAdd: '',

        // 修改工类工种 公用、 类别判断 id 顶部名称 内部名称
        typeIndex: '',
        typeIndexId: '',
        typeTitle: '',
        typeName: '',
        typeParId: ''
      }
    },
    mounted() {
      this.getList();
    },
    methods: {
      // 获取列表数据
      getList() {
        getWorkerList().then((res) => {
          if (!res) {
            return;
          }
          if (res.data.code == 0) {
            this.workingList = res.data.data;
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

      // 显示新增工类 工种
      showWorkingTab(value, item) {
        this.typeIndexAdd = value;
        if (item !== '') {
          var parmas = Object.assign({}, item);
          this.typeParId = parmas.id;
        } else {
          this.typeParId = '';
        }
        if (this.typeIndexAdd == 0) {
          this.typeTitleAdd = '创建工类';
          this.typeNameAdd = '工类名称';
          this.addWorkingVisible = true;
        } else {
          this.typeTitleAdd = '创建工种';
          this.typeNameAdd = '工种名称';
          this.addWorkingVisible = true;
        }
      },
      hiddenWorkingTab() {
        this.addWorkingVisible = false;
        this.$refs['addForm'].resetFields();
      },
      // 提交工类工种
      addWorking() {
        this.$refs.addForm.validate((valid) => {
          if (valid) {
            // 工类  else 工种
            if (this.typeIndexAdd == 0) {
              let parmas = Object.assign({}, this.addForm);
              addWorkerSys(parmas).then((res) => {
                if (res.data.code == '0') {
                  myCallback.call(this,res);
                  // this.$notify.success({
                  //   title: '新增成功',
                  //   // message: res.data.msg,
                  //   duration: 100
                  // });
                } else {
                  myCallback.call(this,res);
                  // this.$notify.error({
                  //   title: '新增失败',
                  //   message: res.data.msg,
                  //   offset: 100
                  // });
                }
                this.addWorkingVisible = false;
                this.$refs['addForm'].resetFields();
                this.getList();
              });
            } else {
              let parmas = Object.assign({workClassId: this.typeParId}, this.addForm);
              addWorkerType(parmas).then((res) => {
                if (res.data.code == '0') {
                  myCallback.call(this,res);
                  // this.$notify.success({
                  //   title: '新增成功',
                  //   // message: res.data.msg,
                  //   duration: 1000
                  // });
                } else {
                  myCallback.call(this,res);
                  // this.$notify.error({
                  //   title: '新增失败',
                  //   message: res.data.msg,
                  //   offset: 100
                  // });
                }
                this.addWorkingVisible = false;
                this.$refs['addForm'].resetFields();
                this.getList();
              });
            }
          }
        });
      },

      // 编辑工类 工种
      editClick(value, id, data) {
        this.typeIndex = value;
        this.typeIndexId = id;
        this.editForm = Object.assign({}, data);
        if (this.typeIndex == 0) {
          this.typeTitle = '修改工类';
          this.typeName = '工类名称';
          this.editWorkingVisible = true;
        } else {
          this.typeTitle = '修改工种';
          this.typeName = '工种名称';
          this.editWorkingVisible = true;
        }
      },
      // 编辑工类提交
      editWorking() {
        this.$refs.editForm.validate((valid) => {
          if (valid) {
            // 工类  else 工种
            if (this.typeIndex == 0) {
              let parmas = {
                'id': this.typeIndexId,
                'name': this.editForm.name
              };
              editType(parmas).then((res) => {
                if (res.data.code == '0') {
                  this.editWorkingVisible = false;
                  this.getList();
                  myCallback.call(this,res);
                  // this.$notify.success({
                  //   title: '修改成功',
                  //   // message: res.data.msg,
                  //   duration: 1000
                  // });
                } else {
                  this.editWorkingVisible = false;
                  myCallback.call(this,res);
                  // this.$notify.error({
                  //   title: '修改失败',
                  //   message: res.data.msg,
                  //   offset: 100
                  // });
                }
              });
            } else {
              let parmas = {
                'id': this.typeIndexId,
                'name': this.editForm.name
              };
              editWorker(parmas).then((res) => {
                if (res.data.code == '0') {
                  this.editWorkingVisible = false;
                  this.getList();
                  myCallback.call(this,res);
                  // this.$notify.success({
                  //   title: '修改成功',
                  //   // message: res.data.msg,
                  //   duration: 1000
                  // });
                } else {
                  this.editWorkingVisible = false;
                  myCallback.call(this,res);
                  // this.$notify.error({
                  //   title: '修改失败',
                  //   message: res.data.msg,
                  //   offset: 100
                  // });
                }
              });
            }


          }
        })
      },
      // 编辑工类取消
      hiddenWorkingTabEdit() {
        this.editWorkingVisible = false;
        this.$refs['editForm'].resetFields();
      },

      // 删除工类 工种
      deleteClick(value, id) {
        if (value == 0) {
          this.$confirm('确认删除该工类吗?', '提示', {
            type: 'warning'
          }).then(() => {
            let parmas = {'id': id};
            deleteType(parmas).then((res) => {
              if (res.data.code == '0') {
                this.getList();
                myCallback.call(this,res);
                // this.$notify.success({
                //   title: '删除成功',
                //   // message: res.data.msg,
                //   duration: 1000
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
        } else {
          this.$confirm('确认删除该工种吗?', '提示', {
            type: 'warning'
          }).then(() => {
            let parmas = {'id': id};
            deleteWorker(parmas).then((res) => {
              if (res.data.code == '0') {
                this.getList();
                myCallback.call(this,res);
                // this.$notify.success({
                //   title: '删除成功',
                //   // message: res.data.msg,
                //   duration: 1000
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
  }
</script>
<style slop-scope>
  .workingClassa {
    font-size: 0rem;
  }
  .workingClassa .btn {
    border-radius: .2rem;
    margin-bottom: 0px !important;
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
    font-size: .23rem;
  }

  .workingBody .editBox {
    position: absolute;
    right: .1rem;
    top: 0;
    height: 100%;
    width: .7rem;
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
<style>
  .el-form-item__label {
    line-height: .4rem;
  }
</style>
