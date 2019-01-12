import Vue from 'vue';
import Router from 'vue-router';
import {requireLoginType} from '../api/api';


Vue.use(Router);

const router = new Router({
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      name: 'gfgf',
      path: '/gfgf',
      component: resolve => require(['../components/project/gfgf.vue'], resolve)
    },
    {
      path: '/',
      component: resolve => require(['../components/common/Home.vue'], resolve),
      children: [
        {
          name: '总览',
          path: '/data-statistics',
          component: resolve => require(['../components/routerView/dataIndex.vue'], resolve),
          children: [
            {
              name: '数据统计',
              path: '/data-statistics',
              component: resolve => require(['../components/page/dataStatistics.vue'], resolve),
              children: [
                {
                  name: '数据分布',
                  path: '/data-distribution',
                  component: resolve => require(['../components/page/dataDistribution.vue'], resolve),
                }
              ]
            },
            {
              name: '项目操作',
              path: '/projectmanagerxq',
              component: resolve => require(['../components/page/project.vue'], resolve),
            }
          ]
        },
        {
          name: '劳务管理',
          path: '/labour-company-manager',
          component: resolve => require(['../components/routerView/labourIndex.vue'], resolve),
          children: [
            {
              name: '劳务公司管理',
              path: '/labour-company-manager',
              component: resolve => require(['../components/page/labourCompanyManager.vue'], resolve),
            },
            {
              name: '班组管理',
              path: '/workTeam-manager',
              component: resolve => require(['../components/page/workTeamManager.vue'], resolve),
              children: [
                {
                  name: '班组考勤',
                  path: '/attendance',
                  component: resolve => require(['../components/page/attendance.vue'], resolve),
                }
              ]
            },
            {
              name: '工友管理',
              path: '/worker-manager',
              component: resolve => require(['../components/page/workerManager.vue'], resolve),
              children: [
                {
                  name: '工友考勤',
                  path: '/workerAttendance',
                  component: resolve => require(['../components/page/workerAttendance.vue'], resolve),
                }
              ]
            },
          ]
        },
        {
          name: '系统管理',
          path: '/branch-manager',
          component: resolve => require(['../components/routerView/branchIndex.vue'], resolve),
          children: [
            {
              name: '招聘信息',
              path: '/recruitment-information',
              component: resolve => require(['../components/page/recruitmentInformation.vue'], resolve),
            },
            {
              name: '培训信息pc',
              path: '/training-information',
              component: resolve => require(['../components/page/trainingInformation.vue'], resolve)
            },
            {
              name: '系统通知',
              path: '/system-notification',
              component: resolve => require(['../components/page/systemNotification.vue'], resolve)
            },
            {
              name: '培训信息',
              path: '/training-wx-information',
              component: resolve => require(['../components/page/trainingWxInformation.vue'], resolve)
            },
            {
              name: '资讯',
              path: '/news-information',
              component: resolve => require(['../components/page/information.vue'], resolve)
            },
            {
              name: '项目审批',
              path: '/project-approval',
              component: resolve => require(['../components/page/projectApproval.vue'], resolve),
            },
            {
              name: '用户审批',
              path: '/user-approval',
              component: resolve => require(['../components/page/userApproval.vue'], resolve),
            },
            {
              name: '生产厂家管理',
              path: '/manufacturer-manager',
              component: resolve => require(['../components/page/manufacturerManager.vue'], resolve),
            },
            {
              name: '设备型号管理',
              path: '/equipment-type-manager',
              component: resolve => require(['../components/page/equipmentTypeManager.vue'], resolve)
            },
            {
              name: '设备信息管理',
              path: '/equipment-details-manager',
              component: resolve => require(['../components/page/equipmentDetailsManager.vue'], resolve)
            },
            {
              name: '工种管理',
              path: '/worker-type-manager',
              component: resolve => require(['../components/page/workerTypeManager.vue'], resolve),
            },
            {
              name: '企业管理',
              path: '/branch-manager',
              component: resolve => require(['../components/page/branchManager.vue'], resolve)
            },
            {
              name: '项目类型管理',
              path: '/project-type-manager',
              component: resolve => require(['../components/page/projectTypeManager.vue'], resolve)
            },
            {
              name: '用户管理',
              path: '/sysuser-manager',
              component: resolve => require(['../components/page/sysuserManager.vue'], resolve)
            },
            {
              name: '不良纪录类型管理',
              path: '/bad-record-type-manager',
              component: resolve => require(['../components/page/badRecordTypeManage.vue'], resolve)
            },
            {
              name: '企业审批',
              path: '/company-approval',
              component: resolve => require(['../components/page/companyApproval.vue'], resolve)
            },
            {
              name: '日志管理',
              path: '/log-manager',
              component: resolve => require(['../components/page/logManage.vue'], resolve)
            },
            {
              name: '用户反馈',
              path: '/sys_user_feedback_manager',
              component: resolve => require(['../components/page/userFeedback.vue'], resolve)
            }
          ]
        }
      ]
    },
    {
      path: '/login',
      component: resolve => require(['../components/page/Login.vue'], resolve)
    },
    {
      path: '/enterprise',
      component: resolve => require(['../components/page/qiye.vue'], resolve)
    },
    {
      path: '/ResertPassword',
      component: resolve => require(['../components/page/ResertPassword.vue'], resolve)
    },
    {
      path: '/OperationsGuide',
      component: resolve => require(['../components/page/operationsGuide.vue'], resolve)
    },
    {
      path: '*',
      redirect: '/404'
    },
    {
      path: '/404',
      component: resolve => require(['../components/page/404.vue'], resolve)
    }
  ]
})

export default router

