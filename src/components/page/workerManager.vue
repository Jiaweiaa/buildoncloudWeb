<template>
  <div class="workerMan">
    <div v-show="lookVisible == false">
      <!--
         添加按钮
      -->
      <!--<el-button class="btn" size="medium" type="primary" @click="clickAdd">创建工友</el-button>-->

      <!--
           搜索盒子
       -->
      <div class="searchBox">
        <div class="search">
          <p>工友姓名：</p>
          <el-input
            placeholder="请输入工友姓名"
            size="small"
            class="searchInput"
            v-model="name">
          </el-input>
        </div>
        <div class="search">
          <p>联系方式：</p>
          <el-input
            placeholder="请输入联系方式"
            size="small"
            class="searchInput"
            v-model="tel">
          </el-input>
        </div>
        <div class="search" style="width: 250px; margin-right: 45px;">
          <p style="width: 70px;">性别：</p>
          <el-select style="width: 180px;" v-model="sex" size="small" placeholder="请选择">
            <el-option
              v-for="item in sexArr"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </div>
        <div class="search" style="width: 250px;">
          <p style="width: 70px;">年龄：</p>
          <el-input
            style="width: 70px;"
            placeholder="年龄"
            size="small"
            class="searchInput"
            v-model="ageA">
          </el-input>
          <p style="float: left; width: 10px; margin: 0 10px;">至</p>
          <el-input
            style="width: 70px;"
            placeholder="年龄"
            size="small"
            class="searchInput"
            v-model="ageB">
          </el-input>
        </div>
        <div class="search">
          <p>工作状态：</p>
          <el-select style="width: 180px;" v-model="workerManState" size="small" placeholder="请选择">
            <el-option
              v-for="item in workerTypeList"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </div>
        <div class="search" style="width: 501px;">
          <p>工类工种：</p>
          <el-select style="width: 180px;margin-right: .1rem" size="small" v-model="workClassId" placeholder="选择工类" @change="changeType">
            <el-option
              v-for="item in workList"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
          <el-select style="width: 180px;" size="small" v-model="workTypeId" placeholder="选择工种">
            <el-option
              v-for="item in workTypeList"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </div>
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
        v-loading="loading"
        stripe
        :data="listData"
        border

      >
        <el-table-column
          label="姓名"
          min-width="8%"
          :show-overflow-tooltip="true"
          align="center">
          <template scope="scope">
            <span @click="lookThis(scope.row)"
                  style="color: #409EFF; width:100%; height: 100%; display: block; cursor: pointer;">{{ scope.row.name ? scope.row.name : ''}}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="所属班组"
          min-width="10%"
          :show-overflow-tooltip="true"
          align="center">
          <template scope="scope">
            <span>{{ scope.row.workerTeam ? scope.row.workerTeam.name : ''}}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="劳务公司名称"
          min-width="15%"
          :show-overflow-tooltip="true"
          align="center">
          <template scope="scope">
            <span>{{ scope.row.workerTeam ? scope.row.workerTeam.laborServiceCompany?scope.row.workerTeam.laborServiceCompany.name:"" : ''}}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="所属工类"
          min-width="8%"
          :show-overflow-tooltip="true"
          align="center">
          <template scope="scope">
            <span>{{ scope.row.workerManWorkExtends ? scope.row.workerManWorkExtends[0].workClass ? scope.row.workerManWorkExtends[0].workClass.name:"" : ''}}</span>
          </template>
        </el-table-column>
        <el-table-column
          min-width="8%"
          :show-overflow-tooltip="true"
          label="所属工种"
          align="center">
          <template scope="scope">
            <span>{{ scope.row.workerManWorkExtends ? scope.row.workerManWorkExtends[0].workType?scope.row.workerManWorkExtends[0].workType.name:"" : ''}}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="性别"
          min-width="6%"
          :show-overflow-tooltip="true"
          align="center">
          <template scope="scope">
            <span>{{ scope.row.sex ? scope.row.sex : ''}}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="年龄"
          min-width="6%"
          :show-overflow-tooltip="true"
          align="center">
          <template scope="scope">
            <span>{{ scope.row.age }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="电话号"
          min-width="10%"
          :show-overflow-tooltip="true"
          align="center">
          <template scope="scope">
            <span>{{ scope.row.tel ? scope.row.tel : ''}}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="创建日期"
          min-width="10%"
          :show-overflow-tooltip="true"
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
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="currentPage"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalNum">
      </el-pagination>
    </div>

    <!--
        工友评价
    -->
    <el-dialog :close-on-press-escape="false" title="参建项目" :visible.sync="projectVisible"
               :before-close="lookCanclByThis" :close-on-click-modal="false">
      <div style="overflow: hidden; width: 100%; height: 40px;">
        <p style="float: left; margin-right: 10px;">参建项目:</p>
        <p style="float: left;">{{evaluateData.project ? evaluateData.project.name : ''}}</p>
      </div>
      <div style="overflow: hidden; width: 100%; height: 40px;">
        <p style="float: left; margin-right: 10px;">项目评价:</p>
        <p style="float: left; width: 300px; height: 100%; position: relative; overflow: hidden;">
          <el-rate style="position: absolute; top: 2px;" :disabled="true" allow-half
                   v-model="evaluateData.manSkillQualityScore / 2"></el-rate>
        </p>
        <span
          style="color: orange;position: absolute; left: 240px; font-size: 14px;">{{evaluateData.manSkillQualityScore !== -1 ? evaluateData.manSkillQualityScore / 2 : 0}}</span>
      </div>
      <div slot="footer" class="dialog-footer">
        <template>
          <el-table
            :data="badRecordData"
            border
            style="width: 100%; margin-bottom: 20px;">
            <el-table-column
              label="不良记录类型"
              align="center">
              <template scope="scope">
                <span>{{ scope.row.name ? scope.row.name : ''}}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="备注"
              align="center">
              <template scope="scope">
                <span>{{ scope.row.note ? scope.row.note : ''}} </span>
              </template>
            </el-table-column>
            <el-table-column
              label="退场日期"
              align="center">
              <template scope="scope">
                <span>{{ scope.row.outDate ? scope.row.outDate : ''}} </span>
              </template>
            </el-table-column>
          </el-table>
        </template>
        <div slot="footer" class="dialog-footer">
          <el-button size="medium" @click.native="lookCanclByThis">关闭</el-button>
        </div>
      </div>
    </el-dialog>

    <!--
        新增工友
    -->
    <el-dialog :close-on-press-escape="false" title="创建工友信息" :visible.sync="addVisible" :before-close="addCencel"
               :close-on-click-modal="false">
      <div style="width: 300px; height: 60px; position: relative; left: 50%; margin-left:-100px; margin-bottom: 20px;">
        <el-steps :space="200" :active="active" finish-status="success">
          <el-step title="录取身份信息"></el-step>
          <el-step title="录取其他信息"></el-step>
        </el-steps>
      </div>
      <el-form :model="addForm" label-width="110px" :rules="addFormRules" style="overflow: hidden;" ref="addForm"
               v-show="active == 0">
        <el-form-item label="姓名" prop="name" style="width: 65%;">
          <el-input size="small" placeholder="请输入姓名" v-model="addForm.name" auto-complete="off"></el-input>
        </el-form-item>
        <img style="position:  absolute; right:60px; top: 150px;" :src="addForm.imgBase"/>
        <el-form-item label="性别" prop="sex" style="width: 65%;">
          <el-select size="small" style="height: 40px !important; width: 100%;" v-model="addForm.sex"
                     placeholder="请选择性别">
            <el-option
              v-for="item in sexArrAdd"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="民族" prop="nation" style="width: 65%;">
          <el-input size="small" placeholder="请输入民族" v-model="addForm.nation" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="住址" style="width: 65%;" prop="address">
          <el-input size="small" placeholder="请输入住址" v-model="addForm.address" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="身份证号" prop="idCardNo">
          <el-input size="small" placeholder="请输入身份证号" v-model="addForm.idCardNo" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="出生日期">
          <el-date-picker
            disabled
            size="small"
            :picker-options="pickerOptions1"
            style="height: 40px !important; width: 100%;"
            v-model="addForm.birthDate"
            type="date"
            value-format="yyyyMMdd">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="签发机关" prop="idCardOrg">
          <el-input size="small" placeholder="请输入签发机关" v-model="addForm.idCardOrg" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="签发日期" prop="isSuedData">
          <el-date-picker
            placeholder="请选择签发日期"
            size="small"
            :editable="false"
            :picker-options="pickerOptions1"
            style="height: 40px !important; width: 100%;"
            v-model="addForm.isSuedData"
            type="date"
            value-format="yyyyMMdd">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="有效期截止日期" prop="idCardValidata">
          <el-date-picker
            placeholder="请选择有效期截止日期"
            size="small"
            :editable="false"
            :picker-options="pickerOptions1"
            style="height: 40px !important; width: 100%;"
            v-model="addForm.idCardValidata"
            type="date"
            value-format="yyyyMMdd">
          </el-date-picker>
        </el-form-item>
        <!--<el-form-item label="身份证物理卡号"  prop="idCardPhysicalNo">-->
        <!--<el-input v-model="addForm.idCardPhysicalNo" auto-complete="off"></el-input>-->
        <!--</el-form-item>-->
        <el-popover trigger="hover" placement="top"
                    style="text-align: center; display: block; width: 30px; float: right;  margin-top: 5px; margin-right: 10px; cursor: pointer;">
          <p>身份证读卡器使用说明：</p>
          <p>1: 安装驱动：安装驱动文件ZKIDROnline.exe，安装后需要重启计算机。</p>
          <p>2: 接入设备：重启后，将读卡器插入USB口，读卡器发出两声蜂鸣。</p>
          <p>3: 读取信息：点击『读取身份证信息』按钮，读取成功发出一声蜂鸣。</p>
          <p>注: 如果仍有问题，请联系系统管理人员。</p>
          <p @click="downloadFile" style="text-align: right; text-decoration: underline; color: blue; cursor: pointer;">
            下载驱动和证书</p>
          <div slot="reference" class="name-wrapper">
            <i class="el-icon-question"></i>
          </div>
        </el-popover>
        <el-button size="small" style="margin-bottom: 20px; float: right; margin-right: 10px;" :loading="cardBok"
                   @click="getCardData">读取身份证信息
        </el-button>
      </el-form>
      <el-form style="overflow: hidden;" :model="addForm2" label-width="110px" :rules="addFormRules2" ref="addForm2"
               v-show="active == 1">
        <el-form-item label="工友联系方式" prop="tel">
          <el-input size="small" v-model="addForm2.tel" auto-complete="off" placeholder="请输入工友联系方式"></el-input>
        </el-form-item>
        <el-form-item label="工类工种" prop="workTypeId">
          <el-select size="small" style="width: 48%; margin-right: 3%;" v-model="addForm2.workClassId"
                     placeholder="选择工类" @change="addChangeType">
            <el-option
              v-for="item in workList"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
          <el-select size="small" style="width: 48%;" v-model="addForm2.workTypeId" placeholder="选择工种">
            <el-option
              v-for="item in workTypeList1"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="紧急联系方式" prop="emergencyContactTel">
          <el-input size="small" v-model="addForm2.emergencyContactTel" auto-complete="off"
                    placeholder="请输入紧急联系方式"></el-input>
        </el-form-item>
        <el-form-item label="血型" prop="bloody">
          <el-select size="small" style="height: 40px !important; width: 100%;" v-model="addForm2.bloody" clearable
                     placeholder="请选择血型">
            <el-option
              v-for="item in bloodyArray"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="班组" prop="workerTeamId">
          <el-select
            @focus="removeReadOnly($event)"
            reserve-keyword
            :remote-method="companyChange"
            :loading="addLoading"
            filterable
            remote
            clearable
            loading-text="请输入最少5位"
            size="small"
            style="height: 40px !important; width: 100%;"
            v-model="addForm2.workerTeamId"
            placeholder="请输入班组名称或者班组长手机">
            <el-option
              v-for="item in workerTeamListData"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="工资卡账号" prop="bankAccount">
          <el-input size="small" v-model="addForm2.bankAccount" auto-complete="off" placeholder="请输入工资卡账号"></el-input>
        </el-form-item>
        <el-form-item label="开户行地址" prop="openAccountBank">
          <el-input size="small" v-model="addForm2.openAccountBank" auto-complete="off"
                    placeholder="请输入开户行地址"></el-input>
        </el-form-item>
        <el-button size="small" style="margin-bottom: 20px; float: right;" @click="prevClick(1)">上一步</el-button>
      </el-form>

      <el-button size="medium" style="float: right; margin-bottom: 20px;" @click="next" v-show="active !== 1">下一步
      </el-button>
      <el-button size="medium" style="float: right; margin-bottom: 20px;" @click="addCencel" v-show="active == 1">取消
      </el-button>
      <el-button size="medium" style="float: right; margin-bottom: 20px; margin-right: 10px;" @click="add"
                 v-show="active == 1">保存
      </el-button>
    </el-dialog>

    <!--
        查看
     -->
    <div v-show="lookVisible == true" class="lookBox">
      <el-button size="small" style="width: 100%; text-align: left;" type="text" @click="lookCancelBtn()"><i
        class="el-icon-arrow-left"></i>返回
      </el-button>
      <div style="width: 35%; margin-top: 10px; height: 95%;float: left; margin-bottom: 20px;">
        <div class="lookHeader">基本信息</div>
        <el-form class="lookFormFindStyle" :model="editForm" label-width="1.3rem"
                 style="overflow: hidden; position: relative; background: #fff;" ref="editForm">
          <el-form-item label="姓名:" prop="name" style="width: 65%;">
            <p style="font-size: .12rem;">{{editForm.name}}</p>
          </el-form-item>
          <img style="position:  absolute; right:.2rem; top: .1rem; width: 1.15rem;" :src="editForm.imgBase"/>
          <el-form-item label="性别:" prop="sex" style="width: 65%;">
            <p style="font-size: .12rem;">{{editForm.sex == 0 ? '女' : '男'}}</p>
          </el-form-item>
          <el-form-item label="民族:" prop="nation" style="width: 65%;">
            <p style="font-size: .12rem;">{{editForm.nation}}</p>
          </el-form-item>
          <el-form-item label="籍贯:" style="width: 65%;" prop="address">
            <p style="font-size: .12rem; width: 100%;">{{editForm.nativePlace}}</p>
          </el-form-item>
          <el-form-item label="身份证号:" prop="idCardNo">
            <p style="font-size: .12rem;">{{editForm.idCardNo}}</p>
          </el-form-item>
          <el-form-item label="地址:" prop="address">
            <p style="font-size: .12rem; width: 100%;">{{editForm.address}}</p>
          </el-form-item>
          <el-form-item label="出生日期:" prop="birthDate">
            <p style="font-size: .12rem;">{{editForm.birthDate}}</p>
          </el-form-item>
          <el-form-item label="工友联系方式:" prop="tel">
            <p v-show="editArrayKey[0] == false" style="font-size: .12rem; position: relative;">{{editForm.tel}}<i
              class="el-icon-edit iconPos" @click="editNow(0)"></i><i class="el-icon-warning"
                                                                      v-show="editChangeArrayKey[0] == true"
                                                                      style="color: orange; position: absolute; right: .45rem;top: .13rem;"></i>
            </p>
            <el-input v-show="editArrayKey[0] == true" class="lookChildStyle" v-model="editForm.tel" size="small"
                      :autofocus="true" @blur="editBlur(0, 'tel')"></el-input>
          </el-form-item>
          <el-form-item label="紧急联系方式:" prop="emergencyContactTel">
            <p v-show="editArrayKey[1] === false" style="font-size: .12rem;  position: relative;">
              {{editForm.emergencyContactTel}}<i class="el-icon-edit iconPos" @click="editNow(1)"></i><i
              class="el-icon-warning" v-show="editChangeArrayKey[1] == true"
              style="color: orange; position: absolute; right: .45rem;top: .13rem;"></i></p>
            <el-input v-show="editArrayKey[1] == true" class="lookChildStyle" v-model="editForm.emergencyContactTel"
                      size="small" :autofocus="true" @blur="editBlur(1, 'emergencyContactTel')"></el-input>
          </el-form-item>
          <el-form-item label="工类工种:" prop="workTypeId">
            <p v-show="editArrayKey[2] == false" style="font-size: .12rem;">
              {{editForm.workerManWorkExtends[0].workClass.name}} - {{editForm.workerManWorkExtends[0].workType.name}}<i
              class="el-icon-edit iconPos" @click="editNow(2)"></i><i class="el-icon-warning"
                                                                      v-show="editChangeArrayKey[2] == true"
                                                                      style="color: orange; position: absolute; right: .45rem;top: .13rem;"></i>
            </p>
            <div v-show="editArrayKey[2] == true">
              <el-select style="width: 36%; margin-right: 1.5%;" size="small" v-model="editForm.workClassId"
                         @change="editChangeType">
                <el-option
                  v-for="item in workList"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
              -
              <el-select style="width: 36%;margin-left: 1.5%;" size="small" v-model="editWorkTypeId"
                         @change="typeChange" @blur="editBlur(2, 'workTypeId')">
                <el-option
                  v-for="item in workTypeList2"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </div>
          </el-form-item>
          <el-form-item label="血型:" prop="bloody">
            <p v-show="editArrayKey[3] == false" style="font-size: .12rem;position: relative;">
              {{editForm.bloody == 'other' ? '其他' : editForm.bloody}}<i class="el-icon-edit iconPos"
                                                                        @click="editNow(3)"></i><i
              class="el-icon-warning" v-show="editChangeArrayKey[3] == true"
              style="color: orange; position: absolute; right: .45rem;top: .13rem;"></i></p>
            <el-select v-show="editArrayKey[3] == true" size="small" style="width: 60%;" v-model="editForm.bloody"
                       @blur="editBlur(3, 'bloody')" @change="lookBloodyChange">
              <el-option
                v-for="item in bloodyArray"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="工资卡账号:" prop="bankAccount">
            <p v-show="editArrayKey[4] == false" style="font-size: .12rem;  position: relative;">
              {{editForm.bankAccount}}<i class="el-icon-edit iconPos" @click="editNow(4)"></i><i class="el-icon-warning"
                                                                                                 v-show="editChangeArrayKey[4] == true"
                                                                                                 style="color: orange; position: absolute; right: .45rem;top: .13rem;"></i>
            </p>
            <el-input v-show="editArrayKey[4] == true" class="lookChildStyle" v-model="editForm.bankAccount"
                      size="small" :autofocus="true" @blur="editBlur(4, 'bankAccount')"></el-input>
          </el-form-item>
          <el-form-item label="开户行地址:" prop="openAccountBank">
            <p v-show="editArrayKey[5] == false" style="font-size: .12rem;  position: relative;">
              {{editForm.openAccountBank}}<i class="el-icon-edit iconPos" @click="editNow(5)"></i><i
              class="el-icon-warning" v-show="editChangeArrayKey[5] == true"
              style="color: orange; position: absolute; right: .45rem;top: .13rem;"></i></p>
            <el-input v-show="editArrayKey[5] == true" class="lookChildStyle" v-model="editForm.openAccountBank"
                      size="small" :autofocus="true" @blur="editBlur(5, 'openAccountBank')"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button v-show="isDataHasChange == true" size="small" style="float: right; margin: .1rem .5rem .1rem 0;"
                       type="primary" @click.native="editBtn">保存
            </el-button>
          </el-form-item>
        </el-form>
        <div class="lookHeader" style="margin-top: .2rem;">评价星级</div>
        <el-form class="lookFormFindStyle" :model="editForm" label-width="1.3rem"
                 style="margin-bottom: .2rem;overflow: hidden; position: relative; background: #fff;" ref="editForm">
          <el-form-item label="评价星级:" prop="manSkillQualityScore" style="width: 65%;position: relative;">
            <el-rate style="position: absolute; top: .1rem;" :disabled="true" allow-half
                     v-model="editForm.manSkillQualityScore / 2"></el-rate>
            <span
              style="color: orange;position: absolute; left: 1.5rem; ">{{editForm.manSkillQualityScore ? editForm.manSkillQualityScore / 2 : 0}}</span>
          </el-form-item>
        </el-form>
      </div>
      <div style="width: calc(65% - .4rem);overflow: hidden; float: right; background: #fff; margin: .1rem 0 .2rem .01rem;">
        <div class="lookHeader">参建项目</div>
        <div style="margin: .2rem .15rem 0;">
          <el-table
            :data="proJectListData"
            border
            style="width: 100%; margin-bottom: .2rem;">
            <el-table-column
              label="项目名称"
              align="center">
              <template scope="scope">
                <span>{{ scope.row.project.name ? scope.row.project.name : ''}}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="所在班组"
              align="center">
              <template scope="scope">
                <span>{{ scope.row.reWorkerTeamAndProject ? scope.row.reWorkerTeamAndProject.workerTeam.name : ''}} </span>
              </template>
            </el-table-column>
            <el-table-column
              label="用工时间"
              align="center">
              <template scope="scope">
                <span>{{ scope.row.workerManInDate ? scope.row.workerManInDate : ''}} 至 {{ scope.row.workerManOutDate ? scope.row.workerManOutDate : '现在'}} </span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="操作" width="2rem">
              <template scope="scope">
                <el-button
                  type="text"
                  size="small"
                  @click="attendance(scope.row)">考勤
                </el-button>
                <el-button
                  type="text"
                  size="small"
                  @click="evaluate(scope.row)">评价
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <!--
            考勤
        -->
        <div style="background: #fff; border: 1px solid #eee; margin: 20px 15px 10px; padding: 10px;"
             v-show="attendanceName !== ''">
          <!--
              搜索框
          -->
          <div class="searchBox" style="font-size: 13px; min-width: 0;">
            <div style="margin: 10px 0 20px ;"><span>项目名称：  {{attendanceName}}</span></div>
            <div style="min-width: 600px; width: 80%; float: left;">
              <span>日期范围：</span>
              <el-date-picker
                size="small"
                v-model="beginData"
                type="month"
                :picker-options="pickerOptions"
                placeholder="选择月">
              </el-date-picker>
              <span style="width: 20px; margin: 0 20px;">至</span>
              <el-date-picker
                v-model="endData"
                type="month"
                size="small"
                :picker-options="pickerOptions1"
                placeholder="选择月">
              </el-date-picker>
            </div>
            <el-button style="float: right;margin-right: 10px;" type="primary" size="small" icon="el-icon-search"
                       @click='searchAttendance'>搜索
            </el-button>
          </div>

          <!--
              列表
          -->
          <el-table
            class="table"
            :data="attendanceListData"
            border
            :loading="attendanceLoading">
            <el-table-column
              label="月份"
              :show-overflow-tooltip="true"
              align="center">
              <template scope="scope">
                <span @click="attendanceLookThis(scope.row)"
                      style="color: #409EFF; width:100%; height: 100%; display: block; cursor: pointer;">{{ scope.row.yearMonth ? scope.row.yearMonth : ''}}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="班组"
              :show-overflow-tooltip="true"
              align="center">
              <template scope="scope">
                <span>{{ scope.row.teamName ? scope.row.teamName : ''}}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="劳务公司"
              :show-overflow-tooltip="true"
              align="center">
              <template scope="scope">
                <span>{{ scope.row.laborName ? scope.row.laborName : ''}}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="出勤天数"
              :show-overflow-tooltip="true"
              align="center">
              <template scope="scope">
                <span>{{ scope.row.attendanceDays ? scope.row.attendanceDays : ''}}</span>
              </template>
            </el-table-column>
            <el-table-column>
              label="总工时"
              :show-overflow-tooltip="true"
              align="center">
              <template scope="scope">
                <span>{{ scope.row.totalWorkingTime ? scope.row.totalWorkingTime : ''}}</span>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>

    <!--
       查看考勤详情
    -->
    <el-dialog :close-on-press-escape="false" style="z-index: 9999;" top="50px" title="工友考勤详情"
               :visible.sync="steamVisible" width="70%" :close-on-click-modal="false">
      <ul style="overflow: hidden;line-height: 40px;">
        <li style="float: left;width: 33%;">
          <p style="float: left;width:100px;">工友姓名：</p>
          <p style="float: left;width:calc(100% - 110px);padding-left: 10px;">{{steamMsg.workerName}}</p>
        </li>
        <li style="float: left;width: 33%;">
          <p style="float: left;text-align: right;width:100px;">月份：</p>
          <p style="float: left;width:calc(100% - 110px);padding-left: 10px;">{{steamMsg.yearMonth}}</p>
        </li>

      </ul>
      <ul style="overflow: hidden;line-height: 40px;">
        <li style="float: left;width: 39%;">
          <p style="float: left;width:80px;">出勤天数：</p>
          <p style="float: left;width:calc(100% - 90px);padding-left: 10px;">{{steamMsg.attendanceDays}}</p>
        </li>
        <!--<li style="float: left;width: 17.5%;">-->
        <!--<p style="float: left;text-align: right;width:80px;">迟到次数：</p>-->
        <!--<p style="float: left;width:calc(100% - 90px);padding-left: 10px;">{{steamMsg.lateTimes}}</p>-->
        <!--</li>-->
        <!--<li style="float: left;width: 15%;">-->
        <!--<p style="float: left;text-align: right;width:80px;">早退次数：</p>-->
        <!--<p style="float: left;width:calc(100% - 90px);padding-left: 10px;">{{steamMsg.tardyTimes}}</p>-->
        <!--</li>-->
        <li style="float: left;width: 33%;">
          <p style="float: left;text-align: right;width:85px;">工作总工时：</p>
          <p style="float: left;width:calc(100% - 95px);padding-left: 10px;">{{steamMsg.totalWorkingTime}}</p>
        </li>
        <!--<li style="float: left;width: 30%;">-->
        <!--<p style="float: left;text-align: right;width:120px;">迟到早退总工时：</p>-->
        <!--<p style="float: left;width:calc(100% - 130px);padding-left: 10px;">{{steamMsg.lateTotalTime}}</p>-->
        <!--</li>-->
        <el-button style="position: absolute; right: 20px; top: 100px;" type="primary" size="small"
                   icon="el-icon-search" @click="getExcel">导出Excel
        </el-button>
      </ul>
      <el-table
        :data="worktableData"
        :loading="teamloading"
        border
        class="attendWorker"
        style="width: 100%">
        <el-table-column label="日期" align="center">
          <template scope="scope">
            <p>{{ scope.row.recordDT}}</p>
          </template>
        </el-table-column>
        <el-table-column label="班组" align="center">
          <template scope="scope">
            <p>{{ scope.row.teamName}}</p>
          </template>
        </el-table-column>
        <el-table-column align="center" label="劳务公司">
          <template scope="scope">
            <p>{{ scope.row.laborName}}</p>
          </template>
        </el-table-column>
        <el-table-column
          label="打卡时间" align="center">
          <template scope="scope">
            <p v-for="item in scope.row.newData">{{item}}</p>
          </template>
        </el-table-column>
        <el-table-column
          label="工时" align="center">
          <template scope="scope">
            <p>{{ scope.row.workingHours }}</p>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button size="medium" @click.native="steamVisible=false">关闭</el-button>
      </div>
    </el-dialog>
    <!--
        工友评价
    -->
    <el-dialog :close-on-press-escape="false" title="参建项目" :visible.sync="projectVisible"
               :before-close="lookCanclByThis" :close-on-click-modal="false">
      <div style="overflow: hidden; width: 100%; height: .4rem;">
        <p style="float: left; margin-right: .1rem;">参建项目:</p>
        <p style="float: left;">{{evaluateData.project ? evaluateData.project.name : ''}}</p>
      </div>
      <div style="overflow: hidden; width: 100%; height: .4rem;">
        <p style="float: left; margin-right: .1rem;">项目评价:</p>
        <p style="float: left; width: 3rem; height: 100%; position: relative; overflow: hidden;">
          <el-rate style="position: absolute; top: 2px;" :disabled="true" allow-half
                   v-model="evaluateData.manSkillQualityScore / 2"></el-rate>
        </p>
        <span
          style="color: orange;position: absolute; left: 2.4rem; font-size: .14rem;">{{evaluateData.manSkillQualityScore !== -1 ? evaluateData.manSkillQualityScore / 2 : 0}}</span>
      </div>
      <div slot="footer" class="dialog-footer">
        <template>
          <el-table
            :data="badRecordData"
            border
            style="width: 100%; margin-bottom: .2rem;">
            <el-table-column
              label="不良记录类型"
              align="center">
              <template scope="scope">
                <span>{{ scope.row.name ? scope.row.name : ''}}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="备注"
              align="center">
              <template scope="scope">
                <span>{{ scope.row.note ? scope.row.note : ''}} </span>
              </template>
            </el-table-column>
            <el-table-column
              label="退场日期"
              align="center">
              <template scope="scope">
                <span>{{ scope.row.outDate ? scope.row.outDate : ''}} </span>
              </template>
            </el-table-column>
          </el-table>
        </template>
        <div slot="footer" class="dialog-footer">
          <el-button size="medium" @click.native="lookCanclByThis">关闭</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import {
    queryWorkerTail,
    getBadRecord,
    WorkerList,
    getWorkerList,
    getWorkerInfo,
    getRecruitWorkerList,
    WorkerProList,
    getCardData,
    checkIdcard,
    checkWorkerPhone,
    upFileDo,
    addWorker,
    updateMan
  } from '../../api/api';
  import {
    getWorkerCount,
    workerTail,
    correctPre,
    correct,
    findManByProjectIdAndKey,
    getWorkTimeByProjectIdAndWorkerManId
  } from '../../api/projectapi';
  import myCallback from "../../../static/common/callback"

  export default {
    data() {
      // 校验身份证
      var validateIdcard = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入15位或者18位身份证号！'));
        } else {
          var parmas = {
            'idCardNo': value
          }
          checkIdcard(parmas).then((res) => {
            if (res.data.code == 0) {
              this.addForm.birthDate = res.data.msg;
              callback();
            } else {
              callback(new Error(res.data.msg));
            }
          })
        }
      };
      // 编辑校验身份证
      var validateIdcardedit = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入15位或者18位身份证号！'));
        } else {
          var parmas = {
            'idCardNo': value,
            'workerManId': this.thisNowEditId
          }
          checkIdcard(parmas).then((res) => {
            if (res.data.code == 0) {
              this.editForm.birthDate = res.data.msg;
              callback();
            } else {
              callback(new Error(res.data.msg));
            }
          })
        }
      };
      // 校验手机
      var validatePhone = (rule, value, callback) => {
        var reg = /^[1]\d{10}$/;
        if (!reg.test(value)) {
          callback(new Error('请输入11位手机号！'));
        } else {
          var parmas = {
            tel: value
          }
          checkWorkerPhone(parmas).then((res) => {
            if (res.data.code == 0) {
              callback()
            } else {
              callback(new Error(res.data.msg));
            }
          })
        }
      };
      // 编校验手机
      var validateEdPhone = (rule, value, callback) => {
        var reg = /^[1]\d{10}$/;
        if (!reg.test(value)) {
          callback(new Error('请输入11位手机号！'));
        } else {
          var parmas = {
            tel: value,
            id: this.editForm.id
          }
          checkWorkerPhone(parmas).then((res) => {
            if (res.data.code == 0) {
              callback()
            } else {
              callback(new Error(res.data.msg));
            }
          })
        }
      };
      // 姓名
      var validName = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入姓名！'));
        } else if (!/^[^\s]+$/.test(value)) {
          callback(new Error('姓名不能带有空格！'));
        } else {
          callback()
        }
      };
      // 民族
      var validNation = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入民族！'));
        } else if (!/^[^\s]+$/.test(value)) {
          callback(new Error('民族不能带有空格！'));
        } else {
          callback()
        }
      };
      // 住址
      var validAddress = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入住址！'));
        } else if (!/^[^\s]+$/.test(value)) {
          callback(new Error('住址不能带有空格！'));
        } else {
          callback()
        }
      };
      return {
        // 加载
        teamloading: true,
        // 开关
        addLoading: false,

        // 列表
        typeOfPage: 0,

        lookVisible: false,

        // 获取身份证开关
        cardBok: false,

        // 显示
        projectVisible: false,
        proJectListData: [],

        // 列表页数据
        listData: [],
        currentPage: 1,
        totalNum: 0,
        pageSize: 10,
        thisNowPage: 1,
        loading: true,

        // 搜索数据
        // 搜索数据
        name: '',
        sex: '',
        ageA: '',
        ageB: '',
        tel: '',
        workerManState: '',
        workClassId: '',
        workTypeId: '',

        imgX: '',
        imgY: '',
        imgW: '',
        imgH: '',

        // 性别列表
        sexArr: [{
          value: '',
          label: '不限'
        }, {
          value: '1',
          label: '男'
        }, {
          value: '0',
          label: '女'
        }],
        sexArrAdd: [{
          value: 1,
          label: '男'
        }, {
          value: 0,
          label: '女'
        }],
        // 血型
        bloodyArray: [{
          value: 'A',
          label: 'A型'
        }, {
          value: 'B',
          label: 'B型'
        }, {
          value: 'AB',
          label: 'AB型'
        }, {
          value: 'O',
          label: 'O型'
        }, {
          value: 'other',
          label: '其他'
        }],
        // 工种状态
        workerTypeList: [{
          value: '',
          label: '不限'
        }, {
          value: '0',
          label: '空闲'
        }, {
          value: '1',
          label: '开工'
        }],
        // 工类列表
        workList: [],
        // 工种列表
        workTypeList: [],
        // 班组列表
        workerTeamListData: [],

        workTypeList1: [],

        // 提交表单
        addVisible: false,
        addForm: {
          name: '',
          sex: '',
          nation: '',
          birthDate: '',
          address: '',
          idCardNo: '',
          idCardOrg: '',
          isSuedData: '',
          idCardValidata: '',
          imgBase: '../../../static/img/img.jpg'
        },
        addFormRules: {
          name: [
            {required: true, validator: validName, trigger: 'blur'},
            {min: 1, max: 15, message: '姓名最大长度不能超过15个字符', trigger: 'blur'}
          ],
          sex: [
            {required: true, message: '请选择性别', trigger: 'change'}
          ],
          nation: [
            {required: true, validator: validNation, trigger: 'blur'},
            {min: 1, max: 10, message: '民族最大长度不能超过10个字符', trigger: 'blur'}
          ],
          birthDate: [
            {required: true, message: '请选择出生日期', trigger: 'change'}
          ],
          address: [
            {required: true, validator: validAddress, trigger: 'blur'},
            {min: 1, max: 50, message: '住址最大长度不能超过50个字符', trigger: 'blur'}
          ],
          idCardNo: [
            {required: true, validator: validateIdcard, trigger: 'blur'},
            {min: 1, max: 18, message: '身份证号最大长度不能超过18个字符', trigger: 'blur'}
          ],
          idCardOrg: [
            {min: 1, max: 50, message: '签发机关最大长度不能超过50个字符', trigger: 'blur'}
          ]
        },

        addForm2: {
          tel: '',
          workClassId: '',
          workTypeId: '',
          emergencyContactTel: '',
          bankAccount: '',
          openAccountBank: ''
        },
        addFormRules2: {
          tel: [
            {min: 1, max: 11, message: '电话号码最大长度不能超过18个字符', trigger: 'blur'}
          ],
          workTypeId: [
            {required: true, message: '请选择工类工种', trigger: 'blur'}
          ],
          emergencyContactTel: [
            {min: 1, max: 11, message: '紧急联系方式最大长度不能超过11个字符', trigger: 'blur'}
          ],
          bankAccount: [
            {min: 1, max: 19, message: '工资卡账号最大长度不能超过19个字符', trigger: 'blur'}
          ],
          openAccountBank: [
            {min: 1, max: 50, message: '开户行地址最大长度不能超过50个字符', trigger: 'blur'}
          ]
        },
        active: 0,
        show: false,
        thisNowEditId: '',
        workTypeList2: [],
        editVisible: false,
        // 修改弹出层数据
        editForm: {
          name: '',
          sex: '',
          idCardNo: '',
          nation: '',
          birthDate: '',
          address: '',
          idCardOrg: '',
          isSuedData: '',
          idCardValidata: '',
          idCardPhotoId: '',
          tel: '',
          workClassId: '',
          workTypeId: '',
          emergencyContactTel: '',
          bloody: '',
          workerTeamId: '',
          bankAccount: '',
          openAccountBank: '',
          nativePlace: '',
          manSkillQualityScore: '',
          workerManWorkExtends: [{
            'workClass': {
              name: ''
            },
            'workType': {
              name: ''
            }
          }]
        },
        editWorkTypeId: '',
        editFormRules: {
          name: [
            {required: true, validator: validName, trigger: 'blur'},
            {min: 1, max: 15, message: '姓名最大长度不能超过15个字符', trigger: 'blur'}
          ],
          sex: [
            {required: true, message: '请选择性别', trigger: 'change'}
          ],
          nation: [
            {required: true, validator: validNation, trigger: 'blur'},
            {min: 1, max: 10, message: '民族最大长度不能超过10个字符', trigger: 'blur'}
          ],
          birthDate: [
            {required: true, message: '请选择出生日期', trigger: 'change'}
          ],
          address: [
            {required: true, validator: validAddress, trigger: 'blur'},
            {min: 1, max: 50, message: '住址最大长度不能超过50个字符', trigger: 'blur'}
          ],
          idCardNo: [
            {required: true, validator: validateIdcardedit, trigger: 'blur'},
            {min: 1, max: 18, message: '身份证号最大长度不能超过18个字符', trigger: 'blur'}
          ],
          idCardOrg: [
            {min: 1, max: 50, message: '签发机关最大长度不能超过50个字符', trigger: 'blur'}
          ],
//                    tel: [
//                        {validator: validateEdPhone  , trigger: 'blur'}
//                    ],
          workTypeId: [
            {required: true, message: '请选择工类工种', trigger: 'blur'}
          ],
          idCardOrg: [
            {min: 1, max: 50, message: '签发机关最大长度不能超过50个字符', trigger: 'blur'}
          ],
          bankAccount: [
            {min: 1, max: 19, message: '工资卡账号最大长度不能超过19个字符', trigger: 'blur'}
          ],
          openAccountBank: [
            {min: 1, max: 50, message: '开户行地址最大长度不能超过50个字符', trigger: 'blur'}
          ],
          emergencyContactTel: [
            {min: 1, max: 11, message: '紧急联系方式最大长度不能超过11个字符', trigger: 'blur'}
          ]
        },

        // 编辑开关数组
        editArrayKey: [false, false, false, false, false, false],
        editChangeArrayKey: [false, false, false, false, false, false],
        // 未被更改的数据
        earlyData: '',
        // 被更改的开关
        isDataHasChange: false,

        // 不良记录表
        badRecordData: [],

        // 考勤
        thisData: [],
        nowData: '',
        // 限制日期
        beginData: new Date(),
        endData: new Date(),
        pickerOptions: {
          disabledDate: (time) => {
            var N1 = this.endData.getYear();
            var Y1 = this.endData.getMonth();
            var N2 = time.getYear();
            var Y2 = time.getMonth();
            var number = (N1 - N2) * 12 + (Y1 - Y2)
            return number >= 36 || number < 0;
          }
        },
        pickerOptions1: {
          disabledDate: (time) => {
            const start = new Date();
            return time.getTime() > start.getTime();
          }
        },

        // 页面
        attendanceListData: [],
        attendanceLoading: true,
        // 查看考勤时候的项目名
        attendanceName: '',
        // 考勤现在工友iD
        attendanceWorkerId: '',
        // 考勤现在项目id
        attendanceProjectId: '',
        //班组详细考勤
        worktableData: [],
        steamMsg: {},
        steamVisible: false,
        // 评价数据
        evaluateData: []
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
          var parmas = {
            'search.unitId': this.companyId,
            'search.name': this.name,
            'search.sex': this.sex,
            'search.minAge': this.ageA,
            'search.maxAge': this.ageB,
            'search.tel': this.tel,
            'search.workerManState': this.workerManState,
            'search.workClassId': this.workClassId,
            'search.workTypeId': this.workTypeId,
            'pageNo': this.thisNowPage,
            'pageSize': this.pagesize
          }
          this.loading = true;
          this.getList(parmas);
        },
        deep: true
      },
    },
    mounted() {
      if (window.localStorage.getItem('typeOfPagea')) {
        this.typeOfPage = window.localStorage.getItem('typeOfPagea');
      }
      this.$root.eventHub.$on('changeState', value => {
        this.typeOfPage = value;
      })
      this.getAllWorkerType();
      this.companyId = this.project.projectId;
      var parmas = {
        'search.unitId': this.companyId,
        'search.name': this.name,
        'search.sex': this.sex,
        'search.minAge': this.ageA,
        'search.maxAge': this.ageB,
        'search.tel': this.tel,
        'search.workerManState': this.workerManState,
        'search.workClassId': this.workClassId,
        'search.workTypeId': this.workTypeId,
        'pageNo': this.thisNowPage,
        'pageSize': this.pagesize
      }
      this.loading = true;
      this.getList(parmas);
    },
    methods: {

      // 考勤
      attendance(row) {
        this.attendanceName = row.project.name;
        this.attendanceWorkerId = row.workerManId;
        this.attendanceProjectId = row.projectId;
        this.attendanceListData = '';
        this.attendanceLoading = true;
      },
      // 考勤搜索
      searchAttendance() {
        if (this.beginData == null) {
          this.$notify.error({
            message: '开始月份不能为空',
            offset: 100
          });
          return;
        }
        if (this.beginData) {
          var oBeginDate = this.beginData.getMonth() + 1;
          if (oBeginDate < 10) {
            oBeginDate = (this.beginData.getYear() + 1900) + '-' + '0' + oBeginDate;
          } else {
            oBeginDate = (this.beginData.getYear() + 1900) + '-' + oBeginDate;
          }
        }
        if (this.endData) {
          var oEndDate = this.endData.getMonth() + 1;
          if (oEndDate < 10) {
            oEndDate = (this.endData.getYear() + 1900) + '-' + '0' + oEndDate;
          } else {
            oEndDate = (this.endData.getYear() + 1900) + '-' + oEndDate;
          }
        }
        let parmas = {
          projectId: this.attendanceProjectId,
          workerId: this.attendanceWorkerId,
          begin: oBeginDate,
          end: oEndDate
        }
        getWorkerCount(parmas).then((res) => {
          if (res.data.code == 0) {
            this.attendanceListData = res.data.data;
          } else {
            myCallback.call(this, res);
            // this.$notify.error({
            //   title: '失败',
            //   message: res.data.msg,
            //   offset: 100
            // });
          }
          this.attendanceLoading = false;
        })
      },
      // 查看当前详情
      attendanceLookThis(item) {
        this.steamMsg = item;
        var data = {
          projectId: item.projectId,
          laborId: item.laborId,
          teamId: item.teamId,
          workerId: item.workerId,
          yyyymm: item.yearMonth + '-01',
        }
        this.steamVisible = true;
        this.teamloading = true;
        workerTail(data).then((res) => {
          if (res.data.code == 0) {
            this.worktableData = res.data.data;
            this.teamloading = false;
          } else {
            this.teamloading = false;
            myCallback.call(this, res);
            // this.$notify.error({
            //   title: '失败',
            //   message: res.data.msg,
            //   offset: 100
            // });
          }
        })
      },
      // 评价
      evaluate(value) {
        this.projectVisible = true;
        if (value.badRecord) {
          this.badRecordData = [
            {
              name: value.badRecord.name,
              note: value.manBadRecordComment,
              outDate: value.workerManOutDate
            }
          ]
        } else {
          this.badRecordData = []
        }
        ;
        this.evaluateData = value;
        getBadRecord()
      },
      // 修改血型
      lookBloodyChange() {
        this.$set(this.editChangeArrayKey, 3, true);
        this.isDataHasChange = true;
      },

      // 当前失去焦点
      editBlur(key, value) {
        this.editArrayKey[key] = !this.editArrayKey[key];
        this.$set(this.editArrayKey, key, this.editArrayKey[key]);
        if (this.editForm[value] !== this.earlyData[value]) {
          this.isDataHasChange = true;
          this.$set(this.editChangeArrayKey, key, true);
        }
      },
      // 编辑当前
      editNow(key) {
        this.editArrayKey[key] = !this.editArrayKey[key];
        this.$set(this.editArrayKey, key, this.editArrayKey[key])
      },
      //解决远程搜索IE兼容问题
      removeReadOnly(e) {
        e.target.readOnly = false;
      },

      // 远程搜索
      companyChange(val) {
        var reg = new RegExp("[\\u4E00-\\u9FFF]+", "g");
        if (reg.test(val)) {
          if (val.length < 2) {
            this.addLoading = true;
            this.workerTeamListData = [];
          } else {
            var parmas = {
              pageNo: 1,
              pageSize: 20,
              'search.key': val
            }
            queryWorkerTail(parmas).then((res) => {
              this.addLoading = false;
              if (res.data.code == 0) {
                this.workerTeamListData = res.data.data;
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
            this.workerTeamListData = [];
          } else {
            var parmas = {
              pageNo: 1,
              pageSize: 20,
              'search.key': val
            }
            queryWorkerTail(parmas).then((res) => {
              this.addLoading = false;
              if (res.data.code == 0) {
                this.workerTeamListData = res.data.data;
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
      // 下载附件
      downloadFile() {
        window.open('../../../static/身份证读卡器驱动和证书.zip', '下载附件')
      },

      editChangeType(val) {
        var parmas = {
          workClassId: val
        };
        for (var i = 0; i < this.workList.length; i++) {
          if (this.workList[i].id == val) {
            this.editForm.workerManWorkExtends[0].workClass.name = this.workList[i].name;
          }
        }
        this.editForm.workTypeId = '';
        this.editWorkTypeId = '';
        getRecruitWorkerList(parmas).then((res) => {
          this.workTypeList2 = res.data.data;
        })
      },
      typeChange(val) {
        this.editForm.workTypeId = val;
        this.$set(this.editChangeArrayKey, 2, true);
        this.isDataHasChange = true;
        for (var i = 0; i < this.workTypeList2.length; i++) {
          if (this.workTypeList2[i].id == val) {
            this.editForm.workerManWorkExtends[0].workType.name = this.workTypeList2[i].name;
          }
        }
      },
      editBtn() {
        this.$refs.editForm.validate((valid) => {
          if (valid) {
            var parmas = {
              id: this.thisNowEditId,
              name: this.editForm.name,
              sex: this.editForm.sex,
              idCardNo: this.editForm.idCardNo,
              nation: this.editForm.nation,
              birthDate: this.editForm.birthDate,
              address: this.editForm.address,
              idCardOrg: this.editForm.idCardOrg,
              isSuedData: this.editForm.isSuedData,
              idCardValidata: this.editForm.idCardValidata,
              idCardPhotoId: this.editForm.idCardPhotoId,
              tel: this.editForm.tel,
              'workEx.workClassId': this.editForm.workClassId,
              'workEx.workTypeId': this.editForm.workTypeId,
              emergencyContactTel: this.editForm.emergencyContactTel,
              bloody: this.editForm.bloody,
              workerTeamId: this.editForm.workerTeamId,
              bankAccount: this.editForm.bankAccount,
              openAccountBank: this.editForm.openAccountBank,
              idCardPhotoPath: this.editForm.idCardPhotoPath
            }
            let num = 0;
            for (var i = 0; i < this.editChangeArrayKey.length; i++) {
              if (this.editChangeArrayKey[i] == true) {
                num++;
              }
            }
            this.$confirm('您有' + num + '项更改，是否确定更改?', '提示', {
              type: 'warning'
            }).then(() => {
              updateMan(parmas).then((res) => {
                if (res.data.code == 0) {
                  var parmas = {
                    'search.unitId': this.companyId,
                    'search.name': this.name,
                    'search.sex': this.sex,
                    'search.minAge': this.ageA,
                    'search.maxAge': this.ageB,
                    'search.tel': this.tel,
                    'search.workerManState': this.workerManState,
                    'search.workClassId': this.workClassId,
                    'search.workTypeId': this.workTypeId,
                    'pageNo': this.thisNowPage,
                    'pageSize': this.pagesize
                  }
                  this.loading = true;
                  myCallback.call(this, res);
                  // this.$notify.success({
                  //   title: '修改工友成功',
                  //   // message: res.data.msg,
                  //   // offset: 100
                  //   duration:1000
                  // });
                  for (var i = 0; i < this.editArrayKey.length; i++) {
                    this.$set(this.editChangeArrayKey, i, false);
                    this.$set(this.editArrayKey, i, false);
                  }
                  this.isDataHasChange = false;
                  this.getList(parmas);
                } else {
                  myCallback.call(this, res);
                  // this.$notify.error({
                  //   title: '修改工友失败',
                  //   message: res.data.msg,
                  //   offset: 100
                  // });
                  this.isDataHasChange = true;
                }
              })
            }).catch(() => {

            });
          }
        });
      },
      editCancelBtn() {
        this.editVisible = false;
        this.editForm.imgBase = '';
        this.editForm.idCardPhotoPath = '';
        this.editForm.birthDate = '';
        this.editForm.workClassId = '';
        this.$refs['editForm'].resetFields();
      },
      // 添加工友
      add() {
        this.$refs.addForm2.validate((valid) => {
          if (valid) {
//                        if(this.addForm2.tel==this.addForm2.emergencyContactTel){
//                            this.$message({
//                                type: 'warning',
//                                message: '联系电话与紧急联系人联系方式重复!'
//                            });
//                            return;
//                        }
//                        if(this.addForm2.bankAccount !== '') {
//                            var reg =  /^([1-9]{1})(\d{14}|\d{18})$/;
//                            if(!reg.test(this.addForm2.bankAccount)) {
//                                this.$message({
//                                    type: 'warning',
//                                    message: '请输入正确的银行卡号!'
//                                });
//                                return;
//                            }
//                        }
            var parmas = {
              name: this.addForm.name,
              sex: this.addForm.sex,
              idCardNo: this.addForm.idCardNo,
              nation: this.addForm.nation,
              birthDate: this.addForm.birthDate,
              address: this.addForm.address,
              idCardOrg: this.addForm.idCardOrg,
              isSuedData: this.addForm.isSuedData,
              idCardValidata: this.addForm.idCardValidata,
              idCardPhotoId: this.addForm.idCardPhotoId,
              tel: this.addForm2.tel,
              'workEx.workClassId': this.addForm2.workClassId,
              'workEx.workTypeId': this.addForm2.workTypeId,
              emergencyContactTel: this.addForm2.emergencyContactTel,
              bloody: this.addForm2.bloody,
              workerTeamId: this.addForm2.workerTeamId,
              bankAccount: this.addForm2.bankAccount,
              openAccountBank: this.addForm2.openAccountBank,
              idCardPhotoPath: this.addForm.idCardPhotoPath
            }
            this.addVisible = false;
            this.$refs['addForm'].resetFields();
            this.$refs['addForm2'].resetFields();
            this.addForm.imgBase = '../../../static/img/img.jpg';
            this.addForm.idCardPhotoPath = '';
            this.addForm2.workClassId = '';
            this.addForm.birthDate = '';
            this.active = 0;
            addWorker(parmas).then((res) => {
              if (res.data.code == 0) {
                var parmas = {
                  'search.unitId': this.companyId,
                  'search.name': this.name,
                  'search.sex': this.sex,
                  'search.minAge': this.ageA,
                  'search.maxAge': this.ageB,
                  'search.tel': this.tel,
                  'search.workerManState': this.workerManState,
                  'search.workClassId': this.workClassId,
                  'search.workTypeId': this.workTypeId,
                  'pageNo': this.thisNowPage,
                  'pageSize': this.pagesize
                };
                myCallback.call(this, res);
                // this.$notify.success({
                //   title: '添加工友成功',
                //   // message: res.data.msg,
                //   // offset: 100,
                //   duration:1000
                // });
                this.loading = true;
                this.getList(parmas);
              } else {
                myCallback.call(this, res);
                // this.$notify.error({
                //   title: '添加工友失败',
                //   message: res.data.msg,
                //   offset: 100
                // });
              }
            })
          }
        });
      },
      addCencel() {
        this.addVisible = false;
        this.$refs['addForm'].resetFields();
        this.$refs['addForm2'].resetFields();
        this.addForm.imgBase = '../../../static/img/img.jpg';
        this.addForm2.workClassId = '';
        this.addForm.idCardPhotoPath = '';
        this.active = 0;
        this.addForm.birthDate = '';
      },
      // 下一步
      next() {
        if (this.active == 0) {
          this.$refs.addForm.validate((valid) => {
            if (valid) {
              var reg = /^[\u2E80-\u9FFF]+$/;
              if (!reg.test(this.addForm.nation)) {
                // this.$message({
                //   type: 'warning',
                //   message: '请输入正确的民族!'
                // });
                this.$notify.warning({
                  title: '民族!',
                  message: '请输入正确的民族',
                  // offset: 100
                });
                return;
              }
              this.active = 1;
            }
          });
        }
      },
      // 上一步
      prevClick(val) {
        this.active = val - 1;
      },
      // 读卡器
      getCardData() {
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

        var request = createCORS('get', 'https://127.0.0.1:24011/ZKIDROnline/ScanReadIdCardInfo?OP-DEV=1&CMD-URL=4&REPEAT=1?' + Math.random());
        if (request) {
          request.onload = function () {
            _this.cardBok = false;
            var data = eval('(' + request.response + ')').Certificate;
            if (data) {
              _this.addForm.name = data.Name;
              var parmas = {
                imgStr: data.Base64Photo
              }
              upFileDo(parmas).then((res) => {
                _this.addForm.idCardPhotoPath = res.data.data;
              })
              if (data.Sex === '男') {
                _this.addForm.sex = 1;
              } else if (data.Sex === '女') {
                _this.addForm.sex = 0;
              }
              _this.addForm.nation = data.Nation;
              _this.addForm.birthDate = data.Birthday;
              _this.addForm.address = data.Address;
              _this.addForm.idCardNo = data.IDNumber;
              _this.addForm.idCardOrg = data.IDIssued;
              _this.addForm.isSuedData = data.IssuedData;
              if (data.ValidDate == '长期') {
                _this.addForm.idCardValidata = '2099-12-31'
              } else {
                _this.addForm.idCardValidata = data.ValidDate;
              }
              _this.addForm.imgBase = 'data:image/jpg;base64,' + data.Base64Photo;
            } else {
              _this.$notify.error({
                title: '读取信息失败',
                message: '请查看读卡器是否链接，或联系管理员',
                offset: 100
              });
            }
          }
          request.send();
        } else {
          this.cardBok = false;
          this.$notify.error({
            title: '读取信息失败',
            message: '请查看读卡器是否链接，或联系管理员',
            offset: 100
          });
          console.log('goHere')
        }
        ;
      },
      // 编辑读卡器
      editCardData() {
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

        var request = createCORS('get', 'https://127.0.0.1:24011/ZKIDROnline/ScanReadIdCardInfo?OP-DEV=1&CMD-URL=4&REPEAT=1?' + Math.random());
        if (request) {
          request.onload = function () {
            _this.cardBok = false;
            var data = eval('(' + request.response + ')').Certificate;
            if (data) {
              _this.editForm.name = data.Name;
              var parmas = {
                imgStr: data.Base64Photo
              }
              upFileDo(parmas).then((res) => {
                _this.editForm.idCardPhotoPath = res.data.data;
              })
              if (data.Sex === '男') {
                _this.editForm.sex = 1;
              } else if (data.Sex === '女') {
                _this.editForm.sex = 0;
              }
              _this.editForm.nation = data.Nation;
              _this.editForm.birthDate = data.Birthday;
              _this.editForm.address = data.Address;
              _this.editForm.idCardNo = data.IDNumber;
              _this.editForm.idCardOrg = data.IDIssued;
              _this.editForm.isSuedData = data.IssuedData;
              _this.editForm.idCardValidata = data.ValidDate;
              _this.editForm.imgBase = 'data:image/jpg;base64,' + data.Base64Photo;
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
      // 添加
      clickAdd() {
        this.addVisible = true;
      },

      // 列表
      // 时间戳序列号
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
      // 列表
      getList(val) {
        WorkerList(val).then((res) => {
          if (!res) {
            return;
          }
          if (res.data.code == 0) {
            this.loading = false;
            this.listData = res.data.data.list;
            for (var i = 0; i < this.listData.length; i++) {
              if (this.listData[i] !== '') {
                this.listData[i].opAt = this.getMyDate(this.listData[i].opAt * 1000).substr(0, 10);
                if (this.listData[i].sex == 1) {
                  this.listData[i].sex = '男';
                } else {
                  this.listData[i].sex = '女';
                }
              }
            }
            this.currentPage = res.data.data.pageNo;
            this.totalNum = res.data.data.totalCount;
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
        };
        this.workTypeId = '';
        getRecruitWorkerList(parmas).then((res) => {
          this.workTypeList = res.data.data;
        })
      },
      addChangeType(val) {
        var parmas = {
          workClassId: val
        };
        this.addForm2.workTypeId = '';
        getRecruitWorkerList(parmas).then((res) => {
          this.workTypeList1 = res.data.data;
        })
      },
      // 搜索
      search() {
        this.thisNowPage = 1;
        var parmas = {
          'search.unitId': this.companyId,
          'search.name': this.name,
          'search.sex': this.sex,
          'search.minAge': this.ageA,
          'search.maxAge': this.ageB,
          'search.tel': this.tel,
          'search.workerManState': this.workerManState,
          'search.workClassId': this.workClassId,
          'search.workTypeId': this.workTypeId,
          'pageNo': this.thisNowPage,
          'pageSize': this.pagesize
        }
        this.loading = true;
        this.getList(parmas);
      },
      // 清空
      clear() {
        this.name = '';
        this.sex = '';
        this.ageA = '';
        this.ageB = '';
        this.tel = '';
        this.workerManState = '';
        this.workClassId = '';
        this.workTypeId = '';
      },
      // 列表页数更改
      handleCurrentChange(val) {
        this.thisNowPage = val;
        this.loading = true;
        var parmas = {
          'search.unitId': this.companyId,
          'search.name': this.name,
          'search.sex': this.sex,
          'search.minAge': this.ageA,
          'search.maxAge': this.ageB,
          'search.tel': this.tel,
          'search.workerManState': this.workerManState,
          'search.workClassId': this.workClassId,
          'search.workTypeId': this.workTypeId,
          'pageNo': this.thisNowPage,
          'pageSize': this.pagesize
        }
        this.getList(parmas);
      },
      // 条数更改
      handleSizeChange(val) {
        this.pagesize = val;
        this.loading = true;
        var parmas = {
          'search.unitId': this.companyId,
          'search.name': this.name,
          'search.sex': this.sex,
          'search.minAge': this.ageA,
          'search.maxAge': this.ageB,
          'search.tel': this.tel,
          'search.workerManState': this.workerManState,
          'search.workClassId': this.workClassId,
          'search.workTypeId': this.workTypeId,
          'pageNo': this.thisNowPage,
          'pageSize': this.pagesize
        }
        this.getList(parmas);
      },
      lookCanclByThis() {
        this.projectVisible = false;
        this.evaluateData = [];
      },

      lookThis(row) {
        this.workerTeamListData = [];
        this.attendanceListData = [];
        this.steamMsg = [];
        var parmas = {
          workerManId: row.id
        }
        WorkerProList(parmas).then((res) => {
          this.proJectListData = res.data.data;
        })
        this.thisNowEditId = row.id;
        getWorkerInfo(parmas).then((res) => {
          this.editForm = Object.assign({}, res.data.data);
          this.earlyData = Object.assign({}, res.data.data);
          let teamName = '';
          if (this.editForm.workerTeam) {
            teamName = this.editForm.workerTeam.name;
          } else {
            teamName = ' ';
          }

          this.workerTeamListData = [{
            name: teamName,
            id: this.editForm.workerTeamId
          }];
          this.editForm.workClassId = this.editForm.workerManWorkExtends[0].workClassId;
          this.editWorkTypeId = this.editForm.workerManWorkExtends[0].workTypeId;
          this.editForm.workTypeId = this.editForm.workerManWorkExtends[0].workTypeId;
          this.earlyData.workTypeId = this.earlyData.workerManWorkExtends[0].workTypeId;
          if (this.editForm.idCardPhotoId) {
            this.editForm.imgBase = '/workerman/fileupload/pageShowFile?fid=' + this.editForm.idCardPhotoId;
          } else {
            this.editForm.imgBase = '../../../static/img/img.jpg';
          }
          var parmas = {
            workClassId: this.editForm.workClassId
          }
          getRecruitWorkerList(parmas).then((res) => {
            this.workTypeList2 = res.data.data;
          })
          this.lookVisible = true;
        })
      },
      lookCancelBtn() {
        this.lookVisible = false;
        this.attendanceName = '';
        this.editForm.birthDate = '';
        this.$refs['editForm'].resetFields();
        this.editChangeArrayKey = [false, false, false, false, false, false];
        this.editForm.imgBase = '';
        this.editForm.idCardPhotoPath = '';
        this.editForm.workClassId = '';
        var parmas = {
          'search.unitId': this.companyId,
          'search.name': this.name,
          'search.sex': this.sex,
          'search.minAge': this.ageA,
          'search.maxAge': this.ageB,
          'search.tel': this.tel,
          'search.workerManState': this.workerManState,
          'search.workClassId': this.workClassId,
          'search.workTypeId': this.workTypeId,
          'pageNo': this.thisNowPage,
          'pageSize': this.pagesize
        }
        this.loading = true;
        this.getList(parmas);
      },

      getExcel() {
        window.open('/workerman/check/workerTailExport?yyyymm=' + this.steamMsg.yearMonth + '-01&projectId=' + this.steamMsg.projectId + '&laborId=' + this.steamMsg.laborId + '&teamId=' + this.steamMsg.teamId + '&workerId=' + this.steamMsg.workerId + '&attendanceNum=' + this.steamMsg.attendanceDays + '&lateTimes=' + this.steamMsg.lateTimes + '&tardyTimes=' + this.steamMsg.tardyTimes + '&lateHours=' + this.steamMsg.lateTotalTime + '&name=' + this.steamMsg.workerName, '导出工友xcel');
      }
    }
  }
</script>
<style>
  .workerMan .lookBox {
    background: #f1f5f8;
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    padding: 0 20px 20px 20px;
    box-sizing: border-box;
    overflow-y: scroll;
    z-index: 120;
    font-size: 0rem;
  }

  .workerMan .lookBox .lookHeader {
    background: rgb(44, 50, 68);
    height: .35rem;
    line-height: .35rem;
    padding-left: .2rem;
    color: #fff;
    font-size: .15rem;
  }

  .workerMan .lookBox .iconPos {
    position: absolute;
    right: .8rem;
    font-size: .13rem;
    top: .12rem;
    cursor: pointer;
  }

  .workerMan .btn {
    border-radius: .2rem;
    margin-bottom: .3rem;
  }

  .workerMan .pageCurrent {
    position: relative;
    top: .15rem;
    float: right;
    right: .3rem;
  }

  .workerMan .select {
    width: 100%;
  }

  .workerMan .searchBox {
    width: 100%;
    margin-bottom: 15px;
    /*min-width: 1150px;*/
    float: left;
    overflow: hidden;
    position: relative;
  }

  .workerMan .search {
    width: 280px;
    height: 50px;
    line-height: 50px;
    float: left;
    margin-right: 15px;
  }

  .workerMan .search p {
    float: left;
    width: 90px;
    height: 50px;
    line-height: 50px;
    font-size: 14px;
    text-align: center;
  }

  .workerMan .search .searchInput {
    float: left;
    width: 180px;
  }

  .workerMan .searchBtn {
    margin-top: 8px;
    margin-left: 15px;
    float: right;
  }

  .workerMan .projectBox {
    overflow: hidden;
    height: 170px;
  }

  .workerMan .projectBoxa {
    overflow: hidden;
    height: 110px;
  }

  .workerMan .projectBoxa .el-select {
    width: 200px;
    /*float: left;*/
  }

  .workerMan .addBox {
    overflow: hidden;
    position: relative;
  }

  .workerMan .searchSbox p {
    width: 80px;
    font-size: 14px;
    height: 30px;
    line-height: 30px;
    float: left;
  }

  .workerMan .searchSbox .el-input, .el-select {
    width: 70%;
    float: left;
  }

  .workerMan .demo-container {
    width: 320px;
    height: 320px;
    position: relative;
  }

  .workerMan .el-icon-question {
    font-size: 20px;
  }

  .workerMan .demo-container div {
    display: none;
  }

  .workerMan .demo-container .rect {
    position: absolute;
    border: 1px solid red;
    display: block;
  }

  .workerMan .el-dialog {
    overflow: hidden;
  }

  .workerMan .el-step__main {
    margin-left: -25px;
  }

  .workerMan .lookFormFindStyle .el-input__suffix {
    display: block !important;
  }

  .workerMan .lookChildStyle .el-input__inner {
    font-size: 12px;
    color: #5C6471 !important;
    width: 80%;
  }

  .workerMan .attendWorker .cell {
    height: 100%;
  }
</style>
