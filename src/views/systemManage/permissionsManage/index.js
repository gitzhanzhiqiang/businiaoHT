import App from '@src/index.vue';
import roleManage from './roleManage';
import adminManage from './adminManage';
module.exports = {
    path: 'permissionsManage',
    component: App,
    meta: {
        title: '权限管理'
    },
    children: [{
            path: 'roleManage',
            name: 'permissionsManage_roleManage',
            component: roleManage,
            meta: {
                title: '角色管理'
            }
        },
        {
            path: 'adminManage',
            name: 'permissionsManage_systemPush',
            component: adminManage,
            meta: {
                title: '管理员管理'
            }
        }
    ]
}