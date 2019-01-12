<template>
  <div class="labour">
    <!--
        添加按钮
    -->
    <!--<el-button class="btn" size="medium" type="primary" @click="clickAdd">创建劳务公司</el-button>-->

    <!--
        搜索盒子
    -->
    <div class="searchBox" style="overflow: hidden;">
      <div class="search">
        <p>劳务公司名称：</p>
        <el-input
          placeholder="请输入劳务公司名称"
          size="small"
          class="searchInput"
          v-model="companyName">
        </el-input>
      </div>
      <div class="search">
        <p>法人姓名：</p>
        <el-input
          placeholder="请输入法人姓名"
          size="small"
          class="searchInput"
          v-model="contact">
        </el-input>
      </div>
      <div class="search">
        <p>法人联系方式：</p>
        <el-input
          placeholder="请输入法人联系方式"
          size="small"
          class="searchInput"
          v-model="contactTel">
        </el-input>
      </div>
      <div class="search">
        <p>是否大清：</p>
        <el-select v-model="isBigClearPack" style="width: 2rem;float: left" size="small" placeholder="请选择">
          <el-option
            v-for="item in clearBoth"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </div>
      <div class="search">
        <p>轻工辅料情况：</p>
        <el-select v-model="materialIs" style="width: 2rem;float: left" size="small" placeholder="请选择">
          <el-option
            v-for="item in giveBoth"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </div>
      <el-button class="searchBtn" :loading="loading" type="primary" size="small" icon="el-icon-search" @click='search'>
        搜索
      </el-button>
      <el-button class="searchBtn" style="float:right;" size="small" icon="el-icon-refresh" @click='clear'>重置
      </el-button>
    </div>

    <!--
        新增劳务公司
    -->
    <el-dialog :close-on-press-escape="false" title="创建劳务公司" :visible.sync="addVisible" :close-on-click-modal="false"
               :before-close="handleClose">
      <el-form :model="addForm" label-width="110px" :rules="addFormRules" ref="addForm">
        <el-form-item label="公司名称" prop="name">
          <el-input size="small" v-model="addForm.name" placeholder="请输入公司名称" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="所属分公司" prop="unitId">
          <el-select size="small" class="select" filterable v-model="addForm.unitId" placeholder="请选择所属分公司">
            <el-option
              v-for="item in compData"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="法人姓名" prop="contact">
          <el-input size="small" v-model="addForm.contact" placeholder="请输入法人姓名" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="法人联系方式" prop="contactTel">
          <el-input size="small" v-model="addForm.contactTel" placeholder="请输入法人联系方式" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="是否大清" prop="isBigClearPack">
          <el-radio-group size="small" style="margin:0;" v-model="addForm.isBigClearPack">
            <el-radio class="radio" :label="0">是</el-radio>
            <el-radio class="radio" :label="1">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="轻工辅料情况" prop="materialIs">
          <el-radio-group size="small" style="margin:0;" v-model="addForm.materialIs">
            <el-radio class="radio" :label="1">包工包料</el-radio>
            <el-radio class="radio" :label="2">包工</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="税号" prop="dutyNum">
          <el-input size="small" v-model="addForm.dutyNum" placeholder="请输入税号" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="银行账户" prop="bankAccount">
          <el-input size="small" v-model="addForm.bankAccount" placeholder="请输入银行账户" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="开户行地址" prop="openAccountBank">
          <el-input size="small" v-model="addForm.openAccountBank" placeholder="请输入开户行地址"
                    auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="资质文件" prop="fileNames">
          <el-upload
            class="upload-demo"
            ref="upload"
            action="/workerman/fileupload/upload"
            :beforeUpload="beforeAvatarUpload"
            :on-success="handleChange"
            :on-remove="handleRemove"
            :on-exceed="addOut"
            :file-list="addForm.tmpFiles"
            :limit="8"
            list-type="picture">
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpeg,pdf,gif,png,bmp等类型的图片文件，且不超过500kb,文件个数不能超过8个。</div>
          </el-upload>
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
      stripe
      v-loading="loading"
      border
    >
      <el-table-column
        label="劳务公司名称"
        min-width="20%"
        :show-overflow-tooltip="true"
        align="center">
        <template scope="scope">
          <span style="color: #409EFF; width:100%; height: 100%; display: block; cursor: pointer;"
                @click="lookThis(scope.row)">{{ scope.row.name ? scope.row.name : ''}}</span>
        </template>
      </el-table-column>
      <el-table-column
        min-width="10%"
        label="法人姓名"
        :show-overflow-tooltip="true"
        align="center">
        <template scope="scope">
          <span>{{ scope.row.contact ? scope.row.contact : ''}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="法人联系方式"
        min-width="10%"
        :show-overflow-tooltip="true"
        align="center">
        <template scope="scope">
          <span>{{ scope.row.contactTel ? scope.row.contactTel : ''}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="所属分公司"
        min-width="10%"
        :show-overflow-tooltip="true"
        align="center">
        <template scope="scope">
          <span>{{ scope.row.sysUnit ? scope.row.sysUnit.name : ''}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="是否大清"
        min-width="8%"
        :show-overflow-tooltip="true"
        align="center">
        <template scope="scope">
          <span>{{ scope.row.isBigClearPack ? scope.row.isBigClearPack : ''}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="班组数量"
        :show-overflow-tooltip="true"
        min-width="8%"
        align="center">
        <template scope="scope">
          <span>{{ scope.row.workerTeamNum }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="工友数量"
        :show-overflow-tooltip="true"
        min-width="8%"
        align="center">
        <template scope="scope">
          <span>{{ scope.row.workerManNum }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="创建日期"
        :show-overflow-tooltip="true"
        min-width="10%"
        align="center">
        <template scope="scope">
          <span>{{ scope.row.opAt ? scope.row.opAt : ''}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" min-width="16%">
        <template scope="scope">
          <el-button
            size="small"
            type="text"
            @click="handleEdit(scope.row)">编辑
          </el-button>
          <el-button
            style="color:red;"
            size="small"
            type="text"
            @click="deleteEdit(scope.row)">删除
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
      修改劳务公司
    -->
    <el-dialog :close-on-press-escape="false" title="修改劳务公司" :before-close="handleEditClose" :visible.sync="editVisible"
               :close-on-click-modal="false">
      <el-form :model="editForm" label-width="110px" :rules="editFormRules" ref="editForm">
        <el-form-item label="公司名称" prop="name">
          <el-input size="small" v-model="editForm.name" placeholder="请输入公司名称" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="所属分公司" prop="unitId">
          <el-select size="small" class="select" filterable v-model="editForm.unitId" placeholder="请选择所属分公司">
            <el-option
              v-for="item in compData"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="法人姓名" prop="contact">
          <el-input size="small" v-model="editForm.contact" placeholder="请输入法人姓名" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="法人联系方式" prop="contactTel">
          <el-input size="small" v-model="editForm.contactTel" placeholder="请输入法人联系方式" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="是否大清" prop="isBigClearPack">
          <el-radio-group size="small" style="margin:0;" v-model="editForm.isBigClearPack">
            <el-radio class="radio" :label="0">是</el-radio>
            <el-radio class="radio" :label="1">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="轻工辅料情况" prop="materialIs">
          <el-radio-group size="small" style="margin:0;" v-model="editForm.materialIs">
            <el-radio class="radio" :label="1">包工包料</el-radio>
            <el-radio class="radio" :label="2">包工</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="税号" prop="dutyNum">
          <el-input size="small" v-model="editForm.dutyNum" placeholder="请输入税号" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="银行账户" prop="bankAccount">
          <el-input size="small" v-model="editForm.bankAccount" placeholder="请输入银行账户" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="开户行地址" prop="openAccountBank">
          <el-input size="small" v-model="editForm.openAccountBank" placeholder="请输入开户行地址"
                    auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="资质文件" prop="tmpFiles">
          <el-upload
            class="upload-demo"
            ref="upload"
            action="/workerman/fileupload/upload"
            :beforeUpload="beforeAvatarUpload"
            :on-success="handleChangeEdit"
            :on-remove="handleRemoveEdit"
            :before-remove="beforeRemove"
            :on-exceed="addOut"
            :file-list="editForm.tmpFiles"
            :limit="8"
            list-type="picture">
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb,文件个数不能超过8个。</div>
          </el-upload>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="medium" @click.native="editCancelBtn">取消</el-button>
        <el-button size="medium" :loading="editLoading" type="primary" @click.native="editBtn">保存</el-button>
      </div>
    </el-dialog>


    <!--
        查看图片
    -->
    <el-dialog
      title="图片详情"
      :visible.sync="dialogVisible"
      width="60%">
      <img style="width: 100%;" :src="'/workerman/fileupload/pageShowFile?fid='+this.imgFileUploadInfoId"/>
      <span slot="footer" class="dialog-footer">
                <el-button size="medium" @click="downLoadImg">下载</el-button>
                <el-button size="medium" @click="dialogVisible = false">关闭</el-button>
              </span>
    </el-dialog>

    <!--
       查看
    -->
    <el-dialog :close-on-press-escape="false" title="查看劳务公司" :visible.sync="editVisiblea" :close-on-click-modal="false">
      <el-form class="lookFormFindStyle" :model="editForm" label-width="110px" ref="editForm">
        <el-form-item label="公司名称:" prop="name">
          <div class="data">{{editForm.name}}</div>
        </el-form-item>
        <el-form-item label="所属分公司:" prop="unitId">
          <div class="data">{{editForm.sysUnit ? editForm.sysUnit.name : ''}}</div>
        </el-form-item>
        <el-form-item label="法人姓名:" prop="contact">
          <div class="data">{{editForm.contact}}</div>
        </el-form-item>
        <el-form-item label="法人联系方式:" prop="contactTel">
          <div class="data">{{editForm.contactTel}}</div>
        </el-form-item>
        <el-form-item label="是否大清:" prop="isBigClearPack">
          <div class="data">{{editForm.isBigClearPack == 0 ? '是' : '否'}}</div>
        </el-form-item>
        <el-form-item label="轻工辅料情况:" prop="materialIs">
          <div class="data">{{editForm.materialIs == 1 ? '包工包料' : '包工'}}</div>
        </el-form-item>
        <el-form-item label="税号:" prop="dutyNum">
          <div class="data">{{editForm.dutyNum}}</div>
        </el-form-item>
        <el-form-item label="银行账户:" prop="bankAccount">
          <div class="data">{{editForm.bankAccount}}</div>
        </el-form-item>
        <el-form-item label="开户行地址:" prop="openAccountBank">
          <div class="data">{{editForm.openAccountBank}}</div>
        </el-form-item>
        <el-form-item label="资质文件:" prop="tmpFiles">
          <div
            style="width: 150px; position: relative; height: 100px; float: left; margin-right: 10px; margin-bottom: 10px; cursor: pointer;"
            v-for="(item) in editForm.qualificationList" @click="lookTmpFile(item.fileUploadInfoId)">
            <img style="width: 100%; height: 80%;"
                 :src="'/workerman/fileupload/pageShowFile?fid='+item.fileUploadInfoId" :title="item.fileName"/>
            <div
              style="position: absolute; bottom: -5px; width: 100%; height: 20%; text-align: center; line-height:20px;  font-size: 12px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">
              {{item.fileName}}
            </div>
          </div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="medium" @click.native="lookCancelBtn">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import {getLaborList, addabor, editabor, deleteabor, deleteaborOne, checkLabor, checkutyNum} from '../../api/api';
  import {allBranchList} from '../../api/projectapi'
  import myCallback from "../../../static/common/callback"

  export default {
    data() {
      // 校验劳务公司名称
      var validLaName = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入公司名称！'));
        } else if (!/^[^\s]+$/.test(value)) {
          callback(new Error('公司名称不能带有空格！'));
        } else {
          var parmas = {
            name: value
          }
          checkLabor(parmas).then((res) => {
            if (res.data.code == 0) {
              callback()
            } else {
              callback(new Error(res.data.msg))
            }
          })
        }
      };

      // 校验编辑劳务公司名称
      var validEdLaName = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入公司名称！'));
        } else if (!/^[^\s]+$/.test(value)) {
          callback(new Error('公司名称不能带有空格！'));
        } else {
          var parmas = {
            name: value,
            id: this.editForm.id
          }
          checkLabor(parmas).then((res) => {
            if (res.data.code == 0) {
              callback()
            } else {
              callback(new Error(res.data.msg))
            }
          })
        }
      };

      // 校验手机
      var validatePhone = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入法人联系方式！'));
        } else {
          var reg = /^[1]\d{10}$/;
          if (!reg.test(value)) {
            callback(new Error('请输入11位手机号！'));
          } else {
            callback();
          }
        }
      };

      // 校验税号
      var validAccount = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入税号！'));
        } else {
          var reg = /^[A-Z0-9]{15}$|^[A-Z0-9]{17}$|^[A-Z0-9]{18}$|^[A-Z0-9]{20}$/;
          if (!reg.test(value)) {
            callback(new Error('请输入18位的税号！'));
          } else {
            var parmas = {
              dutyNum: value
            }
            checkutyNum(parmas).then((res) => {
              if (res.data.code == 0) {
                callback()
              } else {
                callback(new Error(res.data.msg))
              }
            })
          }
        }
      };

      // 编辑校验税号
      var validEdAccount = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入税号！'));
        } else {
          var reg = /^[A-Z0-9]{15}$|^[A-Z0-9]{17}$|^[A-Z0-9]{18}$|^[A-Z0-9]{20}$/;
          if (!reg.test(value)) {
            callback(new Error('请输入18位的税号！'));
          } else {
            var parmas = {
              dutyNum: value,
              id: this.editForm.id
            }
            checkutyNum(parmas).then((res) => {
              if (res.data.code == 0) {
                callback()
              } else {
                callback(new Error(res.data.msg))
              }
            })
          }
        }
      };

      // 银行账号
      var validBank = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入银行账号！'));
        } else {
          var reg = /^([1-9]{1})(\d{14}|\d{18})$/;
          if (!reg.test(value)) {
            callback(new Error('请输入正确的银行账号！'));
          } else {
            callback();
          }
        }
      };


      var validA = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入法人姓名！'));
        } else if (!/^[^\s]+$/.test(value)) {
          callback(new Error('法人姓名不能带有空格！'));
        } else {
          callback()
        }
      };
      var validB = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入开户行地址！'));
        } else if (!/^[^\s]+$/.test(value)) {
          callback(new Error('开户行地址不能带有空格！'));
        } else {
          callback()
        }
      };

      return {

        // 编辑loading
        editLoading: false,
        //类型
        typeBok: true,

        // 查看图片开关
        dialogVisible: false,
        imgFileUploadInfoId: '',

        // 列表页数据
        listData: [],
        currentPage: 1,
        totalNum: 0,
        pageSize: 10,

        // 公司id
        companyId: '',

        thisNowPage: 1,

        loading: true,

        nowFile: '',

        // 是否大清下拉
        clearBoth: [{
          value: '',
          label: '不限'
        }, {
          value: 0,
          label: '是'
        }, {
          value: 1,
          label: '否'
        }],
        // 轻工
        giveBoth: [{
          value: '',
          label: '不限'
        }, {
          value: 1,
          label: '包工包料'
        }, {
          value: 2,
          label: '包工'
        }],

        // search
        companyName: '',
        contact: '',
        contactTel: '',
        isBigClearPack: '',
        materialIs: '',

        // 所有厂家数据
        compData: '',

        addTmpFiles: [],

        // 新增弹出层数据
        addVisible: false,
        addForm: {
          name: '',
          unitId: '',
          contact: '',
          contactTel: '',
          isBigClearPack: 0,
          materialIs: 1,
          bankAccount: '',
          dutyNum: '',
          openAccountBank: '',
          filePaths: [],
          fileNames: []
        },
        addFormRules: {
          name: [
            {required: true, validator: validLaName, trigger: 'blur'},
            {min: 1, max: 20, message: '公司名称最大长度不能超过20个字符!', trigger: 'blur'}
          ],
          unitId: [
            {required: true, message: '请选择所属分公司!', trigger: 'change'}
          ],
          contact: [
            {required: true, validator: validA, trigger: 'blur'},
            {min: 1, max: 15, message: '法人姓名最大长度不能超过15个字符!', trigger: 'blur'}
          ],
          contactTel: [
            {required: true, validator: validatePhone, trigger: 'blur'},
            {min: 1, max: 11, message: '法人联系方式最大长度不能超过11个字符!', trigger: 'blur'}
          ],
          isBigClearPack: [
            {required: true, message: '请选择是否大清!'}
          ],
          materialIs: [
            {required: true, message: '请选择是否轻工辅料情况!'}
          ],
          bankAccount: [
            {min: 1, max: 19, message: '银行账号最大长度不能超过19个字符!', trigger: 'blur'}
          ],
          dutyNum: [
            {min: 1, max: 19, message: '税号最大长度不能超过19个字符!', trigger: 'blur'}
          ],
          openAccountBank: [
            {min: 1, max: 50, message: '开户行地址最大长度不能超过50个字符!', trigger: 'blur'}
          ],
          fileNames: [
            {required: true, type: 'array', message: '请上传资质文件!', trigger: 'blur'}
          ]
        },

        // 修改弹出层数据
        editVisiblea: false,
        editVisible: false,
        editForm: {
          name: '',
          unitId: '',
          contact: '',
          contactTel: '',
          isBigClearPack: 0,
          materialIs: 0,
          bankAccount: '',
          dutyNum: '',
          openAccountBank: '',
          tmpFiles: [],
          filePaths: [],
          fileNames: [],
          fileChange: [],
          tmpFilesa: []
        },
        editFormRules: {
          name: [
            {required: true, validator: validEdLaName, trigger: 'blur'},
            {min: 1, max: 20, message: '公司名称最大长度不能超过20个字符!', trigger: 'blur'}
          ],
          unitId: [
            {required: true, message: '请选择所属分公司!', trigger: 'change'}
          ],
          contact: [
            {required: true, validator: validA, trigger: 'blur'},
            {min: 1, max: 15, message: '法人姓名最大长度不能超过15个字符!', trigger: 'blur'}
          ],
          contactTel: [
            {required: true, validator: validatePhone, trigger: 'blur'},
            {min: 1, max: 11, message: '法人联系方式最大长度不能超过11个字符!', trigger: 'blur'}
          ],
          isBigClearPack: [
            {required: true, message: '请选择是否大清!'}
          ],
          materialIs: [
            {required: true, message: '请选择是否轻工辅料情况!'}
          ],
          bankAccount: [
            {min: 1, max: 19, message: '银行账号最大长度不能超过19个字符!', trigger: 'blur'}
          ],
          dutyNum: [

            {min: 1, max: 19, message: '税号最大长度不能超过19个字符!', trigger: 'blur'}
          ],
          openAccountBank: [
            {min: 1, max: 50, message: '开户行地址最大长度不能超过50个字符!', trigger: 'blur'}
          ],
          tmpFiles: [
            {required: true, type: 'array', message: '请上传资质文件!', trigger: 'blur'}
          ]
        }
      }
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
          this.addForm.unitId = this.companyId;
          let parmas = {
            'search.companyName': this.companyName,
            'search.contact': this.contact,
            'search.contactTel': this.contactTel,
            'search.isBigClearPack': this.isBigClearPack,
            'search.materialIs': this.materialIs,
            'unitId': this.companyId,
            'pageNo': this.thisNowPage,
            'pageSize': this.pageSize
          }
          this.loading = true;
          this.getList(parmas);
        },
        deep: true
      },
    },
    created() {
      this.getCampList();
      this.companyId = this.project.projectId;
      this.addForm.unitId = this.companyId;
      let parmas = {
        'search.companyName': this.companyName,
        'search.contact': this.contact,
        'search.contactTel': this.contactTel,
        'search.isBigClearPack': this.isBigClearPack,
        'search.materialIs': this.materialIs,
        'unitId': this.companyId,
        'pageNo': this.thisNowPage,
        'pageSize': this.pageSize
      };
      this.loading = true;
      this.getList(parmas);
    },
    methods: {
      handleClose() {
        this.$refs['addForm'].resetFields();
        this.addVisible = false;
      },
      handleEditClose() {
        this.editVisible = false;
        this.$refs['editForm'].resetFields();
      },
      // 查看图片
      lookTmpFile(id) {
        this.dialogVisible = true;
        this.imgFileUploadInfoId = id;
      },
      downLoadImg() {
        window.open('/workerman/fileupload/download?fileId=' + this.imgFileUploadInfoId, '下载图片')
      },

      // 上传限制
      beforeAvatarUpload(file) {
        const ifPDF = file.type === 'application/pdf';
        const isJPG = file.type === 'image/jpeg';
        const isGIF = file.type === 'image/gif';
        const isPNG = file.type === 'image/png';
        const isBMP = file.type === 'image/bmp';
        const isLt2M = file.size / 1024 / 1024 < 0.5;

        if (!isJPG && !isGIF && !isPNG && !isBMP && !ifPDF) {
          // this.$message({
          //   showClose: true,
          //   message: '只能上传jpeg,gif,png,bmp,pdf等类型的图片文件',
          //   type: 'warning'
          // });
          this.$notify.warning({
            title: '图片格式!',
            message: "只能上传jpeg,gif,png,bmp,pdf等类型的图片文件",
            // offset: 100
          });
        }
        if (!isLt2M) {
          // this.$message({
          //   showClose: true,
          //   message: '文件大小不超过500kb',
          //   type: 'warning'
          // });
          this.$notify.warning({
            title: '文件大小!',
            message: '文件大小不超过500kb',
            offset: 100
          });
        }
        if ((isJPG || isBMP || isGIF || isPNG || ifPDF) && isLt2M) {
          this.typeBok = true;
        } else {
          this.typeBok = false;
        }
        return (isJPG || isBMP || isGIF || isPNG || ifPDF) && isLt2M;
      },
      // 上传图片  删除  和 上传成功的操作
      handleRemove(file, fileList) {
        var arrName = []
        var arr = [];
        for (var i = 0; i < fileList.length; i++) {
          arr.push(fileList[i].response.data[0].key);
          arrName.push(fileList[i].response.data[0].filename);
        }
        this.addForm.fileNames = arrName;
        this.addForm.filePaths = arr;
      },
      handleChange(response, file, fileList) {
        if (response.code == 0) {
          var arrName = []
          var arr = [];
          for (var i = 0; i < fileList.length; i++) {
            arr.push(fileList[i].response.data[0].key);
            arrName.push(fileList[i].response.data[0].filename);
          }
          this.addForm.fileNames = arrName;
          this.addForm.filePaths = arr;
        }
      },
      addOut() {
        // this.$message({
        //   showClose: true,
        //   message: '只能上传8张照片',
        //   type: 'warning'
        // });
        this.$notify.warning({
          title: '照片数量!',
          message: '只能上传8张照片',
          // offset: 100
        });
      },

      //查看当前
      lookThis(val) {
        this.editForm = Object.assign({}, val);
        if (this.editForm.isBigClearPack == '是') {
          this.editForm.isBigClearPack = 0;
        } else {
          this.editForm.isBigClearPack = 1;
        }
        this.editVisiblea = true;
      },

      // 获取所有分公司
      getCampList() {
        allBranchList().then((res) => {
          if (!res) {
            return;
          }
          if (res.data.code == 0) {
            this.compData = res.data.data;
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
        this.$refs.upload.clearFiles();
      },
      // 确认提交
      addBtn() {
        this.$refs.addForm.validate((valid) => {
          if (valid) {
            var parmas = Object.assign({}, this.addForm);
            this.addVisible = false;
            addabor(parmas).then((res) => {
              if (res.data.code == '0') {
                myCallback.call(this, res);
                // this.$notify.success({
                //   title: '添加成功',
                //   // message: res.data.msg,
                //   // offset: 100
                // });
                let parmas = {
                  'search.companyName': this.companyName,
                  'search.contact': this.contact,
                  'search.contactTel': this.contactTel,
                  'search.isBigClearPack': this.isBigClearPack,
                  'unitId': this.companyId,
                  'search.materialIs': this.materialIs,
                  'pageNo': this.thisNowPage,
                  'pageSize': this.pageSize
                }
                this.loading = true;
                this.getList(parmas);
                this.$refs['addForm'].resetFields();
                this.addForm.tmpFiles = [];
              } else {
                myCallback.call(this, res);
                // this.$notify.error({
                //   title: '添加失败',
                //   message: res.data.msg,
                //   // offset: 100
                // });
              }
            })
          }
        });
      },

      search() {
        this.thisNowPage = 1;
        let parmas = {
          'search.companyName': this.companyName,
          'search.contact': this.contact,
          'search.contactTel': this.contactTel,
          'search.isBigClearPack': this.isBigClearPack,
          'unitId': this.companyId,
          'search.materialIs': this.materialIs,
          'pageNo': this.thisNowPage,
          'pageSize': this.pageSize
        }
        this.loading = true;
        this.getList(parmas);
      },

      clear() {
        this.contact = '';
        this.contactTel = '';
        this.companyName = '';
        this.materialIs = '';
        this.isBigClearPack = '';
      },
      // 获取列表
      getList(val) {
        getLaborList(val).then((res) => {
          if (!res) {
            return;
          }
          if (res.data.code == 0) {
            this.listData = res.data.data.list;
            for (var i = 0; i < this.listData.length; i++) {
              this.listData[i].opAt = this.getMyDate(this.listData[i].opAt * 1000).substr(0, 10);
              if (this.listData[i].isBigClearPack == true) {
                this.listData[i].isBigClearPack = '否';
              } else {
                this.listData[i].isBigClearPack = '是';
              }
            }
            this.currentPage = res.data.data.pageNo;
            this.totalNum = res.data.data.totalCount;
            this.loading = false;
          } else {
            myCallback.call(this, res);
            // this.$notify.error({
            //   title: '获取列表失败',
            //   message: res.data.msg,
            //   // offset: 100
            // });
          }
        });
      },
      // 列表页数更改
      handleCurrentChange(val) {
        this.thisNowPage = val;
        this.loading = true;
        let parmas = {
          'search.companyName': this.companyName,
          'search.contact': this.contact,
          'search.contactTel': this.contactTel,
          'search.isBigClearPack': this.isBigClearPack,
          'search.materialIs': this.materialIs,
          'unitId': this.companyId,
          'pageNo': this.thisNowPage,
          'pageSize': this.pageSize
        }
        this.getList(parmas);
      },
      // 列表条数更改
      handleSizeChange(val) {
        this.pageSize = val;
        this.loading = true;
        let parmas = {
          'search.companyName': this.companyName,
          'search.contact': this.contact,
          'search.contactTel': this.contactTel,
          'search.isBigClearPack': this.isBigClearPack,
          'search.materialIs': this.materialIs,
          'unitId': this.companyId,
          'pageNo': this.thisNowPage,
          'pageSize': this.pageSize
        }
        this.getList(parmas);
      },


      // 点击编辑
      handleEdit(row) {
        this.editForm = Object.assign({}, row);
        if (this.editForm.isBigClearPack == '是') {
          this.editForm.isBigClearPack = 0;
        } else {
          this.editForm.isBigClearPack = 1;
        }
        let arr = [];
        let arrName = [];
        let arrData = [];
        for (var i = 0; i < this.editForm.qualificationList.length; i++) {
          arr.push(this.editForm.qualificationList[i].fileUploadInfoId);
          arrName.push(this.editForm.qualificationList[i].fileName);
        }
        for (var i = 0; i < arr.length; i++) {
          var json = {};
          json.name = arrName[i];
          json.url = '/workerman/fileupload/pageShowFile?fid=' + arr[i];
          json.id = arr[i];
          arrData.push(json);
        }
        this.editForm.tmpFiles = arrData;
        this.editVisible = true;
      },

      //  图片钩子
      handleRemoveEdit(file, fileList) {
        for (var i = 0; i < fileList.length; i++) {
          if (fileList[i].response) {
            this.addTmpFiles.push(fileList[i]);
          }
        }
        this.editForm.tmpFiles = fileList;
      },
      beforeRemove(file, fileList) {
        this.editForm.tmpFiles = fileList;
        this.editForm.tmpFilesa = fileList;
        if (this.typeBok) {
          return this.$confirm(`确定移除 ${ file.name }？`).then(() => {
            if (!file.response) {
              var parmas = {
                fileId: file.id
              };
              deleteaborOne(parmas).then((res) => {
                if (res.data.code == '0') {
                  myCallback.call(this, res);
                  // this.$notify.success({
                  //   title: '删除成功',
                  //   // message: res.data.msg,
                  //   // offset: 100
                  // });
                } else {
                  myCallback.call(this, res);
                  // this.$notify.error({
                  //   title: '删除失败',
                  //   message: res.data.msg,
                  //   // offset: 100
                  // });
                }
              })
            }
          })
        }
      },
      handleChangeEdit(response, file, fileList) {
        this.addTmpFiles = [];
        for (var i = 0; i < fileList.length; i++) {
          if (fileList[i].response) {
            this.addTmpFiles.push(fileList[i]);
            this.editForm.tmpFilesa = this.addTmpFiles;
          }
        }
      },

      // 取消编辑提交
      editCancelBtn() {
        this.editVisible = false;
        this.editForm.tmpFiles = [];
        this.$refs['editForm'].resetFields();
      },
      lookCancelBtn() {
        this.editVisiblea = false;
        this.$refs['editForm'].resetFields();
      },
      // 点击提交
      editBtn() {
        if (this.editForm.tmpFiles == undefined || this.editForm.tmpFiles == '') {
          this.editForm.tmpFiles = this.editForm.tmpFilesa;
        }
        this.$refs.editForm.validate((valid) => {
          if (valid) {
            this.editLoading = true;
            let parmas = Object.assign({}, this.editForm);
            var arrName = []
            var arr = [];
            if (parmas.tmpFilesa) {
              for (var i = 0; i < parmas.tmpFilesa.length; i++) {
                if (parmas.tmpFilesa[i].response) {
                  arr.push(parmas.tmpFilesa[i].response.data[0].key);
                  arrName.push(parmas.tmpFilesa[i].response.data[0].filename);
                }
              }

              var NewArr = [],
                NewArrName = [];

              for (var i = 0; i < arr.length; i++) {
                if (NewArr.indexOf(arr[i]) == -1) {
                  NewArr.push(arr[i]);
                }
              }

//                        for(var i = 0;i<arrName.length;i++){
//                            if(NewArrName.indexOf(arrName[i]) == -1){
//                                NewArrName.push(arrName[i]);
//                            }
//                        }
//                        parmas.fileNames = NewArrName;
              parmas.fileNames = arrName;
              parmas.filePaths = NewArr;

            }
            var obj = {
              id: parmas.id,
              name: parmas.name,
              bankAccount: parmas.bankAccount,
              openAccountBank: parmas.openAccountBank,
              contact: parmas.contact,
              contactTel: parmas.contactTel,
              dutyNum: parmas.dutyNum,
              unitId: parmas.unitId,
              isBigClearPack: parmas.isBigClearPack,
              materialIs: parmas.materialIs,
              fileNames: parmas.fileNames,
              filePaths: parmas.filePaths
            }
            editabor(obj).then((res) => {
              this.editLoading = false;
              if (res.data.code == '0') {
                myCallback.call(this, res);
                // this.$notify.success({
                //   title: '修改成功',
                //   // message: res.data.msg,
                //   // offset: 100
                // });
                let parmas = {
                  'search.companyName': this.companyName,
                  'search.contact': this.contact,
                  'search.contactTel': this.contactTel,
                  'search.isBigClearPack': this.isBigClearPack,
                  'search.materialIs': this.materialIs,
                  'unitId': this.companyId,
                  'pageNo': this.thisNowPage,
                  'pageSize': this.pageSize
                }
                this.loading = true;
                this.getList(parmas);
                this.editVisible = false;
                this.editForm = {};
                this.addTmpFiles = [];
              } else {
                myCallback.call(this, res);
                // this.$notify.error({
                //   title: '修改失败',
                //   message: res.data.msg,
                //   // offset: 100
                // });
                this.editVisible = false;
                this.editForm = {};
                this.addTmpFiles = [];
              }
            });
          }
        });
      },

      // 删除劳务公司
      deleteEdit(value) {
        this.$confirm('确认删除该劳务公司吗?', '提示', {
          type: 'warning'
        }).then(() => {
          var parmas = {
            id: value.id
          }
          deleteabor(parmas).then((res) => {
            if (res.data.code == '0') {
              let parmas = {
                'search.companyName': this.companyName,
                'search.contact': this.contact,
                'search.contactTel': this.contactTel,
                'search.isBigClearPack': this.isBigClearPack,
                'search.materialIs': this.materialIs,
                'unitId': this.companyId,
                'pageNo': this.thisNowPage,
                'pageSize': this.pageSize
              }
              this.loading = true;
              this.getList(parmas);
              myCallback.call(this, res);
              // this.$notify.success({
              //   title: '删除成功',
              //   // message: res.data.msg,
              //   // offset: 100
              // });
            } else {
              myCallback.call(this, res);
              // this.$notify.error({
              //   title: '删除失败',
              //   message: res.data.msg,
              //   // offset: 100
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
  .labour .pageCurrent {
    position: relative;
    top: 15px;
    float: right;
    right: 30px;
  }

  .labour .select {
    width: 100%;
  }

  .labour .searchBox {
    width: 100%;
    margin-bottom: .2rem;
  }

  .labour .search {
    width: 3.2rem;
    height: .5rem;
    line-height: .5rem;
    float: left;
  }

  .labour .search p {
    float: left;
    /*width: 1rem;*/
    height: .5rem;
    line-height: .5rem;
    font-size: .14rem;
  }

  .labour .search .searchInput {
    float: left;
    width: 2rem;
  }

  .labour .searchBtn {
    margin-top: .08rem;
    margin-left: .15rem;
    float: right;
  }

  .labour .el-upload-list__item {
    width: 48%;
    margin-right: 1%;
    float: left;
  }

  .labour .search p {
    text-align: left;
  }

  .labour .content .btn {
    border-radius: 5px !important;
    margin-bottom: 10px !important;
  }

  .data {
    font-size: .12rem;
    color: #5C6471;
  }
</style>
