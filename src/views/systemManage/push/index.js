import App from '@src/index.vue';
import smsPush from './smsPush';
import systemPush from './systemPush';
module.exports = {
    path: 'push',
    component: App,
    meta: {
        title: '推送'
    },
    children: [{
            path: 'smsPush',
            name: 'push_smsPush',
            component: smsPush,
            meta: {
                title: '短信推送'
            }
        },
        {
            path: 'systemPush',
            name: 'push_systemPush',
            component: systemPush,
            meta: {
                title: '系统推送'
            }
        }
    ]
}