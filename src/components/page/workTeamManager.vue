<template>
  <div id="addClass">
    <div v-show="this.typeOfPage == 0">
      <!--
         添加按钮
     -->
      <!--<el-button class="btn" size="medium" type="primary" @click="clickAdd">创建新班组</el-button>-->

      <!--
         创建班组
      -->
      <el-dialog :close-on-press-escape="false" title="创建班组" :before-close="handleClose" :visible.sync="addVisible"
                 :close-on-click-modal="false">
        <el-form class="addFormForm" :model="addForm" label-width="120px" :rules="addFormRules" ref="addForm">
          <div class="projectBox">
            <el-form-item label="班组名称" style="width: 50%; position: absolute; left: 0;" prop="name">
              <el-input size="small" placeholder="请输入班组名称" v-model="addForm.name"></el-input>
            </el-form-item>
            <el-form-item label="所属分公司" style="width: 50%; position: absolute; right:15px;" prop="unitId">
              <el-select
                size="small"
                class="select"
                filterable
                clearable
                v-model="addForm.unitId"
                placeholder="请选择所属公司" style="width: 100%;">
                <el-option
                  v-for="item in workerList"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="班组长姓名" style="width: 50%; position: absolute; left:0;top: 1.15rem;"
                          prop="teamLeaderName">
              <el-input size="small" placeholder="请输入班组长姓名" v-model="addForm.teamLeaderName"></el-input>
            </el-form-item>
            <el-form-item label="联系方式" style="width: 50%; position: absolute; right:.15rem; top: 1.15rem;"
                          prop="teamLeaderTel">
              <el-input size="small" placeholder="请输入联系方式" v-model="addForm.teamLeaderTel"></el-input>
            </el-form-item>
            <el-form-item label="身份证号" style="width: 50%; position: absolute; left:0; top: 1.73rem;" prop="idCardNo">
              <el-input size="small" placeholder="请输入身份证号" v-model="addForm.idCardNo"></el-input>
            </el-form-item>
          </div>
          <el-form-item label="轻工辅料情况" prop="materialIs">
            <el-radio-group size="small" style="margin:0;" v-model="addForm.materialIs">
              <el-radio class="radio" :label="1">包工包料</el-radio>
              <el-radio class="radio" :label="2">包工</el-radio>
            </el-radio-group>
          </el-form-item>
          <div class="addBox">
            <el-form-item
              class="addBoxChild"
              v-for="(domain, index) in addForm.arrData"
              :key="domain.key"
              label="班组类别" :prop="'arrData.' + index + '.workTypeId'"
              :rules="{ required: true, message: '请选择工类工种', trigger: 'blur'}">
              <el-select size="small" style="width: 30%; margin-right: .1rem;float: left;" v-model="domain.workClassId"
                         placeholder="选择工类" @change="addChange(domain)">
                <el-option
                  v-for="item in workList"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
              <el-select size="small" style="width: 30%; float: left;" v-model="domain.workTypeId" placeholder="选择工种">
                <el-option
                  v-for="item in domain.workTypeList"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
              <el-button v-show="addForm.arrData.length !== 1" class="delIcon" style="float: left;margin-left: .1rem;"
                         @click.prevent="removeDomain(domain)"><i style="color:#999;" class="el-icon-delete"></i>
              </el-button>
            </el-form-item>
            <el-button class="addNewOne thisICon" @click="addDomain"><i class="el-icon-circle-plus"></i></el-button>
          </div>
          <div class="projectBoxa">
            <el-form-item label="公司名称" style="width: 50%;float: left;" prop="laborServiceCompanyId">
              <el-select
                @focus="removeReadOnly($event)"
                v-model="addForm.laborServiceCompanyId"
                reserve-keyword
                :remote-method="companyChange"
                :loading="addLoading"
                size="small"
                style="float: left;"
                filterable
                remote
                clearable
                loading-text="请输入最少5位"
                placeholder="请输入公司名称或者法人联系方式">
                <el-option
                  v-for="item in listDataLab"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="可组织人数" style="width: 50%; float: right;" prop="workerCount">
              <el-input size="small" placeholder="请输入可组织人数" v-model="addForm.workerCount"></el-input>
            </el-form-item>
            <el-form-item label="银行账号" style="width: 50%; float: left;" prop="bankAccount">
              <el-input size="small" placeholder="请输入可银行账号" v-model="addForm.bankAccount"></el-input>
            </el-form-item>
            <el-form-item label="开户行地址" style="width: 50%; float: right;" prop="openAccountBank">
              <el-input size="small" placeholder="请输入开户行地址" v-model="addForm.openAccountBank"></el-input>
            </el-form-item>
          </div>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button size="medium" @click.native="cancelBtn">取消</el-button>
          <el-button size="medium" type="primary" @click.native="addBtn">保存</el-button>
        </div>
      </el-dialog>

      <!--
        编辑班组
      -->
      <el-dialog :close-on-press-escape="false" title="修改班组" :before-close="handleEditClose" :visible.sync="editVisible"
                 :close-on-click-modal="false">
        <el-form class="addFormForm" :model="editForm" label-width="120px" :rules="editFormRules" ref="editForm">
          <div class="projectBox">
            <el-form-item label="班组名称" style="width: 50%; position: absolute; left: 0;" prop="name">
              <el-input size="small" v-model="editForm.name"></el-input>
            </el-form-item>
            <el-form-item label="所属分公司" style="width: 50%; position: absolute; right:15px;" prop="unitId">
              <el-select size="small" class="select" filterable v-model="editForm.unitId" placeholder="请选择所属公司">
                <el-option
                  v-for="item in workerList"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="班组长姓名" style="width: 50%; position: absolute; left:0;top: 115px;"
                          prop="teamLeaderName">
              <el-input size="small" v-model="editForm.teamLeaderName"></el-input>
            </el-form-item>
            <el-form-item label="联系方式" style="width: 50%; position: absolute; right:15px; top: 115px;"
                          prop="teamLeaderTel">
              <el-input size="small" v-model="editForm.teamLeaderTel"></el-input>
            </el-form-item>
            <el-form-item label="身份证号" style="width: 50%; position: absolute; left:0; top: 173px;" prop="idCardNo">
              <el-input size="small" v-model="editForm.idCardNo"></el-input>
            </el-form-item>
          </div>
          <el-form-item label="轻工辅料情况" prop="materialIs">
            <el-radio-group size="small" style="margin:0;" v-model="editForm.materialIs">
              <el-radio class="radio" :label="1">包工包料</el-radio>
              <el-radio class="radio" :label="2">包工</el-radio>
            </el-radio-group>
          </el-form-item>
          <div class="addBox">
            <el-form-item
              class="addBoxChild"
              v-for="(domain, index) in editForm.arrData"
              :key="domain.key"
              label="班组类别" :prop="'arrData.' + index + '.workTypeId'"
              :rules="{ required: true, message: '请选择工类工种', trigger: 'blur'}">
              <el-select size="small" style="width: 30%; margin-right: 10px;float: left;" v-model="domain.workClassId"
                         placeholder="选择工类" @change="editChange(domain)">
                <el-option
                  v-for="item in workList"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
              <el-select size="small" style="width: 30%; float: left;" v-model="domain.workTypeId" placeholder="选择工种">
                <el-option
                  v-for="item in domain.workTypeList"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
              <el-button v-show="editForm.arrData.length !== 1" class="delIcon" style="float: left;margin-left: 10px;"
                         @click.prevent="editremoveDomain(domain)"><i style="color:#999;" class="el-icon-delete"></i>
              </el-button>
            </el-form-item>
            <el-button class="addNewOne thisICon" @click="editDomain"><i class="el-icon-circle-plus"></i></el-button>
          </div>
          <div class="projectBoxa">
            <el-form-item label="公司名称" style="width: 50%;float: left;" prop="laborServiceCompanyId">
              <el-select
                @focus="removeReadOnly($event)"
                reserve-keyword
                :remote-method="companyChange"
                :loading="addLoading"
                size="small"
                style="float: left;"
                filterable
                remote
                clearable
                loading-text="请输入最少5位"
                v-model="editForm.laborServiceCompanyId"
                placeholder="请输入公司名称或者法人联系方式">
                <el-option
                  v-for="item in listDataLab"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="可组织人数" style="width: 50%; float: right;" prop="workerCount">
              <el-input size="small" v-model="editForm.workerCount"></el-input>
            </el-form-item>
            <el-form-item label="银行账号" style="width: 50%; float: left;" prop="bankAccount">
              <el-input size="small" v-model="editForm.bankAccount"></el-input>
            </el-form-item>
            <el-form-item label="开户行地址" style="width: 50%; float: right;" prop="openAccountBank">
              <el-input size="small" v-model="editForm.openAccountBank"></el-input>
            </el-form-item>
          </div>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button size="medium" @click.native="editcancelBtn">取消</el-button>
          <el-button size="medium" type="primary" @click.native="editBtn">保存</el-button>
        </div>
      </el-dialog>

      <!--
          查看
      -->
      <el-dialog :close-on-press-escape="false" title="查看班组" :before-close="lookCancl" :visible.sync="lookVisible"
                 :close-on-click-modal="false">
        <el-form :model="editForm" label-width="120px" class="lookFormFindStyle" ref="editForm">
          <div class="projectBox">
            <el-form-item label="班组名称:" style="width: 50%; position: absolute; left: 0;" prop="name">
              <el-input class="lookChildStyle" disabled v-model="editForm.name"></el-input>
            </el-form-item>
            <el-form-item label="所属分公司:" style="width: 50%; position: absolute; right:15px;" prop="unitId">
              <el-select disabled class="select lookChildStyle" filterable v-model="editForm.unitId">
                <el-option
                  v-for="item in workerList"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="班组长姓名:" style="width: 50%; position: absolute; left:0;top: 100px;"
                          prop="teamLeaderName">
              <el-input class="lookChildStyle" disabled v-model="editForm.teamLeaderName"></el-input>
            </el-form-item>
            <el-form-item label="联系方式:" style="width: 50%; position: absolute; right:15px; top: 100px;"
                          prop="teamLeaderTel">
              <el-input class="lookChildStyle" disabled v-model="editForm.teamLeaderTel"></el-input>
            </el-form-item>
            <el-form-item label="身份证号:" style="width: 50%; position: absolute; left:0; top: 145px;" prop="idCardNo">
              <el-input class="lookChildStyle" disabled v-model="editForm.idCardNo"></el-input>
            </el-form-item>
          </div>
          <el-form-item class="listOne" label="轻工辅料情况:" prop="materialIs">
            <el-input class="lookChildStyle" disabled v-model="editForm.materialIs == 1 ? '包工包料' : '包工'"></el-input>
          </el-form-item>
          <div class="addBox">
            <el-form-item
              label="班组类别:">
              <div v-for="(domain, index) in editForm.arrData" :key="domain.key" style="float: left;">
                <el-select class="lookChildStyle" disabled v-model="domain.workClassId" placeholder="选择工类"
                           @change="editChange(domain)">
                  <el-option
                    v-for="item in workList"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
                -
                <el-select class="lookChildStyle" style="margin-right: 5px;" disabled v-model="domain.workTypeId" placeholder="选择工种">
                  <el-option
                    v-for="item in domain.workTypeList"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
              </div>
            </el-form-item>
          </div>
          <div class="projectBoxa">
            <el-form-item label="公司名称:" style="width: 50%;float: left;" prop="laborServiceCompanyId">
              <div class="child">{{editForm.proList ? editForm.proList.name : ''}}</div>
            </el-form-item>
            <!--<el-form-item label="可组织人数:" style="width: 50%; float: right;" prop="workerCount">-->
              <!--<el-input class="lookChildStyle" disabled v-model="editForm.workerCount"></el-input>-->
            <!--</el-form-item>-->
            <el-form-item label="银行账号:" style="width: 50%; float: left; margin-top: 5px;" prop="bankAccount">
              <el-input class="lookChildStyle" disabled v-model="editForm.bankAccount"></el-input>
            </el-form-item>
            <el-form-item label="开户行地址:" style="width: 50%; float: right; margin-top: 5px;" prop="openAccountBank">
              <el-input class="lookChildStyle" disabled v-model="editForm.openAccountBank"></el-input>
            </el-form-item>
          </div>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button size="medium" @click.native="lookCancl">关闭</el-button>
        </div>
      </el-dialog>

      <!--
          搜索盒子
      -->
      <div class="searchBox">
        <div class="search" style="font-size: .13rem">
          <p>班组长姓名：</p>
          <el-input
            placeholder="请输入班组长姓名"
            size="small"
            class="searchInput"
            v-model="teamLeaderName">
          </el-input>
        </div>
        <div class="search">
          <p style="width: 1.3rem;">班组长联系方式：</p>
          <el-input
            placeholder="请输入班组长联系方式"
            size="small"
            class="searchInput"
            style="width: 1.7rem;"
            v-model="teamLeaderTel">
          </el-input>
        </div>
        <div class="search">
          <p>劳务公司名称：</p>
          <el-input
            placeholder="请输入劳务公司名称"
            size="small"
            class="searchInput"
            v-model="laborServiceCompany">
          </el-input>
        </div>
        <div class="search">
          <p>轻工辅料情况：</p>
          <el-select style="width: 1.8rem;float: left" v-model="materialIs" size="small" placeholder="请选择">
            <el-option
              v-for="item in materialIsArr"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </div>
        <div class="search">
          <p>可组织人数：</p>
          <el-select style="width: 1.8rem;float: left" v-model="workerCount" size="small" placeholder="请选择">
            <el-option
              v-for="item in workerCountArr"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </div>
        <div class="search">
          <p>实际注册人数：</p>
          <el-select style="width: 1.8rem;float: left" v-model="trueWorker" size="small" placeholder="请选择">
            <el-option
              v-for="item in workerCountArr"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </div>
        <div class="search" style="width: 7rem;">
          <p>工类工种：</p>
          <el-select style="width: 180px;margin-right: .1rem;float: left" size="small" v-model="workClass" placeholder="选择工类" @change="changeType">
            <el-option
              v-for="item in workList"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
          <el-select style="width: 1.8rem;float: left" size="small" v-model="workType" placeholder="选择工种">
            <el-option
              v-for="item in workTypeList"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </div>
        <!--<div class="search" style="width: 13rem;">-->
          <!--<p>排序：</p>-->
          <!--<el-radio-group v-model="checkedSearchTeams">-->
            <!--<el-radio v-for="item in searchTeam" size="mini" border :label="item.value" :key="item.value">-->
              <!--{{item.name}}-->
            <!--</el-radio>-->
          <!--</el-radio-group>-->
        <!--</div>-->
        <el-button class="searchBtn" :loading="loading" type="primary" size="small" icon="el-icon-search"
                   @click='search'>搜索
        </el-button>
        <el-button class="searchBtn" style="float: right;" size="small" icon="el-icon-refresh" @click='clear'>重置
        </el-button>
      </div>

      <!--
          页面列表
      -->
      <el-table
        class="table"
        :data="listData"
        v-loading="loading"
        stripe
        border
      >
        <el-table-column
          label="班组名称"
          min-width="8%"
          :show-overflow-tooltip="true"
          align="center">
          <template scope="scope">
            <span @click="lookThis(scope.row)"
                  style="color: #409EFF; width:100%; height: 100%; display: block; cursor: pointer;">{{ scope.row.name ? scope.row.name : ''}}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="班组长姓名"
          min-width="8%"
          :show-overflow-tooltip="true"
          align="center">
          <template scope="scope">
            <span>{{ scope.row.teamleadername ? scope.row.teamleadername : ''}}</span>
          </template>
        </el-table-column>
        <el-table-column
          min-width="10%"
          label="班组长联系方式"
          :show-overflow-tooltip="true"
          align="center">
          <template scope="scope">
            <span>{{ scope.row.teamleadertel ? scope.row.teamleadertel : ''}}</span>
          </template>
        </el-table-column>
        <el-table-column
          min-width="18%"
          label="劳务公司名称"
          :show-overflow-tooltip="true"
          align="center">
          <template scope="scope">
            <span>{{ scope.row.laborcompanyname ? scope.row.laborcompanyname : ''}}</span>
          </template>
        </el-table-column>
        <el-table-column
          min-width="10%"
          :show-overflow-tooltip="true"
          label="创建日期"
          align="center">
          <template scope="scope">
            <span>{{ scope.row.createdate ? scope.row.createdate : ''}}</span>
          </template>
        </el-table-column>
        <el-table-column
          min-width="15%"
          :show-overflow-tooltip="true"
          label="班组类别"
          align="center">
          <template scope="scope">
            <span>{{ scope.row.classtype | upReplace}}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="综合评分"
          :show-overflow-tooltip="true"
          min-width="8%"
          align="center">
          <template scope="scope">
            <span>{{ scope.row.comprehensivescore }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" min-width="21%" label="操作">
          <template scope="scope">
            <el-button
              type="text"
              size="small"
              @click="handleEdit(scope.row)">修改
            </el-button>
            <el-button
              type="text"
              size="small"
              @click="handleWorker(scope.row)">工友
            </el-button>
            <el-button
              type="text"
              size="small"
              @click="handleProj(scope.row)">参建项目
            </el-button>
            <el-button
              type="text"
              size="small"
              @click="handleAttend(scope.row)">考勤
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
          参建项目
      -->
      <el-dialog :close-on-press-escape="false" title="参建项目" :visible.sync="projectVisible"
                 :before-close="lookCanclByThis" :close-on-click-modal="false">
        <div slot="footer" class="dialog-footer">
          <template>
            <el-table
              :data="proJectListData"
              border
              style="width: 100%; margin-bottom: 20px;">
              <el-table-column
                label="项目名称"
                align="center">
                <template scope="scope">
                  <span>{{ scope.row.project.name ? scope.row.project.name : ''}}</span>
                </template>
              </el-table-column>
              <el-table-column
                label="用工时间"
                align="center">
                <template scope="scope">
                  <span>{{ scope.row.inDate ? scope.row.inDate : ''}} 至 {{ scope.row.outDate ? scope.row.outDate : '现在'}} </span>
                </template>
              </el-table-column>
              <el-table-column align="center" label="操作" width="200px">
                <template scope="scope">
                  <span @click="getInfoData(scope.row)"
                        style="color: #409EFF; width:100%; height: 100%; display: block; cursor: pointer;">查看详情</span>
                </template>
              </el-table-column>
            </el-table>
            <div v-show="this.getByOneListData.id"
                 style="border: 1px solid #d3dbe3; overflow: hidden; margin-bottom: 20px; padding: 10px;">
              <el-form :model="editForm" label-width="120px" ref="editForm">
                <el-form-item label="项目名称" style="width: 50%; float: left;" prop="name">
                  <el-input size="small" disabled v-model="getByOneListData.project.name"></el-input>
                </el-form-item>
                <el-form-item label="班组名称" style="width: 50%; float: left;" prop="name">
                  <el-input size="small" disabled v-model="getByOneListData.workerTeam.name"></el-input>
                </el-form-item>
                <!--<el-form-item label="现场负责人姓名" style="width: 50%; float: left;" prop="name">-->
                  <!--<el-input size="small" disabled v-model="getByOneListData.behalfName"></el-input>-->
                <!--</el-form-item>-->
                <!--<el-form-item label="联系方式" style="width: 50%; float: left;" prop="name">-->
                  <!--<el-input size="small" disabled v-model="getByOneListData.behalfTel"></el-input>-->
                <!--</el-form-item>-->
                <el-form-item label="所属劳务公司" style="width: 50%; float: left;" prop="name">
                  <el-input size="small" disabled v-model="getByOneListData.laborServiceCompany.name"></el-input>
                </el-form-item>
                <el-form-item label="进场时间" style="width: 50%; float: left;" prop="name">
                  <el-input size="small" disabled v-model="getByOneListData.inDate"></el-input>
                </el-form-item>
              </el-form>
              <el-table
                :data="getByOneListData.extend"
                border
                style="width: 90%;margin-left: 5%;margin-bottom: 20px;">
                <el-table-column
                  label="工种"
                  align="center">
                  <template scope="scope">
                    <span>{{ scope.row.workClass.name ? scope.row.workClass.name : ''}}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  label="上午上工时间"
                  align="center">
                  <template scope="scope">
                    <span>{{ scope.row.morningStart ? scope.row.morningStart : ''}} </span>
                  </template>
                </el-table-column>
                <el-table-column
                  label="上午下工时间"
                  align="center">
                  <template scope="scope">
                    <span>{{ scope.row.morningEnd ? scope.row.morningEnd : ''}} </span>
                  </template>
                </el-table-column>
                <el-table-column
                  label="下午上工时间"
                  align="center">
                  <template scope="scope">
                    <span>{{ scope.row.afternoonStart ? scope.row.afternoonStart : ''}}  </span>
                  </template>
                </el-table-column>
                <el-table-column
                  label="下午下工时间"
                  align="center">
                  <template scope="scope">
                    <span>{{ scope.row.afternoonEnd ? scope.row.afternoonEnd : ''}} </span>
                  </template>
                </el-table-column>
              </el-table>
              <p style="width:60%; height: 16px;line-height: 16px; font-size: 12px; margin-left:26px; border-bottom: 1px solid #ccc; text-align: left;">
                评价信息</p>
              <div style="width: 60%; height: 30px;margin-left:55px; margin-top: 10px; font-size: 14px;">
                <span style="float: left; display: block; height: 30px; line-height: 30px;">评分</span>
                <el-rate disabled style="float: right;margin-right: 80px;margin-top: 5px;" allow-half
                         v-model="getByOneListData.score"></el-rate>
              </div>
              <div style="width: 60%; height: 30px;margin-left:55px;   margin-top: 10px; font-size: 12px;">
                <span style="float: left; display: block; height: 30px; line-height: 30px;">评价</span>
                <el-input style="float: left; width: 80%;margin-left: .4rem;" size="small" class="textareaOverflow" :autosize="true" type="textarea" :rows="2"
                          v-model="getByOneListData.evaluate" disabled placeholder="请输入评价" auto-complete="off" resize="none"></el-input>
              </div>
              <div style="width: 60%; height: 30px;margin-left:55px;  margin-top: 10px; font-size: 12px;">
                <span style="float: left; display: block; height: 30px; line-height: 30px;">是否有不良记录</span>
                <el-radio-group disabled  style="margin-top: 0.08rem; float:left; margin-left: 20px;" v-model="getByOneListData.haveBadRecord">
                  <el-radio class="radio" :label="false">没有不良记录</el-radio>
                  <el-radio class="radio" :label="true">有不良记录</el-radio>
                </el-radio-group>
              </div>
              <div v-show="getByOneListData.haveBadRecord" style="width: 60%; height: 30px;margin-left: .5rem;  margin-top: 10px; font-size: 12px;">
                <span style="float: left; display: block; height: 30px; line-height: 30px;">不良记录</span>
                <el-input size="small" style="float: left; width: 80%;margin-left: 5%;" :autosize="true" disabled type="textarea" :rows="2"
                          v-model="getByOneListData.badRecordNote" placeholder="请输入不良记录内容" auto-complete="off"
                          resize="none"></el-input>
              </div>


            </div>
          </template>
          <div slot="footer" class="dialog-footer">
            <el-button size="medium" @click.native="lookCanclByThis">关闭</el-button>
          </div>
        </div>
      </el-dialog>

      <!--
          查看工友
      -->
      <el-dialog :close-on-press-escape="false" title="班组成员" :before-close="workerCloseBefore"
                 :visible.sync="teamWorkerVisible" :close-on-click-modal="false">
        <div class="dialog-body nassa" style="margin-bottom: 30px;">
          <template>
            <div style="padding: 10px; font-size: 12px;">
              <!--
                  搜索盒子
              -->
              <div style="height: 100px; position: relative;">
                <div class="searchSbox searchSbox_inp">
                  <p style="width: 70px;">工友姓名：</p>
                  <el-input
                    style="width: 130px;float: left;"
                    placeholder="请输入工友姓名"
                    size="small"
                    class="searchInput"
                    v-model="workerName">
                  </el-input>
                </div>
                <div class="searchSbox">
                  <p style="width: 70px;float: left">联系方式：</p>
                  <el-input
                    style="width: 130px;"
                    placeholder="请输入联系方式"
                    size="small"
                    class="searchInput"
                    v-model="workerTel">
                  </el-input>
                </div>
                <div class="searchSbox" style="width: 180px;">
                  <p style="width: 50px;">性别：</p>
                  <el-select size="small" style="width: 130px;" v-model="workerSex" placeholder="不限">
                    <el-option
                      v-for="item in option"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </div>
                <div class="searchSbox" style="margin-top: 10px;">
                  <p style="width: 70px;">工作状态：</p>
                  <el-select size="small" style="width: 130px;" v-model="workerManState" placeholder="不限">
                    <el-option
                      v-for="item in options"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </div>
                <div style=" float: right; width: 180px;">
                  <el-button class="searchBtn" :loading="loading" type="primary" size="small" icon="el-icon-search"
                             @click='workerSearch'>搜索
                  </el-button>
                  <el-button class="searchBtn" size="small" style="right: 90%;" icon="el-icon-refresh"
                             @click='workerClear'>重置
                  </el-button>
                </div>
              </div>
              <!--
                  列表
              -->
              <el-table
                :data="workerListData"
                border
                style="width: 100%; margin-bottom: 20px;">
                <el-table-column
                  label="姓名"
                  align="center">
                  <template scope="scope">
                    <span>{{ scope.row.name ? scope.row.name : ''}}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  label="联系方式"
                  align="center">
                  <template scope="scope">
                    <span>{{ scope.row.tel ? scope.row.tel : ''}}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  label="性别"
                  align="center">
                  <template scope="scope">
                    <span>{{ scope.row.sex ? scope.row.sex : ''}}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  label="年龄"
                  align="center">
                  <template scope="scope">
                    <span>{{ scope.row.age ? scope.row.age : ''}}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  label="住址"
                  :show-overflow-tooltip="true"
                  align="center">
                  <template scope="scope">
                    <span>{{ scope.row.address ? scope.row.address : ''}}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  label="所属工类"
                  align="center">
                  <template scope="scope">
                    <span>{{ scope.row.workerManWorkExtends[0].workClass ? scope.row.workerManWorkExtends[0].workClass.name : ''}}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  label="所属工种"
                  align="center">
                  <template scope="scope">
                    <span>{{ scope.row.workerManWorkExtends[0].workType ? scope.row.workerManWorkExtends[0].workType.name : ''}}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  label="创建日期"
                  align="center">
                  <template scope="scope">
                    <span>{{ scope.row.createDate ? scope.row.createDate : ''}}</span>
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
                style="top: 0;"
                @size-change="handleWorkerSizeChange"
                @current-change="handleWorkerCurrentChange"
                :current-page.sync="workerCurrentPage"
                :page-sizes="[10, 20, 30, 40]"
                :page-size="workerPageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="workerTotalNum">
              </el-pagination>
            </div>
          </template>
        </div>
      </el-dialog>
    </div>
    <!--
        考勤
    -->
    <router-view v-show="this.typeOfPage == 1"></router-view>
  </div>
</template>
<script>
  import {
    searchLaborList,
    queryWorkerTail,
    getHisProList,
    getProInfo,
    getTeamWorker,
    getWorkerList,
    getRecruitWorkerList,
    getWorkerTeamList,
    getUserCompany,
    addWorkerTeam,
    searchWorkerTeam,
    editWorkerTeam,
    getLaborList,
    checkEdWorkerTeamPhone
  } from '../../api/api'
  import {allBranchList, validationWorkerTeamtel} from '../../api/projectapi'
  import myCallback from "../../../static/common/callback"

  export default {
    mounted() {
      this.getAllWorkerType();
      this.getCompany();
    },
    data() {
      // 校验身份证
      var validateIdcard = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入15位或者18位身份证号！'));
        } else {
          var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
          if (!reg.test(value)) {
            callback(new Error('请输入15位或者18位身份证号！'));
          } else {
            callback();
          }
        }
      };

      var validatePhone = (rule, value, callback) => {
        if (value == '') {
          callback(new Error('请输入联系方式！'));
        } else {
          var reg = /^[1]\d{10}$/;
          if (!reg.test(value)) {
            callback(new Error('请输入11位手机号！'));
          } else {
            var parmas = {
              tel: value
            }
            validationWorkerTeamtel(parmas).then((res) => {
              if (res.data.code == 0) {
                callback();
              } else {
                callback(new Error(res.data.msg))
              }
            })
          }
        }
      };

      var validateEdPhone = (rule, value, callback) => {
        if (value == '') {
          callback(new Error('请输入联系方式！'));
        } else {
          var reg = /^[1]\d{10}$/;
          if (!reg.test(value)) {
            callback(new Error('请输入11位手机号！'));
          } else {
            var parmas = {
              tel: value,
              id: this.nowId
            }
            checkEdWorkerTeamPhone(parmas).then((res) => {
              if (res.data.code == 0) {
                callback();
              } else {
                callback(new Error(res.data.msg))
              }
            })
          }
        }
      };

      var validateNum = (rule, value, callback) => {
        var reg = /^[0-9]*$/;
        if (reg.test(value) || value == undefined || value == '') {
          callback();
        } else {
          callback(new Error('请输入数字！'));
        }
      };

      var validA = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入班组名称！'));
        } else if (!/^[^\s]+$/.test(value)) {
          callback(new Error('班组名称不能带有空格！'));
        } else {
          callback()
        }
      };

      var validB = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入班组长姓名！'));
        } else if (!/^[^\s]+$/.test(value)) {
          callback(new Error('班组长姓名不能带有空格！'));
        } else {
          callback()
        }
      };

      return {
        // 加载
        addLoading: false,

        // 类别
        option: [{
          value: '',
          label: '不限'
        }, {
          value: '1',
          label: '男'
        }, {
          value: '0',
          label: '女'
        }],
        options: [{
          value: '',
          label: '不限'
        }, {
          value: '0',
          label: '空闲'
        }, {
          value: '1',
          label: '开工'
        }],

        // 查看工友
        teamWorkerVisible: false,
        // 工友查询
        workerManState: '',
        workerName: '',
        workerSex: '',
        workerTel: '',
        wokerGetId: '',

        workerListData: [],
        workerCurrentPage: 1,
        workerTotalNum: 0,
        workerPageSize: 10,
        workerLoading: true,


        //参建
        projectVisible: false,
        // 参建项目数据
        proJectListData: [],
        getByOneListData: {
          behalfName: '',
          behalfTel: '',
          inDate: '',
          project: {
            name: ''
          },
          workerTeam: {
            name: ''
          },
          laborServiceCompany: {
            name: ''
          }
        },

        // 工类列表
        workList: [],
        // 工种列表
        workTypeList: [],
        // 分公司
        workerList: [],

        typeOfPage: 0,

        // 列表页数据
        listData: [],
        currentPage: 1,
        listDataLab: [],
        totalNum: 0,
        pageSize: 10,
        loading: true,

        thisNowPage: 1,

        // 新增列
        goToProjectgroupForm: {},
        //  排序
        checkedSearchTeams: [],
        searchTeam: [{
          name: '空闲人数',
          value: 'teamFreeWorker'
        },
          {
            name: '综合评分',
            value: 'teamCompositeScore'
          },
          {
            name: '技术和质量',
            value: 'teamSkillQualityScore'
          },
          {
            name: '服务配合度',
            value: 'teamServiceScore'
          },
          {
            name: '垫资能力',
            value: 'teamAdvanceScore'
          },
          {
            name: '劳动力组织能力',
            value: 'teamOrganizationScore'
          },
          {
            name: '无不良记录',
            value: 'teamBadRecordScore'
          }],

        // 搜索
        teamLeaderName: '',
        teamLeaderTel: '',
        laborServiceCompany: '',
        materialIs: '0',
        workerCount: '0',
        trueWorker: '0',
        workClass: '',
        workType: '',
        teamMsgN: '',
        checkedSearchTeams: '',

        lookVisible: false,

        // 组织人数起始 结束
        workerCountStart: '',
        workerCountEnd: '',
        // 实际注册人数起始 结束
        trueWorkerStart: '',
        trueWorkerEnd: '',
        nowId: '',

        // 轻工辅料
        materialIsArr: [{
          value: '0',
          label: '不限'
        }, {
          value: '1',
          label: '包工包料'
        }, {
          value: '2',
          label: '包工'
        }],
        // 人数
        workerCountArr: [{
          value: '0',
          label: '不限'
        }, {
          value: '1',
          label: '1-20'
        }, {
          value: '2',
          label: '21-50'
        }, {
          value: '3',
          label: '51-100'
        }, {
          value: '4',
          label: '101-200'
        }, {
          value: '5',
          label: '200+'
        }],

        // 新增弹出层数据
        addVisible: false,
        addForm: {
          'name': '',
          'unitId': '',
          'teamLeaderName': '',
          'teamLeaderTel': '',
          'idCardNo': '',
          'materialIs': 1,
          'laborServiceCompanyId': '',
          'workerCount': '',
          'bankAccount': '',
          'openAccountBank': '',
          'arrData': [{
            workClassId: '',
            workTypeId: '',
            workTypeList: []
          }]
        },
        addFormRules: {
          name: [
            {required: true, validator: validA, trigger: 'blur'},
            {min: 1, max: 20, message: '班组名称最大长度不能超过20个字符', trigger: 'blur'}
          ],
          unitId: [
            {required: true, message: '请选择所属公司', trigger: 'change'}
          ],
          teamLeaderName: [
            {required: true, validator: validB, trigger: 'blur'},
            {min: 1, max: 20, message: '班组长名称最大长度不能超过20个字符', trigger: 'blur'}
          ],
          teamLeaderTel: [
            {required: true, validator: validatePhone, trigger: 'blur'},
            {min: 1, max: 11, message: '班组长联系方式最大长度不能超过11个字符', trigger: 'blur'}
          ],
          idCardNo: [
            {required: true, validator: validateIdcard, trigger: 'blur'},
            {min: 1, max: 18, message: '身份证号码最大长度不能超过18个字符', trigger: 'blur'}
          ],
          materialIs: [
            {required: true, message: '请选择轻工辅料情况', trigger: 'change'}
          ],
          bankAccount: [
            {validator: validateNum, trigger: 'blur'},
            {min: 1, max: 19, message: '银行卡号最大长度不能超过19个字符', trigger: 'blur'}
          ],
          workerCount: [
            {validator: validateNum, trigger: 'blur'}
          ]

        },

        // 新增弹出层数据
        editVisible: false,
        editForm: {
          'name': this.name,
          'unitId': this.unitId,
          'teamLeaderName': this.teamLeaderName,
          'teamLeaderTel': this.teamLeaderTel,
          'idCardNo': this.idCardNo,
          'materialIs': this.materialIs,
          'laborServiceCompanyId': this.laborServiceCompanyId,
          'workerCount': this.workerCount,
          'bankAccount': this.bankAccount,
          'openAccountBank': this.openAccountBank,
          'arrData': [{
            workClassId: '',
            workTypeId: '',
            workTypeList: []
          }]
        },
        editFormRules: {
          name: [
            {required: true, validator: validA, trigger: 'blur'},
            {min: 1, max: 20, message: '班组名称最大长度不能超过20个字符', trigger: 'blur'}
          ],
          unitId: [
            {required: true, message: '请选择所属公司', trigger: 'change'}
          ],
          teamLeaderName: [
            {required: true, validator: validB, trigger: 'blur'},
            {min: 1, max: 20, message: '班组长名称最大长度不能超过20个字符', trigger: 'blur'}
          ],
          teamLeaderTel: [
            {required: true, validator: validateEdPhone, trigger: 'blur'},
            {min: 1, max: 11, message: '班组长联系方式最大长度不能超过11个字符', trigger: 'blur'}
          ],
          idCardNo: [
            {required: true, validator: validateIdcard, trigger: 'blur'},
            {min: 1, max: 18, message: '身份证号码最大长度不能超过18个字符', trigger: 'blur'}
          ],
          materialIs: [
            {required: true, message: '请选择轻工辅料情况', trigger: 'change'}
          ],
          bankAccount: [
            {validator: validateNum, trigger: 'blur'},
            {min: 1, max: 19, message: '银行卡号最大长度不能超过19个字符', trigger: 'blur'}
          ],
          workerCount: [
            {validator: validateNum, trigger: 'blur'}
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
          this.searchFun();
        },
        deep: true
      },
    },
    created() {
      if (window.localStorage.getItem('typeOfPage')) {
        this.typeOfPage = window.localStorage.getItem('typeOfPage');
      }

      this.$root.eventHub.$on('changeState', value => {
        this.typeOfPage = value;
      })
      this.companyId = this.project.projectId;
      this.addForm.unitId = this.companyId;
      this.searchFun();
    },
    methods: {
      // 搜索
      searchFun() {
        var arr = [];
        arr.push(this.checkedSearchTeams);
        let parmas = {
          'search.unitId': this.companyId,
          'search.teamLeaderName': this.teamLeaderName,
          'search.teamLeaderTel': this.teamLeaderTel,
          'search.laborServiceCompany': this.laborServiceCompany,
          'search.materialIs': this.materialIs,
          'search.workerCountStart': this.workerCountStart,
          'search.workerCountEnd': this.workerCountEnd,
          'search.trueWorkerStart': this.trueWorkerStart,
          'search.trueWorkerEnd': this.trueWorkerEnd,
          'search.workClass': this.workClass,
          'search.workType': this.workType,
          'search.key': arr,
          'pageNo': this.thisNowPage,
          'pageSize': this.pageSize
        }
        this.loading = true;
        this.getList(parmas);
      },

      //解决远程搜索IE兼容问题
      removeReadOnly(e) {
        e.target.readOnly = false;
      },

      companyChange(val) {
        var reg = new RegExp("[\\u4E00-\\u9FFF]+", "g");
        if (reg.test(val)) {
          if (val.length < 2) {
            this.addLoading = true;
            this.listDataLab = [];
          } else {
            var parmas = {
              'nameorphoneKey': val,
              'unitId': this.companyId
            }
            searchLaborList(parmas).then((res) => {
              this.addLoading = false;
              if (res.data.code == 0) {
                this.listDataLab = res.data.data;
              } else {
                myCallback.call(this, res);
                // this.$notify.error({
                //   title: '获取公司列表失败',
                //   message: res.data.msg,
                //   offset: 100
                // });
              }
            })
          }
        } else {
          if (val.length < 5) {
            this.addLoading = true;
            this.listDataLab = [];
          } else {
            var parmas = {
              'nameorphoneKey': val,
              'unitId': this.companyId
            }
            searchLaborList(parmas).then((res) => {
              this.addLoading = false;
              if (res.data.code == 0) {
                this.listDataLab = res.data.data;
              } else {
                myCallback.call(this, res);
                // this.$notify.error({
                //   title: '获取公司列表失败',
                //   message: res.data.msg,
                //   offset: 100
                // });
              }
            })
          }
        }
      },

      handleClose() {
        this.addVisible = false;
        this.$refs['addForm'].resetFields();
        this.addForm.arrData = [{
          workTypeId: '',
          workTypeList: []
        }]
      },
      handleEditClose() {
        this.editVisible = false;
        this.$refs['editForm'].resetFields();
        this.editForm.arrData = [{
          workTypeId: '',
          workTypeList: []
        }]
      },

      workerCloseBefore() {
        this.workerListData = [];
        this.teamWorkerVisible = false;
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

      // 获取公司列表
      getCompany() {
        allBranchList().then((res) => {
          this.workerList = res.data.data;
        })
      },
      // 获取所有工类
      getAllWorkerType() {
        getWorkerList().then((res) => {
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

      // 获取列表
      getList(par) {
        getWorkerTeamList(par).then((res) => {
          if (res.data.code == 0) {
            this.listData = res.data.data.list;
            this.currentPage = res.data.data.pageNo;
            this.totalNum = res.data.data.totalCount;
            this.loading = false;
          } else {
            myCallback.call(this, res);
            // this.$notify.error({
            //   title: '获取列表失败',
            //   message: res.data.msg,
            //   offset: 100
            // });
          }
        })
      },

      // 页数更改
      handleCurrentChange(val) {
        this.thisNowPage = val;
        this.searchFun();
      },
      // 条数更改
      handleSizeChange(val) {
        this.pageSize = val;
        this.searchFun();
      },

      // 点击提交
      clickAdd() {
        this.addVisible = true;
      },
      addChange(item) {
        var index = this.addForm.arrData.indexOf(item);
        var arr = [];
        this.addForm.arrData[index].workTypeList = [];
        this.addForm.arrData[index].workTypeId = '';
        var parmas = {
          workClassId: this.addForm.arrData[index].workClassId
        }
        getRecruitWorkerList(parmas).then((res) => {
          arr = res.data.data;
          this.addForm.arrData[index].workTypeList = arr;
        })
      },
      addBtn() {
        this.$refs.addForm.validate((valid) => {
          if (valid) {
            var parmas = Object.assign({}, this.addForm);
            parmas.classTypes = [];
            parmas.workerCount = parseInt(parmas.workerCount);
            console.log(parmas)
            for (var i = 0; i < parmas.arrData.length; i++) {
              var str = parmas.arrData[i].workClassId + '-' + parmas.arrData[i].workTypeId;
              parmas.classTypes.push(str)
            }
            this.addVisible = false;
            addWorkerTeam(parmas).then((res) => {
              if (res.data.code == '0') {
                myCallback.call(this, res);
                // this.$notify.success({
                //   title: '添加成功',
                //   // message: res.data.msg,
                //   duration: 1000
                // });
                this.searchFun();
                this.$refs['addForm'].resetFields();
                this.addForm.arrData = [{
                  workTypeId: '',
                  workTypeList: []
                }]
              } else {
                myCallback.call(this, res);
                // this.$notify.error({
                //   title: '添加失败',
                //   message: res.data.msg,
                //   offset: 100
                // });
                this.$refs['addForm'].resetFields();
                this.addForm.arrData = [{
                  workTypeId: '',
                  workTypeList: []
                }]
              }
            })
          }
        });
      },
      cancelBtn() {
        this.addVisible = false;
        this.$refs['addForm'].resetFields();
        this.addForm.arrData = [{
          workTypeId: '',
          workTypeList: []
        }]
      },

      // 搜索
      search() {
        if (this.workerCount == '0') {
          this.workerCountStart = '';
          this.workerCountEnd = '';
        } else if (this.workerCount == '1') {
          this.workerCountStart = 1;
          this.workerCountEnd = 20;
        } else if (this.workerCount == '2') {
          this.workerCountStart = 21;
          this.workerCountEnd = 50;
        } else if (this.workerCount == '3') {
          this.workerCountStart = 51;
          this.workerCountEnd = 100;
        } else if (this.workerCount == '4') {
          this.workerCountStart = 101;
          this.workerCountEnd = 200;
        } else if (this.workerCount == '5') {
          this.workerCountStart = 200;
          this.workerCountEnd = '';
        }

        if (this.trueWorker == '0') {
          this.trueWorkerStart = '';
          this.trueWorkerEnd = '';
        } else if (this.trueWorker == '1') {
          this.trueWorkerStart = 1;
          this.trueWorkerEnd = 20;
        } else if (this.trueWorker == '2') {
          this.trueWorkerStart = 21;
          this.trueWorkerEnd = 50;
        } else if (this.trueWorker == '3') {
          this.trueWorkerStart = 51;
          this.trueWorkerEnd = 100;
        } else if (this.trueWorker == '4') {
          this.trueWorkerStart = 101;
          this.trueWorkerEnd = 200;
        } else if (this.trueWorker == '5') {
          this.trueWorkerStart = 200;
          this.trueWorkerEnd = '';
        }
        this.thisNowPage = 1;
        this.searchFun();
      },
      clear() {
        this.workerCount = '0';
        this.trueWorker = '0';
        this.teamLeaderName = '';
        this.teamLeaderTel = '';
        this.laborServiceCompany = '';
        this.materialIs = '0';
        this.workClass = '';
        this.workType = '';
        this.checkedSearchTeams = [];
      },
      lookThis(row) {
        var parmas = {
          id: row.id
        }
        this.nowId = row.id;
        searchWorkerTeam(parmas).then((res) => {
          if (res.data.code == 0) {
            this.editForm = {
              'name': res.data.data.name,
              'unitId': res.data.data.unitId,
              'teamLeaderName': res.data.data.teamLeaderName,
              'teamLeaderTel': res.data.data.teamLeaderTel,
              'idCardNo': res.data.data.idCardNo,
              'materialIs': res.data.data.materialIs,
              'laborServiceCompanyId': res.data.data.laborServiceCompanyId,
              'workerCount': res.data.data.workerCount,
              'bankAccount': res.data.data.bankAccount,
              'openAccountBank': res.data.data.openAccountBank,
              'arrData': []
            }
            for (var i = 0; i < res.data.data.workerTeamWorkExtends.length; i++) {
              this.editForm.arrData.push({
                workClassId: res.data.data.workerTeamWorkExtends[i].workClassId,
                workTypeId: res.data.data.workerTeamWorkExtends[i].workTypeId,
                workTypeList: res.data.data.workerTeamWorkExtends[i].workClass.workTypes
              });
            }
            this.editForm.proList = res.data.data.laborServiceCompany;
            this.lookVisible = true;
          }
        });
      },
      lookCancl() {
        this.lookVisible = false;
        this.$refs['editForm'].resetFields();
      },
      handleEdit(row) {
        this.listDataLab = [];
        var parmas = {
          id: row.id
        }
        this.nowId = row.id;
        searchWorkerTeam(parmas).then((res) => {
          if (res.data.code == 0) {
            if (res.data.data.laborServiceCompanyId !== undefined) {
              this.listDataLab = [{
                name: res.data.data.laborServiceCompany.name,
                id: res.data.data.laborServiceCompanyId
              }]
            }
            this.editForm = {
              'name': res.data.data.name,
              'unitId': res.data.data.unitId,
              'teamLeaderName': res.data.data.teamLeaderName,
              'teamLeaderTel': res.data.data.teamLeaderTel,
              'idCardNo': res.data.data.idCardNo,
              'materialIs': res.data.data.materialIs,
              'laborServiceCompanyId': res.data.data.laborServiceCompanyId,
              'workerCount': parseInt(res.data.data.workerCount),
              'bankAccount': res.data.data.bankAccount,
              'openAccountBank': res.data.data.openAccountBank,
              'arrData': [],
              'createdate': row.createdate
            }
            for (var i = 0; i < res.data.data.workerTeamWorkExtends.length; i++) {
              this.editForm.arrData.push({
                workClassId: res.data.data.workerTeamWorkExtends[i].workClassId,
                workTypeId: res.data.data.workerTeamWorkExtends[i].workTypeId,
                workTypeList: res.data.data.workerTeamWorkExtends[i].workClass.workTypes
              });
            }
          }
        })
        this.editVisible = true
      },
      editChange(item) {
        var index = this.editForm.arrData.indexOf(item);
        var arr = [];
        this.editForm.arrData[index].workTypeId = '';
        this.editForm.arrData[index].workTypeList = [];
        var parmas = {
          workClassId: this.editForm.arrData[index].workClassId
        }
        getRecruitWorkerList(parmas).then((res) => {
          arr = res.data.data;
          this.editForm.arrData[index].workTypeList = arr;
        })
      },

      editBtn() {
        this.$refs.editForm.validate((valid) => {
          if (valid) {
            var parmas = Object.assign({
              id: this.nowId
            }, this.editForm);
            console.log(parmas)
            parmas.workerCount = parseInt(parmas.workerCount);
            parmas.classTypes = [];
            for (var i = 0; i < parmas.arrData.length; i++) {
              var str = parmas.arrData[i].workClassId + '-' + parmas.arrData[i].workTypeId;
              parmas.classTypes.push(str)
            }
            this.editVisible = false;
            editWorkerTeam(parmas).then((res) => {
              if (res.data.code == '0') {
                myCallback.call(this, res);
                // this.$notify.success({
                //   title: '修改成功',
                //   // message: res.data.msg,
                //   duration: 1000
                // });
                this.searchFun();
                this.$refs['editForm'].resetFields();
                this.editForm.arrData = [{
                  workTypeId: '',
                  workTypeList: []
                }]
              } else {
                myCallback.call(this, res);
                // this.$notify.error({
                //   title: '添加失败',
                //   message: res.data.msg,
                //   offset: 100
                // });
                this.$refs['editForm'].resetFields();
                this.editForm.arrData = [{
                  workTypeId: '',
                  workTypeList: []
                }]
              }
            })
          }
        });
      },
      editcancelBtn() {
        this.editVisible = false;
        this.$refs['editForm'].resetFields();
        this.editForm.arrData = [{
          workTypeId: '',
          workTypeList: []
        }]
      },

      editDomain() {
        this.editForm.arrData.push({
          workTypeList: [],
          workTypeId: ''
        });
      },
      editremoveDomain(item) {
        var index = this.editForm.arrData.indexOf(item);
        if (index !== -1) {
          this.editForm.arrData.splice(index, 1)
        }
      },
      addDomain() {
        this.addForm.arrData.push({
          workTypeList: [],
          workTypeId: ''
        });
      },
      removeDomain(item) {
        var index = this.addForm.arrData.indexOf(item);
        if (index !== -1) {
          this.addForm.arrData.splice(index, 1)
        }
      },

      // 项目详情
      handleProj(item) {
        this.projectVisible = true;
        var parmas = {
          id: item.id
        }
        getHisProList(parmas).then((res) => {
          this.proJectListData = res.data.data;
        })
      },

      // 查看详情
      getInfoData(row) {
        var parmas = {
          workTeamId: row.workerTeamId,
          projectId: row.projectId
        }
        getProInfo(parmas).then((res) => {
          this.getByOneListData = res.data.data;
        })
      },

      lookCanclByThis() {
        this.projectVisible = false;
        this.getByOneListData = {
          behalfName: '',
          behalfTel: '',
          inDate: '',
          project: {
            name: ''
          },
          workerTeam: {
            name: ''
          },
          laborServiceCompany: {
            name: ''
          }
        };
      },

      // 考勤
      handleAttend(row) {
        this.typeOfPage = 1;
        this.$router.push({
          path: '/attendance', query: {
            name: row.teamleadername,
            id: row.id
          }
        })
      },

      // 工友
      handleWorker(row) {
        this.teamWorkerVisible = true;
        this.wokerGetId = row.id;
        var parmas = {
          'search.workerTeamId': this.wokerGetId,
          'search.workerManState': this.workerManState,
          'search.name': this.workerName,
          'search.sex': this.workerSex,
          'search.tel': this.workerTel,
          'pageNo': this.workerCurrentPage,
          'pageSize': this.workerPageSize
        }
        this.getWokerListFun(parmas)
      },
      // 获取列表函数
      getWokerListFun(parmas) {
        getTeamWorker(parmas).then((res) => {
          this.workerListData = res.data.data.list;
          for (var i = 0; i < this.workerListData.length; i++) {
            if (this.workerListData[i].sex == 1) {
              this.workerListData[i].sex = '男'
            } else {
              this.workerListData[i].sex = '女'
            }
            this.workerListData[i].opAt = this.getMyDate(this.workerListData[i].opAt * 1000).substr(0, 10)
          }
          this.workerTotalNum = res.data.data.totalCount;
        })
      },

      //关闭
      lookWorkerCencel() {
        this.teamWorkerVisible = false;
        this.workerManState = '';
        this.workerName = '';
        this.workerSex = '';
        this.workerTel = '';
        this.wokerGetId = '';
      },

      // 工友搜索
      workerSearch() {
        var parmas = {
          'search.workerTeamId': this.wokerGetId,
          'search.workerManState': this.workerManState,
          'search.name': this.workerName,
          'search.sex': this.workerSex,
          'search.tel': this.workerTel,
          'pageNo': this.workerCurrentPage,
          'pageSize': this.workerPageSize
        }
        this.getWokerListFun(parmas)
      },
      // 工友清空
      workerClear() {
        this.workerManState = '';
        this.workerName = '';
        this.workerSex = '';
        this.workerTel = '';
      },
      handleWorkerSizeChange(val) {
        this.workerPageSize = val;
        var parmas = {
          'search.workerTeamId': this.wokerGetId,
          'search.workerManState': this.workerManState,
          'search.name': this.workerName,
          'search.sex': this.workerSex,
          'search.tel': this.workerTel,
          'pageNo': this.workerCurrentPage,
          'pageSize': this.workerPageSize
        }
        this.getWokerListFun(parmas)
      },
      handleWorkerCurrentChange(val) {
        this.workerCurrentPage = val;
        var parmas = {
          'search.workerTeamId': this.wokerGetId,
          'search.workerManState': this.workerManState,
          'search.name': this.workerName,
          'search.sex': this.workerSex,
          'search.tel': this.workerTel,
          'pageNo': this.workerCurrentPage,
          'pageSize': this.workerPageSize
        }
        this.getWokerListFun(parmas)
      }
    }
  }
</script>
<style>
  #addClass .btn {
    border-radius: 20px;
    margin-bottom: 30px;
  }

  #addClass .pageCurrent {
    position: relative;
    top: 15px;
    float: right;
    right: 30px;
  }

  #addClass .select {
    width: 100%;
  }

  #addClass .searchBox {
    width: 100%;
    margin-bottom: 15px;
    float: left;
    overflow: hidden;
    position: relative;
  }

  #addClass .search {
    width: 3rem;
    height: .5rem;
    line-height: .5rem;
    float: left;
    margin-right: .15rem;
  }

  #addClass .search p {
    float: left;
    width: 1.2rem;
    height: .5rem;
    line-height: .5rem;
    font-size: .14rem;
    text-align: center;
  }

  #addClass .search .searchInput {
    float: left;
    width: 1.8rem;
  }

  #addClass .searchBtn {
    margin-top: 8px;
    margin-left: 15px;
    float: right;
  }

  #addClass .projectBox {
    overflow: hidden;
    height: 130px;
  }

  #addClass .addFormForm .projectBoxa {
    height: 95px;
  }

  #addClass .addFormForm .projectBox {
    overflow: hidden;
    height: 165px;
  }

  #addClass .projectBoxa {
    overflow: hidden;
    height: 85px;
    margin-top: 5px;
  }

  #addClass .projectBoxa .el-select {
    width: 100%;
  }

  #addClass .addBox {
    overflow: hidden;
    position: relative;
    margin-top: 5px;
  }

  #addClass .searchSbox {
    width: 210px;
    float: left;
    margin-right: 2%;
    position: relative;
    margin-bottom: 10px;
  }

  #addClass .searchSbox p {
    width: 80px;
    font-size: 12px;
    height: 30px;
    line-height: 30px;
    float: left;
  }

  #addClass .searchSbox .el-input, .el-select {
    width: 70%;
    /*float: left;*/
  }

  #addClass .addBoxChild {
    margin-bottom: 20px;
  }

  #addClass .addBoxChild .el-form-item__content {
    margin: 0 !important;
  }

  #addClass . .el-form-item__content {
    display: none;
  }

  #addClass .delIcon {
    background: #fff !important;
    float: right;
    margin-right: 10px;
    margin-top: 5px;
    border: none;
  }

  #addClass .addNewOne {
    background: #fff !important;
    color: #999 !important;
    font-size: 20px;
    float: right;
    border: none;
    position: absolute;
    right: 0;
    top: 0;
  }

  #addClass .addBoxChild .el-form-item__error {
    left: 120px;
  }

  #addClass .el-dialog__body {
    padding: 15px 20px 20px 0;
  }

  #addClass .nassa .el-dialog__body {
    padding: 0;
  }

  #addClass .el-dialog {
    width: 800px !important;
  }

  #addClass .lookChildStyle .el-input__inner {
    font-size: 12px;
    color: #5C6471;
  }

  #addClass .child {
    font-size: 12px;
    color: #5C6471;
  }
  .el-radio--mini.is-bordered {
    padding: .06rem .15rem;
    border-radius:.03rem;
    height: .28rem;
  }
  .el-radio {
    font-size: .14rem;
  }
  /*.el-radio--mini.is-bordered .el-radio__inner {*/
    /*width: .12rem;*/
    /*height: .12rem;*/
  /*}*/
  .el-radio-group {
    display: block;
    margin-top: .1rem;
  }
  .el-radio--mini.is-bordered .el-radio__label {
    font-size: .12rem;
  }
</style>
