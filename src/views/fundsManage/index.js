import Template from '@src/template';
import cashManage from './cashManage'; //提现管理
import userAccount from './userAccount';
import moneyRecord from './moneyRecord';
import topUpManage from './topUpManage';
import moneyStatistics from './moneyStatistics';
module.exports = {
    path: '/fundsManage',
    component: Template,
    meta: {
        title: '资金管理'
    },
    children: [
        cashManage,
        {
            path: 'userAccount',
            name: 'fundsManage_userAccount',
            component: userAccount,
            meta: {
                title: '用户账户'
            }
        },
        {
            path: 'moneyRecord',
            name: 'fundsManage_moneyRecord',
            component: moneyRecord,
            meta: {
                title: '资金记录'
            }
        },
        {
            path: 'topUpManage',
            name: 'fundsManage_topUpManage',
            component: topUpManage,
            meta: {
                title: '充值管理'
            }
        },
        {
            path: 'moneyStatistics',
            name: 'fundsManage_moneyStatistics',
            component: moneyStatistics,
            meta: {
                title: '资金统计'
            }
        }
    ]
}