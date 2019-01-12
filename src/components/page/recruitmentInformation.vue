<template>
  <div class="recutM" style="font-size: 0;">
    <!--
        添加按钮
    -->
    <el-button class="btn" size="medium" type="primary" @click="clickAdd">创建招聘信息</el-button>

    <!--
        添加
    -->
    <el-dialog :close-on-press-escape="false" title="创建招聘信息" :before-close="cencelBtn" :visible.sync="addVisible"
               :close-on-click-modal="false" width="60%">
      <el-form :model="addForm" label-width="1.1rem" :rules="addFormRules" ref="addForm">
        <el-form-item label="项目名称" prop="projectId">
          <el-select size="small" style="width: 100%;" v-model="addForm.projectId" @change="proChange"
                     placeholder="请选择项目">
            <el-option
              v-for="item in projectLists"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="项目详细地址" prop="address">
          <el-input size="small" v-model="addForm.address" disabled auto-complete="off" placeholder="项目详细地址"></el-input>
        </el-form-item>
        <el-form-item label="工种" prop="workTypeId">
          <el-select size="small" style="width: 49%;" v-model="addForm.workClassId" placeholder="选择工类"
                     @change="changeTypeAdd">
            <el-option
              v-for="item in workList"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
          <el-select size="small" style="width: 49%; float: right;" v-model="addForm.workTypeId" placeholder="选择工种">
            <el-option
              v-for="item in workTypeList"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="进场日期" prop="enterDate">
          <el-date-picker
            size="small"
            :editable="false"
            style="width: 100%;"
            v-model="addForm.enterDate"
            type="date"
            value-format="yyyy-MM-dd">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="报名截止日期" prop="endDate">
          <el-date-picker
            size="small"
            style="width: 100%;"
            :editable="false"
            v-model="addForm.endDate"
            type="date"
            value-format="yyyy-MM-dd">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="工程量描述" prop="describe">
          <el-input size="small" v-model="addForm.describe" auto-complete="off" placeholder="如:建筑面积、施工套数等"></el-input>
        </el-form-item>
        <el-form-item label="性别要求" prop="sexRequirement">
          <el-select size="small" style="width: 100%;" v-model="addForm.sexRequirement" placeholder="请选择性别要求">
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
              <el-input size="small" :maxlength="3" :class="{errSelf : this.manS}" v-model="maleMinAge"
                        placeholder="不能低于23岁" @blur="ageChange('ms')"></el-input>
              <div v-show="manS" class="el-form-item__error">年龄范围不能大于已填写的最大年龄不能低于23岁！</div>
            </el-form-item>
            <label style="float: left; margin-left: 4%;">-</label>
            <el-form-item style="width:40%; float: right;">
              <el-input size="small" :class="{errSelf : this.manM}" :maxlength="3" v-model="maleMaxAge"
                        auto-complete="off" placeholder="不能高于55岁" @blur="ageChange('mm')"></el-input>
              <div v-show="manM" class="el-form-item__error">年龄范围不能小于已填写的最小年龄且不能大于55岁!</div>
            </el-form-item>
          </div>
          <div v-show="addForm.sexRequirement == 0 || addForm.sexRequirement == 2" style="width: 48%; float: left;">
            <label style="float: left;">女：</label>
            <el-form-item style="width:40%; float: left;">
              <el-input size="small" :maxlength="3" :class="{errSelf : this.womanS}" v-model="femaleMinAge"
                        auto-complete="off" placeholder="不能低于23岁" @blur="ageChange('ws')"></el-input>
              <div v-show="womanS" class="el-form-item__error">年龄范围不能大于已填写的最大年龄不能低于23岁！</div>
            </el-form-item>
            <label style="float: left; margin-left: 4%;">-</label>
            <el-form-item style="width:40%; float: right;">
              <el-input size="small" :maxlength="3" :class="{errSelf : this.womanM}" v-model="femaleMaxAge"
                        auto-complete="off" placeholder="不能高于50岁" @blur="ageChange('wm')"></el-input>
              <div v-show="womanM" class="el-form-item__error">年龄范围不能小于已填写的最小年龄且不能大于50岁！</div>
            </el-form-item>
          </div>
        </el-form-item>
        <el-form-item label="招募类型" prop="recruitmentType">
          <el-radio-group size="small" v-model="addForm.recruitmentType" @change="typeClickNeed">
            <el-radio :label="0">班组</el-radio>
            <el-radio :label="1">个人</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="招募数量" v-show="numBok" prop="headCount">
          <el-input-number v-model="addForm.headCount" :min="1"></el-input-number>
        </el-form-item>
        <el-form-item label="备注" prop="remark	">
          <el-input size="small" class="textareaOverflow" :autosize="true" resize="none" type="textarea"
                    v-model="addForm.remark" :rows='3' auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="medium" @click="cencelBtn">取消</el-button>
        <el-button size="medium" type="primary" @click.native="addBtn">发布</el-button>
      </div>
    </el-dialog>

    <!--
        搜索盒子
    -->
    <div class="searchBox">
      <div class="search">
        <p>项目名称：</p>
        <el-input
          placeholder="请输入项目名称"
          size="small"
          class="searchInput"
          v-model="projectName">
        </el-input>
      </div>
      <div class="search" style="width: 3.5rem;">
        <p>招聘工种：</p>
        <el-select size="small" v-model="workClass" placeholder="选择工类" @change="changeType">
          <el-option
            v-for="item in workList"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
        <el-select size="small" v-model="workType" placeholder="选择工种">
          <el-option
            v-for="item in workTypeList"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </div>
      <div class="search">
        <p>招聘类型：</p>
        <el-select size="small" v-model="recruitmentType" placeholder="不限" style="width: 2rem;">
          <el-option
            v-for="item in options"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </div>
      <!--<div class="search" style="width: 600px;">-->
      <!--<p>进场日期：</p>-->
      <!--<el-date-picker-->
      <!--size="small"-->
      <!--v-model="dateBE"-->
      <!--type="daterange"-->
      <!--range-separator="至"-->
      <!--start-placeholder="开始日期"-->
      <!--end-placeholder="结束日期"-->
      <!--value-format="yyyy-MM-dd">-->
      <!--</el-date-picker>-->
      <!--</div>-->
      <el-button class="searchBtn" :loading="loading" type="primary" size="small" icon="el-icon-search" @click='search'>
        搜索
      </el-button>
      <el-button class="searchBtn" size="small" icon="el-icon-refresh" @click='clear'>重置</el-button>
    </div>

    <!--
        页面列表
    -->
    <el-table
      class="table"
      stripe
      :data="listData"
      v-loading="loading"
      border
    >
      <el-table-column
        label="项目名称"
        min-width="20%"
        :show-overflow-tooltip="true"
        align="center">
        <template scope="scope">
          <span @click="lookThis(scope.row)"
                style="color: #409EFF; width:100%; height: 100%; display: block; cursor: pointer;">{{ scope.row.project ? scope.row.project.name : ''}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="工类"
        min-width="10%"
        :show-overflow-tooltip="true"
        align="center">
        <template scope="scope">
          <span>{{ scope.row.workClass ? scope.row.workClass.name : ''}}</span>
        </template>
      </el-table-column>
      <el-table-column
        min-width="10%"
        :show-overflow-tooltip="true"
        label="工种"
        align="center">
        <template scope="scope">
          <span>{{ scope.row.workType ? scope.row.workType.name : ''}}</span>
        </template>
      </el-table-column>
      <el-table-column
        min-width="10%"
        :show-overflow-tooltip="true"
        label="招募类型"
        align="center">
        <template scope="scope">
          <span>{{ scope.row.recruitmentType ? scope.row.recruitmentType : ''}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="进场日期"
        min-width="15%"
        :show-overflow-tooltip="true"
        align="center">
        <template scope="scope">
          <span>{{ scope.row.enterDate ? scope.row.enterDate : ''}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="报名截止日期"
        min-width="15%"
        :show-overflow-tooltip="true"
        align="center">
        <template scope="scope">
          <span>{{ scope.row.endDate }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" min-width="10%">
        <template scope="scope">
          <el-button
            type="text"
            size="small"
            @click="handleEdit(scope.row)">编辑
          </el-button>
          <el-button
            type="text"
            v-show="isTopAdmin"
            size="small"
            @click="signMsg(scope.row.id)">
            报名情况
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
        编辑
    -->
    <el-dialog :close-on-press-escape="false" title="编辑招聘信息" :before-close="editCencelBtn" :visible.sync="editVisible"
               :close-on-click-modal="false">
      <el-form :model="editForm" label-width="1.1rem" :rules="editFormRules" ref="editForm">
        <el-form-item label="项目名称" prop="projectId">
          <el-select size="small" style="width: 100%;" v-model="editForm.projectId" placeholder="请选择项目"
                     @change="proEditChange">
            <el-option
              v-for="item in projectLists"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="项目详细地址" prop="address">
          <el-input size="small" disabled v-model="editForm.address" auto-complete="off"
                    placeholder="项目详细地址"></el-input>
        </el-form-item>
        <el-form-item label="工种" prop="workTypeId">
          <el-select size="small" style="width: 49%;" v-model="editForm.workClassId" placeholder="选择工类"
                     @change="changeTypeEdit">
            <el-option
              v-for="item in workList"
              :label="item.name"
              :key="item.id"
              :value="item.id">
            </el-option>
          </el-select>
          <el-select size="small" style="width: 49%; float: right;" v-model="editForm.workTypeId" placeholder="选择工种">
            <el-option
              v-for="item in workTypeList"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="进场日期" prop="enterDate">
          <el-date-picker
            size="small"
            style="width: 100%;"
            v-model="editForm.enterDate"
            type="date"
            :editable="false"
            value-format="yyyy-MM-dd">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="报名截止日期" prop="endDate">
          <el-date-picker
            size="small"
            style="width: 100%;"
            v-model="editForm.endDate"
            type="date"
            :editable="false"
            value-format="yyyy-MM-dd">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="工程量描述" prop="describe">
          <el-input size="small" v-model="editForm.describe" auto-complete="off" placeholder="如:建筑面积、施工套数等"></el-input>
        </el-form-item>
        <el-form-item label="性别要求" prop="sexRequirement">
          <el-select size="small" style="width: 100%;" v-model="editForm.sexRequirement" placeholder="请选择性别要求">
            <el-option
              v-for="item in optionsSex"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="年龄范围" prop="goProp">
          <div v-show="editForm.sexRequirement === '0' || editForm.sexRequirement === '1'"
               style="width: 48%; float: left; margin-right: 4%;">
            <label style="float: left;">男：</label>
            <el-form-item style="width:40%; float: left;">
              <el-input size="small" :class="{errSelf : this.manS}" :maxlength="3" v-model="maleMinAge"
                        placeholder="不能低于23岁" @blur="ageChange('ms')"></el-input>
              <div v-show="manS" class="el-form-item__error">年龄不能低于23岁！</div>
            </el-form-item>
            <label style="float: left; margin-left: 4%;">-</label>
            <el-form-item style="width:40%; float: right;">
              <el-input size="small" :class="{errSelf : this.manM}" :maxlength="3" v-model="maleMaxAge"
                        auto-complete="off" placeholder="不能高于55岁" @blur="ageChange('mm')"></el-input>
              <div v-show="manM" class="el-form-item__error">年龄不能高于55岁!</div>
            </el-form-item>
          </div>
          <div v-show="editForm.sexRequirement === '0' || editForm.sexRequirement === '2'"
               style="width: 48%; float: left;">
            <label style="float: left;">女：</label>
            <el-form-item style="width:40%; float: left;">
              <el-input size="small" :class="{errSelf : this.womanS}" :maxlength="3" v-model="femaleMinAge"
                        auto-complete="off" placeholder="不能低于23岁" @blur="ageChange('ws')"></el-input>
              <div v-show="womanS" class="el-form-item__error">年龄不能低于23岁！</div>
            </el-form-item>
            <label style="float: left; margin-left: 4%;">-</label>
            <el-form-item style="width:40%; float: right;">
              <el-input size="small" :class="{errSelf : this.womanM}" :maxlength="3" v-model="femaleMaxAge"
                        auto-complete="off" placeholder="不能高于50岁" @blur="ageChange('wm')"></el-input>
              <div v-show="womanM" class="el-form-item__error">年龄不能高于50岁！</div>
            </el-form-item>
          </div>
        </el-form-item>
        <el-form-item label="招募类型" prop="recruitmentType">
          <el-radio-group size="small" v-model="editForm.recruitmentType" @change="typeClickNeedEd">
            <el-radio label="0">班组</el-radio>
            <el-radio label="1">个人</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="招募数量" v-show="numBok" prop="headCount">
          <el-input-number v-model="editForm.headCount" :min="1"></el-input-number>
        </el-form-item>
        <el-form-item label="备注" prop="remark	">
          <el-input size="small" class="textareaOverflow" :autosize="true" resize="none" type="textarea"
                    v-model="editForm.remark" :rows='3' auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="medium" @click.native="editCencelBtn">取消</el-button>
        <el-button size="medium" type="primary" @click.native="editBtn">保存</el-button>
      </div>
    </el-dialog>

    <!--
        查看
     -->
    <el-dialog :close-on-press-escape="false" title="查看招聘信息" :before-close="ok" :visible.sync="lookVisible"
               :close-on-click-modal="false">
      <el-form class="lookFormFindStyle" :model="editForm" label-width="1.1rem" ref="editForm">
        <el-form-item class="lookStyleForDiv" label="项目名称:" prop="projectId">
          <div class="data">{{editForm.project ? editForm.project.name : ''}}</div>
        </el-form-item>
        <el-form-item class="lookStyleForDiv" label="项目详细地址:" prop="address">
          <div class="data">{{editForm.address}}</div>
        </el-form-item>
        <el-form-item class="lookStyleForDiv" label="工种:" prop="workTypeId">
          <div class="data">
            {{editForm.workClass ? editForm.workClass.name : ''}} - {{editForm.workType ? editForm.workType.name : ''}}
          </div>
        </el-form-item>
        <el-form-item class="lookStyleForDiv" label="报名开始日期:" prop="enterDate">
          <div class="data">{{editForm.enterDate}}</div>
        </el-form-item>
        <el-form-item class="lookStyleForDiv" label="截止日期:" prop="endDate">
          <div class="data">{{editForm.endDate}}</div>
        </el-form-item>
        <el-form-item class="lookStyleForDiv" label="工程量描述:" prop="describe">
          <div class="data">{{editForm.describe}}</div>
        </el-form-item>
        <el-form-item class="lookStyleForDiv" label="性别要求:" prop="sexRequirement">
          <div class="data">{{editForm.sexRequirement == 1 ? '男' : '女'}}</div>
        </el-form-item>
        <el-form-item class="lookStyleForDiv" label="年龄范围:" prop="goProp">
          <div v-show="editForm.sexRequirement === '0' || editForm.sexRequirement === '1'"
               style="width: 48%; float: left; margin-right: 4%;">
            <label style="float: left;">男：</label>
            <div class="data">{{editForm.maleMinAge}} - {{editForm.maleMaxAge}}</div>
          </div>
          <div v-show="editForm.sexRequirement === '0' || editForm.sexRequirement === '2'"
               style="width: 48%; float: left;">
            <label style="float: left;">女：</label>
            <div class="data">{{editForm.femaleMinAge}} - {{editForm.femaleMaxAge}}</div>
          </div>
        </el-form-item>
        <el-form-item class="lookStyleForDiv" label="招募类型:" prop="recruitmentType">
          <div class="data">{{editForm.recruitmentType == 0 ? '班组' : '个人'}}</div>
        </el-form-item>
        <el-form-item class="lookStyleForDiv" v-show="numBok" label="招募数量:" prop="headCount">
          <div class="data">{{editForm.headCount}}</div>
        </el-form-item>
        <el-form-item class="lookStyleForDiv" label="备注:" disabled prop="remark">
          <div class="data">{{editForm.remark}}</div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="medium" @click.native="ok">关闭</el-button>
      </div>
    </el-dialog>

    <!--
        报名情况
    -->
    <el-dialog :close-on-press-escape="false" title="报名情况" :before-close="closesignMsg" :visible.sync="signMsgVisible"
               width="70%" :close-on-click-modal="false">
      <el-form :model="editForm" label-width="1.1rem">
        <el-form-item label="招募类型">
          <el-select style="width: 2rem;" size="small" v-model="querysignMsg['search.candidateType']" placeholder="
招募类型">
            <el-option
              v-for="item in typeOption"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
          <el-button style="float: right" type="primary" size="medium" @click.native="signMsg(signMsgId)">查询</el-button>
        </el-form-item>
      </el-form>
      <el-table
        class="setWidth"
        stripe
        :data="signMsgList"
        v-loading="loading"
        style="width: 100%;"
        border>
        <el-table-column
          label="报名类型"
          :show-overflow-tooltip="true"
          align="center">
          <template scope="scope">
            <span>{{ scope.row.candidateType == 0 ? '班组' : '个人'}}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="姓名"
          :show-overflow-tooltip="true"
          align="center">
          <template scope="scope">
            <span>{{ scope.row.name ? scope.row.name : ''}}</span>
          </template>
        </el-table-column>
        <el-table-column
          :show-overflow-tooltip="true"
          label="联系方式"
          align="center">
          <template scope="scope">
            <span>{{ scope.row.mobile ? scope.row.mobile : ''}}</span>
          </template>
        </el-table-column>
        <el-table-column
          :show-overflow-tooltip="true"
          label="性别"
          align="center">
          <template scope="scope">
            <span>{{ scope.row.sex == 0 ? '女' : '男'}}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="年龄"
          :show-overflow-tooltip="true"
          align="center">
          <template scope="scope">
            <span>{{ scope.row.age }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="报名时间"
          :show-overflow-tooltip="true"
          align="center">
          <template scope="scope">
            <span>{{ scope.row.opAt}}</span>
          </template>
        </el-table-column>
      </el-table>
      <div style="overflow: hidden;height: .5rem;">
        <el-pagination
          class="pageCurrent"
          @size-change="handleSizeChange2"
          @current-change="handleCurrentChange2"
          :current-page.sync="currentPage2"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="pageSize2"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalNum2">
        </el-pagination>
      </div>
      <!--
         分页
         current-change  改变当前页的回调
         page-size 每页的数据个数
         total 数据条数总数
         current-page.sync 数据总页
      -->
      <div slot="footer" class="dialog-footer">
        <el-button size="medium" @click.native="closesignMsg">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import {
    getAdmin,
    searchSateList,
    getRecruitList,
    getWorkerList,
    getRecruitWorkerList,
    addRecruit,
    getMentByPro,
    searchOnefetch,
    editRecruit
  } from '../../api/api';
  import {findCandidatesByRecruitmentId} from '../../api/projectapi';
  import myCallback from "../../../static/common/callback"
  export default {
    mounted() {
      let parmas = {
        'unitId': this.companyId,
        'projectName': this.projectName,
        'workClass': this.workClass,
        'workType': this.workType,
        'recruitmentType': this.recruitmentType,
        'enterDateFrom': this.enterDateFrom,
        'enterDateTo': this.enterDateTo,
        'pageNo': this.thisNowPage,
        'pageSize': this.pageSize
      }
      this.getList(parmas);
      this.getAllWorkerType();
    },
    data() {
      // 校验起始日期
      var validData = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请选择报名截止日期！'));
        } else {
          if (this.CompareDate(this.addForm.endDate, this.addForm.enterDate)) {
            callback(new Error('报名截止日期不应在项目进场日期之后'));
          } else if (this.CompareDate(this.addForm.enterDate, this.projectEnd)) {
            callback(new Error('报名截止日期不应在项目竣工日期之后'));
          } else {
            callback();
          }

        }
      };


      // 校验起始日期
      var startOrEndValid = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请选择进场日期！'));
        } else {
          if (this.CompareDate(this.projectStart, this.addForm.enterDate)) {
            callback(new Error('进场日期不应在项目开工日期之前'));
          } else if (this.CompareDate(this.addForm.enterDate, this.projectEnd)) {
            callback(new Error('进场日期不应在项目竣工日期之后'));
          } else {
            callback();
          }

        }
      };

      // 校验起始日期
      var validEdData = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请选择报名截止日期！'));
        } else {
          if (this.CompareDate(this.editForm.endDate, this.editForm.enterDate)) {
            callback(new Error('报名截止日期不应在项目进场日期之后'));
          } else if (this.CompareDate(this.editForm.enterDate, this.projectEnd)) {
            callback(new Error('报名截止日期不应在项目竣工日期之后'));
          } else {
            callback();
          }

        }
      };


      // 校验起始日期
      var startOrEdEndValid = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请选择进场日期！'));
        } else {
          if (this.CompareDate(this.projectStart, this.editForm.enterDate)) {
            callback(new Error('进场日期不应在项目开工日期之前'));
          } else if (this.CompareDate(this.editForm.enterDate, this.projectEnd)) {
            callback(new Error('进场日期不应在项目竣工日期之后'));
          } else {
            callback();
          }

        }
      };

      return {
        projectStart: '',
        projectEnd: '',

        // 显示bok
        numBok: true,
        signMsgList: [],
        currentPage2: 1,
        totalNum2: 0,
        pageSize2: 10,
        thisNowPage2: 1,

        signMsgId: '',
        typeOption: [
          {
            id: '',
            name: '不限'
          },
          {
            id: 0,
            name: '班组'
          },
          {
            id: 1,
            name: '个人'
          }
        ],
        signMsgVisible: false,
        querysignMsg: {
          'search.candidateType': '',
          pageSize: 10,
          pageNo: 1
        },
        companyId: '',
        // 列表页数据
        listData: [],
        currentPage: 1,
        totalNum: 0,
        pageSize: 10,

        thisNowPage: 1,

        // 搜索
        dateBE: '',
        projectName: '',
        workClass: '',
        workType: '',
        recruitmentType: '',
        enterDateFrom: '',
        enterDateTo: '',

        //现在的id
        nowEditId: '',

        loading: true,
        lookVisible: false,

        // 工类列表
        workList: [],
        // 工种列表
        workTypeList: [],
        // 项目列表
        projectLists: [],
        // 招聘类型
        options: [{
          value: '',
          label: '不限'
        }, {
          value: '0',
          label: '班组'
        }, {
          value: '1',
          label: '个人'
        }],

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
          projectId: '',
          address: '',
          workClassId: '',
          workTypeId: '',
          enterDate: '',
          describe: '',
          headCount: '',
          sexRequirement: '',
          recruitmentType: 0,
          endDate: '',
          remark: '',
          goProp: '1'
        },
        addFormRules: {
          projectId: [
            {required: true, message: '请选择项目!', trigger: 'change'}
          ],
          address: [
            {required: true, message: '请选择项目!', trigger: 'blur'}
          ],
          workTypeId: [
            {required: true, message: '请选择工类工种!', trigger: 'blur'}
          ],
          enterDate: [
            {required: true, validator: startOrEndValid, trigger: 'change'}
          ],
          describe: [
            {required: true, message: '请填写工作量描述!', trigger: 'blur'},
            {min: 1, max: 100, message: '工作量描述最大长度不能超过100个字符!', trigger: 'blur'}
          ],
          sexRequirement: [
            {required: true, message: '请选择性别要求!', trigger: 'change'}
          ],
          recruitmentType: [
            {required: true, message: '请选择招募类型!', trigger: 'change'}
          ],
          headCount: [
            {required: true, message: '请选择招募数量!', trigger: 'change'}
          ],
          endDate: [
            {required: true, validator: validData, trigger: 'change'}
          ],
          goProp: [
            {required: true, message: '测试', trigger: 'blur'}
          ],
          note: [
            {min: 1, max: 200, message: '备注最大长度不能超过200个字符！', trigger: 'blur'}
          ]
        },

        // 修改
        editVisible: false,
        editForm: {
          projectId: '',
          address: '',
          workClassId: '',
          workTypeId: '',
          enterDate: '',
          describe: '',
          headCount: '',
          sexRequirement: '',
          recruitmentType: '',
          endDate: '',
          remark: '',
          goProp: '1111'
        },
        editFormRules: {
          projectId: [
            {required: true, message: '请选择项目！', trigger: 'change'}
          ],
          address: [
            {required: true, message: '请选择项目!', trigger: 'blur'}
          ],
          workTypeId: [
            {required: true, message: '请选择工类工种！', trigger: 'blur'}
          ],
          enterDate: [
            {required: true, validator: startOrEdEndValid, trigger: 'change'}
          ],
          describe: [
            {required: true, message: '请填写工作量描述！', trigger: 'blur'}
          ],
          sexRequirement: [
            {required: true, message: '请选择性别要求！', trigger: 'change'}
          ],
          recruitmentType: [
            {required: true, message: '请选择招募类型！', trigger: 'change'}
          ],
          headCount: [
            {required: true, message: '请选择招募数量！', trigger: 'change'}
          ],
          endDate: [
            {required: true, validator: validEdData, trigger: 'change'}
          ],
          goProp: [
            {required: true, message: '测试', trigger: 'blur'}
          ]
        },
        adminData: [],
        isTopAdmin: false
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
          this.getAllProject();
          let parmas = {
            'unitId': this.companyId,
            'projectName': this.projectName,
            'workClass': this.workClass,
            'workType': this.workType,
            'recruitmentType': this.recruitmentType,
            'enterDateFrom': this.enterDateFrom,
            'enterDateTo': this.enterDateTo,
            'pageNo': this.thisNowPage,
            'pageSize': this.pageSize
          }
          this.getList(parmas);
        },
        deep: true
      },
    },
    created() {
      this.companyId = this.project.projectId;
      this.getAllProject();
      this.getAdminData();
    },
    methods: {
      //获取登陆信息
      getAdminData() {
        getAdmin().then((res) => {
          if (!res) {
            return;
          }
          this.adminData = res.data.data;
          for (var i = 0; i < this.adminData.roles.length; i++) {
            if (this.adminData.roles[i].code == "HEAD_OFFICE_ADMIN") {
              this.isTopAdmin = true;
            }
          }
        })
      },

      // 类型点击
      typeClickNeed() {
        if (this.addForm.recruitmentType == 0) {
          this.numBok = false;
        } else {
          this.numBok = true;
        }
      },
      typeClickNeedEd() {
        if (this.editForm.recruitmentType == 0) {
          this.numBok = false;
        } else {
          this.numBok = true;
        }
      },
      // 项目变更
      proChange(val) {
        var parmas = {
          projectId: val
        }
        searchSateList(parmas).then((res) => {
          if (res.data.code == 0) {
            this.projectStart = res.data.data.startDate;
            this.projectEnd = res.data.data.completionDate;
            this.addForm.address = res.data.data.province.name + '-' + res.data.data.city.name + '-' + res.data.data.address;
          }
        })
      },

      // 项目变更
      proEditChange(val) {
        var parmas = {
          projectId: val
        }
        searchSateList(parmas).then((res) => {
          if (res.data.code == 0) {
            this.projectStart = res.data.data.startDate;
            this.projectEnd = res.data.data.completionDate;
            this.addForm.address = res.data.data.province.name + '-' + res.data.data.city.name + '-' + res.data.data.address;
          }
        })
      },

      // 查看
      lookThis(row) {
        var parmas = {
          id: row.id
        }
        this.nowEditId = row.id;
        searchOnefetch(parmas).then((res) => {
          if (res.data.code == 0) {
            this.editForm = Object.assign({
              goProp: '12314',
            }, res.data.data);
            this.maleMinAge = this.editForm.maleMinAge;
            this.maleMaxAge = this.editForm.maleMaxAge;
            this.femaleMinAge = this.editForm.femaleMinAge;
            this.femaleMaxAge = this.editForm.femaleMaxAge;
            if (this.editForm.recruitmentType == 0) {
              this.numBok = false;
            } else {
              this.numBok = true;
            }
            this.funValid()
            var parmas = {
              workClassId: this.editForm.workClassId
            }
            getRecruitWorkerList(parmas).then((res) => {
              this.workTypeList = res.data.data;
            })
            this.lookVisible = true;
          } else {
            myCallback.call(this,res);
            // this.$notify.error({
            //   title: '获取数据失败',
            //   message: res.data.msg,
            //   offset: 100
            // });
          }
        })
      },

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
      closesignMsg() {
        this.querysignMsg = {
          'search.candidateType': '',
          pageSize: 10,
          pageNo: 1
        }
        this.signMsgVisible = false;
        this.signMsgList = [];
      },
      handleSizeChange2(val) {
        this.pageSize2 = val;
        this.querysignMsg.pageSize = val;
        this.signMsg(this.signMsgId);
      },
      handleCurrentChange2(val) {
        this.thisNowPage2 = val;
        this.querysignMsg.pageNo = val;
        this.signMsg(this.signMsgId);
        // this.getList(parmas);
      },
      signMsg(id) {
        this.signMsgId = id;
        this.querysignMsg.pageNo = 1;
        var data = {
          recruitmentId: this.signMsgId,
          'search.candidateType': this.querysignMsg['search.candidateType'],
          pageSize: this.querysignMsg.pageSize,
          pageNo: this.querysignMsg.pageNo,
        }
        findCandidatesByRecruitmentId(data).then((res) => {
          if (res.data.code == 0) {
            this.signMsgList = res.data.data.list;
            for (var i = 0; i < this.signMsgList.length; i++) {
              this.signMsgList[i].opAt = this.getMyDate(this.signMsgList[i].opAt * 1000).substr(0, 10);
            }
            this.signMsgVisible = true;
            this.totalNum2 = res.data.data.totalCount;
            this.currentPage2 = res.data.data.pageNo;
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
      CompareDate(d1, d2) {
        return ((new Date(d1.replace(/-/g, "\/"))) > (new Date(d2.replace(/-/g, "\/"))));
      },
      // 获取所有项目
      getAllProject() {
        var parmas = {
          'unitId': this.companyId,
        }
        getMentByPro(parmas).then((res) => {
          if (!res) {
            return;
          }
          this.projectLists = res.data.data;
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

      // 工类改变获取工种
      changeType(val) {
        var parmas = {
          workClassId: val
        }
        this.workType = '';
        getRecruitWorkerList(parmas).then((res) => {
          this.workTypeList = res.data.data;
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
        getRecruitList(val).then((res) => {
          if (!res) {
            return;
          }
          this.loading = false;
          if (res.data.code == 0) {
            this.listData = res.data.data.list;
            for (var i = 0; i < this.listData.length; i++) {
              if (this.listData[i].recruitmentType == 0) {
                this.listData[i].recruitmentType = '班组'
              } else if (this.listData[i].recruitmentType == 1) {
                this.listData[i].recruitmentType = '个人'
              }
            }
            this.totalNum = res.data.data.totalCount;
            this.currentPage = res.data.data.pageNo;
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

      // 列表页数更改
      handleCurrentChange(val) {
        this.thisNowPage = val;
        let parmas = {
          'unitId': this.companyId,
          'projectName': this.projectName,
          'workClass': this.workClass,
          'workType': this.workType,
          'recruitmentType': this.recruitmentType,
          'enterDateFrom': this.enterDateFrom,
          'enterDateTo': this.enterDateTo,
          'pageNo': this.thisNowPage,
          'pageSize': this.pageSize
        }
        this.getList(parmas);
      },
      handleSizeChange(val) {
        this.pageSize = val;
        let parmas = {
          'unitId': this.companyId,
          'projectName': this.projectName,
          'workClass': this.workClass,
          'workType': this.workType,
          'recruitmentType': this.recruitmentType,
          'enterDateFrom': this.enterDateFrom,
          'enterDateTo': this.enterDateTo,
          'pageNo': this.thisNowPage,
          'pageSize': this.pageSize
        }
        this.getList(parmas);
      },
      // 搜索
      search() {
        this.thisNowPage = 1;
        if (this.dateBE !== '') {
          this.enterDateFrom = this.dateBE[0];
          this.enterDateTo = this.dateBE[1];
        }
        let parmas = {
          'unitId': this.companyId,
          'projectName': this.projectName,
          'workClass': this.workClass,
          'workType': this.workType,
          'recruitmentType': this.recruitmentType,
          'enterDateFrom': this.enterDateFrom,
          'enterDateTo': this.enterDateTo,
          'pageNo': this.thisNowPage,
          'pageSize': this.pageSize
        }
        this.loading = true;
        this.getList(parmas);
      },
      clear() {
        this.dateBE = '';
        this.projectName = '';
        this.workClass = '';
        this.workType = '';
        this.recruitmentType = '';
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
      // 新增
      clickAdd() {
        if (this.addForm.recruitmentType == 0) {
          this.numBok = false;
        } else {
          this.numBok = true;
        }
        this.projectStart = '';
        this.projectEnd = '';
        this.addVisible = true;
      },
      // 添加
      addBtn() {
        this.$refs.addForm.validate((valid) => {
          if (valid) {
            this.funValid();
            if (this.addForm.sexRequirement == 0) {
              if (!this.manS && !this.manM && !this.womanS && !this.womanM) {
                var parmas = Object.assign({
                  maleMinAge: parseInt(this.maleMinAge),
                  maleMaxAge: parseInt(this.maleMaxAge),
                  femaleMinAge: parseInt(this.femaleMinAge),
                  femaleMaxAge: parseInt(this.femaleMaxAge)
                }, this.addForm);
                this.addFun(parmas)
              } else {
                return;
              }
            } else if (this.addForm.sexRequirement == 1) {
              var parmas = Object.assign({
                maleMinAge: parseInt(this.maleMinAge),
                maleMaxAge: parseInt(this.maleMaxAge)
              }, this.addForm);
              if (!this.manS && !this.manM) {
                this.addFun(parmas)
              } else {
                return;
              }
            } else if (this.addForm.sexRequirement == 2) {
              if (!this.womanS && !this.womanM) {
                var parmas = Object.assign({
                  femaleMinAge: parseInt(this.femaleMinAge),
                  femaleMaxAge: parseInt(this.femaleMaxAge)
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
        addRecruit(parmas).then((res) => {
          if (res.data.code == '0') {
            let parmas = {
              'unitId': this.companyId,
              'projectName': this.projectName,
              'workClass': this.workClass,
              'workType': this.workType,
              'recruitmentType': this.recruitmentType,
              'enterDateFrom': this.enterDateFrom,
              'enterDateTo': this.enterDateTo,
              'pageNo': this.thisNowPage,
              'pageSize': this.pageSize
            }
            this.getList(parmas);
            myCallback.call(this,res);
            // this.$notify.success({
            //   title: '创建成功',
            //   // message: res.data.msg,
            //   // offset: 100
            // });

          } else {
            myCallback.call(this,res);
            // this.$notify.error({
            //   title: '创建失败',
            //   message: res.data.msg,
            //   offset: 100
            // });

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
      // 取消添加
      cencelBtn() {
        this.$refs['addForm'].resetFields();
        this.addVisible = false;
        this.addForm.workClassId = '';
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

      // 编辑
      handleEdit(row) {
        this.editVisible = true;
        this.projectStart = '';
        this.projectEnd = '';
        var parmas = {
          id: row.id
        }
        this.nowEditId = row.id;
        searchOnefetch(parmas).then((res) => {
          if (res.data.code == 0) {
            this.editForm = Object.assign({
              goProp: '12314',
            }, res.data.data);
            this.maleMinAge = this.editForm.maleMinAge;
            this.maleMaxAge = this.editForm.maleMaxAge;
            this.femaleMinAge = this.editForm.femaleMinAge;
            this.femaleMaxAge = this.editForm.femaleMaxAge;
            this.funValid()
            if (this.editForm.recruitmentType == 0) {
              this.numBok = false;
            } else {
              this.numBok = true;
            }
            var parmas = {
              workClassId: this.editForm.workClassId
            }
            getRecruitWorkerList(parmas).then((res) => {
              this.workTypeList = res.data.data;
            })
          } else {
            myCallback.call(this,res);
            // this.$notify.error({
            //   title: '获取数据失败',
            //   message: res.data.msg,
            //   offset: 100
            // });
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
                this.editForm.maleMinAge = parseInt(this.maleMinAge);
                this.editForm.maleMaxAge = parseInt(this.maleMaxAge);
                this.editForm.femaleMinAge = parseInt(this.femaleMinAge);
                this.editForm.femaleMaxAge = parseInt(this.femaleMaxAge);
                var parmas = Object.assign({
                  id: this.nowEditId
                }, this.editForm);
                this.editFun(parmas)
              } else {
                return;
              }
            } else if (this.editForm.sexRequirement == 1) {
              if (!this.manS && !this.manM) {
                this.editForm.maleMinAge = parseInt(this.maleMinAge);
                this.editForm.maleMaxAge = parseInt(this.maleMaxAge);
                var parmas = Object.assign({
                  id: this.nowEditId,
                }, this.editForm);
                this.editFun(parmas)
              } else {
                return;
              }
            } else if (this.editForm.sexRequirement == 2) {
              if (!this.womanS && !this.womanM) {
                this.editForm.femaleMinAge = parseInt(this.femaleMinAge);
                this.editForm.femaleMaxAge = parseInt(this.femaleMaxAge);
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
        this.editForm.goProp = '12314';
        this.editForm.workClassId = '';
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

      // 编辑函数
      editFun(parmas) {
        this.editVisible = false;
        editRecruit(parmas).then((res) => {
          if (res.data.code == '0') {
            myCallback.call(this,res);
            // this.$notify.success({
            //   title: '修改成功',
            //   // message: res.data.msg,
            //   // offset: 100
            // });

          } else {
            myCallback.call(this,res);
            // this.$notify.error({
            //   title: '修改失败',
            //   message: res.data.msg,
            //   offset: 100
            // });
          }
          let parmas = {
            'unitId': this.companyId,
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
        })
      }
    }
  }
</script>
<style slop-scope>
  .recutM .errSelf .el-input__inner {
    border: 1px solid #f56c6c;
  }

  .recutM .pageCurrent {
    position: relative;
    top: .15rem;
    float: right;
  }

  .recutM .select {
    width: 100%;
  }

  .recutM .searchBox {
    width: 100%;
    margin-bottom: .15rem;
    overflow: hidden;
  }

  .recutM .search {
    width: 3rem;
    height: .5rem;
    line-height: .5rem;
    float: left;
  }

  .recutM .search p {
    float: left;
    /*width: 60px;*/
    height: .5rem;
    line-height: .5rem;
    font-size: .14rem;
    text-align: center;
  }

  .recutM .search .searchInput {
    float: left;
    width: 2rem;
  }

  .recutM .searchBtn {
    margin-top: .15rem !important;
    margin-left: .15rem !important;
    float: right;
  }

  .recutM .el-upload-list__item {
    width: 48%;
    margin-right: 1%;
    float: left;
  }
</style>
<style>
  .setWidth .el-table__body {
    width: 100% !important;
  }

  .setWidth .el-table__header {
    width: 100% !important;
  }

  .setWidth .el-table__body .cell {
    width: 100% !important;
  }
</style>
