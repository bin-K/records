import { createWebHistory, createRouter, RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
	{
		path: '/',
		name: 'Index',
		component: () => import('../views/index.vue'),
	},
	{
		path: '/record-module',
		name: 'RecordModules',
		component: () => import('../components/record-module/index.vue'),
	},
	// {
	// 	path: '/ued-plus-test',
	// 	name: 'UedPlusTest',
	// 	component: () => import('../components/ued-plus/test.vue'),
	// },
	{
		path: '/dialog-translate',
		name: 'DialogTranslate',
		component: () => import('../components/dialog/translate.vue'),
	},
	{
		path: '/dialog-position',
		name: 'DialogPosition',
		component: () => import('../components/dialog/position.vue'),
	},
	{
		path: '/css',
		name: 'Css',
		component: () => import('../components/css/index.vue'),
	},
	{
		path: '/web-worker',
		name: 'WebWorker',
		component: () => import('../components/web-worker/index.vue'),
	},
	{
		path: '/web-worker-canvas',
		name: 'WebWorkerCanvas',
		component: () => import('../components/web-worker/canvas.vue'),
	},
]

export default createRouter({
	history: createWebHistory(),
	routes,
})
