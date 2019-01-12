import axios from 'axios'

let base = '/workerman';

// 获取省直辖市
export const getProvince = params => { return axios.post(`${base}/sys/administrativeArea/queryProvinceList`, params); };
// 获取市
export const getCity = params => { return axios.post(`${base}/sys/administrativeArea/queryCityListByProvinceId?provinceId=`+params); };
// 获取县
export const getCounty = params => { return axios.post(`${base}/sys/administrativeArea/queryCountyListByCityId?cityId=`+params); };
//搜索联系人
export const fuzzyQuery = params => { return axios.post(`${base}/system/usermanager/fuzzyQuery`, params); };


// 创建项目
export const createProject = params => { return axios.post(`${base}/business/project/createProject`, params); };

// 获取项目列表
export const projectList = params => { return axios.post(`${base}/business/project/projectList`, params); };

// 通过id获取项目
export const getProjectById = params => { return axios.post(`${base}/business/project/getProjectById`, params); };

//编辑项目
export const updateProject = params => { return axios.post(`${base}/business/project/updateProject`, params); };
//删除项目
export const delProject = params => { return axios.post(`${base}/business/project/delProject`, params); };

//获取设备型号列表
export const equipmentModeList = params => { return axios.post(`${base}/equipment/equipmentModeList`, params); };

//获取设备信息
export const equipmentByUniqueIdentity = params => { return axios.post(`${base}/equipment/equipmentByUniqueIdentityAndProjectId`, params); };

//设备进场
export const equipmentBindProject = params => { return axios.post(`${base}/equipment/equipmentBindProject`, params); };
//门禁设备唯一标识验重
export const isExistsByUniqueIdentity = params => { return axios.post(`${base}/equipment/isExistsByUniqueIdentity`, params); };

//获取门禁列表
export const equipmentListByProjectId = params => { return axios.post(`${base}/equipment/equipmentListByProjectId`, params); };

//删除门禁列表
export const equipmentUnBindProject = params => { return axios.post(`${base}/equipment/equipmentUnBindProject`, params); };

//获取工种工类列表
export const workClass = params => { return axios.post(`${base}/system/workClass/list`, params); };

//添加班组
export const addWorkerTeam = params => { return axios.post(`${base}/business/workerteam/addWorkerTeam`, params); };
//搜索进场班组
export const queryWorkerTeamByProjectAndKey = params => { return axios.post(`${base}/business/workerteam/queryWorkerTeamByProjectAndKey`, params); };

//搜索班组
export const queryWorkerTeamByKey = params => { return axios.post(`${base}/business/workerteam/queryWorkerTeamByKey`, params); };
export const queryWorkerTeamByKeyAndFakeTel = params => { return axios.post(`${base}/business/workerteam/queryWorkerTeamByKeyAndFakeTel`, params); };
//班组进场
export const createWorkerTeamAndProject = params => { return axios.post(`${base}/business/workerteam/createWorkerTeamAndProject`, params); };
//已进场班组列表
export const queryWorkerTeamListInProject = params => { return axios.post(`${base}/business/workerteam/queryWorkerTeamListInProject`, params); };
//班组详情
export const queryWorkerTeamById = params => { return axios.post(`${base}/business/workerteam/queryWorkerTeamById`, params); };

//班组考勤列表
export const getTeamCount = params => { return axios.post(`${base}/check/getTeamCount`, params); };

//获取指定日期范围内及班组的工友考勤详情
export const teamWorkerTail = params => { return axios.post(`${base}/check/teamWorkerTail`, params); };

//工友考勤查询
export const getWorkerCount = params => { return axios.post(`${base}/check/getWorkerCount`, params); };

//工友月考勤查询
export const workerTail = params => { return axios.post(`${base}/check/workerTail`, params); };
//补卡查询

export const correctPre = params => { return axios.post(`${base}/check/correctPre`, params); };
//补卡
export const correct = params => { return axios.post(`${base}/check/correct`, params); };

//班组退场
export const workerTeamAndOut = params => { return axios.post(`${base}/business/workerteam/workerTeamAndOut`, params); };

//创建项目通知
export const createNotification = params => { return axios.post(`${base}/business/projectNotification/createNotification`, params); };

//项目通知列表
export const NoList = params => { return axios.post(`${base}/business/projectNotification/list`, params); };

//已进场班组搜索
export const queryWorkerTeamListInProject02 = params => { return axios.post(`${base}/business/workerteam/queryWorkerTeamListInProject02`, params); };

//已进场班组下的已进场工友
export const queryManListForEnter = params => { return axios.post(`${base}/business/workerman/queryManListForEnter`, params); };

//已进场工友搜索
export const findManByProjectIdAndKey   = params => { return axios.post(`${base}/business/workerman/findManByProjectIdAndKey`, params); };
//工友标准时间
export const getWorkTimeByProjectIdAndWorkerManId   = params => { return axios.post(`${base}/business/workerman/getWorkTimeByProjectIdAndWorkerManId`, params); };

//工友进场
export const createManAndEnter   = params => { return axios.post(`${base}/business/workerman/createManAndEnter`, params); };


// 工友是否进场

export const getManInfoByIdOrIdCardNo   = params => { return axios.post(`${base}/business/workerman/getManInfoByIdOrIdCardNo`, params); };

//修改工友并进场
export const updManAndEnter   = params => { return axios.post(`${base}/business/workerman/updManAndEnter`, params); };
//工友退场
export const manOutProject   = params => { return axios.post(`${base}/business/workerman/manOutProject`, params); };
//工友进场详情
export const getManTeamAndProjectInfo   = params => { return axios.post(`${base}/business/workerman/getManTeamAndProjectInfo`, params); };

//获取班组工种工类
export const getClassAndTypeByWorkerTeamIdAndProjectId   = params => { return axios.post(`${base}/business/workerteam/getClassAndTypeByWorkerTeamIdAndProjectId`, params); };

//创建项目获取分公司列表
export const allBranchList   = params => { return axios.post(`${base}/system/unit/allBranchList`, params); };

//创建项目获取分公司列表
export const getFaceInfosByBase64   = params => { return axios.post(`${base}/face/getFaceInfosByBase64
`, params); };

//创建临时卡扣
export const addOrUpdate   = params => { return axios.post(`${base}/business/project/addOrUpdate`, params); };
//查询临时卡扣
export const queryListByProjectId   = params => { return axios.post(`${base}/business/project/queryListByProjectId`, params); };

//废除临时卡扣
export const remove   = params => { return axios.post(`${base}/business/project/remove`, params); };
//补录卡扣
export const updateRfidCardByWorkerManAndProject   = params => { return axios.post(`${base}/business/workerman/updateRfidCardByWorkerManAndProject`, params); };
//补录人脸
export const updateFaceByWorkerMan   = params => { return axios.post(`${base}/business/workerman/updateFaceByWorkerMan`, params); };

//进场班组编辑
export const editWorkerTeamAndProject   = params => { return axios.post(`${base}/business/workerteam/editWorkerTeamAndProject`, params); };

//校验创建项目名称是否存在
export const validationProjectName   = params => { return axios.post(`${base}/business/project/validationProjectName`, params); };

//校验编辑项目名称是否存在
export const eidtValidationProjectName   = params => { return axios.post(`${base}/business/project/eidtValidationProjectName`, params); };

//校验创建班组班组长联系方式是否存在
export const validationWorkerTeamtel   = params => { return axios.post(`${base}/business/workerteam/validationWorkerTeamtel`, params); };

//校验编辑班组班组长联系方式是否存在
export const editValidationWorkerTeamtel   = params => { return axios.post(`${base}/business/workerteam/editValidationWorkerTeamtel`, params); };
//校验收手机号
export const isTelExists   = params => { return axios.post(`${base}/business/workerman/isTelExists`, params); };
//查看工友
export const getManInfoByProject   = params => { return axios.post(`${base}/business/workerman/getManInfoByProject`, params); };


//报名情况
export const findCandidatesByRecruitmentId   = params => { return axios.post(`${base}/business/recruitment/findCandidatesByRecruitmentId`, params); };

//报名情况
export const query   = params => { return axios.post(`${base}/accessRecord/query`, params); };

//获取进出
export const queryList   = params => { return axios.post(`${base}/accessRecord/query`, params); };

