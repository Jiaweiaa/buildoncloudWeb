import axios from 'axios'

let base = '/workerman';

export const urlGlobal = base;

// 企业注册
export const createUserByZK = params => { return axios.post(`${base}/system/usermanager/createUserByZK`, params); };
//验证单位
export const checkUnit = params => { return axios.post(`${base}/system/usermanager/checkUnit`, params); };
//验证用户
export const checkUser = params => { return axios.post(`${base}/system/usermanager/checkUser`, params); };

//获取待审核列表
export const waitConfirmList = params => { return axios.post(`${base}/system/usermanager/waitConfirmList`, params); };

//用户审核
export const approval = params => { return axios.post(`${base}/system/usermanager/approval_unit`, params); };

//验证用户
export const verifyCaptchaAndLogin = params => { return axios.post(`${base}/authority/verifyCaptchaAndLogin`, params); };



// 登陆
export const requireLogin = params => { return axios.post(`${base}/authority/login`, params); };
// 查看session是否过期
export const requireLoginType = params => { return axios.get(`${base}/authority/checkLogin`, params); };
// 登出
export const loginOut = params => { return axios.post(`${base}/authority/logout`, params); };
// 获取登陆者信息
export const getAdmin = params => { return axios.post(`${base}/authority/loginInfo`, params); };

// 忘记密码
export const forgetPassWord = params => { return axios.post(`${base}/system/usermanager/updateUserPwdBySelf`, params); };

// 获取短信验证码
export const valiadCap = params => { return axios.post(`${base}/system/usermanager/forgetPassword`, params); };
// 重置验证码
export const resertPass = params => { return axios.post(`${base}/system/usermanager/resetPassword4ForgetPassword`, params); };

// 获取登陆权限
export const getMenu = params => { return axios.get(`${base}/authority/getMenus`, params); };

// 工类管理
// 获取列表
export const getWorkerList = params => { return axios.get(`${base}/system/workClass/list`, params); };
// 添加工类
export const addWorkerSys = params => { return axios.post(`${base}/system/workClass/createWorkClass`, params); };
// 添加工种
export const addWorkerType = params => { return axios.post(`${base}/system/workClass/createWorkType`, params); };
// 删除工类
export const deleteType = params => { return axios.post(`${base}/system/workClass/delWorkClass`, params); };
// 删除工种
export const deleteWorker = params => { return axios.post(`${base}/system/workClass/delWorkType`, params); };
// 编辑工类
export const editType = params => { return axios.post(`${base}/system/workClass/updWorkClass`, params); };
// 编辑工种
export const editWorker = params => { return axios.post(`${base}/system/workClass/updWorkType`, params); };
// 校验工类
export const checkWorkerClass = params => { return axios.post(`${base}/system/workClass/isClassExists`, params); };
// 校验工种
export const checkWorkerType = params => { return axios.post(`${base}/system/workClass/isTypeExists`, params); };


// 公司管理
// 获取公司列表
export const getCompanyList = params => { return axios.post(`${base}/system/unit/branchList`, params); };
// 添加分公司
export const addCompany = params => { return axios.post(`${base}/system/unit/createBranch`, params); };
// 修改分公司
export const editCompany = params => { return axios.post(`${base}/system/unit/updateBranch`, params); };
// 获取公司列表
export const branchList = params => { return axios.post(`${base}/system/unit/branchList`, params); };
// 校验公司名称
export const checkCompanyName = params => { return axios.post(`${base}/system/unit/isExists`, params); };

// 项目类型管理
// 获取项目列表
export const getProjcetList = params => { return axios.post(`${base}/system/projectType/list`, params); };
// 添加项目
export const addProject = params => { return axios.post(`${base}/system/projectType/create`, params); };
// 修改项目
// export const editProject = params => { return axios.post(`${base}/system/projectType/upd`, params); };
export const editProject = params => { return axios.get(`${base}/system/projectType/upd?id=`+params.id+`&name=`+params.name); };
// 校验名称
export const checkProjectName = params => { return axios.post(`${base}/system/projectType/isExists`, params); };


// 删除项目
export const deleteProject= params => { return axios.post(`${base}/system/projectType/del`, params); };

// 用户管理
// 用户列表
export const getUserList = params => { return axios.post(`${base}/system/usermanager/list`, params); };
// 新增用户
export const addUser = params => { return axios.post(`${base}/system/usermanager/createUserByWanke`, params); };
// 编辑用户
export const editUser = params => { return axios.post(`${base}/system/usermanager/updateUserByWanke`, params); };
// 用户页面的获取公司
export const getUserCompany = params => { return axios.get(`${base}/system/unit/branchList?pageSize=999`, params); };

// header组件获取分公司
export const topBranchList = params => { return axios.get(`${base}/system/unit/topBranchList`, params); };

// 用户获取用户权限
export const getUserRole = params => { return axios.post(`${base}/system/usermanager/systemRoleList`, params); };
// 查询详细信息
export const findUserDe = params => { return axios.post(`${base}/system/usermanager/fetchDetails`, params); };
// 启禁
export const openCloseEq = params => { return axios.post(`${base}/system/usermanager/updUserLockOrUnLock`, params); };
// 校验邮箱
export const requiredEmail = params => { return axios.post(`${base}/system/usermanager/checkEmailUsable`, params); };
// 校验电话
export const requiredPhone = params => { return axios.post(`${base}/system/usermanager/checkPhoneUsable`, params); };
// 用户审批
export const approvalUserRole = params => { return axios.post(`${base}/system/usermanager/approval`, params); };

// 厂家模块
// 获取厂家列表
export const getManuList = params => { return axios.post(`${base}/equipment/manufacturerList`, params); };
// 添加厂家
export const addManu = params => { return axios.post(`${base}/equipment/createManufacturer`, params); };
// 修改厂家
export const editManu = params => { return axios.post(`${base}/equipment/updManufacturer`, params); };
// 删除厂家
export const deleteManu = params => { return axios.post(`${base}/equipment/delManufacturer`, params); };
// 校验厂家名称
export const checkEqName = params => { return axios.post(`${base}/equipment/isExistsByManufacturer`, params); };

// 日志模块
// 获取日志
export const getLogList = params => { return axios.post(`${base}/system/log/data`, params); };

// 劳务公司
// 劳务公司列表
export const getLaborList = params => { return axios.post(`${base}/business/laborServiceCompany/list`, params); };
// 搜索劳务公司
export const searchLaborList = params => { return axios.post(`${base}/business/laborServiceCompany/queryCompanyBykey`, params); };
// 添加厂家
export const addabor = params => { return axios.post(`${base}/business/laborServiceCompany/create`, params); };
// 修改厂家
export const editabor = params => { return axios.post(`${base}/business/laborServiceCompany/upd`, params); };
// 删除厂家
export const deleteabor = params => { return axios.post(`${base}/business/laborServiceCompany/del`, params); };
// 公司获取
export const getCompanyLista = params => { return axios.post(`${base}/system/unit/branchList`, params); };
// 删除资源文件
export const deleteaborOne = params => { return axios.post(`${base}/business/laborServiceCompany/delFile`, params); };
// 劳务公司名称校验
export const checkLabor = params => { return axios.post(`${base}/business/laborServiceCompany/nameIsExists`, params); };
// 校验税号
export const checkutyNum = params => { return axios.post(`${base}/business/laborServiceCompany/dutyNumIsExists`, params); }


// 设备型号模块
// 获取设备型号列表
export const getEquipList = params => { return axios.post(`${base}/equipment/equipmentModeList`, params); };
// 添加型号
export const addEquip = params => { return axios.post(`${base}/equipment/createEquipmentMode`, params); };
// 修改型号
export const editEquip = params => { return axios.post(`${base}/equipment/updEquipmentMode`, params); };
// 删除型号
export const deleteEquip = params => { return axios.post(`${base}/equipment/delEquipmentMode`, params); };
// 检验设备型号
export const checkSn = params => { return axios.post(`${base}/equipment/isExistsByUniqueIdentity`, params); };
// 版本升级
export const upGrade = params => { return axios.post(`${base}/equipment/upgradeEquipmentVersion`, params); };

// 设备管理
// 获取设备管理列表
export const getMentList = params => { return axios.post(`${base}/equipment/equipmentList`, params); };
// 添加设备管理
export const addMent = params => { return axios.post(`${base}/equipment/createEquipment`, params); };
// 修改设备管理
export const editMent = params => { return axios.post(`${base}/equipment/updEquipment`, params); };
// 删除厂家
export const deleteMent = params => { return axios.post(`${base}/equipment/updEquipmentDisabled`, params); };
// 获取入场项目
export const getMentByPro = params => { return axios.post(`${base}/business/project/queryProjectListByStatesAndUnitId`, params); };
// 当前数据
export const editOneMent = params => { return axios.post(`${base}/equipment/findEquipmentById`, params); };
// 设备历史
export const showFWViewList = params => { return axios.post(`${base}/equipment/showFWViewList`, params); };


// 审批管理
// 获取审批列表
export const getSateList = params => { return axios.post(`${base}/business/project/queryProjectListbySate`, params); };
export const getSateLista = params => { return axios.post(`${base}/business/project/projectList`, params); };
// 查询
export const searchSateList = params => { return axios.post(`${base}/business/project/getProjectById`, params); };
// 提交审批
export const setState = params => { return axios.post(`${base}/business/project/editApprovalStates`, params); };

// 信息发布
// 招聘信息列表
export const getRecruitList = params => { return axios.post(`${base}/business/recruitment/list`, params); };
// 获取工类下的工种
export const getRecruitWorkerList = params => { return axios.post(`${base}/system/workClass/getWorkTypeByWorkClass`, params); };
// 创建招聘信息
export const addRecruit = params => { return axios.post(`${base}/business/recruitment/createRecruitmentInfo`, params); };
// 获取所有项目
export const projectList = params => { return axios.post(`${base}/business/project/projectList`, params); };
// 查询单条数据
export const searchOnefetch= params => { return axios.post(`${base}/business/recruitment/fetchDetails`, params); };
// 编辑招聘信息
export const editRecruit = params => { return axios.post(`${base}/business/recruitment/updateRecruitmentInfo`, params); };

// 培训信息
// 培训列表
export const getTrainingList = params => { return axios.post(`${base}/business/training/list`, params); };
// 提交培训
export const addTraining = params => { return axios.post(`${base}/business/training/createTrainingInfo`, params); };
// 查询单条数据
export const searchTraining = params => { return axios.post(`${base}/business/training/fetchDetails`, params); };
// 编辑培训信息
export const editTraining = params => { return axios.post(`${base}/business/training/updateTrainingInfo`, params); };

// 班组
// 班组列表
export const getWorkerTeamList = params => { return axios.post(`${base}/business/workerteam/queryWorkerTeamList`, params); };
// 添加班组
export const addWorkerTeam = params => { return axios.post(`${base}/business/workerteam/addWorkerTeam`, params); };
// 获取单挑详情
export const searchWorkerTeam = params => { return axios.post(`${base}/business/workerteam/queryWorkerTeamById`, params); };
// 修改班组
export const editWorkerTeam = params => { return axios.post(`${base}/business/workerteam/editWorkerTeam`, params); };
// 参建项目列表
export const getHisProList = params => { return axios.post(`${base}/business/workerteam/getHistoryPorjectByWorkerTeamId`, params); };
// 项目详情
export const getProInfo = params => { return axios.post(`${base}/business/workerteam/getHistoryPorjectByWorkerTeamIdDes`, params); };
// 获取班组下的工友
export const getTeamWorker = params => { return axios.post(`${base}/business/workerman/queryManList`, params); };
// 班组考勤
export const getTeamList = params => { return axios.post(`${base}/check/getTeamCount2`, params); };
// 查看详情
export const teamWorkerTail = params => { return axios.post(`${base}/check/teamWorkerTail`, params); };
// 查询对应数据
export const queryWorkerTail = params => { return axios.post(`${base}/business/workerteam/queryWorkerTeamByKey`, params); };

// 工友模块
// 工友列表
export const WorkerList = params => { return axios.post(`${base}/business/workerman/queryManList`, params); };
// 参建项目
export const WorkerProList = params => { return axios.post(`${base}/business/workerman/referToProjectsByManId`, params); };
// 工友列表
export const WorkerKqList = params => { return axios.post(`${base}/check/getWorkerCount2`, params); };
// 查询工友
export const checkWorkerPhone = params => { return axios.post(`${base}/business/workerman/isTelExists`, params); };
// 校验工友tel
export const checkEdWorkerTeamPhone = params => { return axios.post(`${base}/business/workerteam/editValidationWorkerTeamtel`, params); };

// 获取身份证
export const getCardData = params => { return axios.get(`/apis`, params); };

// 文件上传
export const upFileDo = params => { return axios.post(`${base}/fileupload/base64toJpg`, params); };
// 新增工友
export const addWorker = params => { return axios.post(`${base}/business/workerman/createMan`, params); };
// 查看工友
export const getWorkerInfo = params => { return axios.post(`${base}/business/workerman/getManInfoById`, params); };
// 修改
export const updateMan = params => { return axios.post(`${base}/business/workerman/updateMan`, params); };
// 校验身份证
export const checkIdcard = params => { return axios.post(`${base}/business/workerman/checkIdCard`, params); };

// 获取培训招聘
export const findEnrolments = params => { return axios.post(`${base}/business/training/findEnrolmentsByTrainId`, params); };

// 系统通知
// 获取所有系统通知列表
export const getNotification = params => { return axios.post(`${base}/business/systemNotification/list`, params); };
// 新增
export const createNotification = params => { return axios.post(`${base}/business/systemNotification/create`, params); };

// 资讯
// 列表
export const newsList = params => { return axios.post(`${base}/business/news/list`, params); };
// 新增
export const getNewsList = params => { return axios.post(`${base}/business/news/create`, params); };
// 详情
export const detailsNewsList = params => { return axios.post(`${base}/business/news/details`, params); };

// 通知未读
// 获取对应列表
export const noInfornationList = params => { return axios.post(`${base}/business/notificationUser/allNotification`, params); };
// 已读
export const readInfornation = params => { return axios.post(`${base}/business/notificationUser/readNotification`, params); };
// 未读条数
export const infornationCount = params => { return axios.post(`${base}/business/notificationUser/getNoReadCount`, params); };

// 微信培训
// 培训列表
export const wxInformationList = params => { return axios.post(`${base}/business/training/listmaterial`, params); };
// 培训详情
export const wxInformationDetalis = params => { return axios.post(`${base}/business/training/findEnrolmentsByTrainId`, params); };
// 同步
export const asyncGetTrainMaterialInfo = params => { return axios.post(`${base}/business/training/asyncGetTrainMaterialInfo`, params); };

// 不良记录 badRecord
// 不良记录列表
export const badRecordList = params => { return axios.post(`${base}/system/badRecord/list`, params); };
// 不良记录新增
export const createBadRecord = params => { return axios.post(`${base}/system/badRecord/create`, params); };
// 不良记录修改
export const editBadRecord = params => { return axios.post(`${base}/system/badRecord/upd`, params); };
// 不良记录查看
export const delBadRecord = params => { return axios.post(`${base}/system/badRecord/del`, params); };
// 不良记录校验
export const checkBadRecord = params => { return axios.post(`${base}/system/badRecord/isExists`, params); };

// 批量进场
// 查看选中工友的不良记录
export const getBadRecord = params => { return axios.post(`${base}/business/workerman/queryManBadRecord`, params); };
// 未进场列表
export const getOnEnterList = params => { return axios.post(`${base}/business/workerman/queryManListForOnEnter`, params); };
// 确认进场
export const batchInProject = params => { return axios.post(`${base}/business/workerman/batchInProject`, params); };
// 批量退场
export const batchOutProject = params => { return axios.post(`${base}/business/workerman/batchOutProject`, params); };

// 项目通知
export const getTypeByInProject = params => { return axios.post(`${base}/business/workerman/getTypeByProject`, params); };
// 项目通知详情
export const fetchDetails = params => { return axios.post(`${base}/business/projectNotification/fetchDetails`, params); };

// 解锁
export const unLockDoorAccess = params => { return axios.post(`${base}/business/workerman/unLockDoorAccess`, params); };

// 管理员进场
export const getProjectJob = params => { return axios.post(`${base}/system/projectJob/list`, params); };
// 管理员进场
export const addProjectIn = params => { return axios.post(`${base}/business/specialPerson/add`, params); };
// 管理员列表
export const getProjectList = params => { return axios.post(`${base}/business/specialPerson/list`, params); };
// 删除
export const delProject = params => { return axios.post(`${base}/business/specialPerson/del`, params); };
// 模糊查询
export const fuzzyQueryByName = params => { return axios.post(`${base}/business/specialPerson/fuzzyQueryByName`, params); };

// 导出excel的条件
export const getRowData = params => { return axios.post(`${base}/business/workerman/getRowData`, params); };

// 查看设备日志列表
export const getShowLogs = params => { return axios.post(`${base}/equipment/showLogs`, params); };
// 查看管理员进场详情
export const getProInMessage = params => { return axios.post(`${base}/business/specialPerson/getDetails`, params); };

// 调取相似度
export const faceToFace = params => { return axios.post(`${base}/face/base64ToJpgComparison`, params); };
// 补录调取接口
export const recordFace = params => { return axios.post(`${base}/face/getBase64ByFile`, params); };

// 统计页面
// 调取统计数据
export const getStatistical = params => { return axios.post(`${base}/homePage/index`, params); };
// 拿到要渲染的个数
export const getStatisticalCount = params => { return axios.post(`${base}/homePage/unitCount`, params); };
// 线形图
export const getLineChart = params => { return axios.post(`${base}/homePage/indexLineChart`, params); };
// 调取详情
export const getMapDetail = params => { return axios.post(`${base}/homePage/indexMapDetail`, params); };

// 换取项目管理远
export const editProjectAdmin = params => { return axios.post(`${base}/business/project/editProjectAdmin`, params); };
// 获取项目组成员角色
export const getProjectJobList = params => { return axios.post(`${base}/business/project/getProjectJobList`, params); };
// 新增项目管理员
export const addProjectController = params => { return axios.post(`${base}/business/project/addProjectController`, params); };
// 获取管理员列表
export const getProjectControllerList = params => { return axios.post(`${base}/business/project/getProjectControllerList`, params); };
// 删除管理员
export const delProjectController = params => { return axios.post(`${base}/business/project/delProjectController`, params); };

// 查看是否有新增权限
export const checkRoles01 = params => { return axios.post(`${base}/business/project/checkRoles01`, params); };

// 用户反馈列表
export const listPageFeedbackForm  = params => {
  return axios.post(`${base}/feedbackForm/listPageFeedbackForm`, params)
};

// 用户反馈详情接口
export const getFeedbackForm = params => {
  return axios.post(`${base}/feedbackForm/getFeedbackForm`, params )
};
// 获取用户信息
export const getSysUserInfoById = params => {
  return axios.post(`${base}/system/usermanager/getSysUserInfoById`, params)
};
// 设置反馈电话
export const insertPhone = params => {
  return axios.post(`${base}/feedbackCall/insert`,params)
};
// 删除电话
export const deletePhone = params => {
  return axios.post(`${base}/feedbackCall/delete`, params)
};
// 反馈电话的手机号
export const listPhone = params => {
  return axios.post(`${base}/feedbackCall/list`,params)
};

// 微信登陆
export const wechatCallback = params => {
  return axios.post(`${base}/authority/wechatCallback`,params)
};

// 绑定
export const bindWechat = params => {
  return axios.post(`${base}/authority/bindWechat`,params)
};
