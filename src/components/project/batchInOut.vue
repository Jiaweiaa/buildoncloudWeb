<template>
  <div id="batchBox">
    <!--
        主体内容
    -->
    <div
      style="position: absolute;width:calc(100% - .4rem);top: 0;left: 0;padding-top: .2rem;padding-left: .2rem;padding-right: .2rem;">
      <!--
          班组搜索框
      -->
      <p style="padding-bottom: .1rem;border-bottom: 1px solid  #ccc">已进场班组：
        <el-select
          v-model="workerId"
          ref="sSelect"
          filterable
          remote
          clearable
          suffix-icon="el-icon-search"
          reserve-keyword
          placeholder="班组长姓名、班组长电话"
          :remote-method="remoteMethod"
          @focus="removeReadOnly($event)"
          @change="steamChange"
          size="small"
          style="width: 2rem;float: none"
          :loading="workerloading"
          :loading-text="workerloadingText"
        >
          <el-option
            v-for="item in workerOptions"
            :key="item.id"
            :label="item.workteamname"
            :value="item.id">
          </el-option>
        </el-select>
        <el-button size="small" type="primary" style="margin-left: .5rem;" v-show="workerId !== ''" @click="clickAdd">
          工友进场
        </el-button>
      </p>

      <!--
          操作框
      -->
      <div class="operation">
        <div class="btns">
          <el-button size="medium" v-show="activeIndex == 1" type="primary" @click="enterField()">进场</el-button>
          <el-button size="medium" v-show="activeIndex == 0" type="primary" @click="Retreat()">退场</el-button>
        </div>
        <div class="tabs">
          <div class="nth0" :class="{'activeBtn':activeIndex == 0}" @click="enterOrGoOut(0)">已进场</div>
          <div class="nth1" :class="{'activeBtn':activeIndex == 1}" @click="enterOrGoOut(1)">未进场</div>
        </div>
        <div class="search">
          &nbsp;&nbsp;工类:&nbsp;&nbsp;
          <el-select style="width: 1rem;" v-model="searchForm['search.workClassId']" placeholder="请选工类"
                     @change="editGetPro(searchForm['search.workClassId'])" size="small">
            <el-option
              v-for="item in workClassOption"
              :label="item.name"
              :key="item.id"
              :value="item.id">
            </el-option>
          </el-select>
          &nbsp;&nbsp;工种:&nbsp;&nbsp;
          <el-select size="small" style="width: 1rem;" v-model="searchForm['search.workTypeId']" placeholder="请选工种">
            <el-option
              v-for="item in workTypeOption"
              :label="item.name"
              :key="item.id"
              :value="item.id">
            </el-option>
          </el-select>
          <el-input size="small" placeholder="请输入工友姓名或者联系方式" style="width: 2.5rem;" clearable
                    v-model="searchForm['search.nameOrTel']" class="input-with-select">
            <el-button size="small" slot="append" icon="el-icon-search" @click="search"></el-button>
          </el-input>
          <el-button style="" size="small" v-show="activeIndex == 0" @click="ForExcel">导出excel</el-button>
        </div>
      </div>

      <!--
          表单
      -->
      <div class="table">
        <el-table
          stripe
          border
          v-loading="loading"
          ref="multipleTable"
          :data="listData"
          tooltip-effect="dark"
          style="width: 100%"
          @selection-change="handleSelectionChange">
          <el-table-column
            type="selection"
            width="55">
          </el-table-column>
          <el-table-column label="现场照片" min-width="10%" align="center">
            <template scope="scope">
              <img style="cursor: pointer; width: 1rem;" @click="seePhoto(scope.row.head_photo_id)"
                   :src="`/workerman/fileupload/pageShowFile?fid=${scope.row.head_photo_id}`"
                   alt="">
            </template>
          </el-table-column>
          <el-table-column
            label="姓名"
            min-width="10%"
            :show-overflow-tooltip="true"
            align="center">
            <template scope="scope">
              <p @click="lookThis(scope.row)" :class="{activeClick : activeIndex == 0 }">
                {{ scope.row.workermanname ? scope.row.workermanname : ''}}</p>
            </template>
          </el-table-column>
          <el-table-column
            label="所属班组"
            min-width="10%"
            :show-overflow-tooltip="true"
            align="center">
            <template scope="scope">
              <span>{{ scope.row.workerteamname ? scope.row.workerteamname : ''}}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="劳务公司信息"
            min-width="14%"
            :show-overflow-tooltip="true"
            align="center">
            <template scope="scope">
              <span>{{ scope.row.laborname}}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="所属工类"
            min-width="8%"
            :show-overflow-tooltip="true"
            align="center">
            <template scope="scope">
              <span>{{ scope.row.workclassname}}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="所属工种"
            min-width="10%"
            :show-overflow-tooltip="true"
            align="center">
            <template scope="scope">
              <span>{{ scope.row.worktypename}}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="性别"
            min-width="8%"
            :show-overflow-tooltip="true"
            align="center">
            <template scope="scope">
              <span>{{ scope.row.sex == '0' ? '女' : '男'}}</span>
            </template>
          </el-table-column>
          <el-table-column
            min-width="10%"
            :show-overflow-tooltip="true"
            label="电话号"
            align="center">
            <template scope="scope">
              <span>{{ scope.row.tel ? scope.row.tel : ''}}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="入场日期"
            min-width="10%"
            :show-overflow-tooltip="true"
            align="center">
            <template scope="scope">
              <span>{{ scope.row.workman_in_date}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" min-width="20%" label="操作">
            <template scope="scope">
              <el-button
                v-show="scope.row.dooraccesslock == true"
                size="small"
                type="text"
                style="color: green;"
                @click="Unchain(scope.row)">解锁
              </el-button>
              <el-button
                v-show="activeIndex == 0"
                size="small"
                type="text"
                style="color: red;"
                @click="Exit(scope.row)">退场
              </el-button>
              <el-button
                size="small"
                type="text"
                @click="photobuckle(scope.row)">补录人脸
              </el-button>
                <el-button
                  size="small"
                  type="text"
                  @click="printForm(scope.row)">打印进场通知单
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          style="float: right;margin-top: .1rem;"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
      </div>
    </div>

    <!--
        浮层
    -->
    <el-dialog title="工友批量进场" :visible.sync="workerBatchEnterVis" :close-on-press-escape="false"
               :before-close="beforeClose">
      <el-form :model="enterForm" :rules="enterFormRules" ref="enterForm">
        <el-form-item label="工类工种" prop="workTypeId">
          <el-select size="small" style="width: 40%; margin-right: 3%;" v-model="enterForm.workClassId"
                     placeholder="选择工类" @change="enterClassChange">
            <el-option
              v-for="item in workList"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
          <el-select size="small" style="width: 40%;" v-model="enterForm.workTypeId" placeholder="选择工种">
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
            v-model="enterForm.enterDate"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="不良记录">
          <el-table
            border
            :data="violationList">
            <el-table-column type="expand">
              <template slot-scope="props">
                <el-table
                  stripe
                  border
                  :data="props.row.badRecordData">
                  <el-table-column
                    prop="proname"
                    align="center"
                    :show-overflow-tooltip="true"
                    label="项目">
                  </el-table-column>
                  <el-table-column
                    prop="brname"
                    align="center"
                    :show-overflow-tooltip="true"
                    label="不良记录">
                  </el-table-column>
                  <el-table-column
                    prop="outdate"
                    align="center"
                    :show-overflow-tooltip="true"
                    label="退场日期">
                  </el-table-column>
                  <el-table-column
                    prop="brcomment"
                    align="center"
                    :show-overflow-tooltip="true"
                    label="备注">
                  </el-table-column>
                </el-table>
              </template>
            </el-table-column>
            <el-table-column
              prop="manName"
              align="center"
              :show-overflow-tooltip="true"
              label="工友姓名">
            </el-table-column>
            <el-table-column
              prop="manTel"
              align="center"
              :show-overflow-tooltip="true"
              label="工友电话">
            </el-table-column>
            <el-table-column
              prop="manIdCardNo"
              align="center"
              :show-overflow-tooltip="true"
              label="工友身份证">
            </el-table-column>
            <el-table-column align="center" label="操作">
              <template scope="scope">
                <el-button size="small" v-show="enterCancelArray.indexOf(scope.row.manId) !== -1" type="text"
                           @click="sureSelected(scope.row.manId)">选中
                </el-button>
                <el-button size="small" v-show="enterSureArray.indexOf(scope.row.manId) !== -1" type="text"
                           style="color:red;" @click="cancelSelected(scope.row.manId)">取消选中
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            style="float: right;margin-top: .1rem;position: relative; top: .2rem"
            @size-change="violaHandleSizeChange"
            @current-change="violaHandleCurrentChange"
            :current-page="violaCurrentPage"
            :page-sizes="[10, 20, 30, 40]"
            :page-size="violaPagesize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="violaTotal">
          </el-pagination>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="beforeClose">取 消</el-button>
        <el-button size="small" type="primary" @click="sureEnter">确 定</el-button>
      </div>
    </el-dialog>

    <!--
        退场
    -->
    <el-dialog top="50px" title="工友退场" :visible.sync="ExitShow" :close-on-click-modal="false"
               :close-on-press-escape="false">
      <div v-if="exitData.id">
        <p style="overflow: hidden">
          <span style="float: left;width: calc(50% - .1rem);text-align: right;padding-right: .1rem">项目名称：</span>
          <span style="float: left;width: 50%;">{{formProject.name}}</span>
        </p>
        <p style="overflow: hidden">
          <span style="float: left;width: calc(50% - .1rem);text-align: right;padding-right: .1rem">班组名称：</span>
          <span style="float: left;width: 50%;">{{exitData.workerteamname}}</span>
        </p>
        <p style="overflow: hidden">
          <span style="float: left;width: calc(50% - .1rem);text-align: right;padding-right: .1rem">劳务公司：</span>
          <span style="float: left;width: 50%;">{{exitData.laborname}}</span>
        </p>
        <p style="overflow: hidden">
          <span style="float: left;width: calc(50% - .1rem);text-align: right;padding-right: .1rem">工种：</span>
          <span style="float: left;width: 50%;">{{exitData.workclassname}}&nbsp;-&nbsp;{{exitData.worktypename}}</span>
        </p>
        <p style="margin: 0 auto; width: 60%;border-bottom: 1px solid #ccc">评价</p>
        <p style="overflow: hidden;margin-top: .05rem;">
          <span style="float: left;width: calc(50% - .1rem);text-align: right;padding-right: .1rem">技术和质量：</span>
          <span style="float: left;width: 50%;"><el-rate allow-half
                                                         v-model="ExitForm.manSkillqualityScore"></el-rate></span>
        </p>
        <p style="margin-top: .05rem; overflow: hidden;height: 1.2rem;">
          <span style="float: left;width: calc(50% - .1rem);text-align: right;padding-right: .1rem; margin-top:.05rem;">无不良记录：</span>
          <span style="float: left;width: 50%;position: relative;">

                        <el-select style="position: absolute; top: 0;" size="small"
                                   v-model="ExitForm.manBadRecordTypeId" placeholder="请选择不良记录类型">
                            <el-option
                              v-for="item in badTypeList"
                              :key="item.id"
                              :label="item.name"
                              :value="item.id">
                            </el-option>
                        </el-select>
                        <el-input size="small" style="position: absolute; top: .4rem;" class="textareaOverflow"
                                  type="textarea" v-model="ExitForm.manBadRecordComment" resize="none" :rows=3
                                  placeholder="不良记录备注"></el-input>
                    </span>
        </p>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click.native="exitQX">取消</el-button>
        <el-button size="small" type="primary" @click.native="exitQD">提交</el-button>
      </div>
    </el-dialog>

    <!--
        补录照片
    -->
    <el-dialog title="补录人脸" :visible.sync="photoVisible" :close-on-click-modal="false" :close-on-press-escape="false" :before-close="photoformQX" width="5rem">
      <el-form :model="photoform" :rules="rulesphoto" ref="photoform">
        <el-form-item label="人脸" label-width="1.3rem" prop="photoPath">
          <img v-show="imgSrc2==''" src="../../../static/img/face.jpg" alt="">
          <img v-show="imgSrc2!=''" style="width: 3rem;" :src="imgSrc2" alt="">
          <el-button size="small" style="margin-left: .2rem;" @click="takephoto2(2)">录入人脸</el-button>
          <el-button type="text" @click="guidePath(true)">点击进入摄像头操作详情</el-button>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="photoformQX('photoform')">取 消</el-button>
        <el-button size="small" :disabled="disabled2" type="primary" @click="photoformQD('photoform')">确 定</el-button>
      </div>
    </el-dialog>

    <!--
        相机
    -->
    <el-dialog title="相机" :visible.sync="cameraVisible" :close-on-click-modal="false" :close-on-press-escape="false"
               :before-close="cameraQX" @open="cameraOpen" width="30%">
      <div id="pushwebcam" v-show="!show" style="position: relative; overflow: hidden;padding-bottom: .2rem;">
        <!--<img class="maskPhoto" src="../../../static/img/face.png" />-->
        <div id="my_camera" style="width:3.2rem; height:2.4rem;"></div>
        <el-button style="margin-top: .2rem; float: right;" size="small" @click="paizao">拍照</el-button>
      </div>
      <div v-show="show" class="demo-container" style="overflow:hidden; margin-bottom: .2rem;">
        <div style="vertical-align: top;position: relative;" class="demo-container">
          <canvas v-show="!show" style="" ref="myCanvas" width="320" height="240"></canvas>
          <div style="position: relative;vertical-align: top">
            <div v-show="isSureRecord" style="width: 3.2rem; height: 2.4rem; float: left;">
              <vueCropper
                ref="cropper"
                :img="example2.img"
                :autoCrop="example2.autoCrop"
                :autoCropWidth="example2.autoCropWidth"
                :autoCropHeight="example2.autoCropHeight"
              ></vueCropper>
            </div>
            <img class="recordImg" v-show="!isSureRecord" :src="this.recordUrl"/>
            <img v-show="addForm.imgBase !== '../../../static/img/img.jpg' && !isSureRecord" class="idCardImg"
                 :src="addForm.imgBase"/>
            <div v-show="showIsFace !== ''" style="width: 100%;margin-top: .2rem;text-align: center; font-size: .13rem;">
              <span style="color: red; vertical-align:middle; margin-right: .05rem;">*</span>{{this.showIsFace}}
            </div>
          </div>
        </div>
        <el-button class="carmerBtn" v-show="isSureRecord" size="small" @click="takePhotoHead">截取头像</el-button>
        <el-button class="carmerBtn" :loading="recordLoading" v-show="!isSureRecord" size="small" @click='surePhoto'>
          确定
        </el-button>
        <el-button class="carmerBtn" v-show="getImgFace" size="small" @click="cancelPhoto">取消</el-button>
      </div>
    </el-dialog>

    <!--
      查看
    -->
    <el-dialog class="wokerBox" v-if="editForm.id" title="工友详情" :before-close="lookCancelBtn"
               :visible.sync="lookVisible" :close-on-click-modal="false" :close-on-press-escape="false" width="10rem">
      <el-form :model="editForm" label-width="1.3rem" style="overflow: hidden;" ref="editForm">
        <div style="width:50%;position:relative;float: left;">
          <img v-if="editForm.workerMan.idCardPhotoId"
               style="position:  absolute;width: 1.15rem; right: -.5rem; top: -.03rem;"
               :src="`/workerman/fileupload/pageShowFile?fid=${editForm.workerMan.idCardPhotoId}`"/>
          <img v-else="editForm.workerMan.idCardPhotoId" style="position:  absolute; right:.1rem; top: .1rem;"
               src="../../../static/img/img.jpg"/>
          <el-form-item label="姓名：" style="width: 65%;">
            <p v-if="editForm.workerMan.name">{{editForm.workerMan.name}}</p>
          </el-form-item>
          <el-form-item label="性别：" style="width: 65%;">
            <p>{{editForm.workerMan.sex}}</p>
          </el-form-item>
          <el-form-item label="民族：" style="width: 65%;">
            <p>{{editForm.workerMan.nation}}</p>
          </el-form-item>
          <el-form-item label="出生日期：">
            <p>{{editForm.workerMan.birthDate}}</p>
          </el-form-item>
          <el-form-item label="住址：">
            <p>{{editForm.workerMan.address}}</p>
          </el-form-item>
          <el-form-item label="身份证号：">
            <p>{{editForm.workerMan.idCardNo}}</p>
          </el-form-item>
          <el-form-item label="签发机关：">
            <p>{{editForm.workerMan.idCardOrg}}</p>
          </el-form-item>
          <el-form-item label="签发日期：">
            <p>{{editForm.workerMan.isSuedData}}</p>
          </el-form-item>
          <el-form-item label="有效期截止日期：">
            <p>{{editForm.workerMan.idCardValidata}}</p>
          </el-form-item>
          <el-form-item label="工友联系方式：">
            <p>{{editForm.workerMan.tel}}</p>
          </el-form-item>
          <el-form-item label="工类工种：">
            <span v-if="editForm.workClass.name">{{editForm.workClass.name}}</span>
            <span v-if="editForm.workType.name">{{editForm.workType.name}}</span>
          </el-form-item>
          <el-form-item label="紧急联系方式：">
            <p>{{editForm.workerMan.emergencyContactTel}}</p>
          </el-form-item>
          <el-form-item label="血型：">
            <p>{{editForm.workerMan.bloody}}</p>
          </el-form-item>
          <el-form-item label="班组：">
            <p>{{editForm.workerTeam.name}}</p>
          </el-form-item>
          <el-form-item label="工资卡账号：">
            <p>{{editForm.workerMan.bankAccount}}</p>
          </el-form-item>
          <el-form-item label="开户行地址：">
            <p>{{editForm.workerMan.openAccountBank}}</p>
          </el-form-item>
        </div>
        <div style="width:50%;position:relative;float: left;">
          <el-form-item label="人脸：" style="">
            <img width="300" v-if="editForm.workerMan.headPhotoId"
                 :src="`/workerman/fileupload/pageShowFile?fid=${editForm.workerMan.headPhotoId}`" alt="">
          </el-form-item>
        </div>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click.native="lookCancelBtn">关闭</el-button>
        <el-button size="small" @click.native="goprint(editForm)">打印进场通知</el-button>
      </div>
    </el-dialog>

    <!--
        选择导出项
    -->
    <el-dialog title="选择导出项" :visible.sync="excelVisible" :close-on-click-modal="false" :close-on-press-escape="false"
               :before-close="cencelExcel">
      <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
      <div style="margin: .15rem 0;"></div>
      <el-checkbox-group v-model="checkedrowLists" @change="handleCheckedCitiesChange">
        <el-checkbox v-for="row in rowList" :label="row.id" :key="row.id">{{row.name}}</el-checkbox>
      </el-checkbox-group>
      <el-button style="float: right;" size="small" @click="cencelExcel">取消</el-button>
      <el-button style="float: right; margin-right: .1rem; margin-bottom: .2rem;" type="primary" size="small"
                 @click='sureExcel'>确定
      </el-button>
    </el-dialog>

    <!--
        工友进场
    -->
    <el-dialog class="zIndexStyleBox" id="addIn" :before-close="resetForm" title="创建工友信息" :visible.sync="addVisible"
               :close-on-click-modal="false" :close-on-press-escape="false">
      <div id="steps" style="width: 100%; height: .6rem; position: relative; left: 12%; margin-bottom: .2rem;">
        <el-steps :space="200" :active="active" finish-status="success">
          <el-step title="录取身份信息"></el-step>
          <el-step title="录取其他信息"></el-step>
          <el-step title="录取人脸"></el-step>
        </el-steps>
      </div>
      <el-form :model="addForm" label-width="1.3rem" :rules="addFormRules" style="overflow: hidden;" ref="addForm"
               v-show="active == 0">
        <el-form-item label="身份证号" prop="idCardNo" style="width: 65%;">
          <el-input v-model="addForm.idCardNo" size="small" @focus="IDfocus" @blur="iDCardChange"
                    auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="name" style="width: 65%;">
          <el-input :maxlength="15" size="small" v-model="addForm.name" auto-complete="off"></el-input>
        </el-form-item>
        <img style="position:  absolute; right:.6rem; top: 1.42rem;width: 1.15rem;" :src="addForm.imgBase"/>
        <el-form-item label="性别" prop="sex" style="width: 65%;">
          <el-select style="height: .4rem !important; width: 100%;" v-model="addForm.sex" size="small" placeholder="请选择">
            <el-option
              v-for="item in sexArrAdd"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="民族" prop="nation" style="width: 65%;">
          <el-input :maxlength="10" size="small" v-model="addForm.nation" auto-complete="off"></el-input>
        </el-form-item>

        <el-form-item label="出生日期" prop="birthDate">
          <el-date-picker
            style="height: .4rem !important; width: 100%;"
            v-model="addForm.birthDate"
            type="date"
            size="small"
            disabled
            value-format="yyyyMMdd">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="住址" prop="address">
          <el-input :maxlength="50" size="small" v-model="addForm.address" auto-complete="off"></el-input>
        </el-form-item>

        <el-form-item label="签发机关" prop="idCardOrg">
          <el-input :maxlength="50" size="small" v-model="addForm.idCardOrg" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="签发日期" prop="isSuedData">
          <el-date-picker
            style="height: .4rem !important; width: 100%;"
            size="small"
            v-model="addForm.isSuedData"
            type="date"
            :editable="false"
            value-format="yyyyMMdd">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="有效期截止日期" prop="idCardValidata">
          <el-date-picker
            :editable="false"
            style="height: .4rem !important; width: 100%;"
            size="small"
            v-model="addForm.idCardValidata"
            type="date"
            value-format="yyyyMMdd">
          </el-date-picker>
        </el-form-item>
        <el-popover trigger="hover" placement="top"
                    style="text-align: center; display: block; width: .3rem; float: right;  margin-top: .05rem; font-size: .2rem; margin-right: .1rem; cursor: pointer;">
          <p>身份证读卡器使用说明：</p>
          <p>1: 安装驱动：安装驱动文件ZKIDROnline.exe，安装后需要重启计算机。</p>
          <p>2: 接入设备：重启后，将读卡器插入USB口，读卡器发出两声蜂鸣。</p>
          <p>3: 读取信息：点击『读取身份证信息』按钮，读取成功发出一声蜂鸣.</p>
          <p>注: 如果仍有问题，请联系系统管理人员.</p>
          <p @click="guidePath(false)"
             style="text-align: right; text-decoration: underline; color: blue; cursor: pointer;">点击进入读卡器操作过程</p>
          <p @click="downloadFile" style="text-align: right; text-decoration: underline; color: blue; cursor: pointer;">
            下载驱动和证书</p>
          <div slot="reference" class="name-wrapper">
            <i class="el-icon-question"></i>
          </div>
        </el-popover>
        <el-button size="small" style="margin-bottom: .2rem; float: right;" :loading="cardBok" @click="getCardData">
          读取身份证信息
        </el-button>
      </el-form>
      <el-form style="overflow: hidden;" :model="addForm2" label-width="1.3rem" :rules="addFormRules2" ref="addForm2"
               v-show="active == 1">
        <el-form-item label="工友联系方式">
          <el-input :maxlength="11" v-model="addForm2.tel" size="small" auto-complete="off"
                    placeholder="请输入工友联系方式"></el-input>
        </el-form-item>
        <el-form-item label="工类工种" prop="workTypeId">
          <el-select style="width: 48%; margin-right: 3%;" size="small" v-model="addForm2.workClassId"
                     placeholder="选择工类" @change="addChangeType2">
            <el-option
              v-for="item in workList"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
          <el-select style="width: 48%;" size="small" v-model="addForm2.workTypeId" placeholder="选择工种">
            <el-option
              v-for="item in workTypeList1"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="工资卡账号">
          <el-input :maxlength="19" size="small" v-model="addForm2.bankAccount" auto-complete="off"
                    placeholder="请输入工资卡账号"></el-input>
        </el-form-item>
        <el-form-item label="进场日期" prop="inDate">
          <el-date-picker
            style="width:48%;"
            v-model="addForm2.inDate"
            type="date"
            size="small"
            :picker-options="pickerOptions1"
            placeholder="选择日期"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="薪资计算形式">
          <el-select style="width: 48%;" size="small" v-model="addForm2.calculationOfSalary" placeholder="选择薪资计算形式">
            <el-option
              label="按小时"
              :value="1">
            </el-option>
            <el-option
              label="按日"
              :value="2">
            </el-option>
            <el-option
              label="按月"
              :value="3">
            </el-option>
            <el-option
              label="绩效"
              :value="4">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="薪资计算形式说明">
          <el-input :maxlength="50" size="small" v-model="addForm2.calculationOfSalaryNote" auto-complete="off"
                    placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="紧急联系方式" prop="emergencyContactTel">
          <el-input :maxlength="11" size="small" v-model="addForm2.emergencyContactTel" auto-complete="off"
                    placeholder="请输入紧急联系方式"></el-input>
        </el-form-item>

        <el-form-item label="血型" prop="bloody">
          <el-select size="small" style="height: .4rem !important; width: 100%;" v-model="addForm2.bloody"
                     placeholder="请选择血型">
            <el-option
              v-for="item in bloodyArray"
              :label="item.label"
              :key="item.value"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="开户行地址" prop="openAccountBank">
          <el-input :maxlength="50" size="small" v-model="addForm2.openAccountBank" auto-complete="off"
                    placeholder="请输入开户行地址"></el-input>
        </el-form-item>
      </el-form>
      <div class="demo-frame" v-show="active == 2" style="overflow: hidden; margin-bottom: .15rem;padding-left: .6rem;">
        <el-form style="overflow: hidden;" :model="addForm3" label-width="1.3rem" :rules="addFormRules3" ref="addForm3">

          <el-form-item label="照片" prop="headPhotoPath">
            <img v-show="imgSrc2==''" src="../../../static/img/face.jpg" alt="">
            <img v-show="imgSrc2!=''" :src="imgSrc2" alt="">
            <el-button size="small" style="margin-left: .2rem;" @click="takephoto2(1)">录入人脸</el-button>
            <el-button type="text" @click="guidePath(true)">点击进入摄像头操作详情</el-button>
          </el-form-item>
        </el-form>

      </div>
      <el-button :disabled="disabled1" size="small" style="float: right; margin-bottom: .2rem;" @click="add"
                 v-show="active == 2">提交
      </el-button>
      <el-button id="1111" size="small" style="float: right; margin-bottom: .2rem;" @click="next" v-show="active < 2">
        下一步
      </el-button>
      <el-button v-show="active>0" size="small" style="margin-bottom: .2rem; float: right; margin-right: .2rem;"
                 @click="prevClick">上一步
      </el-button>
    </el-dialog>

    <!--图片查看-->
    <el-dialog id="photoSee" title="照片" top="30vh" :visible.sync="photoLookVisible" :close-on-click-modal="false"
               :close-on-press-escape="false">
      <img width="360" v-if="photoLookVisible"
           :src="`/workerman/fileupload/pageShowFile?fid=${photoId}`" alt="">
    </el-dialog>

    <a :href="openUrl" target="_blank" v-show="false" id="openUrlA"></a>
  </div>
</template>
<script>
  import {
    getClassAndTypeByWorkerTeamIdAndProjectId,
    getManInfoByIdOrIdCardNo,
    queryWorkerTeamListInProject02,
    queryManListForEnter,
    updManAndEnter,
    workClass,
    updateFaceByWorkerMan,
    getManInfoByProject,
    createManAndEnter,
    manOutProject
  } from '../../api/projectapi'
  import {
    getBadRecord,
    getOnEnterList,
    batchInProject,
    batchOutProject,
    badRecordList,
    unLockDoorAccess,
    getRowData,
    faceToFace,
    recordFace,
    upFileDo
  } from '../../api/api';
  import vueCropper from 'vue-cropper';
  import myCallback from "../../../static/common/callback"
  export default {
    props: {
      formProject: {
        type: Object
      }
    },
    data() {
      // 校验工类
      var validateworkType = (rule, value, callback) => {
        if (this.addForm2.workClassId === '') {
          callback(new Error('请选择工类！'));
        } else {
          if (this.addForm2.workTypeId === '') {
            callback(new Error('请选择工种！'));
          } else {
            callback();
          }
        }
      };

      var validateworkTypeEnter = (rule, value, callback) => {
        if (this.enterForm.workClassId === '') {
          callback(new Error('请选择工类！'));
        } else {
          if (this.enterForm.workTypeId === '') {
            callback(new Error('请选择工种！'));
          } else {
            callback();
          }
        }
      };

      //校验工友姓名
      var validateName = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入工友姓名！'));
        } else {
          callback();
        }
      };

      // 校验身份证
      var validateIdcard = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入身份证号！'));
        } else {
          var data = {
            projectId: this.formProject.id,
            idCardNo: this.addForm.idCardNo
          }
          getManInfoByIdOrIdCardNo(data).then((res) => {
            if (res.data.code == 1) {
              callback(new Error(res.data.msg));
            } else {
              callback();
            }
          })
        }
      };
      // 手机号
      var validatePhone2 = (rule, value, callback) => {
        if (value === '') {
          callback();
        } else {
          var reg = /^[1]\d{10}$/;
          if (!reg.test(value)) {
            callback(new Error('请输入11位手机号！'));
          } else {
            callback();
          }
        }
      };

      //校验人脸
      var valiheadPhotoPath = (rule, value, callback) => {
        if (this.addType == 0) {
          if (value === '') {
            callback(new Error('请录入人脸！'));
          } else {
            callback();
          }
        }
        if (this.addType == 1) {
          if (!this.isHeaderId) {
            if (value === '') {
              callback(new Error('请录入人脸！'));
            } else {
              callback();
            }
          } else {
            callback();
          }
        }

      };

      //校验联系方式与紧急联系方式
      var validateemergencyContactTel = (rule, value, callback) => {
        if (value === '') {
          callback();
        } else {
          if (this.addForm2.tel == this.addForm2.emergencyContactTel) {
            callback(new Error('联系电话与紧急联系人联系方式重复！'));
          } else {
            callback();
          }
        }
      };

      return {

        idCardChangePhoto: '',
        openUrl: '',

        photoLookVisible: false,
        // 相似度展示词
        showIsFace: '',
        // 确定截图了
        isSureRecord: true,
        recordLoading: true,
        // 截图插件参数
        example2: {
          img: '',
          autoCrop: true,
          autoCropWidth: 150,
          autoCropHeight: 150,
        },

        // 截图图片
        recordUrl: '',

        // 违纪工友
        violationList: [],

        // 所属工类工种
        workList: [],
        workTypeList: [],

        // 浮层显示
        workerBatchEnterVis: false,

        loading: true,
        // 加载
        workerloading: false,
        workerloadingText: '班组长姓名、班组长电话',

        // 班组搜索
        workerId: '',
        workerOptions: '',

        // 样式开关
        activeIndex: 0,

        // 列表数据
        listData: [],

        // 班组查询的
        searchForm: {
          'pageSize': 10,
          'pageNo': 1,
          'search.nameOrTel': '',
          'search.workerTeamId': '',
          'search.projectId': '',
          'search.workClassId': '',
          'search.workTypeId': ''
        },

        searchBadForm: {
          ids: '',
          pageNo: 1,
          pageSize: 10
        },

        //分页
        total: 1,
        currentPage: 1,
        pagesize: 10,
        pageNo: 1,

        //分页
        violaTotal: 1,
        violaCurrentPage: 1,
        violaPagesize: 10,
        violaPageNo: 1,

        // 所选工友
        selectedWorker: [],
        // 班组
        enterForm: {
          workClassId: '',
          workTypeId: '',
          enterDate: ''
        },

        enterFormRules: {
          enterDate: [
            {required: true, message: '请选择进场日期', trigger: 'change'}
          ],
          workTypeId: [
            {required: true, validator: validateworkTypeEnter, trigger: 'blur'}
          ]
        },

        // 进场取消选中的数组
        enterCancelArray: [],
        // 进场确认选中的数组
        enterSureArray: [],

        // 退场
        exitData: [],
        ExitShow: false,
        ExitForm: {
          projectId: this.formProject.id,
          workerManId: '',
          manBadRecordComment: '',
          manBadRecordTypeId: '',
          manSkillqualityScore: 0
        },
        badTypeList: [],

        // 导出excel
        checkedrowLists: [],
        nowcheckedArr: [],
        rowList: [],
        checkAll: false,
        isIndeterminate: true,
        excelVisible: false,

        //补录照片
        photoVisible: false,
        photoform: {
          projectId: this.formProject.id,
          workerManId: '',
          photoPath: ''
        },
        rulesphoto: {
          photoPath: [
            {required: true, message: '人脸照片不能为空', trigger: 'blur'}
          ],
        },
        imgSrc2: '',
        disabled2: true,
        // 状态active
        activeIndex: 0,


        //相机数据
        cameraVisible: false,
        //拍照类型
        cameraType: 0,

        active: 0,
        show: false,
        //临时？
        getImgFace: true,

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
          openAccountBank: ''
        },

        workClassOption: [],
        workTypeOption: [],


        // 提交表单
        addVisible: false,
        addForm: {
          id: '',
          name: '',
          sex: '',
          nation: '',
          birthDate: '',
          address: '',
          idCardNo: '',
          idCardOrg: '',
          isSuedData: '',

          idCardValidata: '',
          idCardPhotoId: '',
          idCardPhotoPath: '',
          headPhotoId: '',

          imgBase: '../../../static/img/img.jpg'
        },
        addFormRules: {
          name: [
            {required: true, validator: validateName, trigger: 'blur'}
          ],
          sex: [
            {required: true, message: '请选择性别', trigger: 'change'}
          ],
          nation: [
            {required: true, message: '请输入民族', trigger: 'blur'}
          ],
          birthDate: [
            {required: true, message: '请选择出生日期', trigger: 'change'}
          ],
          address: [
            {required: true, message: '请输入住址', trigger: 'blur'}
          ],
          idCardNo: [
            {required: true, validator: validateIdcard, trigger: 'blur'}
          ]
        },

        addForm2: {
          tel: '',
          workClassId: '',
          workTypeId: '',
          emergencyContactTel: '',
          inDate: '',
          bloody: '',
          calculationOfSalary: '',
          calculationOfSalaryNote: ''

        },
        pickerOptions1: {
          disabledDate: (time) => {
            return time.getTime() <= (new Date(this.teamIndate).getTime() - 60 * 60 * 24 * 1000) || time.getTime() > (new Date(this.formProject.completionDate).getTime())
          }
        },
        addFormRules2: {
          tel: [
            {validator: validatePhone2, trigger: 'blur'}
          ],
          workTypeId: [
            {required: true, validator: validateworkType, trigger: 'blur'}
          ],
          inDate: [
            {required: true, message: '请选择进场日期', trigger: 'blur'}
          ],
          emergencyContactTel: [
            {validator: validateemergencyContactTel, trigger: 'change'}
          ],
        },
        addForm3: {
          cardNo: '',
          headPhotoPath: '',
        },
        addFormRules3: {
          cardNo: [
            {required: true, message: '请填写卡扣编号', trigger: 'change'}
          ],
          headPhotoPath: [
            {required: true, validator: valiheadPhotoPath, trigger: 'change'}
          ]
        },
        sexArrAdd: [{
          value: 1,
          label: '男'
        }, {
          value: 0,
          label: '女'
        }],
        cardBok: false,
        workTypeList1: [],
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
        disabled1: false,
      }
    },
    components: {
      vueCropper
    },
    created() {
      this.searchForm['search.projectId'] = this.formProject.id;
      if (window.localStorage.getItem('advanceBatchTeamName') !== null && window.localStorage.getItem('advanceBatchTeamId') !== null) {
        this.workerId = window.localStorage.getItem('advanceBatchTeamId');
        this.workerOptions = [
          {
            id: window.localStorage.getItem('advanceBatchTeamId'),
            workteamname: window.localStorage.getItem('advanceBatchTeamName')
          }
        ];
        this.searchForm['search.workerTeamId'] = this.workerId;
      }
      // 获取列表
      this.getList();
      // 获取不良记录列表
      this.getBadTypeList();
      // 获取导出的列
      this.getRow();
      // 获取所有工类
      this.workClass();
    },
    methods: {
      printForm(row) {
         var parmas = {
          workerManId: row.id,
          projectId: this.formProject.id,
          workerTeamId: row.worker_team_id
        }
        getManInfoByProject(parmas).then((res) => {
            if (res.data.code == 0) {
              this.editForm = res.data.data;
              window.open("./?from=ins#/gfgf?workerManId=" + this.editForm.workerManId + '&workerTeamId=' + this.editForm.workerTeam.id + '&projectId=' + this.formProject.id);
            }
        });
      },
      guidePath(bool) {
        if (bool) {
          sessionStorage.setItem("nameCamera", "camera");
        } else {
          sessionStorage.removeItem("nameCamera");
        }
        window.open(window.location.origin + '/#/OperationsGuide')
      },
      // 查看详情
      seePhoto(val) {
        this.photoId = val;
        this.photoLookVisible = true;
      },
      // 截取头像
      takePhotoHead() {
        this.$refs.cropper.getCropData((data) => {
          this.recordUrl = data;
          // 工友进场
          if (this.addVisible == true) {
            if (this.addForm.imgBase !== '../../../static/img/img.jpg' ) {
              var parmas = {
                'face1': this.recordUrl.substring(23, this.recordUrl.length),
                'face2': this.addForm.imgBase.substring(22, this.addForm.imgBase.length),
                'face2Id': this.idCardChangePhoto
              }

              if(parmas.face2.indexOf('pageShowFile') !== -1) {
               parmas.face2Id = parmas.face2.substring(17, parmas.face2.length);
              }
              faceToFace(parmas).then((res) => {
                if (res.data.code == 0) {
                  this.showIsFace = '相似度为' + parseInt(res.data.data * 100) + '%,确认要提交吗?';
                  this.recordLoading = false;
                } else if (res.data.code == 80) {
                  this.showIsFace = res.data.msg;
                  this.recordLoading = true;
                }
                else {
                  this.showIsFace = '相似度为对比失败:' + res.data.msg;
                  this.recordLoading = true;
                }
              })
            } else {
              var parmas = {
                'face1': this.recordUrl.substring(23, this.recordUrl.length),
                'face2': ''
              }
              faceToFace(parmas).then((res) => {
                if (res.data.code == 0) {
                  this.recordLoading = false;
                } else if (res.data.code == 80) {
                  this.showIsFace = res.data.msg;
                  this.recordLoading = true;
                }
                else {
                  this.showIsFace = '相似度为对比失败:' + res.data.msg;
                  this.recordLoading = true;
                }
              })
            }
            this.isSureRecord = false;

          } else {
            var parmas = {
              'face1': this.recordUrl.substring(23, this.recordUrl.length),
              'face2': this.addForm.imgBase.substring(22, this.addForm.imgBase.length),
            }
            faceToFace(parmas).then((res) => {
              if (res.data.code == 0) {
                this.showIsFace = '相似度为' + parseInt(res.data.data * 100) + '%,确认要提交吗?';
                this.recordLoading = false;
              } else if (res.data.code == 80) {
                this.showIsFace = res.data.msg;
                this.recordLoading = true;
              }
              else {
                this.showIsFace = '相似度为对比失败:' + res.data.msg;
                this.recordLoading = true;
              }
              this.isSureRecord = false;
            })
          }

        });
      },
      // 拍照
      paizao() {
        var self = this;
        Webcam.snap(function (data_uri) {
          self.show = true;
          self.example2.img = data_uri;
        });
      },
      //补录照片
      photobuckle(item) {
        this.photoform.workerManId = item.id;
        var parmas = {
          id: item.id
        }
        recordFace(parmas).then((res) => {
          this.addForm.imgBase = 'data:image/jpg;base64,' + res.data.data;
          this.imgSrc2 = this.addForm.imgBase;
        })
        this.photoVisible = true;
      },
      //补录照片取消
      photoformQX(formName) {
        this.photoVisible = false;
        this.photoform.workerManId = '';
        this.photoform.photoPath = '';
        this.$refs['photoform'].resetFields();
        this.imgSrc2 = '';
        this.isSureRecord = true;
        this.showIsFace = '';
      },
      //补录照片确定
      photoformQD(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.disabled2 = true;
            var data = this.photoform;
            updateFaceByWorkerMan(data).then((res) => {
              this.disabled2 = false;
              if (res.data.code == 0) {
                myCallback.call(this,res)
                // this.$notify.success({
                //   title: '操作成功!',
                //   offset: 100
                // });
                this.getImgFace = true;
                this.tijiao = false;
                this.imgSrc2 = '';
                this.isSureRecord = true;
                this.showIsFace = '';
                this.photoVisible = false;
                this.photoform.workerManId = '';
                this.photoform.photoPath = '';
                this.photoVisible = false;
                this.getList();
              } else {
                myCallback.call(this,res);
                // this.$notify.error({
                //   title: '操作失败',
                //   message: res.data.msg,
                //   offset: 100
                // });
              }
            }).catch(() => {
              this.disabled2 = false;
            });
          } else {
            console.log('error submit!!');
            return false;
          }
        });

      },
      //录入照片按钮
      takephoto2(type) {
        this.cameraType = type;
        this.cameraVisible = true;
      },
      //打开相机
      cameraOpen() {
        this.$nextTick(function () {
          Webcam.attach('#my_camera');
        })
      },
      //相机弹层关闭
      cameraQX() {
        this.getImgFace = true;
        Webcam.reset();
        this.cameraVisible = false;
        this.isSureRecord = true;
        this.showIsFace = '';
        this.show = false;
      },
      //照片取消
      cancelPhoto() {
        this.show = false;
        this.recordUrl = '';
        this.isSureRecord = true;
        this.showIsFace = '';
      },
      //照片确定
      surePhoto() {
        if (this.showIsFace.substring(4, 6) < 50 && this.showIsFace !== '') {
          this.$confirm(this.showIsFace, '相似度过低请确认是本人', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.sameDo();
          }).catch(() => {
          });
        } else {
          this.sameDo();
        }

      },
      // 公共内容
      sameDo() {
        this.isSureRecord = true;
        this.showIsFace = '';
        this.imgSrc2 = this.recordUrl;
        this.getImgFace = true;
        Webcam.reset();
        this.cameraVisible = false;
        this.show = false;
        this.isSureRecord = true;
        this.showIsFace = '';
        //获取头部id
        var parmas = {
          imgStr: this.imgSrc2.substring(22)
        }
        upFileDo(parmas).then((res) => {
          this.disabled2 = false;
          if (this.cameraType == 1) {
            this.addForm3.headPhotoPath = res.data.data;
          } else {
            this.photoform.photoPath = res.data.data;
          }
        })
      },

      // 获取列表
      getList() {
        if (this.workerId !== '') {
          this.getAllWorkerType();
        }
        if (this.activeIndex == 0) {
          queryManListForEnter(this.searchForm).then((res) => {
            this.loading = false;
            this.listData = res.data.data.list;
            this.total = res.data.data.totalCount;
            if (res.data.code == 0) {
              this.loading = false;
              this.listData = res.data.data.list;
              this.total = res.data.data.totalCount;
            } else {
              myCallback.call(this,res);
              // this.$notify.error({
              //   title: '获取列表失败',
              //   message: res.data.msg,
              //   offset: 100
              // });
            }
          })
        } else {
          getOnEnterList(this.searchForm).then((res) => {
            if (res.data.code == 0) {
              this.loading = false;
              this.listData = res.data.data.list;
              this.total = res.data.data.totalCount;
            } else {
              myCallback.call(this,res);
              // this.$notify.error({
              //   title: '获取列表失败',
              //   message: res.data.msg,
              //   offset: 100
              // });
            }
          })
        }
      },

      // 进场操作
      // 取消选中
      cancelSelected(id) {
        this.enterCancelArray.push(id);
        for (var i = 0; i < this.enterSureArray.length; i++) {
          if (this.enterSureArray[i] == id) {
            this.enterSureArray.splice(i, 1);
          }
        }
      },
      // 确认选中
      sureSelected(id) {
        this.enterSureArray.push(id);
        for (var i = 0; i < this.enterCancelArray.length; i++) {
          if (this.enterCancelArray[i] == id) {
            this.enterCancelArray.splice(i, 1);
          }
        }
      },
      // 进场
      enterField() {
        if (this.workerId == '') {
          this.$notify({
            title: '警告',
            message: '请选择班组后进行进场操作!',
            type: 'warning'
          });
          this.loading = false;
          return;
        }
        if (this.selectedWorker.length == 0) {
          this.loading = false;
          return;
        }
        var oData = Object.assign({}, this.selectedWorker);
        var arr = [];
        for (var i in oData) {
          arr.push(oData[i]);
        }
        this.searchBadForm.ids = this.selectedWorker;
        this.enterCancelArray = [];
        this.enterSureArray = arr;
        this.getBadList();
        this.enterForm.enterDate = this.getNowFormatDate();

      },
      // 获取不良列表
      getBadList() {
        getBadRecord(this.searchBadForm).then((res) => {
          this.workerBatchEnterVis = true;
          this.violationList = res.data.data.list;
          this.violaTotal = res.data.data.totalCount;
        })
      },
      // 进场浮层关闭之前
      beforeClose() {
        this.workerBatchEnterVis = false;
        this.enterForm.workClassId = '';
        this.enterCancelArray = [];
        this.enterSureArray = [];
        this.$refs['enterForm'].resetFields();
      },
      // 进场提交
      sureEnter() {
        this.$refs.enterForm.validate((valid) => {
          if (valid) {
            var parmas = {
              'projectId': this.formProject.id,
              'workEx.workClassId': this.enterForm.workClassId,
              'workEx.workTypeId': this.enterForm.workTypeId,
              'workerTeamId': this.workerId,
              'ids': this.enterSureArray,
              'inDate': this.enterForm.enterDate
            }
            // 没有不良记录的人数
            let showGoIn = this.selectedWorker.length - this.violaTotal;
            // 进场人数等于没有不良记录的人数才会提示
            if (showGoIn == this.enterSureArray.length) {
              this.loading = true;
              this.goInProject(parmas);
            } else {
              this.$confirm('此操作将有不良记录的工友进场, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }).then(() => {
                this.loading = true;
                this.goInProject(parmas);
              }).catch(() => {
              });
            }
          }
        })
      },
      // 进场函数接口
      goInProject(val) {
        batchInProject(val).then((res) => {
          if (res.data.code == 0) {
            this.$notify.success({
              title: '进场成功' + res.data.data.successNum + '人;' + '进场失败' + res.data.data.errorNum + '人',
              message: '',
              offset: 100
            });
            this.getList();
          } else {
            this.$notify.error({
              title: '进场失败',
              message: res.data.msg,
              offset: 100
            });
          }
        })
        this.beforeClose();

      },

      // 班组切换
      steamChange(val) {
        if (val == '') {
          this.listData = [];
          this.searchForm['search.workerTeamId'] = '';
          this.workerOptions = [];
          this.getList();
          return;
        }
        this.searchForm['search.workerTeamId'] = val;
        this.loading = true;
        this.getList();
      },
      // 班组搜索
      remoteMethod(query) {
        this.workerloading = true;
        if (query == '') {
          this.workerOptions = [];
          this.workerloadingText = '班组长姓名、班组长电话';
          return;
        }
        var reg = /^[\u2E80-\u9FFF]+$/;
        if (reg.test(query)) {
          if (query.length <= 1) {
            this.workerOptions = [];
            this.workerloadingText = '请最少输入两个汉字';
            return;
          }
        } else {
          if (query.length < 5) {
            this.workerOptions = [];
            this.workerloadingText = '请最少输入5位';
            return;
          }
        }
        if (query != '') {
          var data = {
            'search.projectId': this.formProject.id,
            'search.key': query,
          };
          queryWorkerTeamListInProject02(data).then((res) => {
            if (res.data.code == 0) {
              this.workerOptions = res.data.data;
              this.workerloading = false;
            } else {
              this.workerloading = false;
              myCallback.call(this,res)
              // this.$notify.error({
              //   title: '失败',
              //   message: res.data.msg,
              //   offset: 100
              // });
            }
          });
        }
      },

      // 项目所属工类工种
      enterClassChange() {
        var key = this.enterForm.workClassId;
        for (var i = 0; i < this.workList.length; i++) {
          if (key == this.workList[i].id) {
            this.workTypeList = this.workList[i].workTypes;
          }
        }
        this.enterForm.workTypeId = '';
      },
      // 获取所有工类
      getAllWorkerType() {
        var data = {
          workTeamId: this.workerId,
          projectId: this.formProject.id
        }
        getClassAndTypeByWorkerTeamIdAndProjectId(data).then((res) => {
          if (res.data.code == 0) {
            this.workList = res.data.data;
          } else {
            myCallback.call(this,res);
            // this.$notify.error({
            //   title: '获取所有工类失败',
            //   message: res.data.msg,
            //   offset: 100
            // });
          }

        })
      },

      // 已进场未进场状态
      enterOrGoOut(index) {
        this.activeIndex = index;
        this.searchForm['pageNo'] = 1;
        this.searchForm['pageSize'] = 10;
        this.searchForm['search.nameOrTel'] = '';
        this.searchForm['search.workClassId'] = '';
        this.searchForm['search.workTypeId'] = '';
        this.loading = true;
        this.getList();
      },

      // 退场
      Retreat() {
        if (this.selectedWorker.length == 0) {
          this.loading = false;
          return;
        }
        this.$confirm('此操作将执行批量工友退场, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          var parmas = {
            projectId: this.formProject.id,
            ids: this.selectedWorker
          }
          this.loading = true;
          batchOutProject(parmas).then((res) => {
            if (res.data.code == 0) {
              this.$notify.success({
                title: '操作成功',
                message: '已成功退场' + res.data.msg + '人',
                offset: 100
              });
              this.getList();
            } else {
              myCallback.call(this,res)
              // this.$notify.error({
              //   title: '操作失败',
              //   message: res.data.msg,
              //   offset: 100
              // });
            }
          });
        }).catch(() => {
        });

      },

      // 下载附件
      downloadFile() {
        window.open('../../../static/身份证读卡器驱动和证书.zip', '下载附件')
      },
      // 解决ie输入不了bug
      removeReadOnly(e) {
        e.target.readOnly = false;
      },

      //分页
      //每页条数改变
      handleSizeChange(val) {
        this.searchForm.pageSize = val;
        this.loading = true;
        this.getList();
      },
      //页数改变
      handleCurrentChange(val) {
        this.searchForm.pageNo = val;
        this.loading = true;
        this.getList();
      },

      // 解锁
      Unchain(val) {
        var parmas = {
          'projectId': this.formProject.id,
          'workerManId': val.id
        }

        unLockDoorAccess(parmas).then((res) => {
          if (res.data.code == 0) {
            myCallback.call(this,res);
            // this.$notify.success({
            //   title: '解锁成功',
            //   message: res.data.msg,
            //   offset: 100
            // });
          } else {
            myCallback.call(this.res)
            // this.$notify.error({
            //   title: '解锁失败',
            //   message: res.data.msg,
            //   offset: 100
            // });
          }
          this.getList();
        })
      },
      // 搜索
      search() {
        this.loading = true;
        this.searchForm.pageNo = 1;
        this.getList();
      },
      // 选中
      handleSelectionChange(val) {
        var selectedArr = [];
        for (var i = 0; i < val.length; i++) {
          selectedArr.push(val[i].id);
        }
        this.selectedWorker = selectedArr;
      },
      // 获取当前年月日
      getNowFormatDate() {
        var date = new Date();
        var seperator1 = "-";
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var strDate = date.getDate();
        if (month >= 1 && month <= 9) {
          month = "0" + month;
        }
        if (strDate >= 0 && strDate <= 9) {
          strDate = "0" + strDate;
        }
        var currentdate = year + seperator1 + month + seperator1 + strDate;
        return currentdate;
      },
      // 不良分别
      violaHandleSizeChange(val) {
        this.searchBadForm.pageSize = val;
        this.getBadList();
      },
      violaHandleCurrentChange(val) {
        this.searchBadForm.pageNo = val;
        this.getBadList();
      },

      // 显示excel
      ForExcel() {
        this.excelVisible = true;
      },
      // 导出excel
      sureExcel() {
        if (this.checkedrowLists == '') {
          this.$notify.error({
            title: '请选择要导出的列',
            offset: 100
          });
        } else {
          window.open('/workerman/business/workerman/exportEnterManList?search.nameOrTel=' + this.searchForm['search.nameOrTel'] + '&search.workClassId=' + this.searchForm['search.workClassId'] + '&search.workTypeId=' + this.searchForm['search.workTypeId'] + '&search.projectId=' + this.formProject.id + '&cellNums=' + this.checkedrowLists, '导出excel');
          this.cencelExcel();
        }
      },
      // 取消
      cencelExcel() {
        this.excelVisible = false;
        this.checkedrowLists = [];
        this.checkAll = false;
        this.isIndeterminate = true;
      },
      // 全选
      handleCheckAllChange(val) {
        this.checkedrowLists = val ? this.nowcheckedArr : [];
        this.isIndeterminate = false;
      },
      handleCheckedCitiesChange() {
        let checkedCount = this.checkedrowLists.length;
        this.checkAll = checkedCount === this.nowcheckedArr.length;
        this.isIndeterminate = checkedCount > 0 && checkedCount < this.nowcheckedArr.length;
      },
      // 获取导出列
      getRow() {
        getRowData().then((res) => {
          this.rowList = res.data.data;
          for (var i = 0; i < this.rowList.length; i++) {
            this.nowcheckedArr.push(this.rowList[i].id)
          }
        })
      },

      // copy代码
      //退场
      Exit(item) {
        this.exitData = item;
        this.ExitShow = true;

      },
      exitQX() {
        this.ExitShow = false;
        this.exitData = {}
        this.ExitForm = {
          projectId: this.formProject.id,
          workerManId: '',
          manBadRecordComment: '',
          manBadRecordTypeId: '',
          manSkillqualityScore: 0
        }
      },
      exitQD() {
        this.$confirm('确定退场吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.ExitForm.workerManId = this.exitData.id;
          this.ExitForm.manSkillqualityScore = this.ExitForm.manSkillqualityScore * 2;
          this.ExitShow = false;
          this.loading = true;
          manOutProject(this.ExitForm).then((res) => {
            if (res.data.code == 0) {
              // this.$message({
              //   type: 'success',
              //   message: '退场成功!'
              // });
              myCallback.call(this,res)
              // this.$notify.success({
              //   title: '退场成功!',
              //   offset: 100
              // });
              this.ExitForm = {
                projectId: this.formProject.id,
                workerManId: '',
                manBadRecordScore: 0,
                manSkillqualityScore: 0,
              }
              this.getList();
            } else {
              myCallback.call(this,res);
              // this.$notify.error({
              //   title: '退场失败',
              //   message: res.data.msg,
              //   offset: 100
              // });
            }
          });
        }).catch(() => {
        });

      },
      // 获取不良记录类型
      getBadTypeList() {
        badRecordList().then((res) => {
          this.badTypeList = res.data.data;
        })
      },

      //查看
      lookThis(row) {
        if (this.activeIndex == 1) {
          return;
        }
        var parmas = {
          workerManId: row.id,
          projectId: this.formProject.id,
          workerTeamId: row.worker_team_id
        }
        this.lookVisible = true;
        getManInfoByProject(parmas).then((res) => {
          if (res.data.code == 0) {
            this.editForm = res.data.data;
            if (this.editForm.workerMan.sex == 1) {
              this.editForm.workerMan.sex = '男'
            }
            if (this.editForm.workerMan.sex == 0) {
              this.editForm.workerMan.sex = '女'
            }
            if (this.editForm.workerMan.bloody == 'A') {
              this.editForm.workerMan.bloody = 'A型'
            }
            if (this.editForm.workerMan.bloody == 'B') {
              this.editForm.workerMan.bloody = 'B型'
            }
            if (this.editForm.workerMan.bloody == 'AB') {
              this.editForm.workerMan.bloody = 'AB型'
            }
            if (this.editForm.workerMan.bloody == 'O') {
              this.editForm.workerMan.bloody = 'O型'
            }
            if (this.editForm.workerMan.bloody == 'other') {
              this.editForm.workerMan.bloody = '其他'
            }
          } else {
            myCallback.call(this,res)
            // this.$notify.error({
            //   title: '获取工友详情失败',
            //   message: res.data.msg,
            //   offset: 100
            // });
          }
        })
      },
      lookCancelBtn() {
        this.lookVisible = false;
        this.$refs['editForm'].resetFields();
        this.editForm.imgBase = '';
        this.editForm.idCardPhotoPath = '';
        this.editForm.workClassId = '';
        this.editForm = {
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
          openAccountBank: ''
        }
      },
      // 获取所有工类
      workClass() {
        workClass().then((res) => {
          if (res.data.code == 0) {
            var arr = res.data.data;
            for (var i = 0; i < arr.length; i++) {
              this.workClassOption.push(arr[i])
            }
          } else {
            myCallback.call(this,res)
            // this.$notify.error({
            //   title: '获取所有工类失败',
            //   message: res.data.msg,
            //   offset: 100
            // });
          }

        })
      },
      // 获取所有工种
      getAllWorkerType() {
        var data = {
          workTeamId: this.workerId,
          projectId: this.formProject.id
        }
        getClassAndTypeByWorkerTeamIdAndProjectId(data).then((res) => {
          if (res.data.code == 0) {
            this.workList = res.data.data;
          } else {
            myCallback.call(this,res)
            // this.$notify.error({
            //   title: '获取所有工类失败',
            //   message: res.data.msg,
            //   offset: 100
            // });
          }

        })
      },
      // 切换工类
      editGetPro(id) {
        this.searchForm['search.workTypeId'] = '';
        this.workTypeOption = [
          {
            id: '',
            name: '全部'
          }
        ]
        if (id == '') {
          return;
        }
        var arr = this.workClassOption;
        for (var i = 0; i < arr.length; i++) {
          if (id == arr[i].id) {
            var arr2 = arr[i].workTypes;
            for (var j = 0; j < arr2.length; j++) {
              this.workTypeOption.push(arr2[j]);
            }

          }
        }
      },
      // 打印
      goprint(editForm) {
        window.open("./?from=ins#/gfgf?workerManId=" + editForm.workerManId + '&workerTeamId=' + editForm.workerTeam.id + '&projectId=' + this.formProject.id)
      },

      // 点击进场
      clickAdd() {
        this.addForm3 = {
          cardNo: '',
          headPhotoPath: '',
        }
        this.addForm2 = {
          tel: '',
          workClassId: '',
          workTypeId: '',
          inDate: '',
          bloody: '',
          emergencyContactTel: '',
          calculationOfSalary: '',
          calculationOfSalaryNote: ''

        }
        this.addForm = {
          id: '',
          name: '',
          sex: '',
          nation: '',
          birthDate: '',
          address: '',
          idCardNo: '',
          idCardOrg: '',
          isSuedData: '',
          idCardValidata: '',
          idCardPhotoId: '',
          idCardPhotoPath: '',
          headPhotoId: '',

          imgBase: '../../../static/img/img.jpg'
        }
        this.addVisible = true;
        this.getAllWorkerType();
      },
      //关闭进场
      resetForm() {
        this.$refs['addForm'].resetFields();
        this.$refs['addForm2'].resetFields();
        this.addForm.imgBase = '../../../static/img/img.jpg';
        this.active = 0;
        this.getImgFace = true;
        this.tijiao = false;
        this.addVisible = false;
        this.imgSrc = '';
        this.imgSrc2 = '';
        this.isSureRecord = true;
        this.showIsFace = '';
        this.addForm2.workClassId = '';
        this.show = false;
        this.addForm2.calculationOfSalary = '';
        this.addForm2.calculationOfSalaryNote = '';
        this.addForm2.workClassId = '';
        this.addForm2.workTypeId = '';
        this.addForm2.inDate = '';
        this.addForm.id = '';
        this.addType = 0;
        this.addForm3.cardNo = '';
        this.getCard = false;
        this.isHeaderId = false;
      },
      //身份证号输入框获得焦点时
      IDfocus() {
        this.oldiDCard = this.addForm.idCardNo;
      },
      //查找数组中有没有
      findinarr(arr, item) {
        var json = {
          bok: false,
          index: 0
        }
        for (var i = 0; i < arr.length; i++) {
          if (arr[i].id == item) {
            json = {
              bok: true,
              index: i
            };
          }
        }
        return json;
      },
      //身份证号码变化
      iDCardChange() {
        if (this.addForm.idCardNo != this.oldiDCard) {
          this.addForm.id = '';
          this.addForm.name = '';
          this.addForm.sex = '';
          this.addForm.nation = '';
          this.addForm.address = '';
          this.addForm.idCardOrg = '';
          this.addForm.isSuedData = '';
          this.addForm.idCardValidata = '';
          this.addForm.imgBase = '../../../static/img/img.jpg';
          this.addForm.birthDate = '';
          this.addForm2.tel = '';
          this.addForm2.workClassId = '';
          this.addForm2.workTypeId = '';
          this.addForm2.inDate = '';
          this.addForm2.emergencyContactTel = '';
          this.addForm2.bloody = '';
          this.addForm2.bankAccount = '';
          this.addForm2.openAccountBank = '';
          this.imgSrc2 = '';
          this.idCardChangePhoto= '';
          this.addType = 0;
          var data = {
            projectId: this.formProject.id,
            idCardNo: this.addForm.idCardNo
          }
          getManInfoByIdOrIdCardNo(data).then((res) => {
            if (res.data.code == 0) {
              var json = res.data.data;
              if (!this.getCard) {
                this.addForm.id = json.id;
                this.addForm.name = json.name;
                this.addForm.sex = json.sex;
                this.addForm.nation = json.nation;
                this.addForm.birthDate = json.birthDate;
                this.addForm.address = json.address;
                this.addForm.idCardNo = json.idCardNo;
                this.addForm.idCardOrg = json.idCardOrg;
                this.addForm.isSuedData = json.isSuedData;
                this.addForm.idCardValidata = json.idCardValidata;
                if (json.idCardPhotoId) {
                  this.idCardChangePhoto = json.idCardPhotoId;
                  this.addForm.imgBase = '/workerman/fileupload/pageShowFile?fid=' + json.idCardPhotoId;
                }

                this.addForm2.tel = json.tel;
                if (this.findinarr(this.workList, json.workerManWorkExtends[0].workClassId).bok) {
                  if (this.findinarr(this.workList[this.findinarr(this.workList, json.workerManWorkExtends[0].workClassId).index].workTypes, json.workerManWorkExtends[0].workTypeId).bok) {
                    this.addForm2.workClassId = json.workerManWorkExtends[0].workClassId;
                    this.addChangeType2();
                    this.addForm2.workTypeId = json.workerManWorkExtends[0].workTypeId;
                  }
                }
                this.addForm2.emergencyContactTel = json.emergencyContactTel;
                if (json.bloody !== '') {
                  this.addForm2.bloody = json.bloody;
                }
                this.addForm2.bankAccount = json.bankAccount;
                this.addForm2.openAccountBank = json.openAccountBank;
                if (json.headPhotoId) {
                  this.isHeaderId = true;
                  this.addForm.headPhotoId = json.headPhotoId;
                  this.imgSrc2 = `/workerman/fileupload/pageShowFile?fid=${json.headPhotoId}`
                } else {
                  this.isHeaderId = false;
                  this.addForm.headPhotoId = '';
                }
                this.addType = 1;
                this.getCard = false;
              } else {
                this.addForm.id = json.id;
                this.addForm2.tel = json.tel;
                if (this.findinarr(this.workList, json.workerManWorkExtends[0].workClassId).bok) {
                  if (this.findinarr(this.workList[this.findinarr(this.workList, json.workerManWorkExtends[0].workClassId).index].workTypes, json.workerManWorkExtends[0].workTypeId).bok) {
                    this.addForm2.workClassId = json.workerManWorkExtends[0].workClassId;
                    this.addChangeType2();
                    this.addForm2.workTypeId = json.workerManWorkExtends[0].workTypeId;
                  }
                }
                this.addForm2.emergencyContactTel = json.emergencyContactTel;
                if (json.bloody !== '') {
                  this.addForm2.bloody = json.bloody;
                }
                this.addForm2.bankAccount = json.bankAccount;
                this.addForm2.openAccountBank = json.openAccountBank;
                if (json.headPhotoId) {
                  this.isHeaderId = true;
                  this.addForm.headPhotoId = json.headPhotoId;
                  this.imgSrc2 = `/workerman/fileupload/pageShowFile?fid=${json.headPhotoId}`
                } else {
                  this.isHeaderId = false;
                  this.addForm.headPhotoId = json.headPhotoId;
                }
                this.addType = 1;
                this.getCard = false;
              }
            } else if (res.data.code == 5) {
              this.addForm.birthDate = res.data.data;
            }
          })
        }else {
          this.idCardChangePhoto = '';
        }
      },
      //刷身份证
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

        var request = createCORS('get', 'http://127.0.0.1:24010/ZKIDROnline/ScanReadIdCardInfo?OP-DEV=1&CMD-URL=4&REPEAT=1?' + +Math.random());
        if (request) {
          request.onload = function () {
            _this.cardBok = false;
            var data = eval('(' + request.response + ')').Certificate;
            var ret = eval('(' + request.response + ')').ret;
            if (ret == '0') {
              if (data) {
                _this.addForm.idCardNo = data.IDNumber;
                _this.getCard = true;
                _this.iDCardChange()
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
            } else {
              _this.$notify.error({
                title: '读取信息失败',
                message: '请查看读卡器是否链接，或联系管理员',
                offset: 100
              });
            }
          };
          request.onreadystatechange = function () {
            if (request.readyState == 4) {
              if (request.status != 200) {
                _this.cardBok = false;
                _this.$notify.error({
                  title: '读取信息失败',
                  message: '请查看读卡器是否链接，或联系管理员',
                  offset: 100
                });
              }
            }

          }
          request.send();
        }
      },
      // 工类变化
      addChangeType2() {
        var arr = this.workList;
        this.addForm2.workTypeId = '';
        for (var i = 0; i < arr.length; i++) {
          if (this.addForm2.workClassId == arr[i].id) {
            this.workTypeList1 = arr[i].workTypes;
          }
        }
      },
      //进场提交
      add() {
        var self = this;
        this.$refs.addForm3.validate((valid) => {
          if (valid) {
            self.disabled1 = true;

            var parmas = {
              projectId: this.formProject.id,
              id: this.addForm.id,
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
              idCardPhotoPath: this.addForm.idCardPhotoPath,
              headPhotoId: this.addForm.headPhotoId,
              headPhotoPath: this.addForm3.headPhotoPath,
              tel: this.addForm2.tel,
              inDate: this.addForm2.inDate,
              'workEx.workClassId': this.addForm2.workClassId,
              'workEx.workTypeId': this.addForm2.workTypeId,
              emergencyContactTel: this.addForm2.emergencyContactTel,
              bloody: this.addForm2.bloody,
              workerTeamId: this.workerId,
              bankAccount: this.addForm2.bankAccount,
              calculationOfSalary: this.addForm2.calculationOfSalary,
              calculationOfSalaryNote: this.addForm2.calculationOfSalaryNote,
              openAccountBank: this.addForm2.openAccountBank,
              cardNo: this.addForm3.cardNo
            }
            if (this.addType == 0) {
              createManAndEnter(parmas).then((res) => {
                self.disabled1 = false;
                if (res.data.code == 0) {
                  this.$refs['addForm'].resetFields();
                  this.$refs['addForm2'].resetFields();
                  this.addForm.imgBase = '../../../static/img/img.jpg';
                  this.active = 0;
                  this.getImgFace = true;
                  this.tijiao = false;
                  this.imgSrc = '';
                  this.imgSrc2 = '';
                  this.isSureRecord = true;
                  this.showIsFace = '';
                  this.addForm2.workClassId = '';
                  this.show = false;
                  this.addForm2.calculationOfSalary = '';
                  this.addForm2.calculationOfSalaryNote = '';
                  this.addForm2.workClassId = '';
                  this.addForm2.workTypeId = '';
                  this.addForm2.inDate = '';
                  this.addForm.id = '';
                  this.addForm3.cardNo = '';
                  this.getCard = false;
                  if (document.querySelector('.demo-container .rect')) {
                    document.querySelector('.demo-container .rect').className = '';
                  }
                  this.addVisible = false;
                  this.isHeaderId = false;
                  this.addType = 0;
                  this.getList();
                  // this.$message({
                  //   type: 'success',
                  //   message: '进场成功，即将跳转打印页!'
                  // });

                  this.$notify.success({
                    title: '进场成功，即将跳转打印页!',
                    offset: 100
                  });
                } else {
                  myCallback.call(this,res)
                  // this.$notify.error({
                  //   title: '进场失败',
                  //   message: res.data.msg,
                  //   offset: 100
                  // });
                }
              }).catch(() => {
                self.disabled1 = false;
              });
            } else {
              updManAndEnter(parmas).then((res) => {
                self.disabled1 = false;
                if (res.data.code == 0) {
                  this.$refs['addForm'].resetFields();
                  this.$refs['addForm2'].resetFields();
                  this.addForm.imgBase = '../../../static/img/img.jpg';
                  this.active = 0;
                  this.getImgFace = true;
                  this.tijiao = false;
                  this.imgSrc = '';
                  this.imgSrc2 = '';
                  this.isSureRecord = true;
                  this.showIsFace = '';
                  this.addForm2.workClassId = '';
                  this.show = false;
                  this.addForm2.calculationOfSalary = '';
                  this.addForm2.calculationOfSalaryNote = '';
                  this.addForm2.workClassId = '';
                  this.addForm2.workTypeId = '';
                  this.addForm2.inDate = '';
                  this.addForm.id = '';
                  this.addForm3.cardNo = '';
                  this.getCard = false;
                  if (document.querySelector('.demo-container .rect')) {
                    document.querySelector('.demo-container .rect').className = '';
                  }

                  this.addType = 0;
                  this.getList();
                  // this.$message({
                  //   type: 'success',
                  //   message: '进场成功，即将跳转打印页!'
                  // });
                  this.$notify.success({
                    title: '进场',
                    message: '进场成功，即将跳转打印页!',
                    offset: 100
                  });
                  this.disabled1 = false;
                  this.addVisible = false;
                  this.isHeaderId = false;
                } else {
                  this.$notify.error({
                    title: '进场失败',
                    message: res.data.msg,
                    offset: 100
                  });
                }
              }).catch(() => {
                self.disabled1 = false;
              });
            }
          }
        });


      },
      // 下一步
      next() {
        this.cameraBok = false;
        if (this.active == 0) {
          this.$refs.addForm.validate((valid) => {
            if (valid) {
              let oDate = new Date().getFullYear();
              let peopleYear = this.addForm.birthDate.substring(0, 4);
              let oYear = oDate - peopleYear;
              if (oYear < 16) {
                this.$confirm('此人年龄小于16周岁为童工，是否确定进场?', '提示', {
                  type: 'warning'
                }).then(() => {
                  this.active = 1
                }).catch(() => {
                });
              } else if (oYear > 60) {
                this.$confirm('此人年龄大于60周岁，不能参加保险，是否确定进场？', '提示', {
                  type: 'warning'
                }).then(() => {
                  this.active = 1
                }).catch(() => {
                });
              } else {
                this.active = 1;
              }
            }
          });
        } else if (this.active == 1) {
          this.$refs.addForm2.validate((valid) => {
            if (valid) {
              this.active = 2;
            }
          });
        } else if (this.active == 2) {
          this.active = 3;
          this.tijiao = true;
        }

      },
      // 上一步
      prevClick() {
        this.active -= 1;
        this.cameraBok = false;
      },
    }
  }
</script>
<style scoped>
  #batchBox {
    /*min-width: 1000px;*/
    border-top: 1px solid #eee;
    padding-top: .1rem;
    font-size: .12rem;
    color: #606266;
    position: relative;
  }

  #placeholder {
    position: absolute;
    border: 1px dashed red;
  }

  #placeholder span {
    position: absolute;
    width: 10px;
    height: 10px;
    border: 2px solid red;
  }

  #placeholder .l {
    left: 0;
    border-left: none;
  }

  #placeholder .t {
    top: 0;
    border-top: none;
  }

  #placeholder .b {
    bottom: 0;
    border-bottom: none;
  }

  #placeholder .r {
    right: 0;
    border-right: none;
  }

  #placeholder .rt {
    top: 0;
    right: 0;
    border-top: none;
    border-right: none;
  }

  #placeholder .rb {
    right: 0;
    bottom: 0;
    border-right: none;
    border-bottom: none;
  }

  #placeholder .lb {
    left: 0;
    bottom: 0;
    border-bottom: none;
    border-left: none;
  }

  #placeholder .lt {
    left: 0;
    top: 0;
    border-top: none;
    border-left: none;
  }

  .rect {
    border: 2px solid #a64ceb;
    left: -1000px;
    position: absolute;
    top: -1000px;
  }

  #batchBox .operation {
    position: relative;
    overflow: hidden;
    margin-top: .2rem;
    height: .4rem;
  }

  #batchBox .operation .btns {
    width: 1.2rem;
    position: absolute;
    top: 0;
    left: 0;
  }

  #batchBox .operation .search {
    position: absolute;
    top: 0;
    right: 0;
  }

  #batchBox .operation .tabs {
    height: .3rem;
    position: absolute;
    left: 28%;
    top: 0;
    margin-left: -1.52rem;
  }

  #batchBox .operation .tabs div {
    width: 1.20rem;
    height: .3rem;
    line-height: .3rem;
    text-align: center;
    float: left;
    border: 1px solid #999;
    cursor: pointer;
  }

  #batchBox .operation .tabs .nth0 {
    border-radius: .05rem 0 0 .05rem;
  }

  #batchBox .operation .tabs .nth1 {
    border-radius: 0 .05rem .05rem 0;
  }

  #batchBox .operation .tabs .activeBtn {
    background: #409EFF;
    color: #fff;
    border: 1px solid #409EFF;
  }

  #batchBox .table {
    margin-top: .15rem;
  }

  #batchBox .recordImg {
    width: 1.15rem;
    margin-left: .2rem;
  }

  #batchBox .idCardImg {
    width: 1.15rem;
    margin-left: .2rem;
  }

  #batchBox .carmerBtn {
    margin-top: .2rem;
    float: right;
    margin-right: .1rem;
  }

  #batchBox .maskPhoto {
    width: 1.2rem;
    position: absolute;
    top: .5rem;
    left: 50%;
    margin-left: -1rem;
  }
</style>
<style>
  #batchBox .el-form-item__error {
    left: 11%;
  }

  .demo-container .rect {
    position: absolute;
    border: 1px solid red;
    display: block;
  }

  .el-dialog {
    overflow: hidden;
  }

  #steps .el-step__title {
    position: relative;
    left: -50px;
  }

  .zIndexStyleBox {
    z-index: 2333;
  }

  .wokerBox .el-form-item {
    margin-bottom: 0 !important;
  }

  .wokerBox .el-form-item__label {
    line-height: .3rem;
  }

  .wokerBox .el-form-item__content p {
    line-height: 30px;
  }

  #addIn .el-form-item__error {
    left: 0;
  }

  .activeClick {
    color: #409EFF;
    width: 100%;
    height: 100%;
    display: block;
    cursor: pointer;
  }
</style>
