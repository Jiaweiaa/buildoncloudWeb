<template>
  <div class="box">
    <!--相机弹层-->
    <el-dialog title="相机" :visible.sync="cameraVisible" :close-on-click-modal="false" :close-on-press-escape="false"
               :before-close="cameraQX" @open="cameraOpen">
      <div id="pushwebcam" v-show="!show" style="position: relative; overflow: hidden;padding-bottom: 20px;">
        <div id="my_camera" style="width:320px; height:240px;"></div>
        <el-button style="position: absolute;left: 350px;top:100px;" size="small" @click="paizao">拍照</el-button>
      </div>
      <div v-show="show" class="demo-container" style="position: relative; height: 240px; margin-bottom: 20px; ">
        <div style="vertical-align: top;position: relative;" class="demo-container">
          <canvas v-show="!show" style="" ref="myCanvas" width="320" height="240"></canvas>
          <canvas v-show="false" style="" ref="canvas_clip"></canvas>
          <div style="position: relative;vertical-align: top">
            <img id="img" style="display: block" ref="img" :src='this.imgSrc2lin'/>
            <div class="faceDivStyle" v-show="faceDivStyle" :style="faceDivStyle"></div>
          </div>
        </div>
        <el-button v-show="getImgFace" style="position: absolute;left: 350px;top: 200px;" size="small"
                   @click="cancelPhoto">取消
        </el-button>
        <el-button v-show="getImgFace" style="position: absolute;left: 400px;top: 200px;" size="small"
                   @click='surePhoto'>确定
        </el-button>
      </div>
    </el-dialog>
    <!--补录照片-->
    <el-dialog title="补录人脸" :visible.sync="photoVisible" :close-on-click-modal="false" :close-on-press-escape="false"
               :before-close="photoformQX">
      <el-form :model="photoform" :rules="rulesphoto" ref="photoform">
        <el-form-item label="人脸" label-width="110px" prop="photoPath">
          <img v-show="imgSrc2==''" src="../../../static/img/face.jpg" alt="">
          <img v-show="imgSrc2!=''" :src="imgSrc2" alt="">
          <el-button size="small" style="margin-left: 20px;" @click="takephoto2(2)">录入人脸</el-button>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="photoformQX('photoform')">取 消</el-button>
        <el-button size="small" :disabled="disabled2" type="primary" @click="photoformQD('photoform')">确 定</el-button>
      </div>
    </el-dialog>

    <!--
        查看
     -->
    <el-dialog class="wokerBox" v-if="editForm.id" title="工友详情" :visible.sync="lookVisible"
               :close-on-click-modal="false" :close-on-press-escape="false" width="60%">
      <el-form :model="editForm" label-width="110px" style="overflow: hidden;" ref="editForm">
        <div style="width:50%;position:relative;float: left;">
          <img v-if="editForm.workerMan.idCardPhotoId" style="position:  absolute;width: 115px; right:10px; top: -3px;"
               :src="`/workerman/fileupload/pageShowFile?fid=${editForm.workerMan.idCardPhotoId}`"/>
          <img v-else="editForm.workerMan.idCardPhotoId" style="position:  absolute; right:10px; top: 10px;"
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

    <!--工友进场-->
    <el-dialog class="zIndexStyleBox" :before-close="resetForm" title="创建工友信息" :visible.sync="addVisible"
               :close-on-click-modal="false" :close-on-press-escape="false">
      <div id="steps" style="width: 100%; height: 60px; position: relative; left: 12%; margin-bottom: 20px;">
        <el-steps :space="200" :active="active" finish-status="success">
          <el-step title="录取身份信息"></el-step>
          <el-step title="录取其他信息"></el-step>
          <el-step title="录取人脸"></el-step>
        </el-steps>
      </div>
      <el-form :model="addForm" label-width="130px" :rules="addFormRules" style="overflow: hidden;" ref="addForm"
               v-show="active == 0">
        <el-form-item label="身份证号" prop="idCardNo" style="width: 65%;">
          <el-input v-model="addForm.idCardNo" size="small" @focus="IDfocus" @blur="iDCardChange"
                    auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="name" style="width: 65%;">
          <el-input :maxlength="15" size="small" v-model="addForm.name" auto-complete="off"></el-input>
        </el-form-item>
        <img style="position:  absolute; right:60px; top: 142px;width: 115px;" :src="addForm.imgBase"/>
        <el-form-item label="性别" prop="sex" style="width: 65%;">
          <el-select style="height: 40px !important; width: 100%;" v-model="addForm.sex" size="small" placeholder="请选择">
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
            style="height: 40px !important; width: 100%;"
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
            style="height: 40px !important; width: 100%;"
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
            style="height: 40px !important; width: 100%;"
            size="small"
            v-model="addForm.idCardValidata"
            type="date"
            value-format="yyyyMMdd">
          </el-date-picker>
        </el-form-item>
        <el-popover trigger="hover" placement="top"
                    style="text-align: center; display: block; width: 30px; float: right;  margin-top: 5px; font-size: 20px; margin-right: 10px; cursor: pointer;">
          <p>身份证读卡器使用说明：</p>
          <p>1: 安装驱动：安装驱动文件ZKIDROnline.exe，安装后需要重启计算机。</p>
          <p>2: 接入设备：重启后，将读卡器插入USB口，读卡器发出两声蜂鸣。</p>
          <p>3: 读取信息：点击『读取身份证信息』按钮，读取成功发出一声蜂鸣.</p>
          <p>注: 如果仍有问题，请联系系统管理人员.</p>
          <div slot="reference" class="name-wrapper">
            <i class="el-icon-question"></i>
          </div>
        </el-popover>
        <el-button size="small" style="margin-bottom: 20px; float: right;" :loading="cardBok" @click="getCardData">
          读取身份证信息
        </el-button>
      </el-form>
      <el-form style="overflow: hidden;" :model="addForm2" label-width="110px" :rules="addFormRules2" ref="addForm2"
               v-show="active == 1">
        <el-form-item label="工友联系方式">
          <el-input :maxlength="11" v-model="addForm2.tel" size="small" auto-complete="off"
                    placeholder="请输入工友联系方式"></el-input>
        </el-form-item>
        <el-form-item label="工类工种" prop="workTypeId">
          <el-select style="width: 48%; margin-right: 3%;" size="small" v-model="addForm2.workClassId"
                     placeholder="选择工类" @change="addChangeType2" @visible-change="proHasChanges">
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
          <el-select size="small" style="height: 40px !important; width: 100%;" v-model="addForm2.bloody"
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
      <div class="demo-frame" v-show="active == 2" style="overflow: hidden; margin-bottom: 15px;padding-left: 60px;">
        <el-form style="overflow: hidden;" :model="addForm3" label-width="110px" :rules="addFormRules3" ref="addForm3">

          <el-form-item label="照片" prop="headPhotoPath">
            <img v-show="imgSrc2==''" src="../../../static/img/face.jpg" alt="">
            <img v-show="imgSrc2!=''" :src="imgSrc2" alt="">
            <el-button size="small" style="margin-left: 20px;" @click="takephoto2(1)">录入人脸</el-button>
          </el-form-item>
        </el-form>

      </div>
      <el-button :disabled="disabled1" size="small" style="float: right; margin-bottom: 20px;" @click="add"
                 v-show="active == 2">提交
      </el-button>
      <el-button id="1111" size="small" style="float: right; margin-bottom: 20px;" @click="next" v-show="active < 2">
        下一步
      </el-button>
      <el-button v-show="active>0" size="small" style="margin-bottom: 20px; float: right; margin-right: 20px;"
                 @click="prevClick">上一步
      </el-button>
    </el-dialog>

    <!--退场-->
    <el-dialog top="50px" title="工友退场" :visible.sync="ExitShow" :close-on-click-modal="false"
               :close-on-press-escape="false">
      <div v-if="exitData.id">
        <p style="overflow: hidden">
          <span style="float: left;width: calc(50% - 10px);text-align: right;padding-right: 10px">项目名称：</span>
          <span style="float: left;width: 50%;">{{formProject.name}}</span>
        </p>
        <p style="overflow: hidden">
          <span style="float: left;width: calc(50% - 10px);text-align: right;padding-right: 10px">班组名称：</span>
          <span style="float: left;width: 50%;">{{exitData.workerteamname}}</span>
        </p>
        <p style="overflow: hidden">
          <span style="float: left;width: calc(50% - 10px);text-align: right;padding-right: 10px">劳务公司：</span>
          <span style="float: left;width: 50%;">{{exitData.laborname}}</span>
        </p>
        <p style="overflow: hidden">
          <span style="float: left;width: calc(50% - 10px);text-align: right;padding-right: 10px">工种：</span>
          <span style="float: left;width: 50%;">{{exitData.workclassname}}&nbsp;-&nbsp;{{exitData.worktypename}}</span>
        </p>
        <p style="margin: 0 auto; width: 60%;border-bottom: 1px solid #ccc">评价</p>
        <p style="overflow: hidden;margin-top: 5px;">
          <span style="float: left;width: calc(50% - 10px);text-align: right;padding-right: 10px">技术和质量：</span>
          <span style="float: left;width: 50%;"><el-rate allow-half
                                                         v-model="ExitFrom.manSkillqualityScore"></el-rate></span>
        </p>
        <p style="margin-top: 5px; overflow: hidden;height: 120px;">
          <span style="float: left;width: calc(50% - 10px);text-align: right;padding-right: 10px; margin-top:5px;">无不良记录：</span>
          <span style="float: left;width: 50%;position: relative;">

                        <el-select style="position: absolute; top: 0;" size="small"
                                   v-model="ExitFrom.manBadRecordTypeId" placeholder="请选择不良记录类型">
                            <el-option
                              v-for="item in badList"
                              :key="item.id"
                              :label="item.name"
                              :value="item.id">
                            </el-option>
                        </el-select>
                        <el-input size="small" style="position: absolute; top: 40px;" class="textareaOverflow"
                                  type="textarea" v-model="ExitFrom.manBadRecordComment" resize="none" :rows=3
                                  placeholder="不良记录备注"></el-input>
                    </span>
        </p>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click.native="exitQX">取消</el-button>
        <el-button size="small" type="primary" @click.native="exitQD">提交</el-button>
      </div>
    </el-dialog>
    <div
      style="position: absolute;width:calc(100% - 40px);top: 0;left: 0;padding-top: 20px;padding-left: 20px;padding-right: 20px;">
      <p style="padding-bottom: 10px;border-bottom: 1px solid  #ccc">已进场班组：
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
          @blur="toFalse"
          @change="steamChange"
          size="small"
          style="width: 200px;"
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
        <el-button size="small" type="primary" style="margin-left: 50px;" v-if="teamCount" @click="clickAdd">工友进场
        </el-button>

      </p>
      <div>
        <ul style="overflow: hidden;min-width: 1000px; height: 42px;line-height: 42px;padding-top: 10px;">
          <li style="float: left;width: 200px;">
            工友姓名:
            <el-input size="small" :maxlength="15" style="width: 120px;" v-model="queryManFrom['search.name']"
                      placeholder="工友姓名" auto-complete="off"></el-input>
          </li>
          <li style="float: left;width: 200px;">
            联系方式:
            <el-input size="small" :maxlength="11" style="width: 120px;" v-model="queryManFrom['search.tel']"
                      placeholder="联系方式" auto-complete="off"></el-input>
          </li>
          <li style="float: left;width: 200px;text-align: center;">
            工类:
            <el-select style="width: 100px;" v-model="queryManFrom['search.workClassId']" placeholder="请选工类"
                       @change="editGetPro(queryManFrom['search.workClassId'])" size="small"
                       @visible-change="proHasChanges">
              <el-option
                v-for="item in workClassOption"
                :label="item.name"
                :key="item.id"
                :value="item.id">
              </el-option>
            </el-select>
          </li>
          <li style="float: left;width: 200px;">
            工种:
            <el-select size="small" style="width: 100px;" v-model="queryManFrom['search.workTypeId']"
                       placeholder="请选工种">
              <el-option
                v-for="item in workTypeOption"
                :label="item.name"
                :key="item.id"
                :value="item.id">
              </el-option>
            </el-select>
          </li>
          <li style="float: left;width: 300px;">
            <el-button style="" size="small" @click="ForExcel">导出excel</el-button>
            <el-button style="" size="small" @click="resetqueryManFrom" icon="el-icon-refresh">重置</el-button>
            <el-button style="" size="small" type="primary" icon="el-icon-search" @click="getList">搜索</el-button>
          </li>
        </ul>
        <!--
              页面列表
          -->
        <el-table
          stripe
          class="table"
          v-loading="loading"
          :data="listData"
          border
          style="min-width: 1100px;margin-top: 10px;">
          <el-table-column
            label="姓名"
            min-width="10%"
            :show-overflow-tooltip="true"
            align="center">
            <template scope="scope">
              <p @click="lookThis(scope.row)"
                 style="color: #409EFF; width:100%; height: 100%; display: block; cursor: pointer;">{{
                scope.row.workermanname ? scope.row.workermanname : ''}}</p>
            </template>
          </el-table-column>
          <el-table-column
            min-width="10%"
            :show-overflow-tooltip="true"
            label="电话号"
            align="center">
            <template scope="scope">
              <span>{{ scope.row.tel ? scope.row.tel  : ''}}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="性别"
            min-width="8%"
            :show-overflow-tooltip="true"
            align="center">
            <template scope="scope">
              <span>{{ scope.row.sex ? scope.row.sex  : ''}}</span>
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
            label="劳务公司信息"
            min-width="14%"
            :show-overflow-tooltip="true"
            align="center">
            <template scope="scope">
              <span>{{ scope.row.laborname}}</span>
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
                size="small"
                type="text"
                style="color: red;"
                @click="Exit(scope.row)">退场
              </el-button>
              <!--<el-button-->
              <!--size="small"-->
              <!--type="text"-->
              <!--@click="makeupbuckle(scope.row)">补录卡扣</el-button>-->
              <el-button
                size="small"
                type="text"
                @click="photobuckle(scope.row)">补录人脸
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          style="float: right;margin-top: 10px;"
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


    <!--选择导出项-->
    <el-dialog title="选择导出项" :visible.sync="excelVisible" :close-on-click-modal="false" :close-on-press-escape="false"
               :before-close="photoformQX">
      <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
      <div style="margin: 15px 0;"></div>
      <el-checkbox-group v-model="checkedrowLists" @change="handleCheckedCitiesChange">
        <el-checkbox v-for="row in rowList" :label="row.id" :key="row.id">{{row.name}}</el-checkbox>
      </el-checkbox-group>
      <el-button style="float: right;" size="small" @click="cencelExcel">取消</el-button>
      <el-button style="float: right; margin-right: 10px; margin-bottom: 20px;" type="primary" size="small"
                 @click='sureExcel'>确定
      </el-button>

    </el-dialog>

  </div>
</template>
<script>
  import {
    queryWorkerTeamListInProject02,
    queryManListForEnter,
    workClass,
    createManAndEnter,
    getManInfoByIdOrIdCardNo,
    updManAndEnter,
    manOutProject,
    getClassAndTypeByWorkerTeamIdAndProjectId,
    getFaceInfosByBase64,
    updateRfidCardByWorkerManAndProject,
    updateFaceByWorkerMan,
    isTelExists,
    getManInfoByProject
  } from '../../api/projectapi'
  import {
    getWorkerTeamList,
    getWorkerList,
    getRecruitWorkerList,
    upFileDo,
    getCardData,
    getWorkerInfo,
    checkIdcard,
    unLockDoorAccess,
    badRecordList,
    getRowData
  } from '../../api/api';

  export default {
    props: {
      formProject: {
        type: Object
      }
    },
    data() {
      Date.prototype.Format = function (fmt) { //author: meizz
        var o = {
          "M+": this.getMonth() + 1, //月份
          "d+": this.getDate(), //日
          "h+": this.getHours(), //小时
          "m+": this.getMinutes(), //分
          "s+": this.getSeconds(), //秒
          "q+": Math.floor((this.getMonth() + 3) / 3), //季度
          "S": this.getMilliseconds() //毫秒
        };
        if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o)
          if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
      }
      //校验联系方式与紧急联系方式
      var validateemergencyContactTel = (rule, value, callback) => {
        if (value === '') {
          callback();
        } else {
          callback();
        }
      };
      //校验工友姓名
      var validateName = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入工友姓名！'));
        } else {
          // var reg = /^[\u4e00-\u9fa5]{1,15}$/;
          // if(!reg.test(value)) {
          //     callback(new Error('1-15个汉字'));
          // }else {
          //     callback();
          // }
          callback();
        }
      };

      // 校验工类
      var validateworkType = (rule, value, callback) => {
        if (this.addForm2.workClassId === '') {
          callback(new Error('请选择工类！'));
        } else {
          if (this.addForm2.workTypeId === '') {
            callback(new Error('请选择工类！'));
          } else {
            callback();
          }
        }
      };
      // 校验身份证
      var validateIdcard = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入身份证号！'));
        } else {
          // var parmas = {
          //     'idCardNo' : value,
          //     enter:'哈哈'
          // }
          // checkIdcard(parmas).then((res) => {
          //     if(res.data.code == 0) {
          //         this.addForm.birthDate = res.data.msg;
          //         callback();
          //     }else {
          //         callback(new Error(res.data.msg));
          //     }
          // })

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

      // 校验手机
      var validatePhone = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入手机号！'));
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
      // 校验手机重复
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
      return {
        excelVisible: false,

        disabled1: false,
        disabled2: false,
        //拍照
        //占位div style
        placeholderStyle: {
          width: '',
          height: '',
          left: '',
          top: ''
        },
        //占位div 显示
        placeholderShow: false,
        placeholderSpanShow: true,


        // 获取身份证开关
        cardBok: false,
        //退场
        ExitFrom: {
          projectId: this.formProject.id,
          workerManId: '',
          manBadRecordComment: '',
          manBadRecordTypeId: '',
          manSkillqualityScore: 0
        },
        ExitShow: false,
        exitData: {},
        //分页
        total: 1,
        currentPage: 1,
        pagesize: 10,
        pageNo: 1,
        //列表数据
        listData: [],
        //列表loding
        loading: false,
        //班组搜索
        workerId: '',
        workerOptions: [],
        workerloading: false,
        //班组 进场工友列表显示
        teamCount: false,
        queryManFrom: {
          pageSize: 10,
          pageNo: 1,
          'search.name': '',
          'search.tel': '',
          'search.workClassId': '',
          'search.workTypeId': '',
          'search.workerTeamId': '',
          'search.projectId': this.formProject.id
        },
        // 工类option
        workClassOption: [
          {
            id: '',
            name: '全部'
          }
        ],
        //工种option
        workTypeOption: [
          {
            id: '',
            name: '全部'
          }
        ],
        //查看工友
        workerMsgShow: false,
        workerMsgForm: {},
        //新增工友并进场工友
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
        workTypeList1: [],
        // 班组列表
        workerTeamListData: [],


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

        active: 0,

        imgSrc: '',
        imgSrc2: '',
        //临时
        imgSrc2lin: '',
        show: false,
        cameraBok: false,
        getImgFace: true,
        tijiao: false,

        //进场类型
        addType: 0,
        //查看
        lookVisible: false,
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
        editWorkTypeId: '',
        workTypeList2: [],
        //补录卡扣
        makeupVisible: false,
        makeupform: {
          projectId: this.formProject.id,
          workerManId: '',
          rfidCardNo: ''
        },
        rulesmakeup: {
          rfidCardNo: [
            {required: true, message: '卡扣id不能为空', trigger: 'blur'}
          ],
        },
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
        //相机数据
        cameraVisible: false,
        //拍照类型
        cameraType: 0,
        //人脸区域div
        faceDivStyle: {
          width: '',
          height: '',
          left: '',
          top: ''
        },
        faceDivStyleShow: false,
        teamIndate: '',
        workerloadingText: '班组长姓名、班组长电话',
        getCard: false,
        oldiDCard: '',
        newiDCard: '',
        isHeaderId: false,
        badList: [],


        checkedrowLists: [],
        nowcheckedArr: [],
        rowList: [],
        checkAll: false,
        isIndeterminate: true
      }
    },
    created() {
      if (window.localStorage.getItem('advanceTeamId') !== null && window.localStorage.getItem('advanceTeamName') !== null) {
        this.workerId = window.localStorage.getItem('advanceTeamId');
        this.workerOptions = [
          {
            id: window.localStorage.getItem('advanceTeamId'),
            workteamname: window.localStorage.getItem('advanceTeamName')
          }
        ];
        this.queryManFrom['search.workerTeamId'] = this.workerId;
        this.getList();
      }

    },
    mounted() {
      this.getList();
      this.getBadList();
      this.getRow();
      this.workClass();
      this.$nextTick(function () {
        Webcam.set({
          width: 320,
          height: 240,
          dest_width: 320,
          dest_height: 240,
          image_format: 'jpeg',
          jpeg_quality: 100,
          force_flash: false,
          flip_horiz: true,
          fps: 45
        });
      })

    },
    methods: {

      // 导出excel
      sureExcel() {
        if (this.checkedrowLists == '') {
          this.$notify.error({
            title: '请选择要导出的列',
            offset: 100
          });

        } else {
          window.open('/workerman/business/workerman/exportEnterManList?search.name=' + this.queryManFrom['search.name'] + '&search.tel=' + this.queryManFrom['search.tel'] + '&search.workClassId=' + this.queryManFrom['search.workClassId'] + 'search.workTypeId&=' + this.queryManFrom['search.workTypeId'] + '&search.projectId=' + this.formProject.id + '&cellNums=' + this.checkedrowLists, '导出excel');
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

      // 解锁
      Unchain(val) {
        var parmas = {
          'projectId': this.formProject.id,
          'workerManId': val.id
        }

        unLockDoorAccess(parmas).then((res) => {
          if (res.data.code == 0) {
            this.$notify.success({
              title: '解锁成功',
              message: res.data.msg,
              offset: 100
            });
          } else {
            this.$notify.error({
              title: '解锁失败',
              message: res.data.msg,
              offset: 100
            });
          }
          this.getList();
        })
      },
      // 获取不良记录
      getBadList() {
        badRecordList().then((res) => {
          this.badList = res.data.data;
        })
      },

      ForExcel() {
        this.excelVisible = true;
      },
      //身份证号输入框获得焦点时
      IDfocus() {
        this.oldiDCard = this.addForm.idCardNo;
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
        }
      },
      toFalse() {
        this.workerloadingText = '班组长姓名、班组长电话';
      },
      removeReadOnly(e) {
        e.target.readOnly = false;
      },
      //打印
      goprint(editForm) {
        window.open("./?from=ins#/gfgf?workerManId=" + editForm.workerManId + '&workerTeamId=' + editForm.workerTeam.id + '&projectId=' + this.formProject.id)
      },
      //打开相机
      cameraOpen() {
        var self = this;
        this.$nextTick(function () {
          Webcam.attach('#my_camera');
        })
      },
      //拍照
      paizao() {
        var self = this;
        Webcam.snap(function (data_uri) {
          self.show = true;
          self.imgSrc2lin = data_uri;
        });

      },
      //照片取消
      cancelPhoto() {
        this.show = false;
        this.imgSrc2lin = '';
        this.faceDivStyle = {
          width: '',
          height: '',
          left: '',
          top: ''
        }
      },
      //照片确定
      surePhoto() {
        this.imgSrc2 = this.imgSrc2lin;
        this.getImgFace = true;
        Webcam.reset();
        this.cameraVisible = false;
        this.show = false;
        this.imgSrc2lin = '';
        //获取头部id
        var parmas = {
          imgStr: this.imgSrc2.substring(22)
        }
        upFileDo(parmas).then((res) => {
          if (this.cameraType == 1) {
            this.addForm3.headPhotoPath = res.data.data;

          } else {
            this.photoform.photoPath = res.data.data;
          }
        })
      },
      //相机弹层关闭
      cameraQX() {
        this.getImgFace = true;
        Webcam.reset();
        this.cameraVisible = false;
        this.imgSrc2lin = '';
        this.show = false;
      },

      //录入照片按钮
      takephoto2(type) {
        this.cameraType = type;
        this.cameraVisible = true;


      },
      //补录卡扣
      makeupbuckle(item) {
        this.makeupVisible = true;
        this.makeupform.workerManId = item.id;

      },
      //补录卡扣取消
      makeupQX(formName) {
        this.makeupVisible = false;
        this.makeupform.rfidCardNo = '';
        this.makeupform.workerManId = '';
        this.$refs[formName].resetFields();
      },
      //补录卡扣确定
      makeupQD(formName) {
        var self = this;
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.makeupVisible = false;
            var data = this.makeupform;
            updateRfidCardByWorkerManAndProject(data).then((res) => {
              if (res.data.code == 0) {
                // self.$message({
                //     type: 'success',
                //     message: '补录卡扣成功!'
                // });
                self.$notify.success({
                  title: '补卡!',
                  message: '补录卡扣成功',
                  // offset: 100
                });
                self.makeupform.rfidCardNo = '';
                self.makeupform.workerManId = '';
              } else {
                this.$notify.error({
                  title: '补录卡扣失败',
                  message: res.data.msg,
                  offset: 100
                });
              }
            })
          } else {
            console.log('error submit!!');
            return false;
          }
        });

      },

      //补录照片
      photobuckle(item) {
        this.photoVisible = true;
        this.photoform.workerManId = item.id;
      },
      //补录照片取消
      photoformQX(formName) {
        this.photoVisible = false;
        this.photoform.workerManId = '';
        this.photoform.photoPath = '';
        this.$refs['photoform'].resetFields();
        this.imgSrc2 = '';
        this.imgSrc2lin = '';
        this.faceDivStyle = {
          width: '',
          height: '',
          left: '',
          top: ''
        }
      },
      //补录照片确定
      photoformQD(formName) {
        var self = this;
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.disabled2 = true;
            var data = this.photoform;
            updateFaceByWorkerMan(data).then((res) => {
              this.disabled2 = false;

              if (res.data.code == 0) {
                // self.$message({
                //     type: 'success',
                //     message: '补录人脸照片成功!'
                // });
                self.$notify.success({
                  title: '补录!',
                  message: '补录人脸照片成功',
                  // offset: 100
                });
                self.getImgFace = true;
                self.tijiao = false;
                self.imgSrc2 = '';
                self.imgSrc2lin = '';
                this.photoVisible = false;
                this.photoform.workerManId = '';
                this.photoform.photoPath = '';
                this.photoVisible = false;
              } else {
                this.$notify.error({
                  title: '补录人脸照片失败',
                  message: res.data.msg,
                  offset: 100
                });
              }
            }).catch(() => {
              self.disabled2 = false;
            });
          } else {
            console.log('error submit!!');
            return false;
          }
        });

      },

      //转换时间
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
      //重置
      resetqueryManFrom() {
        this.queryManFrom = {
          pageSize: 10,
          pageNo: 1,
          'search.name': '',
          'search.tel': '',
          'search.workClassId': '',
          'search.workTypeId': '',
          'search.workerTeamId': this.workerId,
          'search.projectId': this.formProject.id
        }
        this.workTypeOption = [
          {
            id: '',
            name: '全部'
          }
        ]
      },
      // 获取所有工类
      workClass() {
        workClass().then((res) => {
          if (!res) {
            return;
          }
          if (res.data.code == 0) {
            var arr = res.data.data;
            for (var i = 0; i < arr.length; i++) {
              this.workClassOption.push(arr[i])
            }
          } else {
            this.$notify.error({
              title: '获取所有工类失败',
              message: res.data.msg,
              offset: 100
            });
          }

        })
      },
      editGetPro(id) {
        this.queryManFrom['search.workTypeId'] = '';
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
      proHasChanges() {

      },
      //分页
      //每页条数改变
      handleSizeChange(val) {
        this.queryManFrom.pageSize = val;
        this.getList();
      },
      //页数改变
      handleCurrentChange(val) {
        this.queryManFrom.pageNo = val;
        this.getList();
      },
      //班组切换
      steamChange(val) {
        if (val == '') {
          this.listData = [];
          this.teamCount = false;
          this.queryManFrom['search.workerTeamId'] = '';
          this.teamIndate = '';
          this.workerOptions = [];
          this.getList();
          return;
        }
        this.queryManFrom['search.workerTeamId'] = val;
        var arr = this.workerOptions;
        for (var i = 0; i < arr.length; i++) {
          if (arr[i].id == val) {
            this.teamIndate = arr[i].in_date
          }
        }
        this.getList();
        this.getAllWorkerType();
      },
      //获取列表
      getList() {
        this.loading = true;
        queryManListForEnter(this.queryManFrom).then((res) => {
          if (!res) {
            return;
          }
          if (res.data.code == 0) {
            this.listData = res.data.data.list;
            for (var i = 0; i < this.listData.length; i++) {
              if (this.listData[i].sex == 1) {
                this.listData[i].sex = '男';
              } else {
                this.listData[i].sex = '女';
              }
            }

            this.total = res.data.data.totalCount;
            if (this.workerId != '') {
              this.teamCount = true;
            }
            this.loading = false;
          } else {
            this.loading = false;
            this.$notify.error({
              title: '获取列表失败',
              message: res.data.msg,
              offset: 100
            });
          }
        });
      },
      //班组搜索
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
              console.log(this.workerOptions);
              this.workerloading = false;
            } else {
              this.workerloading = false;
              this.$notify.error({
                title: '失败',
                message: res.data.msg,
                offset: 100
              });
            }
          });
        }
      },

      /*
            * 工友进场
            *
            * */

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
        this.imgSrc2lin = '';
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
                  this.imgSrc2lin = '';
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
                  //     type: 'success',
                  //     message: '进场成功，即将跳转打印页!'
                  // });
                  this.$notify.success({
                    // title: '进场成功，即将跳转打印页!',
                    title: '进场成功!',
                    // message: '补录人脸照片成功',
                    // offset: 100
                  });
                  // setTimeout(function () {
                  //   window.open("./?from=ins#/gfgf?workerManId=" + res.data.data.id + '&workerTeamId=' + res.data.data.workerTeamId + '&projectId=' + self.formProject.id)
                  // }, 300)

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
                  this.imgSrc2lin = '';
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
                  //     type: 'success',
                  //     message: '进场成功，即将跳转打印页!'
                  // });
                  this.$notify.success({
                    // title: '进场成功，即将跳转打印页!',
                    title: '进场成功!',
                    // message: '补录人脸照片成功',
                    // offset: 100
                  });
                  self.disabled1 = false;
                  this.addVisible = false;
                  this.isHeaderId = false;
                  // setTimeout(function () {
                  //   window.open("./?from=ins#/gfgf?workerManId=" + res.data.data.id + '&workerTeamId=' + res.data.data.workerTeamId + '&projectId=' + self.formProject.id)
                  // }, 300)
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

      // 上一步
      prevClick() {
        this.active -= 1;
        this.cameraBok = false;
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

        var request = createCORS('get', 'http://127.0.0.1:24010/ZKIDROnline/ScanReadIdCardInfo?OP-DEV=1&CMD-URL=4&REPEAT=1?' + Math.random());
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
      // 入场按钮
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
            this.$notify.error({
              title: '获取所有工类失败',
              message: res.data.msg,
              offset: 100
            });
          }

        })
      },
      addChangeType(val) {
        var parmas = {
          workClassId: val
        }
        this.addForm2.workTypeId = '';
        getRecruitWorkerList(parmas).then((res) => {
          this.workTypeList1 = res.data.data;
        })
      },
      addChangeType2() {
        var arr = this.workList;
        this.addForm2.workTypeId = '';
        for (var i = 0; i < arr.length; i++) {
          if (this.addForm2.workClassId == arr[i].id) {
            this.workTypeList1 = arr[i].workTypes;
          }
        }
      },
      proHasChanges() {

      },
      //查看
      lookThis(row) {
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
            this.$notify.error({
              title: '获取工友详情失败',
              message: res.data.msg,
              offset: 100
            });
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
      typeChange(val) {
        this.editForm.workTypeId = val;
      },
      editChangeType(val) {
        var parmas = {
          workClassId: val
        }
        this.editForm.workTypeId = '';
        this.editWorkTypeId = '';
        getRecruitWorkerList(parmas).then((res) => {
          this.workTypeList2 = res.data.data;
        })
      },
      //退场
      Exit(item) {
        this.exitData = item;
        this.ExitShow = true;

      },
      exitQX() {
        this.ExitShow = false;
        this.exitData = {}
        this.ExitFrom = {
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
          this.ExitFrom.workerManId = this.exitData.id;
          this.ExitFrom.manSkillqualityScore = this.ExitFrom.manSkillqualityScore * 2;
          this.ExitShow = false;
          manOutProject(this.ExitFrom).then((res) => {
            if (res.data.code == 0) {
              // this.$message({
              //     type: 'success',
              //     message: '退场成功!'
              // });
              this.$notify.success({
                title: '退场!',
                message: '退场成功',
                // offset: 100
              });
              this.ExitFrom = {
                projectId: this.formProject.id,
                workerManId: '',
                manBadRecordScore: 0,
                manSkillqualityScore: 0,
              }
              this.getList();
            } else {
              this.$notify.error({
                title: '退场失败',
                message: res.data.msg,
                offset: 100
              });
            }
          });
        }).catch(() => {
        });

      }
    },
  }
</script>
<style scoped>
  .box {
    min-width: 1000px;
    border-top: 1px solid #eee;
    padding-top: 10px;
    font-size: 12px;
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

  .faceDivStyle {
    border: 1px solid red;
    position: absolute;
    left: 0;
    top: 0;
  }
</style>
<style>
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
    line-height: 30px;
  }

  .wokerBox .el-form-item__content p {
    line-height: 30px;
  }
</style>
