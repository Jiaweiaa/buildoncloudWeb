<template>
  <div class="traninM">
    <!--
        添加按钮
    -->
    <el-button class="btn" size="medium" type="primary" @click="clickAdd">创建培训信息</el-button>

    <!--
        搜索盒子
    -->
    <div class="searchBox">
      <div class="search">
        <p>课程名称：</p>
        <el-input
          placeholder="请输入课程名称"
          size="small"
          class="searchInput"
          v-model="name">
        </el-input>
      </div>
      <div class="search">
        <p>培训地点：</p>
        <el-input
          placeholder="请输入培训地点"
          size="small"
          class="searchInput"
          v-model="address">
        </el-input>
      </div>
      <div class="search" style="width: 440px; margin-right: 0;">
        <p>开课日期：</p>
        <el-date-picker
          size="small"
          v-model="dateBE"
          type="daterange"
          range-separator="至"
          start-placeholder="请选择开始日期"
          end-placeholder="请选择结束日期"
          value-format="yyyy-MM-dd">
        </el-date-picker>
      </div>

      <el-button class="searchBtn" :loading="loading" type="primary" size="small" icon="el-icon-search" @click='search'>
        搜索
      </el-button>
      <el-button class="searchBtn" style="margin-right: 15px;" size="small" icon="el-icon-refresh" @click='clear'>重置
      </el-button>
    </div>

    <!--
        添加
    -->
    <el-dialog :close-on-press-escape="false" title="创建培训信息" :before-close="cencelBtn" :visible.sync="addVisible"
               :close-on-click-modal="false">
      <el-form :model="addForm" label-width="110px" :rules="addFormRules" ref="addForm">
        <el-form-item label="课程名称" prop="name">
          <el-input v-model="addForm.name" auto-complete="off" placeholder="请输入课程名称"></el-input>
        </el-form-item>
        <el-form-item label="培训地点" prop="address">
          <el-input v-model="addForm.address" auto-complete="off" placeholder="请输入培训地点"></el-input>
        </el-form-item>
        <el-form-item label="培训周期" prop="cycle">
          <el-input v-model="addForm.cycle" auto-complete="off" placeholder="请输入培训周期"></el-input>
        </el-form-item>
        <el-form-item label="开课日期" prop="beginDate">
          <el-date-picker
            style="width: 100%;"
            v-model="addForm.beginDate"
            type="date"
            :editable="false"
            value-format="yyyy-MM-dd">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="截止日期" prop="endDate">
          <el-date-picker
            style="width: 100%;"
            :editable="false"
            v-model="addForm.endDate"
            type="date"
            value-format="yyyy-MM-dd">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="招收人数" prop="headCount">
          <el-input-number v-model="addForm.headCount" :min="1"></el-input-number>
        </el-form-item>
        <el-form-item label="工种" prop="workTypeId">
          <el-select style="width: 49%;" v-model="addForm.workClassId" placeholder="选择工类" @change="changeTypeAdd">
            <el-option
              v-for="item in workList"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
          <el-select style="width: 49%; float: right;" v-model="addForm.workTypeId" placeholder="选择工种">
            <el-option
              v-for="item in workTypeList"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="性别要求" prop="sexRequirement">
          <el-select style="width: 100%;" v-model="addForm.sexRequirement" placeholder="请选择性别要求">
            <el-option
              v-for="item in optionsSex"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="年龄范围" prop="goProp">
          <div v-show="addForm.sexRequirement == 0 || addForm.sexRequirement == 1"
               style="width: 48%; float: left; margin-right: 4%;">
            <label style="float: left;">男：</label>
            <el-form-item style="width:40%; float: left;">
              <el-input :class="{errSelf : this.manS}" :maxlength="3" v-model="maleMinAge" placeholder="不能低于23岁"
                        @blur="ageChange('ms')"></el-input>
              <div v-show="manS" class="el-form-item__error">年龄不能低于23岁！</div>
            </el-form-item>
            <label style="float: left; margin-left: 4%;">-</label>
            <el-form-item style="width:40%; float: right;">
              <el-input :class="{errSelf : this.manM}" :maxlength="3" v-model="maleMaxAge" auto-complete="off"
                        placeholder="不能高于55岁" @blur="ageChange('mm')"></el-input>
              <div v-show="manM" class="el-form-item__error">年龄不能高于55岁!</div>
            </el-form-item>
          </div>
          <div v-show="addForm.sexRequirement == 0 || addForm.sexRequirement == 2" style="width: 48%; float: left;">
            <label style="float: left;">女：</label>
            <el-form-item style="width:40%; float: left;">
              <el-input :class="{errSelf : this.womanS}" :maxlength="3" v-model="femaleMinAge" auto-complete="off"
                        placeholder="不能低于23岁" @blur="ageChange('ws')"></el-input>
              <div v-show="womanS" class="el-form-item__error">年龄不能低于23岁！</div>
            </el-form-item>
            <label style="float: left; margin-left: 4%;">-</label>
            <el-form-item style="width:40%; float: right;">
              <el-input :class="{errSelf : this.womanM}" :maxlength="3" v-model="femaleMaxAge" auto-complete="off"
                        placeholder="不能高于50岁" @blur="ageChange('wm')"></el-input>
              <div v-show="womanM" class="el-form-item__error">年龄不能超过50岁！</div>
            </el-form-item>
          </div>
        </el-form-item>
        <el-form-item label="课程内容" prop="describe">
          <el-input type="textarea" v-model="addForm.describe" :rows='3' auto-complete="off" resize="none"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="remark	">
          <el-input type="textarea" v-model="addForm.remark" :rows='3' auto-complete="off" resize="none"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="cencelBtn">取消</el-button>
        <el-button type="primary" @click.native="addBtn">保存并发布</el-button>
      </div>
    </el-dialog>

    <!--
        编辑
    -->
    <el-dialog :close-on-press-escape="false" title="修改培训信息" :before-close="editCencelBtn" :visible.sync="editVisible"
               :close-on-click-modal="false">
      <el-form :model="editForm" label-width="110px" :editCencelBtn="editRules" ref="editForm">
        <el-form-item label="课程名称" prop="name">
          <el-input v-model="editForm.name" auto-complete="off" placeholder="请输入课程名称"></el-input>
        </el-form-item>
        <el-form-item label="培训地点" prop="address">
          <el-input v-model="editForm.address" auto-complete="off" placeholder="请输入培训地点"></el-input>
        </el-form-item>
        <el-form-item label="培训周期" prop="cycle">
          <el-input v-model="editForm.cycle" auto-complete="off" placeholder="请输入培训周期"></el-input>
        </el-form-item>
        <el-form-item label="开课日期" prop="beginDate">
          <el-date-picker
            style="width: 100%;"
            :editable="false"
            v-model="editForm.beginDate"
            type="date"
            value-format="yyyy-MM-dd">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="截止日期" prop="endDate">
          <el-date-picker
            style="width: 100%;"
            :editable="false"
            v-model="editForm.endDate"
            type="date"
            value-format="yyyy-MM-dd">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="招收人数" prop="headCount">
          <el-input-number v-model="editForm.headCount" :min="1"></el-input-number>
        </el-form-item>
        <el-form-item label="工种" prop="workTypeId">
          <el-select style="width: 49%;" v-model="editForm.workClassId" placeholder="选择工类" @change="changeTypeEdit">
            <el-option
              v-for="item in workList"
              :label="item.name"
              :key="item.id"
              :value="item.id">
            </el-option>
          </el-select>
          <el-select style="width: 49%; float: right;" v-model="editForm.workTypeId" placeholder="选择工种">
            <el-option
              v-for="item in workTypeList"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="性别要求" prop="sexRequirement">
          <el-select style="width: 100%;" v-model="editForm.sexRequirement" placeholder="请选择性别要求">
            <el-option
              v-for="item in optionsSex"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="年龄范围" prop="goProp">
          <div v-show="editForm.sexRequirement == 0 || editForm.sexRequirement == 1"
               style="width: 48%; float: left; margin-right: 4%;">
            <label style="float: left;">男：</label>
            <el-form-item style="width:40%; float: left;">
              <el-input :class="{errSelf : this.manS}" :maxlength="3" v-model="maleMinAge" placeholder="不能低于23岁"
                        @blur="ageChange('ms')"></el-input>
              <div v-show="manS" class="el-form-item__error">年龄不能低于23岁！</div>
            </el-form-item>
            <label style="float: left; margin-left: 4%;">-</label>
            <el-form-item style="width:40%; float: right;">
              <el-input :class="{errSelf : this.manM}" :maxlength="3" v-model="maleMaxAge" auto-complete="off"
                        placeholder="不能高于55岁" @blur="ageChange('mm')"></el-input>
              <div v-show="manM" class="el-form-item__error">年龄不能高于55岁!</div>
            </el-form-item>
          </div>
          <div v-show="editForm.sexRequirement == 0 || editForm.sexRequirement == 2" style="width: 48%; float: left;">
            <label style="float: left;">女：</label>
            <el-form-item style="width:40%; float: left;">
              <el-input :class="{errSelf : this.womanS}" :maxlength="3" v-model="femaleMinAge" auto-complete="off"
                        placeholder="不能低于23岁" @blur="ageChange('ws')"></el-input>
              <div v-show="womanS" class="el-form-item__error">年龄不能低于23岁！</div>
            </el-form-item>
            <label style="float: left; margin-left: 4%;">-</label>
            <el-form-item style="width:40%; float: right;">
              <el-input :class="{errSelf : this.womanM}" :maxlength="3" v-model="femaleMaxAge" auto-complete="off"
                        placeholder="不能高于50岁" @blur="ageChange('wm')"></el-input>
              <div v-show="womanM" class="el-form-item__error">年龄不能超过50岁！</div>
            </el-form-item>
          </div>
        </el-form-item>
        <el-form-item label="课程内容" prop="describe">
          <el-input type="textarea" v-model="editForm.describe" :rows='3' auto-complete="off" resize="none"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="remark	">
          <el-input type="textarea" v-model="editForm.remark" :rows='3' auto-complete="off" resize="none"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="editCencelBtn">取消</el-button>
        <el-button type="primary" @click.native="editBtn">保存</el-button>
      </div>
    </el-dialog>

    <!--
        查看
    -->
    <el-dialog :close-on-press-escape="false" title="查看培训信息" :before-close="ok" :visible.sync="lookVisible"
               :close-on-click-modal="false">
      <el-form class="lookFormFindStyle" :model="editForm" label-width="110px" ref="editForm">
        <el-form-item class="lookStyleForDiv" label="课程名称:" prop="name">
          <div class="data">{{editForm.name}}</div>
        </el-form-item>
        <el-form-item class="lookStyleForDiv" label="培训地点:" prop="address">
          <div class="data">{{editForm.address}}</div>
        </el-form-item>
        <el-form-item class="lookStyleForDiv" label="培训周期:" prop="cycle">
          <div class="data">{{editForm.cycle}}</div>
        </el-form-item>
        <el-form-item class="lookStyleForDiv" label="开课日期:" prop="beginDate">
          <div class="data">{{editForm.beginDate}}</div>
        </el-form-item>
        <el-form-item class="lookStyleForDiv" label="截止日期:" prop="endDate">
          <div class="data">{{editForm.endDate}}</div>
        </el-form-item>
        <el-form-item class="lookStyleForDiv" label="招收人数:" prop="headCount">
          <div class="data">{{editForm.headCount}}</div>
        </el-form-item>
        <el-form-item label="工种:" prop="workTypeId">
          <el-select class="lookStyleForDiv" disabled v-model="editForm.workClassId" placeholder="选择工类"
                     @change="changeTypeEdit">
            <el-option
              v-for="item in workList"
              :label="item.name"
              :key="item.id"
              :value="item.id">
            </el-option>
          </el-select>
          -
          <el-select class="lookStyleForDiv" disabled v-model="editForm.workTypeId" placeholder="选择工种">
            <el-option
              v-for="item in workTypeList"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="性别要求:" prop="sexRequirement">
          <el-select class="lookStyleForDiv" disabled style="width: 100%;" v-model="editForm.sexRequirement"
                     placeholder="请选择性别要求">
            <el-option
              v-for="item in optionsSex"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="年龄范围:" prop="goProp">
          <div class="lookStyleForDiv" v-show="editForm.sexRequirement == 0 || editForm.sexRequirement == 1"
               style="width: 48%; float: left; margin-right: 4%;">
            <label style="float: left;">男：</label>
            {{maleMinAge}} - {{maleMaxAge}}
          </div>
          <div class="lookStyleForDiv" v-show="editForm.sexRequirement == 0 || editForm.sexRequirement == 2"
               style="width: 48%; float: left;">
            <label style="float: left;">女：</label>
            {{femaleMinAge}} - {{femaleMaxAge}}
          </div>
        </el-form-item>
        <el-form-item class="lookStyleForDiv" label="课程内容:" prop="describe">
          <div class="data">{{editForm.describe}}</div>
        </el-form-item>
        <el-form-item class="lookStyleForDiv" label="备注:" prop="remark	">
          <div class="data">{{editForm.remark}}</div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="ok">关闭</el-button>
      </div>
    </el-dialog>

    <!--
        页面列表
    -->
    <el-table
      class="table"
      stripe
      :data="listData"
      v-loading="loading"
      border
      style="width: 100%">
      <el-table-column
        label="课程名称"
        align="center">
        <template scope="scope">
          <span @click="lookThis(scope.row)"
                style="color: #409EFF; width:100%; height: 100%; display: block; cursor: pointer;">{{ scope.row.name ? scope.row.name  : ''}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="培训地点"
        align="center">
        <template scope="scope">
          <span @click="lookThis(scope.row)">{{ scope.row.address ? scope.row.address : ''}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="招收人数"
        align="center">
        <template scope="scope">
          <span @click="lookThis(scope.row)">{{ scope.row.headCount ? scope.row.headCount  : ''}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="培训周期"
        align="center">
        <template scope="scope">
          <span @click="lookThis(scope.row)">{{ scope.row.cycle ? scope.row.cycle  : ''}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="开课日期"
        align="center">
        <template scope="scope">
          <span @click="lookThis(scope.row)">{{ scope.row.beginDate ? scope.row.beginDate  : ''}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="报名截止日期"
        align="center">
        <template scope="scope">
          <span @click="lookThis(scope.row)">{{ scope.row.endDate ? scope.row.endDate  : ''}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template scope="scope">
          <el-button
            size="small"
            type="text"
            @click="handleEdit(scope.row)">编辑
          </el-button>
          <el-button
            size="small"
            type="text"
            @click="handleLook(scope.row)">报名情况
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--
          报名情况
      -->
    <el-dialog class="joinStyle" :close-on-press-escape="false" title="报名情况" :visible.sync="jonVisible"
               :before-close="joinCanclByThis" :close-on-click-modal="false">
      <div slot="footer" class="dialog-footer">
        <template>
          <el-table
            :data="joinListData"
            border
            style="width: 100%; margin-bottom: 20px;">
            <el-table-column
              label="联系人姓名"
              align="center">
              <template scope="scope">
                <span>{{ scope.row.name ? scope.row.name  : ''}}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="联系方式"
              align="center">
              <template scope="scope">
                <span>{{ scope.row.mobile ? scope.row.mobile   : ''}} </span>
              </template>
            </el-table-column>
            <el-table-column
              label="报名时间"
              align="center">
              <template scope="scope">
                <span>{{ scope.row.opAtopAt ? scope.row.opAt   : ''}} </span>
              </template>
            </el-table-column>
          </el-table>
        </template>
        <el-pagination
          @size-change="lookhandleSizeChange"
          @current-change="lookhandleCurrentChange"
          :current-page.sync="joincurrentPage"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="joinpageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="jointotalNum">
        </el-pagination>
      </div>
    </el-dialog>

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

  </div>
</template>
<script>
  import {
    getTrainingList,
    addTraining,
    searchTraining,
    editTraining,
    getWorkerList,
    getRecruitWorkerList,
    findEnrolments
  } from '../../api/api';

  export default {
    data() {
      // 校验起始日期
      var validData = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入报名截止日期！'));
        } else {
          function CompareDate(d1, d2) {
            return ((new Date(d1.replace(/-/g, "\/"))) > (new Date(d2.replace(/-/g, "\/"))));
          }

          if (CompareDate(this.addForm.beginDate, this.addForm.endDate)) {
            callback(new Error('截止日期不应比起始日期大'));
          } else {
            callback();
          }
        }
      };


      var validA = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入课程名称！'));
        } else if (!/^[^\s]+$/.test(value)) {
          callback(new Error('课程名称不能带有空格！'));
        } else {
          callback()
        }
      };

      var validB = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入培训地点！'));
        } else if (!/^[^\s]+$/.test(value)) {
          callback(new Error('培训地点不能带有空格！'));
        } else {
          callback()
        }
      };

      var validC = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入培训周期！'));
        } else if (!/^[^\s]+$/.test(value)) {
          callback(new Error('培训周期不能带有空格！'));
        } else {
          callback()
        }
      };

      return {
        jonVisible: false,
        joinListData: [],

        joincurrentPage: 1,
        jointotalNum: 0,
        joinpageSize: 10,
        joinPageNum: 1,

        workList: [],
        workTypeList: [],

        // 列表页数据
        listData: [],
        currentPage: 1,
        totalNum: 0,
        pageSize: 10,

        thisNowPage: 1,

        // 搜索
        name: '',
        address: '',
        beginDateTo: '',
        beginDateFrom: '',
        dateBE: [],

        // 列表页数据
        listData: [],
        currentPage: 1,
        totalNum: 0,

        thisNowPage: 1,

        // loading 加载
        loading: true,
        lookVisible: false,

        //性别
        optionsSex: [{
          value: '0',
          label: '不限'
        }, {
          value: '1',
          label: '男'
        }, {
          value: '2',
          label: '女'
        }],

        // 年龄走其他校验
        maleMinAge: '',
        maleMaxAge: '',
        femaleMinAge: '',
        femaleMaxAge: '',
        // 是否显示校验
        manS: false,
        manM: false,
        womanS: false,
        womanM: false,


        // 添加
        addVisible: false,
        addForm: {
          name: '',
          address: '',
          cycle: '',
          beginDate: '',
          sexRequirement: '',
          workClassId: '',
          workTypeId: '',
          remark: '',
          endDate: '',
          goProp: '1'
        },
        addFormRules: {
          name: [
            {required: true, validator: validA, trigger: 'change'},
            {min: 1, max: 50, message: '课程名称最大长度不能超过50个字符', trigger: 'blur'}
          ],
          address: [
            {required: true, validator: validB, trigger: 'blur'},
            {min: 1, max: 100, message: '培训地点最大长度不能超过100个字符', trigger: 'blur'}
          ],
          cycle: [
            {required: true, validator: validC, trigger: 'blur'},
            {min: 1, max: 50, message: '培训周期最大长度不能超过50个字符', trigger: 'blur'}
          ],
          headCount: [
            {required: true, message: '请选择招收人数 ', trigger: 'change'}
          ],
          sexRequirement: [
            {required: true, message: '请选择性别要求', trigger: 'change'}
          ],
          workTypeId: [
            {required: true, message: '请选择工类工种', trigger: 'blur'}
          ],
          beginDate: [
            {required: true, message: '请选择开课日期', trigger: 'change'}
          ],
          goProp: [
            {required: true, message: '测试', trigger: 'blur'}
          ],
          describe: [
            {required: true, message: '填写课程内容', trigger: 'blur'},
            {min: 1, max: 200, message: '课程内容最大长度不能超过200个字符', trigger: 'blur'}
          ],
          endDate: [
            {required: true, validator: validData, trigger: 'change'}
          ],
          note: [
            {min: 1, max: 200, message: '备注最大长度不能超过200个字符', trigger: 'blur'}
          ]
        },

        editVisible: false,
        editForm: {
          name: '',
          address: '',
          cycle: '',
          beginDate: '',
          sexRequirement: '',
          workClassId: '',
          workTypeId: '',
          remark: '',
          goProp: '1'
        },
        editRules: {
          name: [
            {required: true, validator: validA, trigger: 'change'},
            {min: 1, max: 50, message: '课程名称最大长度不能超过50个字符', trigger: 'blur'}
          ],
          address: [
            {required: true, validator: validB, trigger: 'blur'},
            {min: 1, max: 100, message: '培训地点最大长度不能超过100个字符', trigger: 'blur'}
          ],
          cycle: [
            {required: true, validator: validC, trigger: 'blur'},
            {min: 1, max: 50, message: '培训周期最大长度不能超过50个字符', trigger: 'blur'}
          ],
          headCount: [
            {required: true, message: '请选择招收人数 ', trigger: 'change'}
          ],
          sexRequirement: [
            {required: true, message: '请选择性别要求', trigger: 'change'}
          ],
          workTypeId: [
            {required: true, message: '请选择工类工种', trigger: 'change'}
          ],
          beginDate: [
            {required: true, message: '请选择开课日期', trigger: 'change'}
          ],
          goProp: [
            {required: true, message: '测试', trigger: 'blur'}
          ],
          describe: [
            {required: true, message: '填写课程内容', trigger: 'blur'},
            {min: 1, max: 200, message: '课程内容最大长度不能超过200个字符', trigger: 'blur'}
          ],
          endDate: [
            {required: true, validator: validData, trigger: 'change'}
          ],
          note: [
            {min: 1, max: 200, message: '备注最大长度不能超过200个字符', trigger: 'blur'}
          ]
        }
      }
    },
    mounted() {
      let parmas = {
        'name': this.name,
        'address': this.address,
        'beginDateFrom': this.beginDateFrom,
        'beginDateTo': this.beginDateTo,
        'pageNo': this.thisNowPage,
        'pageSize': this.pageSize
      }
      this.getList(parmas);
      this.getAllWorkerType();
    },
    methods: {

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


      joinCanclByThis() {
        this.jonVisible = false;
        this.joinListData = [];
      },

      handleLook(id) {
        this.jonVisible = true;
        var parmas = {
          trainingId: id.id,
          pageSize: this.joinpageSize,
          pageNo: this.joinPageNum
        }
        findEnrolments(parmas).then((res) => {
          this.joinListData = res.data.data.list;
          this.jointotalNum = res.data.data.totalCount;
          for (var i = 0; i < this.joinListData.length; i++) {
            this.joinListData[i].opAt = this.getMyDate(this.joinListData[i].opAt * 1000).substr(0, 10);
          }
        })
      },

      // 获取所有工类
      getAllWorkerType() {
        getWorkerList().then((res) => {
          if (!res) {
            return;
          }
          this.workList = res.data.data;
        })
      },

      changeTypeAdd(val) {
        var parmas = {
          workClassId: val
        }
        this.addForm.workTypeId = '';
        getRecruitWorkerList(parmas).then((res) => {
          this.workTypeList = res.data.data;
        })
      },
      changeTypeEdit(val) {
        var parmas = {
          workClassId: val
        }
        this.editForm.workTypeId = '';
        getRecruitWorkerList(parmas).then((res) => {
          this.workTypeList = res.data.data;
        })
      },

      // 获取列表
      getList(val) {
        getTrainingList(val).then((res) => {
          if (!res) {
            return;
          }
          this.loading = false;
          if (res.data.code == 0) {
            this.listData = res.data.data.list;
            this.totalNum = res.data.data.totalCount;
          } else {
            this.$notify.error({
              title: '获取列表失败',
              message: res.data.msg,
              offset: 100
            });
          }
        })
      },

      // 列表页数更改
      handleCurrentChange(val) {
        this.thisNowPage = val;
        let parmas = {
          'name': this.name,
          'address': this.address,
          'beginDateFrom': this.beginDateFrom,
          'beginDateTo': this.beginDateTo,
          'pageNo': this.thisNowPage,
          'pageSize': this.pageSize
        }
        this.getList(parmas);
      },
      handleSizeChange(val) {
        this.pageSize = val;
        let parmas = {
          'name': this.name,
          'address': this.address,
          'beginDateFrom': this.beginDateFrom,
          'beginDateTo': this.beginDateTo,
          'pageNo': this.thisNowPage,
          'pageSize': this.pageSize
        }
        this.getList(parmas);
      },

      lookhandleCurrentChange(val) {
        this.joinPageNum = val;
        var parmas = {
          trainingId: id.id,
          pageSize: this.joinpageSize,
          pageNo: this.joinPageNum
        }
        findEnrolments(parmas).then((res) => {
          this.joinListData = res.data.data.list;
          this.jointotalNum = res.data.data.totalCount;
        })
      },
      lookhandleSizeChange(val) {
        this.joinpageSize = val;
        var parmas = {
          trainingId: id.id,
          pageSize: this.joinpageSize,
          pageNo: this.joinPageNum
        }
        findEnrolments(parmas).then((res) => {
          this.joinListData = res.data.data.list;
          this.jointotalNum = res.data.data.totalCount;
        })
      },

      // 搜索
      search() {
        if (this.dateBE !== '' && this.dateBE) {
          this.beginDateFrom = this.dateBE[0];
          this.beginDateTo = this.dateBE[1];
        } else {
          this.beginDateFrom = '';
          this.beginDateTo = '';
        }
        let parmas = {
          'name': this.name,
          'address': this.address,
          'beginDateFrom': this.beginDateFrom,
          'beginDateTo': this.beginDateTo,
          'pageNo': this.thisNowPage,
          'pageSize': this.pageSize
        }
        this.loading = true;
        this.getList(parmas);
      },
      clear() {
        this.name = '';
        this.address = '';
        this.dateBE = '';
      },

      // 添加
      clickAdd() {
        this.addVisible = true;
      },
      cencelBtn() {
        this.$refs['addForm'].resetFields();
        this.addVisible = false;
        this.addForm.remark = '';
        this.maleMinAge = '';
        this.maleMaxAge = '';
        this.femaleMinAge = '';
        this.femaleMaxAge = '';
        this.manM = false;
        this.manS = false;
        this.womanS = false;
        this.womanM = false;
      },

      // age改变校验
      ageChange(val) {
        var reg = /^[0-9]+$/;
        if (val == 'ms') {
          if (this.maleMinAge == '') {
            this.manS = true;
          } else if (!reg.test(this.maleMinAge)) {
            this.manS = true;
          } else if (this.maleMinAge < 23 || this.maleMinAge > 55) {
            this.manS = true;
          } else {
            this.manS = false;
          }
        } else if (val == 'mm') {
          if (this.maleMaxAge == '') {
            this.manM = true;
          } else if (!reg.test(this.maleMaxAge)) {
            this.manM = true;
          } else if (this.maleMaxAge < 23 || this.maleMaxAge > 55) {
            this.manM = true;
          } else if (this.maleMaxAge < this.maleMinAge) {
            this.manM = true;
          } else {
            this.manM = false;
          }

        } else if (val == 'ws') {
          if (this.femaleMinAge == '') {
            this.womanS = true;
          } else if (!reg.test(this.femaleMinAge)) {
            this.womanS = true;
          } else if (this.femaleMinAge < 23 || this.femaleMinAge > 50) {
            this.womanS = true;
          } else {
            this.womanS = false;
          }

        } else if (val == 'wm') {
          if (this.femaleMaxAge == '') {
            this.womanM = true;
          } else if (!reg.test(this.femaleMaxAge)) {
            this.womanM = true;
          } else if (this.femaleMaxAge < 23 || this.femaleMaxAge > 50) {
            this.womanM = true;
          } else if (this.femaleMaxAge < this.femaleMinAge) {
            this.womanS = true;
          } else {
            this.womanM = false;
          }
        }
      },
      // 校验函数
      funValid() {
        var reg = /^[0-9]+$/;
        if (this.addForm.sexRequirement == 0 || this.addForm.sexRequirement == '') {
          if (this.maleMinAge == '') {
            this.manS = true;
          } else if (!reg.test(this.maleMinAge)) {
            this.manS = true;
          } else if (this.maleMinAge < 23 || this.maleMinAge > 55) {
            this.manS = true;
          } else {
            this.manS = false;
          }
          if (this.maleMaxAge == '') {
            this.manM = true;
          } else if (!reg.test(this.maleMaxAge)) {
            this.manM = true;
          } else if (this.maleMaxAge < 23 || this.maleMaxAge > 55) {
            this.manM = true;
          } else if (this.maleMaxAge < this.maleMinAge) {
            this.manM = true;
          } else {
            this.manM = false;
          }
          if (this.femaleMinAge == '') {
            this.womanS = true;
          } else if (!reg.test(this.femaleMinAge)) {
            this.womanS = true;
          } else if (this.femaleMinAge < 23 || this.femaleMinAge > 50) {
            this.womanS = true;
          } else {
            this.womanS = false;
          }
          if (this.femaleMaxAge == '') {
            this.womanM = true;
          } else if (!reg.test(this.femaleMaxAge)) {
            this.womanM = true;
          } else if (this.femaleMaxAge < 23 || this.femaleMaxAge > 50) {
            this.womanM = true;
          } else if (this.femaleMaxAge < this.femaleMinAge) {
            this.womanS = true;
          } else {
            this.womanM = false;
          }
        } else if (this.addForm.sexRequirement == 1) {
          if (this.maleMinAge == '') {
            this.manS = true;
          } else if (!reg.test(this.maleMinAge)) {
            this.manS = true;
          } else if (this.maleMinAge < 23 || this.maleMinAge > 55) {
            this.manS = true;
          } else {
            this.manS = false;
          }
          if (this.maleMaxAge == '') {
            this.manM = true;
          } else if (!reg.test(this.maleMaxAge)) {
            this.manM = true;
          } else if (this.maleMaxAge < 23 || this.maleMaxAge > 55) {
            this.manM = true;
          } else if (this.maleMaxAge < this.maleMinAge) {
            this.manM = true;
          } else {
            this.manM = false;
          }
        } else if (this.addForm.sexRequirement == 2) {
          if (this.femaleMinAge == '') {
            this.womanS = true;
          } else if (!reg.test(this.femaleMinAge)) {
            this.womanS = true;
          } else if (this.femaleMinAge < 23 || this.femaleMinAge > 50) {
            this.womanS = true;
          } else {
            this.womanS = false;
          }
          if (this.femaleMaxAge == '') {
            this.womanM = true;
          } else if (!reg.test(this.femaleMaxAge)) {
            this.womanM = true;
          } else if (this.femaleMaxAge < 23 || this.femaleMaxAge > 50) {
            this.womanM = true;
          } else if (this.femaleMaxAge < this.femaleMinAge) {
            this.womanS = true;
          } else {
            this.womanM = false;
          }
        }
      },
      // 添加函数
      addFun(parmas) {
        this.addVisible = false;
        addTraining(parmas).then((res) => {
          if (res.data.code == '0') {
            let parmas = {
              'name': this.name,
              'address': this.address,
              'beginDateFrom': this.beginDateFrom,
              'beginDateTo': this.beginDateTo,
              'pageNo': this.thisNowPage,
              'pageSize': this.pageSize
            }
            this.getList(parmas);
            this.$notify.success({
              title: '创建成功',
              // message: res.data.msg,
              // offset: 100
            });

          } else {
            this.$notify.error({
              title: '创建失败',
              message: res.data.msg,
              offset: 100
            });

          }
          this.maleMinAge = '';
          this.maleMaxAge = '';
          this.femaleMinAge = '';
          this.femaleMaxAge = '';
          this.addForm.remark = '';
          this.addForm.workClassId = '';
          this.$refs['addForm'].resetFields();
        })
      },
      addBtn() {
        this.$refs.addForm.validate((valid) => {
          if (valid) {
            this.funValid();
            if (this.addForm.sexRequirement == 0) {
              if (!this.manS && !this.manM && !this.womanS && !this.womanM) {
                var parmas = Object.assign({
                  maleMinAge: this.maleMinAge,
                  maleMaxAge: this.maleMaxAge,
                  femaleMinAge: this.femaleMinAge,
                  femaleMaxAge: this.femaleMaxAge
                }, this.addForm);
                this.addFun(parmas)
              } else {
                return;
              }
            } else if (this.addForm.sexRequirement == 1) {
              var parmas = Object.assign({
                maleMinAge: this.maleMinAge,
                maleMaxAge: this.maleMaxAge
              }, this.addForm);
              if (!this.manS && !this.manM) {
                this.addFun(parmas)
              } else {
                return;
              }
            } else if (this.addForm.sexRequirement == 2) {
              if (!this.womanS && !this.womanM) {
                var parmas = Object.assign({
                  femaleMinAge: this.femaleMinAge,
                  femaleMaxAge: this.femaleMaxAge
                }, this.addForm);
                this.addFun(parmas)
              } else {
                return;
              }
            }
          } else {
            this.funValid();
          }
        });
      },

      // 编辑
      handleEdit(row) {
        this.editVisible = true;
        var parmas = {
          id: row.id
        }
        this.nowEditId = row.id;
        searchTraining(parmas).then((res) => {
          if (res.data.code == 0) {
            this.editForm = Object.assign({
              goProp: '12314',
            }, res.data.data);
            var parmas = {
              workClassId: this.editForm.workClassId
            }
            getRecruitWorkerList(parmas).then((res) => {
              this.workTypeList = res.data.data;
            })
            this.maleMinAge = this.editForm.maleMinAge;
            this.maleMaxAge = this.editForm.maleMaxAge;
            this.femaleMinAge = this.editForm.femaleMinAge;
            this.femaleMaxAge = this.editForm.femaleMaxAge;
            this.funValid()
          } else {
            this.$notify.error({
              title: '获取数据失败',
              message: res.data.msg,
              offset: 100
            });
          }
        })
      },
      // 编辑提交
      editBtn() {
        this.$refs.editForm.validate((valid) => {
          if (valid) {
            this.funValid();
            if (this.editForm.sexRequirement == 0) {
              if (!this.manS && !this.manM && !this.womanS && !this.womanM) {
                this.editForm.maleMinAge = this.maleMinAge;
                this.editForm.maleMaxAge = this.maleMaxAge;
                this.editForm.femaleMinAge = this.femaleMinAge;
                this.editForm.femaleMaxAge = this.femaleMaxAge;
                var parmas = Object.assign({
                  id: this.nowEditId
                }, this.editForm);
                this.editFun(parmas)
              } else {
                return;
              }
            } else if (this.editForm.sexRequirement == 1) {
              if (!this.manS && !this.manM) {
                this.editForm.maleMinAge = this.maleMinAge;
                this.editForm.maleMaxAge = this.maleMaxAge;
                var parmas = Object.assign({
                  id: this.nowEditId,
                }, this.editForm);
                this.editFun(parmas)
              } else {
                return;
              }
            } else if (this.editForm.sexRequirement == 2) {
              if (!this.womanS && !this.womanM) {
                this.editForm.femaleMinAge = this.femaleMinAge;
                this.editForm.femaleMaxAge = this.femaleMaxAge;
                var parmas = Object.assign({
                  id: this.nowEditId
                }, this.editForm);
                this.editFun(parmas)
              } else {
                return;
              }
            }
          } else {
            this.funValid();
          }
        });
      },
      // 取消
      editCencelBtn() {
        this.$refs['editForm'].resetFields();
        this.editVisible = false;
        this.editForm.goProp = '12314'
        this.editForm.remark = '';
        this.maleMinAge = '';
        this.maleMaxAge = '';
        this.femaleMinAge = '';
        this.femaleMaxAge = '';
        this.manM = false;
        this.manS = false;
        this.womanS = false;
        this.womanM = false;
      },
      // 编辑函数
      editFun(parmas) {
        this.editVisible = false;
        editTraining(parmas).then((res) => {
          if (res.data.code == '0') {
            let parmas = {
              'projectName': this.projectName,
              'workClass': this.workClass,
              'workType': this.workType,
              'recruitmentType': this.recruitmentType,
              'enterDateFrom': this.enterDateFrom,
              'enterDateTo': this.enterDateTo,
              'pageNo': this.thisNowPage,
              'pageSize': this.pageSize
            }
            this.maleMinAge = '';
            this.maleMaxAge = '';
            this.femaleMinAge = '';
            this.femaleMaxAge = '';
            this.editForm.remark = '';
            this.$refs['editForm'].resetFields();
            this.editForm.goProp = '12314';
            this.getList(parmas);
            this.$notify.success({
              title: '修改成功',
              // message: res.data.msg,
              // offset: 100
            });

          } else {
            this.maleMinAge = '';
            this.maleMaxAge = '';
            this.femaleMinAge = '';
            this.femaleMaxAge = '';
            this.editForm.remark = '';
            this.$refs['editForm'].resetFields();
            this.editForm.goProp = '12314';
            this.$notify.error({
              title: '修改失败',
              message: res.data.msg,
              offset: 100
            });

          }
        })
      },

      ok() {
        this.$refs['editForm'].resetFields();
        this.lookVisible = false;
        this.editForm.remark = '';
        this.maleMinAge = '';
        this.maleMaxAge = '';
        this.femaleMinAge = '';
        this.femaleMaxAge = '';
        this.manM = false;
        this.manS = false;
        this.womanS = false;
        this.womanM = false;
      },
      // 查看
      lookThis(row) {
        this.lookVisible = true;
        var parmas = {
          id: row.id
        }
        this.nowEditId = row.id;
        searchTraining(parmas).then((res) => {
          if (res.data.code == 0) {
            this.editForm = Object.assign({
              goProp: '12314',
            }, res.data.data);
            console.log(this.editForm)
            var parmas = {
              workClassId: this.editForm.workClassId
            }
            getRecruitWorkerList(parmas).then((res) => {
              this.workTypeList = res.data.data;
            })
            this.maleMinAge = this.editForm.maleMinAge;
            this.maleMaxAge = this.editForm.maleMaxAge;
            this.femaleMinAge = this.editForm.femaleMinAge;
            this.femaleMaxAge = this.editForm.femaleMaxAge;
            this.funValid()
          } else {
            this.$notify.error({
              title: '获取数据失败',
              message: res.data.msg,
              offset: 100
            });
          }
        })
      }
    }
  }
</script>
<style scoped>
  .traninM .errSelf .el-input__inner {
    border: 1px solid #f56c6c;
  }

  .traninM .btn {
    border-radius: 20px;
    margin-bottom: 15px;
  }

  .traninM .pageCurrent {
    position: relative;
    top: 15px;
    float: right;
    right: 30px;
  }

  .traninM .select {
    width: 100%;
  }

  .traninM .searchBox {
    width: 100%;
    overflow: hidden;
    margin-bottom: 20px;
  }

  .traninM .search {
    width: 280px;
    height: 50px;
    line-height: 50px;
    float: left;
    margin-right: 10px;
  }

  .traninM .search p {
    float: left;
    width: 80px;
    height: 50px;
    line-height: 50px;
    font-size: 14px;
    text-align: center;
  }

  .traninM .search .searchInput {
    float: left;
    width: 200px;
  }

  .traninM .searchBtn {
    margin-top: 10px;
    float: right;
  }

  .lookFormFindStyle .el-input {
    width: 40px;
  }

  .traninM .lookStyleForDiv {
    font-size: 12px !important;
    color: #5C6471 !important;
  }

  .traninM .lookStyleForDiv .el-input.is-disabled .el-input__inner {
    font-size: 12px;
    color: #5C6471;
  }
</style>
