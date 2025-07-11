<template>
	<!-- <ued-button v-for="item in routerLink" @click="$router.push(item.link)">
		{{ item.name }}
	</ued-button> -->
	<cors-component> </cors-component>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router'
import CorsComponent from '../components/cors/index.vue'

const $router = useRouter()

const routerLink = [
	{
		name: '容器中线是否进入元素',
		link: '/record-module',
	},
	// {
	// 	name: 'ued-plus组件测试',
	// 	link: '/ued-plus-test',
	// },
	{
		name: '拖拽弹窗-translate',
		link: '/dialog-translate',
	},
	{
		name: '拖拽弹窗-position',
		link: '/dialog-position',
	},
	{
		name: '动态引入CSS',
		link: '/css',
	},
	// {
	// 	name: 'web-worker计算',
	// 	link: '/web-worker',
	// },
	// {
	// 	name: 'web-worker绘图',
	// 	link: '/web-worker-canvas',
	// },
]
</script>
