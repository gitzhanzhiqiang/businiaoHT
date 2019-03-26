import Template from '@src/template';
import debtList from './debtList';
import appealManage from './appealManage';
import auditManage from './auditManage';
import newsManage from './newsManage';
module.exports = {
    path: '/debtManage',
    component: Template,
    meta: {
        title: '债权管理'
    },
    children: [{
            path: 'debtList',
            name: 'debtManage_debtList',
            component: debtList,
            meta: {
                title: '债权列表'
            }
        },
        {
            path: 'appealManage',
            name: 'debtManage_appealManage',
            component: appealManage,
            meta: {
                title: '申诉管理'
            }
        },
        {
            path: 'auditManage',
            name: 'debtManage_auditManage',
            component: auditManage,
            meta: {
                title: '审核管理'
            }
        },
        {
            path: 'newsManage',
            name: 'debtManage_newsManage',
            component: newsManage,
            meta: {
                title: '债权信息管理'
            }
        }
    ]
}