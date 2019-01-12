<template>
  <div class="team">
    <!--编辑-->
    <el-dialog id="aaa2" v-if="editVisible" top=".5rem" title="已进场班组编辑" :visible.sync="editVisible"
               :close-on-click-modal="false" :close-on-press-escape="false" width="13rem">
      <el-form :model="editTeamForm" label-width="1.6rem" :rules="editTeamRules" ref="editMsg">
        <div style="overflow: hidden;line-height:.24rem;">
          <el-form-item label="班组名称：" style="width: 50%;float: left;">
            <p>{{editMsg.workerTeam.name}}</p>
          </el-form-item>
          <el-form-item label="所属分公司：" style="width: 50%;float: left;">
            <p>{{editMsg.workerTeam.unit.name}}</p>
          </el-form-item>
          <el-form-item label="班组长姓名：" style="width: 50%;float: left;">
            <p>{{editMsg.workerTeam.teamLeaderName}}</p>
          </el-form-item>
          <el-form-item label="联系方式：" style="width: 50%;float: left;">
            <p>{{editMsg.workerTeam.teamLeaderTel}}</p>
          </el-form-item>

          <el-form-item label="身份证号：" style="width: 50%;float: left;">
            <p>{{editMsg.workerTeam.idCardNo}}</p>
          </el-form-item>
        </div>
        <el-form-item style="margin-bottom: 0px;" label="轻工辅料情况：">
          <p>{{editMsg.workerTeam.materialIs}}</p>
        </el-form-item>
        <div style="line-height: .24rem;overflow: hidden;padding-bottom: .1rem;">
          <el-form-item label="劳务公司名称：" style="width: 50%;float: left;">
            <p>{{editMsg.laborServiceCompany ? editMsg.laborServiceCompany.name : ''}}</p>
          </el-form-item>
          <el-form-item label="可组织人数：" style="width: 50%; float: right;">
            <p>{{editMsg.workerTeam ? editMsg.workerTeam.workerCount : ''}}</p>
          </el-form-item>
          <el-form-item label="银行账号：" style="width: 50%; float: left;">
            <p>{{editMsg.workerTeam ? editMsg.workerTeam.bankAccount : ''}}</p>
          </el-form-item>
          <el-form-item label="开户行地址：" style="width: 50%; float: right;">
            <p>{{editMsg.workerTeam ? editMsg.workerTeam.openAccountBank : ''}}</p>
          </el-form-item>
          <!--<el-form-item label="班组负责人姓名：" style="width: 50%; float: left;" prop="name">-->
          <!--<el-input size="small" style="width: 2rem;" v-model="editTeamForm.name"></el-input>-->
          <!--</el-form-item>-->
          <!--<el-form-item label="班组联系方式：" style="width: 50%; float: right;" prop="tel">-->
          <!--<el-input size="small" style="width: 2rem;" v-model="editTeamForm.tel"></el-input>-->
          <!--</el-form-item>-->
          <!--<el-form-item label="劳务公司负责人姓名：" style="width: 50%; float: left;">-->
          <!--<el-input size="small" style="width: 2rem;" v-model="editTeamForm.laborBehalfName"></el-input>-->
          <!--</el-form-item>-->
          <!--<el-form-item label="劳务公司负责人电话：" style="width: 50%; float: right;">-->
          <!--<el-input size="small" style="width: 2rem;" v-model="editTeamForm.laborBehalfTel"></el-input>-->
          <!--</el-form-item>-->
        </div>
        <div style="padding-top: .1rem;">
          <el-form-item label="已选择工种：" style="width: 100%;">
            <el-table
              stripe
              :data="editMsg.extend"
              border
              style="width:10.5rem"
            >
              <el-table-column
                label="工种"
                align="center">
                <template scope="scope">
                  <span>{{ scope.row.workClass.name ? scope.row.workClass.name  : ''}}&nbsp;-&nbsp;{{ scope.row.workType.name ? scope.row.workType.name  : ''}}</span>
                </template>
              </el-table-column>
              <el-table-column
                label="上午上工时间"
                align="center">
                <template scope="scope">
                  <span>{{ scope.row.morningStart ? scope.row.morningStart   : ''}} </span>
                </template>
              </el-table-column>
              <el-table-column
                label="上午下工时间"
                align="center">
                <template scope="scope">
                  <span>{{ scope.row.morningEnd ? scope.row.morningEnd   : ''}} </span>
                </template>
              </el-table-column>
              <el-table-column
                label="下午上工时间"
                align="center">
                <template scope="scope">
                  <span>{{ scope.row.afternoonStart ? scope.row.afternoonStart   : ''}}  </span>
                </template>
              </el-table-column>
              <el-table-column
                label="下午下工时间"
                align="center">
                <template scope="scope">
                  <span>{{ scope.row.afternoonEnd ? scope.row.afternoonEnd   : ''}} </span>
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>
          <el-form-item label="添加工种：" style="width: 100%;padding-top: .1rem;" prop="classTypes">
            <ul style="position: relative;width:10.56rem;">
              <i class="el-icon-circle-plus"
                 style="position: absolute;right: -.3rem;top: .1rem; width: .3rem;height:.3rem;font-size: .2rem;cursor: pointer"
                 @click="addclassTypes3"></i>
              <li>
                <ul class="box clearfloat">
                  <li class="item">工种</li>
                  <li class="item">上午上工时间</li>
                  <li class="item">上午下工时间</li>
                  <li class="item">下午上工时间</li>
                  <li class="item">下午下工时间</li>
                </ul>
              </li>
              <li v-for="(item,index) in classTypes3" style="position: relative">
                <ul class="box clearfloat">
                  <li class="item">
                    <el-select size="small" style="width: 1rem;" v-model="item.workClass" placeholder="请选工类"
                               @change="editGetPro4(item.workClass,index)" @visible-change="proHasChanges">
                      <el-option
                        v-for="item in workClassOption"
                        :label="item.name"
                        :key="item.id"
                        :value="item.id">
                      </el-option>
                    </el-select>
                    <el-select size="small" style="width: 1rem;" v-model="item.workType" placeholder="请选工种"
                               @visible-change="workTypeChanges(item.workClass,index)">
                      <el-option
                        v-for="item in workTypeOption"
                        :label="item.name"
                        :key="item.id"
                        :value="item.id">
                      </el-option>
                    </el-select>
                  </li>
                  <li class="item">
                    <el-time-select
                      style="width: 1.5rem;"
                      size="small"
                      placeholder="06:00"
                      v-model="item.amin"
                      format="HH-mm-ss"
                      :picker-options="{
      start: '06:00',
      step: '00:15',
      end: '10:30'
    }">
                    </el-time-select>
                  </li>
                  <li class="item">
                    <el-time-select
                      style="width: 1.5rem;"
                      size="small"
                      placeholder="10:30"
                      v-model="item.amout"
                      :picker-options="{
      start: '10:30',
      step: '00:15',
      end: '12:00'
    }">
                    </el-time-select>
                  </li>
                  <li class="item">
                    <el-time-select
                      style="width: 1.5rem;"
                      size="small"
                      placeholder="13:00"
                      v-model="item.pmin"
                      :picker-options="{
      start: '13:00',
      step: '00:15',
      end: '14:00'
    }">
                    </el-time-select>
                  </li>
                  <li class="item">
                    <el-time-select
                      style="width: 1.5rem;"
                      size="small"
                      placeholder="17:00"
                      v-model="item.pmout"
                      :picker-options="{
      start: '17:00',
      step: '00:15:00',
      end: '19:00'
    }">
                    </el-time-select>
                  </li>
                </ul>
                <i class="el-icon-delete"
                   style="position: absolute;right: -.3rem;top: .1rem; width: .3rem;height:.3rem;font-size: .2rem;cursor: pointer"
                   @click="jianclassTypes3(index)"></i>
              </li>
            </ul>
          </el-form-item>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click.native="editTeamQX">取消</el-button>
        <el-button size="small" type="primary" @click.native="editTeamQD">提交</el-button>
      </div>
    </el-dialog>
    <!--退场-->
    <el-dialog top="50px" title="退场" :visible.sync="exitVisible" :close-on-click-modal="false"
               :close-on-press-escape="false">
      <div>
        <p style="overflow: hidden">
          <span style="float: left;width: calc(50% - .1rem);text-align: right;padding-right: .1rem">项目名称：</span>
          <span style="float: left;width: 50%;">{{formProject.name}}</span>
        </p>
        <p style="overflow: hidden">
          <span style="float: left;width: calc(50% - .1rem);text-align: right;padding-right: .1rem">班组名称：</span>
          <span style="float: left;width: 50%;">{{exitData.workteamname}}</span>
        </p>
        <p style="overflow: hidden">
          <span style="float: left;width: calc(50% - .1rem);text-align: right;padding-right: .1rem">劳务公司：</span>
          <span style="float: left;width: 50%;">{{exitData.laborcompanyname}}</span>
        </p>
        <p style="overflow: hidden">
          <span style="float: left;width: calc(50% - .1rem);text-align: right;padding-right: .1rem">工种：</span>
          <span style="float: left;width: 50%;">{{exitData.classtype}}</span>
        </p>
        <p style="margin: 0 auto; width: 60%;border-bottom: 1px solid #ccc">评价</p>
        <p style="overflow: hidden">
          <span style="float: left;width: calc(50% - .1rem);text-align: right;padding-right: .1rem;  margin: .1rem 0;">评分：</span>
          <span style="float: left;width: 50%;"><el-rate v-model="exitFrom.score"></el-rate></span>
        </p>
        <p style="overflow: hidden">
          <span style="float: left;width: calc(50% - .1rem);text-align: right;padding-right: .1rem;  margin: .1rem 0;">评价：</span>
          <span style="float: left;width: 50%;">
          <el-input size="small" class="textareaOverflow" :autosize="true" type="textarea" :rows="2"
                    v-model="exitFrom.evaluate" placeholder="请输入评价" auto-complete="off" resize="none"></el-input>
          </span>
        </p>
        <p style="overflow: hidden">
          <span style="float: left;width: calc(50% - .1rem);text-align: right;padding-right: .1rem; margin: .1rem 0;">是否有不良记录：</span>
          <span style="float: left;width: 50%;">
            <el-radio-group style="margin-top: .1rem;" v-model="exitFrom.haveBadRecord">
              <el-radio class="radio" :label="0">没有不良记录</el-radio>
              <el-radio class="radio" :label="1">有不良记录</el-radio>
            </el-radio-group>
          </span>
        </p>
        <p style="overflow: hidden" v-show="exitFrom.haveBadRecord === 1">
          <span style="float: left;width: calc(50% - .1rem);text-align: right;padding-right: .1rem;  margin: .1rem 0;">不良记录：</span>
          <span style="float: left;width: 50%;">
            <el-input size="small" class="textareaOverflow" :autosize="true" type="textarea" :rows="2"
                      v-model="exitFrom.badRecordNote" placeholder="请输入不良记录内容" auto-complete="off"
                      resize="none"></el-input>
          </span>
        </p>

        <!--<p style="overflow: hidden">-->
        <!--<span style="float: left;width: calc(50% - .1rem);text-align: right;padding-right: .1rem">服务配合度：</span>-->
        <!--<span style="float: left;width: 50%;"><el-rate allow-half-->
        <!--v-model="exitFrom.teamServiceScore"></el-rate></span>-->
        <!--</p>-->
        <!--<p style="overflow: hidden">-->
        <!--<span style="float: left;width: calc(50% - .1rem);text-align: right;padding-right: .1rem">垫资能力：</span>-->
        <!--<span style="float: left;width: 50%;"><el-rate allow-half-->
        <!--v-model="exitFrom.teamAdvanceScore"></el-rate></span>-->
        <!--</p>-->
        <!--<p style="overflow: hidden">-->
        <!--<span style="float: left;width: calc(50% - .1rem);text-align: right;padding-right: .1rem">劳动力组织能：</span>-->
        <!--<span style="float: left;width: 50%;"><el-rate allow-half v-model="exitFrom.teamOrganizationScore"></el-rate></span>-->
        <!--</p>-->
        <!--<p style="overflow: hidden">-->
        <!--<span style="float: left;width: calc(50% - .1rem);text-align: right;padding-right: .1rem">无不良记录：</span>-->
        <!--<span style="float: left;width: 50%;"><el-rate allow-half-->
        <!--v-model="exitFrom.teamBadRecordScore"></el-rate></span>-->
        <!--</p>-->
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click.native="exitQX">取消</el-button>
        <el-button size="small" type="primary" @click.native="exitQD">提交</el-button>
      </div>
    </el-dialog>
    <!--创建劳务公司-->
    <el-dialog id="lwgs" title="创建劳务公司" :visible.sync="addVisible" :close-on-click-modal="false"
               :before-close="handleClose" :close-on-press-escape="false">
      <el-form :model="addForm" label-width="1.1rem" :rules="addFormRules" ref="addForm">
        <el-form-item label="公司名称" prop="name">
          <el-input :maxlength="20" size="small" v-model="addForm.name" placeholder="请输入公司名称"
                    auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="所属分公司" prop="unitId">
          <p>{{formProject.unit.name}}</p>
        </el-form-item>
        <el-form-item label="法人姓名" prop="contact">
          <el-input :maxlength="15" size="small" v-model="addForm.contact" placeholder="请输入法人姓名"
                    auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="法人联系方式" prop="contactTel">
          <el-input size="small" v-model="addForm.contactTel" placeholder="请输入法人联系方式" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="是否大清" prop="isBigClearPack">
          <el-radio-group style="margin:0;" v-model="addForm.isBigClearPack">
            <el-radio class="radio" :label="0">是</el-radio>
            <el-radio class="radio" :label="1">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="轻工辅料情况" prop="materialIs">
          <el-radio-group style="margin:0;" v-model="addForm.materialIs">
            <el-radio class="radio" :label="1">包工包料</el-radio>
            <el-radio class="radio" :label="2">包工</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="税号" prop="dutyNum">
          <el-input size="small" v-model="addForm.dutyNum" placeholder="请输入税号" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="银行账户" prop="bankAccount">
          <el-input size="small" :maxlength="19" v-model="addForm.bankAccount" placeholder="请输入银行账户"
                    auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="开户行地址" prop="openAccountBank">
          <el-input size="small" :maxlength="50" v-model="addForm.openAccountBank" placeholder="请输入开户行地址"
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
        <el-button size="small" @click.native="cencelBtn">取消</el-button>
        <el-button size="small" type="primary" @click.native="addBtn">保存</el-button>
      </div>
    </el-dialog>
    <!--创建班组-->
    <el-dialog title="创建班组" :before-close="resetForm" :visible.sync="addTeamVisible" :close-on-click-modal="false"
               :close-on-press-escape="false" width="50%">
      <el-form :model="addteamform" label-width="1.2rem" :rules="addteamformRules" ref="addteamform">
        <div class="projectBox">
          <el-form-item label="班组名称" style="width: 50%;  left: 0;" prop="name">
            <el-input style="width: 5rem;" v-model="addteamform.name" size="small" :maxlength="20"></el-input>
          </el-form-item>
          <el-form-item label="所属分公司" style="width: 50%;  right:.15rem;" prop="unitId">
            <p>{{formProject.unit.name}}</p>
          </el-form-item>
          <el-form-item label="班组长姓名" style="width: 50%;  left:0;top: 1.25rem;"
                        prop="teamLeaderName">
            <el-input style="width: 5rem;" size="small" :maxlength="15"
                      v-model="addteamform.teamLeaderName"></el-input>
          </el-form-item>
          <el-form-item label="联系方式" style="width: 50%;  right:.15rem; top: 1.25rem;"
                        prop="teamLeaderTel">
            <el-input style="width: 5rem;" size="small" :maxlength="11" v-model="addteamform.teamLeaderTel"></el-input>
          </el-form-item>
          <el-form-item label="身份证号" style="width: 50%;  left:0; top: 1.83rem;" prop="idCardNo">
            <el-input style="width: 5rem;" size="small" :maxlength="18" v-model="addteamform.idCardNo"></el-input>
          </el-form-item>
        </div>
        <el-form-item label="轻工辅料情况" prop="materialIs">
          <el-radio-group style="margin:0;" v-model="addteamform.materialIs">
            <el-radio class="radio" :label="1">包工包料</el-radio>
            <el-radio class="radio" :label="2">包工</el-radio>
          </el-radio-group>
        </el-form-item>
        <div class="addBox" style="padding-bottom: .1rem;">
          <el-form-item label="班组类别" prop="classTypes">
            <ul style="position: relative">
              <i class="el-icon-circle-plus"
                 style="position: absolute;left: 2.8rem;top: .1rem; width: .3rem;height:.3rem;font-size: .2rem;cursor: pointer;z-index: 999"
                 @click="addclassTypes"></i>
              <li v-for="(item,index) in classTypes" style="position: relative">
                <i v-if="classTypes.length>1" class="el-icon-delete"
                   style="position: absolute;left: 2.3rem;top: .1rem; width: .3rem;height:.3rem;font-size: .2rem;cursor: pointer"
                   @click="jianclassTypes(index)"></i>
                <el-select style="width: 1rem;" v-model="item.workClass" size="small" placeholder="请选工类"
                           @change="editGetPro(item.workClass,index)" @visible-change="proHasChanges">
                  <el-option
                    v-for="item in workClassOption"
                    :label="item.name"
                    :key="item.id"
                    :value="item.id">
                  </el-option>
                </el-select>
                <el-select size="small" style="width: 1rem;" v-model="item.workType" placeholder="请选工种"
                           @visible-change="workTypeChanges(item.workClass,index)">
                  <el-option
                    v-for="item in workTypeOption"
                    :label="item.name"
                    :key="item.id"
                    :value="item.id">
                  </el-option>
                </el-select>
              </li>
            </ul>
          </el-form-item>
        </div>
        <div class="projectBoxa">
          <el-form-item label="所属劳务公司">
            <el-select
              v-model="addteamform.laborServiceCompanyId"
              filterable
              remote
              style="width: 5rem;"
              size="small"
              @focus="removeReadOnly($event)"
              reserve-keyword
              placeholder="劳务公司名称或联系方式"
              :loading-text="projectCommissionerloadingText"
              @blur="toFalse"
              :remote-method="getList" :loading="projectCommissionerloading">
              <el-option
                v-for="item in laborServiceCompanyOption"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
            <el-button size="small" type="text" @click="clickAdd(1)">创建新劳务公司</el-button>
          </el-form-item>
          <!--<el-form-item label="可组织人数" style="width: 50%; float: right;" prop="workerCount">-->
          <!--<el-input style="width: 200px;"  size="small" v-model="addteamform.workerCount"></el-input>-->
          <!--</el-form-item>-->
          <el-form-item label="银行账号" prop="bankAccount">
            <el-input style="width: 5rem;" size="small" :maxlength="19" v-model="addteamform.bankAccount"></el-input>
          </el-form-item>
          <el-form-item label="开户行地址"  prop="openAccountBank">
            <el-input size="small" :maxlength="50" style="width: 5rem;"
                      v-model="addteamform.openAccountBank"></el-input>
          </el-form-item>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click.native="resetForm('addteamform')">取消</el-button>
        <el-button size="small" type="primary" :loading="addCompanyLoading" @click.native="submitForm('addteamform')">
          提交
        </el-button>
      </div>
    </el-dialog>
    <!--查看班组-->
    <el-dialog id="aaa" v-if="seeTeamVisible" :close-on-click-modal="false" :close-on-press-escape="false" title="班组详情"
               :visible.sync="seeTeamVisible" width="12rem">
      <el-form :model="seeteamform" ref="seeteamform" label-width="1.5rem" class="demo-ruleForm" :inline="true"
               size="small">
        <div id="quline" style="width: 100%;overflow: hidden;">
          <div style="width: 50%;float: left;">
            <el-form-item label="班组名称：">
              <p style="line-height: .25rem;">{{seeteamform.name}}</p>
            </el-form-item>
            <br>
            <el-form-item label="班组长名称：">
              <p style="line-height: .25rem;">{{seeteamform.teamLeaderName}}</p>
            </el-form-item>
            <br>
            <el-form-item label="身份证号：">
              <p style="line-height: .25rem;">{{seeteamform.idCardNo}}</p>
            </el-form-item>
            <br>
            <el-form-item label="轻工辅料情况：">
              <p style="line-height: .25rem;">{{seeteamform.materialIs}}</p>
            </el-form-item>
            <br>
            <el-form-item label="班组类别：">
              <p v-for="item in seeteamform.workerTeamWorkExtends" v-if="item.workClass">
                {{item.workClass.name}}-{{item.workType.name}}</p>

            </el-form-item>
          </div>
          <div style="width: 50%;float: left;">
            <el-form-item label="所属分公司：">
              <p style="line-height: .25rem;" v-if="seeteamform.unit">{{seeteamform.unit.name}}</p>
            </el-form-item>
            <br>
            <el-form-item label="联系方式：">
              <p style="line-height: .25rem;">{{seeteamform.teamLeaderTel}}</p>
            </el-form-item>
          </div>
        </div>
        <div id="quline2">
          <el-form-item label="所属劳务公司：">
            <p style="line-height: .25rem;width: 2rem;" v-if="seeteamform.laborServiceCompany">
              {{seeteamform.laborServiceCompany.name}}</p>
          </el-form-item>
          <el-form-item label="可组织人数：">
            <p style="line-height: .25rem;">{{seeteamform.workerCount}}</p>
          </el-form-item>
          <br>
          <el-form-item label="银行账号：">
            <p style="line-height: .25rem;width: 2rem;">{{seeteamform.bankAccount}}</p>
          </el-form-item>
          <el-form-item label="开户行地址：">
            <p style="line-height: .25rem;">{{seeteamform.openAccountBank}}</p>
          </el-form-item>
        </div>
      </el-form>
      <p style="padding-left:.2rem;line-height: .4rem;border-bottom: 1px solid #ccc;margin-bottom: .1rem;">进场详情</p>
      <el-form :model="getByOneListData" label-width="1.8rem" ref="editForm">
        <el-form-item label="项目名称：" style="width: 50%; float: left;" prop="name">
          <p>{{getByOneListData.project.name}}</p>
        </el-form-item>
        <!--<el-form-item label="现场负责人姓名：" style="width: 50%; float: left;" prop="name">-->
        <!--<p>{{getByOneListData.behalfName}}</p>-->
        <!--</el-form-item>-->
        <!--<el-form-item label="联系方式：" style="width: 50%; float: left;" prop="name">-->
        <!--<p>{{getByOneListData.behalfTel}}</p>-->
        <!--</el-form-item>-->
        <el-form-item label="进场时间：" style="width: 50%; float: left;" prop="name">
          <p>{{getByOneListData.inDate}}</p>
        </el-form-item>
      </el-form>
      <el-table
        stripe
        :data="getByOneListData.extend"
        border
        style="width: 10.4rem;margin-left: 5%;margin-bottom: .2rem;">
        <el-table-column
          label="工种"
          align="center">
          <template scope="scope">
            <span>{{ scope.row.workClass.name ? scope.row.workClass.name  : ''}}&nbsp;-&nbsp;{{ scope.row.workType.name ? scope.row.workType.name  : ''}}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="上午上工时间"
          align="center">
          <template scope="scope">
            <span>{{ scope.row.morningStart ? scope.row.morningStart   : ''}} </span>
          </template>
        </el-table-column>
        <el-table-column
          label="上午下工时间"
          align="center">
          <template scope="scope">
            <span>{{ scope.row.morningEnd ? scope.row.morningEnd   : ''}} </span>
          </template>
        </el-table-column>
        <el-table-column
          label="下午上工时间"
          align="center">
          <template scope="scope">
            <span>{{ scope.row.afternoonStart ? scope.row.afternoonStart   : ''}}  </span>
          </template>
        </el-table-column>
        <el-table-column
          label="下午下工时间"
          align="center">
          <template scope="scope">
            <span>{{ scope.row.afternoonEnd ? scope.row.afternoonEnd   : ''}} </span>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="close"> 关闭</el-button>
      </div>
    </el-dialog>
    <!-- 班组进场 -->
    <el-dialog title="班组进场" :visible.sync="workerTeamVisible" width="12rem" :close-on-press-escape="false"
               :close-on-click-modal="false" :before-close="beforeWorkerTeamClose">
      <el-form :model="formAdd" :rules="formAddRules" ref="formAdd" label-width="1.8rem" class="demo-ruleForm"
               size="small" style="overflow: hidden;">
        <el-form-item style="width: 48%; float: left;margin-bottom: 10px !important;" label="项目名称：">
          <p>{{formProject.name}}</p>
        </el-form-item>
        <el-form-item style="width: 48%; float: left;margin-bottom: 10px !important;" label="班组：" prop="workerTeamId">
          <el-select
            v-model="formAdd.workerTeamId"
            filterable
            remote
            clearable
            style="width: 2rem;"
            size="small"
            @focus="removeReadOnly($event)"
            @change="setname"
            placeholder="班组名称或班组长联系方式"
            @blur="toFalse"
            :loading-text="workerTeamOptionloadingText"
            :remote-method="getList2" :loading="workerTeamOptionloading">
            <el-option
              v-for="item in workerTeamOption"
              :key="item.id"
              :label="item.name"
              :value="item.id">
              <span style="float: left">{{ item.name }}</span>
              <span style="float: right; color: #8492a6; font-size: .13rem">{{ item.teamLeaderTel }}</span>
            </el-option>
          </el-select>
          <el-button size="small" type="text" @click="addTeam">创建班组</el-button>
        </el-form-item>
        <el-form-item style="width: 48%; float: left;margin-bottom: .1rem !important;" label="进场时间：" prop="inDate">
          <el-date-picker
            v-model="formAdd.inDate"
            type="date"
            :picker-options="pickerOptions1"
            style="width: 2rem;"
            placeholder="选择日期"
            format="yyyy 年 MM 月 dd 日"
            value-format="yyyy-MM-dd">
          </el-date-picker>
        </el-form-item>
        <el-form-item style="width: 48%; float: left;margin-bottom: .1rem !important;" label="所属劳务公司：">
          <el-select
            v-if="laowuShow"
            v-model="formAdd.laborServiceCompanyId"
            filterable
            remote
            clearable
            style="width: 2rem;"
            size="small"
            reserve-keyword
            @change="setlabor"
            @focus="removeReadOnly($event)"
            :loading-text="projectCommissionerloadingText"
            @blur="toFalse"
            placeholder="劳务公司名称或联系方式"
            :remote-method="getList" :loading="projectCommissionerloading">
            <el-option
              v-for="item in laborServiceCompanyOption"
              :key="item.id"
              :label="item.name"
              :value="item.id">
              <span style="float: left">{{ item.name }}</span>
              <span style="float: right; color: #8492a6; font-size: .13rem">{{ item.contactTel }}</span>
            </el-option>
          </el-select>
          <span style="color: #606266;font-size: .13rem;">{{laowuName}}</span>
          <el-button size="small" v-if="laowuShow" type="text" @click="clickAdd(2)">创建新劳务公司</el-button>
        </el-form-item>
        <!--<el-form-item style="width: 48%; float: left;margin-bottom: .10rem !important;" label="班组负责人姓名："-->
        <!--prop="behalfName">-->
        <!--<el-input placeholder="现场负责人姓名" :maxlength="20" v-model="formAdd.behalfName" style="width: 2rem;"></el-input>-->
        <!--</el-form-item>-->
        <!--<el-form-item style="width: 48%; float: left;margin-bottom: .1rem !important;" label="班组联系方式：" prop="behalfTel">-->
        <!--<el-input :maxlength="11" placeholder="现场负责人联系方式" v-model="formAdd.behalfTel"-->
        <!--style="width: 2rem;"></el-input>-->
        <!--</el-form-item>-->
        <!--<el-form-item style="width: 48%; float: left;margin-bottom: .1rem !important;" label=" 劳务公司负责人姓名：">-->
        <!--<el-input placeholder="请输入劳务公司负责人姓名" :maxlength="20" v-model="formAdd.laborBehalfName"-->
        <!--style="width: 2rem;"></el-input>-->
        <!--</el-form-item>-->
        <!--<el-form-item style="width: 48%; float: left;margin-bottom: .1rem !important;" label="劳务公司负责人方式：">-->
        <!--<el-input placeholder="请输入劳务公司负责人方式" :maxlength="11" v-model="formAdd.laborBehalfTel"-->
        <!--style="width: 2rem;"></el-input>-->
        <!--</el-form-item>-->
        <el-form-item prop="classTypes" label-width="0px"
                      style="width: 12rem; float:left; margin-top: .1rem; margin-bottom: .2rem !important;;">
          <ul style="position: relative;width:10.4rem;float: left;left: 1px">
            <i class="el-icon-circle-plus"
               style="position: absolute;left: 10.8rem;top: .1rem; width: .3rem;height:.3rem;font-size: .2rem;cursor: pointer"
               @click="addclassTypes2"></i>
            <li>
              <ul class="box clearfloat">
                <li class="item">工种</li>
                <li class="item">上午上工时间</li>
                <li class="item">上午下工时间</li>
                <li class="item">下午上工时间</li>
                <li class="item">下午下工时间</li>
              </ul>
            </li>
            <li v-for="(item,index) in classTypes2" style="position: relative">
              <ul class="box clearfloat">
                <li class="item">
                  <el-select size="small" style="width: 1rem;" v-model="item.workClass" placeholder="请选工类"
                             @change="editGetPro2(item.workClass,index)" @visible-change="proHasChanges">
                    <el-option
                      v-for="item in workClassOption"
                      :label="item.name"
                      :key="item.id"
                      :value="item.id">
                    </el-option>
                  </el-select>
                  <el-select size="small" style="width: 1rem;" v-model="item.workType" placeholder="请选工种"
                             @visible-change="workTypeChanges(item.workClass,index)">
                    <el-option
                      v-for="item in workTypeOption"
                      :label="item.name"
                      :key="item.id"
                      :value="item.id">
                    </el-option>
                  </el-select>
                </li>
                <li class="item">
                  <el-time-select
                    style="width: 1.5rem;"
                    placeholder="06:00"
                    v-model="item.amin"
                    format="HH-mm-ss"
                    :picker-options="{
                    start: '06:00',
                    step: '00:15',
                    end: '10:30'
                    }">
                  </el-time-select>
                </li>
                <li class="item">
                  <el-time-select
                    style="width: 1.5rem;"
                    placeholder="10:30"
                    v-model="item.amout"
                    :picker-options="{
                    start: '10:30',
                    step: '00:15',
                    end: '12:00'
                    }">
                  </el-time-select>
                </li>
                <li class="item">
                  <el-time-select
                    style="width: 1.5rem;"
                    placeholder="13:00"
                    v-model="item.pmin"
                    :picker-options="{
                    start: '13:00',
                    step: '00:15',
                    end: '14:00'
                    }">
                  </el-time-select>
                </li>
                <li class="item">
                  <el-time-select
                    style="width: 1.5rem;"
                    placeholder="17:00"
                    v-model="item.pmout"
                    :picker-options="{
                    start: '17:00',
                    step: '00:15:00',
                    end: '19:00'
                    }">
                  </el-time-select>
                </li>
              </ul>
              <i v-if="classTypes2.length>1" class="el-icon-delete"
                 style="position: absolute;right: -.3rem;top: .1rem; width: .3rem;height:.3rem;font-size: .2rem;cursor: pointer"
                 @click="jianclassTypes2(index)"></i>
            </li>
          </ul>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" type="primary" style="margin-top: .1rem;" :loading="addCompanyLoading"
                   icon="el-icon-edit" @click="createWorkerTeamAndProject('formAdd')">进场
        </el-button>
        <el-button size="small" @click="resetFormadd" icon="el-icon-refresh">重置</el-button>
        <el-button size="small" @click="beforeWorkerTeamClose"> 关闭</el-button>
      </div>
    </el-dialog>

    <el-button type="primary" style="margin-bottom: .15rem;" size="small" @click="showWorkerTeamIn">班组进场</el-button>
    <div>
      <p style="color: #606266;font-size: .13rem;padding: .05rem .1rem;">已进场班组：</p>
      <!--查询-->
      <div class="query">
        <ul class="term">
          <li class="term_item">
            <div class="demo-input-suffix" style="margin-right: .1rem">
              班组名称：
              <el-input
                placeholder="班组名称"
                style="width: 2rem;"
                size="small"
                :maxlength="20"
                v-model="queryForm['search.name']">
              </el-input>
            </div>
          </li>
          <li class="term_item">
            <div class="demo-input-suffix" style="text-align: center">
              班组长联系方式：
              <el-input
                placeholder="班组长联系方式"
                style="width: 2rem;"
                :maxlength="11"
                size="small"
                v-model="queryForm['search.teamLeaderTel']">
              </el-input>
            </div>
          </li>
          <li class="term_item" style="padding-left: .2rem;">
            <div class="demo-input-suffix">
              工类：
              <el-select size="small" style="width: 1rem;" v-model="queryForm['search.workClass']" placeholder="请选工类"
                         @change="editGetPro3(queryForm['search.workClass'])" @visible-change="proHasChanges">
                <el-option
                  v-for="item in workClassOption2"
                  :label="item.name"
                  :key="item.id"
                  :value="item.id">
                </el-option>
              </el-select>
              工种：
              <el-select size="small" style="width: 1rem;" v-model="queryForm['search.workType']" placeholder="请选工种">
                <el-option
                  v-for="item in workTypeOption2"
                  :label="item.name"
                  :key="item.id"
                  :value="item.id">
                </el-option>
              </el-select>
            </div>
          </li>
          <el-button style="position: absolute;right: .1rem;top: .05rem;" size="small" type="primary"
                     icon="el-icon-search"
                     @click="queryWorkerTeamListInProject">搜索
          </el-button>
          <el-button size="small" style="position: absolute;right: 1.1rem;top: .05rem;" @click="reset"
                     icon="el-icon-refresh">重置
          </el-button>
        </ul>

      </div>
      <!--列表-->
      <el-table stripe v-loading="loading" element-loading-text="拼命加载中"
                :data="tableData"
                border
                style="width: 100%">
        <el-table-column label="班组" :show-overflow-tooltip="true" align="center">
          <template scope="scope">
            <p @click="see(scope.row)" class="workteamname">{{ scope.row.workteamname}}</p>
          </template>
        </el-table-column>
        <el-table-column label="公司名称" :show-overflow-tooltip="true" align="center">
          <template scope="scope">
            <p>{{ scope.row.laborcompanyname}}</p>
          </template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true"
                         label="联系方式" align="center">
          <template scope="scope">
            <p>{{ scope.row.teamleadertel}}</p>
          </template>
        </el-table-column>
        <el-table-column
          label="班组类别" :show-overflow-tooltip="true" align="center">
          <template scope="scope">
            <p>{{ scope.row.classtype}}</p>
          </template>
        </el-table-column>
        <el-table-column
          label="进场日期" :show-overflow-tooltip="true" align="center">
          <template scope="scope">
            <p>{{ scope.row.in_date }}</p>
          </template>
        </el-table-column>
        <el-table-column
          label="已进场人数" :show-overflow-tooltip="true" align="center">
          <template scope="scope">
            <p>{{ scope.row.isinnum}}</p>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="300">
          <template scope="scope">
            <el-button type="text" size="small" @click="workerBatchEnter(scope.row)">工友进退场</el-button>
            <el-button type="text" size="small" @click="edit(scope.row)">编辑</el-button>
            <el-button type="text" style="color: red;" size="small" @click="addEdit(scope.row)">退场</el-button>
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
</template>
<script>
  import {
    workClass,
    addWorkerTeam,
    queryWorkerTeamByKeyAndFakeTel,
    createWorkerTeamAndProject,
    queryWorkerTeamListInProject,
    queryWorkerTeamById,
    workerTeamAndOut,
    editWorkerTeamAndProject,
    validationWorkerTeamtel
  } from '../../api/projectapi'
  import {
    searchLaborList,
    getCompanyLista,
    addabor,
    getProInfo,
    checkLabor
  } from '../../api/api';
  import myCallback from "../../../static/common/callback"

  export default {
    props: {
      formProject: {
        type: Object
      }
    },
    data() {
      // 校验现场负责人名称
      var validatebehalfName = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入场负责人名称！'));
        } else {
          var reg = /^[\u4e00-\u9fa5]{1,15}$/;
          if (!reg.test(value)) {
            callback(new Error('1-15个汉字'));
          } else {
            callback();
          }
        }
      };
      // 校验班组名称
      var validateTeamname = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入班组名称！'));
        } else if (!/^[^\s]+$/.test(value)) {
          callback(new Error('班组名称不能带有空格！'));
        } else {
          callback()
        }
      };
      // 校验班组长名称
      var validateTeamname2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入班组长名称！'));
        } else {
          var reg = /^[\u4e00-\u9fa5]{1,15}$/;
          if (!reg.test(value)) {
            callback(new Error('1-15个汉字'));
          } else {
            callback();
          }
        }
      };
      // 校验劳务公司名称
      var validLaName = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入公司名称！'));
        } else {
          if (!/^[^\s]+$/.test(value)) {
            callback(new Error('班组名称不能带有空格！'));
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
        }
      };
      // 校验法人名称
      var validLaName2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入法人名称！'));
        } else {
          var reg = /^[\u4e00-\u9fa5]{1,15}$/;
          if (!reg.test(value)) {
            callback(new Error('1-15个汉字'));
          } else {
            callback()
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
            callback();
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

      //验证身份证
      var validateIdcard = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入身份证号！'));
        } else {
          var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
          if (!reg.test(value)) {
            callback(new Error('请输入15位或者18位身份证号！'));
          } else {
            callback();
          }
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
          }
          callback();
        }
      };
      var validatePhone2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入手机号！'));
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
                callback(new Error(res.data.msg));
              }
            })
          }
        }
      };
      var validatePhone3 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入11位手机号！'));
        } else {
          var reg = /^[1]\d{10}$/;
          if (!reg.test(value)) {
            callback(new Error('请输入11位手机号！'));
          } else {
            // var parmas = {
            //     tel:value,
            //     id:this.editTeamForm.workerTeamId
            // }
            // editValidationWorkerTeamtel(parmas).then((res) => {
            //     if(res.data.code == 0) {
            //
            //     }else {
            //         callback(new Error(res.data.msg));
            //     }
            // })
            callback();
          }
        }
      };

      var classTypesRules = (rule, value, callback) => {
        for (var i = 0; i < this.classTypes.length; i++) {
          if (this.classTypes[i].workClass == '') {
            return callback(new Error('请选择工类'));
          }
          if (this.classTypes[i].workType == '') {
            return callback(new Error('请选择工种'));
          }
        }
        var arr = [];
        for (var i = 0; i < this.classTypes.length; i++) {
          var str = '';
          str += this.classTypes[i].workClass + '-' + this.classTypes[i].workType;
          arr.push(str);
        }
        this.addteamform.classTypes = arr;
        callback();
      };
      var classTypesRules2 = (rule, value, callback) => {
        for (var i = 0; i < this.classTypes2.length; i++) {
          if (this.classTypes2[i].workClass == '') {
            return callback(new Error('请选择工类'));
          }
          if (this.classTypes2[i].workType == '') {
            return callback(new Error('请选择工种'));
          }
          if (this.classTypes2[i].amin == '' || this.classTypes2[i].amin == null) {
            return callback(new Error('请选择上午上工时间'));
          }
          if (this.classTypes2[i].amout == '' || this.classTypes2[i].amout == null) {
            return callback(new Error('上午下工时间'));
          }
          if (this.classTypes2[i].pmin == '' || this.classTypes2[i].pmin == null) {
            return callback(new Error('下午上工时间'));
          }
          if (this.classTypes2[i].pmout == '' || this.classTypes2[i].pmout == null) {
            return callback(new Error('下午下工时间'));
          }
        }
        var arr = [];
        for (var i = 0; i < this.classTypes2.length; i++) {
          var str = '';
          str += this.classTypes2[i].workClass + ',' + this.classTypes2[i].workType + ',' + this.classTypes2[i].amin + ':00,' + this.classTypes2[i].amout + ':00,' + this.classTypes2[i].pmin + ':00,' + this.classTypes2[i].pmout + ':00';
          arr.push(str);
        }
        this.formAdd.classTypes = arr;
        callback();
      };
      var classTypesRules3 = (rule, value, callback) => {
        for (var i = 0; i < this.classTypes3.length; i++) {
          if (this.classTypes3[i].workClass == '') {
            return callback(new Error('请选择工类'));
          }
          if (this.classTypes3[i].workType == '') {
            return callback(new Error('请选择工种'));
          }
          if (this.classTypes3[i].amin == '' || this.classTypes3[i].amin == null) {
            return callback(new Error('请选择上午上工时间'));
          }
          if (this.classTypes3[i].amout == '' || this.classTypes3[i].amout == null) {
            return callback(new Error('上午下工时间'));
          }
          if (this.classTypes3[i].pmin == '' || this.classTypes3[i].pmin == null) {
            return callback(new Error('下午上工时间'));
          }
          if (this.classTypes3[i].pmout == '' || this.classTypes3[i].pmout == null) {
            return callback(new Error('下午下工时间'));
          }
        }
        var repeat = false;

        function findInArr(arr, n, m) {
          for (var i = m + 1; i < arr.length; i++) {
            if (arr[i].workType == n) return true;
          }
          return false;
        }

        for (var i = 0; i < this.classTypes3.length; i++) {
          if (findInArr(this.classTypes3, this.classTypes3[i].workType, i)) {
            repeat = true;
          }
        }
        if (repeat) {
          return callback(new Error('工种重复'));
        }
        var arr = [];
        for (var i = 0; i < this.classTypes3.length; i++) {
          var str = '';
          str += this.classTypes3[i].workClass + ',' + this.classTypes3[i].workType + ',' + this.classTypes3[i].amin + ':00,' + this.classTypes3[i].amout + ':00,' + this.classTypes3[i].pmin + ':00,' + this.classTypes3[i].pmout + ':00';
          arr.push(str);
        }
        this.editTeamForm.classTypes = arr;
        callback();
      };
      var labor = (rule, value, callback) => {
        if (!this.laowuShow) {
          return callback();
        }
        if (this.formAdd.workerTeamId == '') {
          this.formAdd.laborServiceCompanyId = ''
          return callback(new Error('请选择劳务公司'));
        } else if (this.formAdd.laborServiceCompanyId == '') {
          return callback(new Error('请选择劳务公司'));
        }
        callback();
      };
      return {
        // 上传loading
        addCompanyLoading: false,

        //  班组显示
        workerTeamVisible: false,

        workerTeamOptionloadingText: '班组名称或班组长联系方式',
        projectCommissionerloadingText: '请输入劳务公司名称或联系方式',
        //退场
        exitVisible: false,
        exitData: {},
        exitFrom: {
          projectId: this.formProject.id,
          workTeamId: '',
          score: 5,
          haveBadRecord: 0,
          badRecordNote: '',
          evaluate: ''
        },
        pickerOptions1: {
          disabledDate: (time) => {
            return time.getTime() <= (new Date(this.formProject.startDate).getTime() - 60 * 60 * 24 * 1000) || time.getTime() > (new Date(this.formProject.completionDate).getTime())
          }
        },
        //进场form
        formAdd: {
          projectId: this.formProject.id,
          workerTeamId: '',
          behalfName: '',
          laborBehalfName: '',
          laborBehalfTel: '',
          inDate: '',
          laborServiceCompanyId: '',
          behalfTel: ''
        },
        formAddRules: {
          workerTeamId: [
            {required: true, message: '请选择班组', trigger: 'blur'}
          ],
          behalfName: [
            {required: true, validator: validatebehalfName, trigger: 'blur'}
          ],
          inDate: [
            {required: true, message: '请选择进场时间', trigger: 'blur'}
          ],
          laborBehalfName: [
            {required: true, message: '请输入劳务公司负责人姓名', trigger: 'blur'}
          ],
          laborBehalfTel: [
            {required: true, validator: validatePhone, trigger: 'blur'}
          ],
          laborServiceCompanyId: [
            {required: true, validator: labor, trigger: 'blur'}
          ],
          behalfTel: [
            {required: true, validator: validatePhone, trigger: 'blur'}
          ],
          classTypes: [
            {required: true, validator: classTypesRules2, trigger: 'blur'}
          ],
        },
        //班组列表
        workerTeamOption: [],
        //劳务公司列表
        laborServiceCompanyOption: [],
        //劳务公司loding
        projectCommissionerloading: false,
        //班组loding
        workerTeamOptionloading: false,
        //添加劳务公司弹层
        addVisible: false,
        //添加劳务公司form
        addForm: {
          name: '',
          unitId: this.formProject.unitId,
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
            {required: true, validator: validLaName, trigger: 'blur'}
          ],
          unitId: [
            {required: true, message: '请选择所属分公司', trigger: 'change'}
          ],
          contact: [
            {required: true, validator: validLaName2, trigger: 'blur'}
          ],
          contactTel: [
            {required: true, validator: validatePhone, trigger: 'blur'}
          ],
          isBigClearPack: [
            {required: true, message: '请选择是否大清'}
          ],
          materialIs: [
            {required: true, message: '请选择是否轻工辅料情况'}
          ],
          bankAccount: [
            {required: true, message: '请填写银行账号', trigger: 'blur'}
          ],
          dutyNum: [
            {required: true, validator: validAccount, trigger: 'blur'}
          ],
          openAccountBank: [
            {required: true, message: '请输入开户行地址', trigger: 'blur'}
          ],
          fileNames: [
            {required: true, type: 'array', message: '请上传资质文件', trigger: 'blur'}
          ]
        },
        // 所属分公司数据
        compData: '',
        //创建班组弹层
        addTeamVisible: false,
        //创建班组from
        addteamform: {
          name: '',
          teamLeaderName: '',
          idCardNo: '',
          materialIs: 1,
          classTypes: [],
          unitId: this.formProject.unitId,
          teamLeaderTel: '',
          laborServiceCompanyId: '',
          workerCount: 0,
          bankAccount: '',
          openAccountBank: ''
        },
        addteamformRules: {
          name: [
            {required: true, validator: validateTeamname, trigger: 'blur'}
          ],
          teamLeaderTel: [
            {required: true, validator: validatePhone2, trigger: 'blur'}
          ],
          teamLeaderName: [
            {required: true, validator: validateTeamname2, trigger: 'blur'}
          ],
          idCardNo: [
            {required: true, validator: validateIdcard, trigger: 'blur'}
          ],
          materialIs: [
            {required: true, message: '请选择是否轻工辅料情况'}
          ],
          classTypes: [
            {required: true, validator: classTypesRules, trigger: 'blur'}
          ],
          unitId: [
            {required: true, message: '请选择所属分公司', trigger: 'change'}
          ],
          workerCount: [
            {validator: validateNum, trigger: 'blur'}
          ]
        },
        //工种工类选择
        classTypes: [
          {
            workClass: '',
            workType: ''
          }
        ],
        // 工类option
        workClassOption: [],
        // 工类option
        workClassOption2: [
          {
            id: '',
            name: '不限'
          }
        ],
        //工种option
        workTypeOption: [],
        //工种option
        workTypeOption2: [
          {
            id: '',
            name: '不限'
          }
        ],
        //进场工种工类选择
        classTypes2: [
          {
            workClass: '',
            workType: '',
            amin: '06:00',
            amout: '10:30',
            pmin: '13:00',
            pmout: '17:00',
          }
        ],
        //进场工种工类选择
        classTypes3: [],
        //劳务公司是否可选
        laowuShow: true,
        laowuName: '',
        //查询
        queryForm: {
          pageNo: 1,
          pageSize: 10,
          'search.projectId': this.formProject.id,
          'search.name': '',
          'search.teamLeaderTel': '',
          'search.workClass': '',
          'search.workType': '',
        },
        //列表数据
        tableData: [],
        //列表loding
        loading: false,

        //分页
        total: 1,
        currentPage: 1,
        pagesize: 10,
        pageNo: 1,
        //查看班组弹层
        seeTeamVisible: false,
        //班组详情
        seeteamform: {},
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
        //编辑

        editVisible: false,
        editMsg: {},
        editMsg2: {},
        editTeamForm: {
          projectId: this.formProject.id,
          workerTeamId: '',
          laborBehalfName: '',
          laborBehalfTel: '',
          name: '',
          tel: '',
          classTypes: []
        },
        editTeamRules: {
          name: [
            {required: true, message: '现场负责人姓名不能为空', trigger: 'blur'}
          ],
          tel: [
            {required: true, validator: validatePhone3, trigger: 'blur'}
          ],
          laborBehalfName: [
            {required: true, message: '劳务公司现场负责人姓名不能为空', trigger: 'blur'}
          ],
          laborBehalfTel: [
            {required: true, validator: validatePhone3, trigger: 'blur'}
          ],
          classTypes: [
            {required: true, validator: classTypesRules3, trigger: 'change'}
          ],
        },
        clickAddType: 0,
      }
    },
    created() {
      this.getCampList();
      this.workClass();
      this.queryWorkerTeamListInProject();
    },
    methods: {
      showWorkerTeamIn() {
        this.workerTeamVisible = true;
      },
      beforeWorkerTeamClose() {
        this.workerTeamVisible = false;
      },

      workerEnter(row) {
        this.$emit('subChange', row, 2)
      },
      workerBatchEnter(row) {
        this.$emit('subBatchChange', row, 9)
      },
      toFalse() {
        this.projectCommissionerloadingText = '请输入劳务公司名称或联系方式';
        this.workerTeamOptionloadingText = '班组名称或班组长联系方式';
      },
      removeReadOnly(e) {
        e.target.readOnly = false;
      },
      //班组编辑
      edit(item) {
        this.editMsg2 = item;
        this.editTeamForm.workerTeamId = item.id;
        var parmas = {
          workTeamId: item.id,
          projectId: this.formProject.id
        }
        getProInfo(parmas).then((res) => {
          if (res.data.code == 0) {
            this.editVisible = true;
            this.editMsg = res.data.data;
            if (this.editMsg.workerTeam.materialIs == 1) {
              this.editMsg.workerTeam.materialIs = '包工包料'
            }
            if (this.editMsg.workerTeam.materialIs == 2) {
              this.editMsg.workerTeam.materialIs = '包工'
            }
            this.editTeamForm.name = this.editMsg.behalfName;
            this.editTeamForm.tel = this.editMsg.behalfTel;
            this.editTeamForm.laborBehalfName = this.editMsg.laborBehalfName;
            this.editTeamForm.laborBehalfTel = this.editMsg.laborBehalfTel;
          } else {
            myCallback.call(this, res);
            // this.$notify.error({
            //   title: '失败',
            //   message: res.data.msg,
            //   offset: 100
            // });
          }

        })
      },

      editTeamQX() {
        this.editVisible = false;
        this.editMsg = {}
        this.editMsg2 = {}
        this.editTeamForm = {
          projectId: this.formProject.id,
          workerTeamId: '',
          name: '',
          tel: '',
          classTypes: []
        }
        this.classTypes3 = []
        this.$refs['editMsg'].resetFields();
      },
      editTeamQD() {
        var self = this;
        this.$refs['editMsg'].validate((valid) => {
          if (valid) {
            this.editVisible = false
            var data = self.editTeamForm;
            self.editMsg = {}
            self.editMsg2 = {}
            self.editTeamForm = {
              projectId: this.formProject.id,
              workerTeamId: '',
              name: '',
              tel: '',
              classTypes: []
            }
            self.classTypes3 = []
            editWorkerTeamAndProject(data).then((res) => {
              if (res.data.code == 0) {
                myCallback.call(self, res)
                // self.$notify.success({
                //   title: '编辑成功',
                //   message: res.data.msg,
                //   offset: 100
                // });
                self.queryWorkerTeamListInProject();
              } else {
                myCallback.call(self, res)
                // self.$notify.error({
                //   title: '编辑失败',
                //   message: res.data.msg,
                //   offset: 100
                // });
              }
            });
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      //关闭班组详情
      close() {
        this.seeteamform = {};
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
        this.seeTeamVisible = false;
      },
      //查看班组详情
      see(item) {
        var data = {
          id: item.id
        }
        queryWorkerTeamById(data).then((res) => {
          if (res.data.code == 0) {
            var json = res.data.data;
            var json2 = {};
            json2.name = json.name;
            json2.teamLeaderName = json.teamLeaderName;
            json2.idCardNo = json.idCardNo;
            if (json.materialIs == 1) {
              json.materialIs = '包工包料'
            }
            if (json.materialIs == 2) {
              json.materialIs = '包工'
            }
            json2.materialIs = json.materialIs;
            json2.workerTeamWorkExtends = json.workerTeamWorkExtends;
            json2.unit = json.unit;
            json2.teamLeaderTel = json.teamLeaderTel;
            json2.laborServiceCompany = json.laborServiceCompany;
            json2.workerCount = json.workerCount;
            json2.bankAccount = json.bankAccount;
            json2.openAccountBank = json.openAccountBank;
            this.seeteamform = json2;
            this.seeTeamVisible = true;
          } else {
            myCallback.call(this, res)
            // this.$notify.error({
            //   title: '失败',
            //   message: res.data.msg,
            //   offset: 100
            // });
          }

        })
        var parmas = {
          workTeamId: item.id,
          projectId: this.formProject.id
        }
        getProInfo(parmas).then((res) => {
          if (res.data.code == 0) {
            this.getByOneListData = res.data.data;
          } else {
            myCallback.call(this, res);
            // this.$notify.error({
            //   title: '失败',
            //   message: res.data.msg,
            //   offset: 100
            // });
          }

        })
      },
      setlabor(val) {
        if (val == '') {
          this.laborServiceCompanyOption = [];
        }
      },
      //分页
      //每页条数改变
      handleSizeChange(val) {
        this.queryForm.pageSize = val;
        this.queryWorkerTeamListInProject();
      },
      //页数改变
      handleCurrentChange(val) {
        this.queryForm.pageNo = val;
        this.queryWorkerTeamListInProject();
      },
      //已进场班组列表
      queryWorkerTeamListInProject() {
        var self = this;
        self.loading = true;
        queryWorkerTeamListInProject(self.queryForm).then((res) => {
          if (!res) {
            return;
          }
          if (res.data.code == 0) {
            var arr = res.data.data.list;
            self.tableData = [];
            for (var i = 0; i < arr.length; i++) {
              var str = arr[i].classtype;
              str = str.slice(0, str.length - 2)
              str = str.replace(/\,,,/g, ";")
              arr[i].classtype = str;
              if (!arr[i].isinnum) {
                arr[i].isinnum = 0;
              }
            }
            self.tableData = arr;
            self.total = res.data.data.totalCount;
            self.loading = false;
          } else {
            self.loading = false;
            myCallback.call(this, res);
            // this.$notify.error({
            //   title: '失败',
            //   message: res.data.msg,
            //   offset: 100
            // });
          }
        });
      },
      //清空查询
      reset() {
        this.queryForm = {
          pageNo: 1,
          pageSize: 10,
          'search.projectId': this.formProject.id,
          'search.name': '',
          'search.teamLeaderTel': '',
          'search.workClass': '',
          'search.workType': ''
        }
        this.workTypeOption2 = [
          {
            id: '',
            name: '不限'
          }
        ]
      },
      //退场
      exitQX() {
        this.exitVisible = false;
      },
      //退场确定
      exitQD() {
       let data = Object.assign({}, this.exitFrom)
        if(data.haveBadRecord === 0) {
          data.badRecordNote = '';
        }
        this.exitVisible = false;
        workerTeamAndOut(data).then((res) => {
          if (res.data.code == 0) {
            myCallback.call(this, res);
            // this.$notify.success({
            //   title: '退场成功',
            //   message: res.data.msg,
            //   offset: 100
            // });
            this.queryWorkerTeamListInProject();
          } else {
            myCallback.call(this, res);
            // this.$notify.error({
            //   title: '退场失败',
            //   message: res.data.msg,
            //   offset: 100
            // });
          }
        })
      },

      //退场
      addEdit(item) {
        this.exitFrom = {
          projectId: this.formProject.id,
          workTeamId: item.id,
          score: 5,
          haveBadRecord: 0,
          badRecordNote: '',
          evaluate: ''
        }
        this.exitData = item;
        this.exitVisible = true;
      },
      setname(val) {
        if (val == '') {
          this.laowuShow = true;
          this.laowuName = '';
          this.workerTeamOption = [];
          this.laborServiceCompanyOption = [];
          this.formAdd.laborServiceCompanyId = '';
        } else {
          var arr = this.workerTeamOption;
          this.laborServiceCompanyOption = [];
          for (var i = 0; i < arr.length; i++) {
            if (arr[i].id == this.formAdd.workerTeamId) {
              if (arr[i].laborServiceCompany.id) {
                this.laborServiceCompanyOption.push({
                  name: arr[i].laborServiceCompany.name,
                  id: arr[i].laborServiceCompany.id
                })
                this.formAdd.laborServiceCompanyId = arr[i].laborServiceCompany.id;
              }
            }
          }
        }
      },
      //进场
      createWorkerTeamAndProject(formName) {
        var self = this;
        self.addTeamVisible = false;
        this.$refs[formName].validate((valid) => {
          if (valid) {
            createWorkerTeamAndProject(self.formAdd).then((res) => {
              if (res.data.code == 0) {
                myCallback.call(self, res)
                // self.$notify.success({
                //   title: '进场成功',
                //   message: res.data.msg,
                //   offset: 100
                // });
                self.classTypes2 = [{
                  workClass: '',
                  workType: '',
                  amin: '06:00',
                  amout: '10:30',
                  pmin: '13:00',
                  pmout: '17:00',
                }];
                self.workTypeOption = [];
                self.laowuShow = true;
                self.laowuName = '';
                self.$refs['formAdd'].resetFields();
                self.queryWorkerTeamListInProject();
              } else {
                myCallback.call(self, res)
                // self.$notify.error({
                //   title: '进场失败',
                //   message: res.data.msg,
                //   offset: 100
                // });
              }
            });
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      //进场重置
      resetFormadd() {
        this.classTypes2 = [{
          workClass: '',
          workType: '',
          amin: '06:00',
          amout: '10:30',
          pmin: '13:00',
          pmout: '17:00',
        }];
        this.workTypeOption = [];
        this.laowuShow = true;
        this.laowuName = '';
        this.$refs['formAdd'].resetFields();
      },
      //增加类别选项
      addclassTypes() {
        this.classTypes.push({
          workClass: '',
          workType: ''
        })
      },
      jianclassTypes(index) {
        this.classTypes.splice(index, 1);
      },
      //增加类别选项
      addclassTypes2() {
        this.classTypes2.push({
          workClass: '',
          workType: '',
          amin: '06:00',
          amout: '10:30',
          pmin: '13:00',
          pmout: '17:00',
        })
      },
      //增加编辑类别选项
      addclassTypes3() {
        this.classTypes3.push({
          workClass: '',
          workType: '',
          amin: '06:00',
          amout: '10:30',
          pmin: '13:00',
          pmout: '17:00',
        })
      },
      jianclassTypes2(index) {
        this.classTypes2.splice(index, 1);
      },
      //编辑
      jianclassTypes3(index) {
        this.classTypes3.splice(index, 1);
      },
      // 获取所有工类
      workClass() {
        workClass().then((res) => {
          if (!res) {
            return;
          }
          if (res.data.code == 0) {
            this.workClassOption = res.data.data;
            var arr = res.data.data;
            for (var i = 0; i < arr.length; i++) {
              this.workClassOption2.push(arr[i])
            }
          } else {
            myCallback.call(this, res)
            // this.$notify.error({
            //   title: '获取所有工类失败',
            //   message: res.data.msg,
            //   offset: 100
            // });
          }

        })
      },
      editGetPro(id, index) {
        var arr = this.workClassOption;
        this.classTypes[index].workType = '';
        for (var i = 0; i < arr.length; i++) {
          if (id == arr[i].id) {
            this.workTypeOption = arr[i].workTypes;
          }
        }
      },
      editGetPro2(id, index) {
        var arr = this.workClassOption;
        this.classTypes2[index].workType = '';
        for (var i = 0; i < arr.length; i++) {
          if (id == arr[i].id) {
            this.workTypeOption = arr[i].workTypes;
          }
        }
      },

      editGetPro3(id) {
        if (id == '') {
          this.workTypeOption2 = [
            {
              id: '',
              name: '不限'
            }
          ]
          this.queryForm['search.workType'] = '';
        } else {
          this.workTypeOption2 = [
            {
              id: '',
              name: '不限'
            }
          ];
          this.queryForm['search.workType'] = '';
          var arr = this.workClassOption2;
          for (var i = 0; i < arr.length; i++) {
            if (id == arr[i].id) {
              var arr2 = arr[i].workTypes;
              for (var j = 0; j < arr2.length; j++) {
                this.workTypeOption2.push(arr2[j])
              }
            }
          }
        }

        var arr = this.workClassOption2;
        for (var i = 0; i < arr.length; i++) {
          if (id == arr[i].id) {
            this.workTypeOption = arr[i].workTypes;
          }
        }
      },
      //编辑项目
      editGetPro4(id, index) {
        var arr = this.workClassOption;
        this.classTypes3[index].workType = '';
        for (var i = 0; i < arr.length; i++) {
          if (id == arr[i].id) {
            this.workTypeOption = arr[i].workTypes;
          }
        }
      },
      proHasChanges() {

      },
      workTypeChanges(id) {
        if (id != '') {
          var arr = this.workClassOption;
          for (var i = 0; i < arr.length; i++) {
            if (id == arr[i].id) {
              this.workTypeOption = arr[i].workTypes;
            }
          }
        } else {
          this.workTypeOption = [];
        }
      },
      //添加班组按钮
      addTeam() {
        this.addTeamVisible = true;
        this.addteamform = {
          name: '',
          teamLeaderName: '',
          idCardNo: '',
          materialIs: 1,
          classTypes: [],
          unitId: this.formProject.unitId,
          teamLeaderTel: '',
          laborServiceCompanyId: '',
          workerCount: 0,
          bankAccount: '',
          openAccountBank: ''
        }
        this.classTypes = [{
          workClass: '',
          workType: ''
        }];
        this.workTypeOption = [];
      },
      //添加班组取消
      resetForm(formName) {
        this.addTeamVisible = false;
        this.$refs['addteamform'].resetFields();
      },
      //添加班组确定
      submitForm(formName) {
        var self = this;
        this.$refs[formName].validate((valid) => {
          if (valid) {

            self.addTeamVisible = false;
            addWorkerTeam(self.addteamform).then((res) => {
              if (res.data.code == 0) {
                myCallback.call(self, res);
                // self.$notify.success({
                //   title: '添加成功',
                //   message: res.data.msg,
                //   offset: 100
                // });
                self.addTeamVisible = false;
                self.classTypes = [{
                  workClass: '',
                  workType: ''
                }];
                self.workTypeOption = [];
                self.$refs[formName].resetFields();
                self.workerTeamOption = res.data.data;
                self.formAdd.workerTeamId = res.data.data[0].id;
                var arr = self.workerTeamOption;
                self.laborServiceCompanyOption = [];
                for (var i = 0; i < arr.length; i++) {
                  if (arr[i].id == self.formAdd.workerTeamId) {
                    if (arr[i].laborServiceCompany.id) {
                      self.laborServiceCompanyOption.push({
                        name: arr[i].laborServiceCompany.name,
                        id: arr[i].laborServiceCompany.id
                      })
                      self.formAdd.laborServiceCompanyId = arr[i].laborServiceCompany.id;
                    }
                  }
                }

              } else {
                myCallback.call(self, res)
                // self.$notify.error({
                //   title: '添加失败',
                //   message: res.data.msg,
                //   offset: 100
                // });
              }
            });
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      // 获取劳务公司列表
      getList(query) {
        var self = this;
        self.projectCommissionerloading = true;
        if (query == '') {
          self.laborServiceCompanyOption = [];
          self.projectCommissionerloadingText = '请输入劳务公司名称或联系方式';
          return;
        }
        var reg = /^[\u2E80-\u9FFF]+$/;
        if (reg.test(query)) {
          if (query.length <= 1) {
            self.laborServiceCompanyOption = [];
            self.projectCommissionerloadingText = '请最少输入两个汉字';
            return;
          }
        } else {
          if (query.length < 5) {
            self.laborServiceCompanyOption = [];
            self.projectCommissionerloadingText = '请最少输入5位';
            return;
          }
        }
        var data = {
          'nameorphoneKey': query
        }
        searchLaborList(data).then((res) => {
          if (res.data.code == 0) {
            this.laborServiceCompanyOption = res.data.data;
            self.projectCommissionerloading = false;
          } else {
            self.projectCommissionerloading = false;
            myCallback.call(this, res);
            // this.$notify.error({
            //   title: '获取劳务公司列表失败',
            //   message: res.data.msg,
            //   offset: 100
            // });
          }
        });
      },
      // 获取班组列表
      getList2(query) {
        var self = this;
        this.workerTeamOptionloading = true;
        if (query == '') {
          self.workerTeamOption = [];
          this.workerTeamOptionloadingText = '班组名称或班组长联系方式';
          return;
        }
        var reg = /^[\u2E80-\u9FFF]+$/;
        if (reg.test(query)) {
          if (query.length <= 1) {
            self.workerTeamOption = [];
            this.workerTeamOptionloadingText = '请最少输入两个汉字';
            return;
          }
        } else {
          if (query.length < 5) {
            self.workerTeamOption = [];
            this.workerTeamOptionloadingText = '请最少输入5位';
            return;
          }
        }
        var data = {
          'search.key': query,
          pageNo: 1,
          pageSize: 10
        }
        queryWorkerTeamByKeyAndFakeTel(data).then((res) => {
          if (res.data.code == 0) {
            self.workerTeamOption = res.data.data;
            self.workerTeamOptionloading = false;
          } else {
            self.workerTeamOptionloading = false;
            myCallback.call(self, res);
            // self.$notify.error({
            //   title: '获取失败',
            //   message: res.data.msg,
            //   offset: 100
            // });
          }
        });
      },
      // 点击创建劳务公司
      clickAdd(type) {
        this.clickAddType = type;
        this.addVisible = true;
      },
      // 获取公司列表
      getCampList() {
        var parmas = {
          'pageSize': 999
        };
        getCompanyLista(parmas).then((res) => {
          if (!res) {
            return;
          }
          if (res.data.code == 0) {
            this.compData = res.data.data.list;
          } else {
            myCallback.call(this, res);
            // this.$notify.error({
            //   title: '获取公司列表失败',
            //   message: res.data.msg,
            //   offset: 100
            // });
          }
        })
      },
      // 上传限制
      beforeAvatarUpload(file) {
        const ifPDF = file.type === 'application/pdf';
        const isJPG = file.type === 'image/jpeg';
        const isGIF = file.type === 'image/gif';
        const isPNG = file.type === 'image/png';
        const isBMP = file.type === 'image/bmp';
        const isLt2M = file.size / 1024 / 1024 < 2;

        if (!isJPG && !isGIF && !isPNG && !isBMP && !ifPDF) {
          // this.$message({
          //     showClose: true,
          //     message: '只能上传jpeg,pdf,gif,png,bmp等类型的图片文件',
          //     type: 'warning'
          // });
          this.$notify.warning({
            title: '格式',
            message: '只能上传jpeg,pdf,gif,png,bmp等类型的图片文件',
            offset: 100
          });
        }
        if (!isLt2M) {
          // this.$message({
          //     showClose: true,
          //     message: '文件大小不超过500kb',
          //     type: 'warning'
          // });
          this.$notify.warning({
            title: '大小',
            message: '文件大小不超过500kb',
            offset: 100
          });
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
        //     showClose: true,
        //     message: '只能上传8张照片',
        //     type: 'warning'
        // });
        this.$notify.warning({
          title: '只能上传8张照片',
          offset: 100
        });
      },
      // 创建劳务公司取消提交
      cencelBtn() {
        this.addVisible = false;
        this.$refs['addForm'].resetFields();
        this.$refs.upload.clearFiles();
      },
      handleClose() {
        this.$refs['addForm'].resetFields();
        this.addVisible = false;
      },
      // 创建劳务公司确认提交
      addBtn() {
        this.$refs.addForm.validate((valid) => {
          if (valid) {
            var parmas = Object.assign({}, this.addForm);
            this.addVisible = false;
            this.addCompanyLoading = true;
            addabor(parmas).then((res) => {
              if (res.data.code == '0') {
                myCallback.call(this, res)
                // this.$notify.success({
                //   title: '添加成功',
                //   message: res.data.msg,
                //   offset: 100
                // });
                this.$refs['addForm'].resetFields();
                this.addForm.tmpFiles = [];
                if (this.clickAddType == 1) {
                  this.laborServiceCompanyOption = [];
                  this.laborServiceCompanyOption.push({
                    name: res.data.data.name,
                    id: res.data.data.id
                  })
                  this.addteamform.laborServiceCompanyId = res.data.data.id;
                }
                if (this.clickAddType == 2) {
                  this.laborServiceCompanyOption = [];
                  this.laborServiceCompanyOption.push({
                    name: res.data.data.name,
                    id: res.data.data.id
                  })
                  this.formAdd.laborServiceCompanyId = res.data.data.id;
                }
              } else {
                myCallback.call(this, res)
                // this.$notify.error({
                //   title: '添加失败',
                //   message: res.data.msg,
                //   offset: 100
                // });
              }
              this.addCompanyLoading = false;
            })
          }
        });
      },
    },
  }
</script>
<style scoped>
  .team {
    /*min-width: 1000px;*/
    border-top: 1px solid #eee;
    padding-top: 20px;
    padding-left: 20px;
    padding-right: 20px;
    font-size: 0rem;
  }

  .box {

  }

  .item {
    float: left;
    width: 20%;
    height: .4rem;
    box-sizing: border-box;
    border: 1px solid #dcdfe6;
    margin-left: -1px;
    margin-top: -1px;
    text-align: center;
    line-height: .4rem;
  }

  .clearfloat:after {
    display: block;
    clear: both;
    content: "";
    visibility: hidden;
    height: 0
  }

  .clearfloat {
    zoom: 1
  }
</style>
<style>
  .team .el-form-item__content {
    line-height: .42rem;
    /*width:4rem;*/
    /*margin-bottom: .2rem;*/
  }

  .team .el-form-item--small .el-form-item__error {
    padding-top: 0px;
  }

  .team .el-form-item__label {
    line-height: .42rem;
  }

  #quline .el-form-item__content {
    line-height: 25px;
  }

  #quline .el-form-item__label {
    line-height: 25px;
  }

  #quline2 .el-form-item__content {
    line-height: 25px;
  }

  #quline2 .el-form-item__label {
    line-height: 25px;
  }

  .team .el-form-item {
    margin-bottom: .2rem !important;
  }

  .query {
    height: .4rem;
    margin-top: .05rem;
    padding: .06rem;
    position: relative;
  }

  .term {
    font-size: .12rem;
    height: .24rem;
    /*min-width: 1000px;*/
    padding: .05rem;
    position: relative;
  }

  .term_item {
    float: left;
    /*height: .24rem;*/
    line-height: .24rem;
    /*width: 3rem;*/
  }

  .workteamname {
    color: #409EFF;
    cursor: pointer;
  }

  .projectBox {
    overflow: hidden;
    /*height: 170px;*/
    line-height: 24px;
  }

  .projectBoxa {
    overflow: hidden;
    /*height: 200px;*/
  }

  .projectBoxa .el-select {
    width: 100%;
  }

  .addBox {
    overflow: hidden;
    position: relative;
  }

  #aaa .el-table__body {
    width: 1049px !important;
  }

  #aaa .el-table__header {
    width: 1049px !important;
  }

  #aaa2 .el-table__body {
    width: 1049px !important;
  }

  #aaa2 .el-table__header {
    width: 1049px !important;
  }

  #lwgs .el-form-item__error {
    padding-top: 0;
  }

  .el-input--small .el-input__icon {
    line-height: .32rem;
  }

  .el-dialog__title {
    line-height: .3rem;
  }
</style>
