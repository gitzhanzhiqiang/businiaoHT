import App from '@src/index.vue';
import withdrawalAudit from './withdrawalAudit';
import withdrawalRecord from './withdrawalRecord';
module.exports = {
    path: 'cashManage',
    component: App,
    meta: {
        title: '提现管理'
    },
    children: [{
            path: 'withdrawalAudit',
            name: 'cashManage_withdrawalAudit',
            component: withdrawalAudit,
            meta: {
                title: '提现审核'
            }
        },
        {
            path: 'withdrawalRecord',
            name: 'cashManage_withdrawalRecord',
            component: withdrawalRecord,
            meta: {
                title: '提现记录'
            }
        }
    ]
}