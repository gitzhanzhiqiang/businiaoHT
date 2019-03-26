import Template from '@src/template';
import userList from './userList';
import bankManage from './bankManage';
module.exports = {
    path: '/userManage',
    component: Template,
    meta: {
        title: '用户管理'
    },
    children: [{
            path: 'userList',
            name: 'userManage_userList',
            component: userList,
            meta: {
                title: '用户列表'
            }
        },
        {
            path: 'bankManage',
            name: 'userManage_bankManage',
            component: bankManage,
            meta: {
                title: '银行卡管理'
            }
        }
    ]
}