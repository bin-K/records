<template>
	<div class="box"></div>
	<button @click="switchBg">切换背景</button>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
const bgc = ref('red')
const switchBg = () => {
	if (bgc.value === 'red') {
		bgc.value = 'yellow'
	} else {
		bgc.value = 'red'
	}
}

watch(
	() => bgc.value,
	(newVal) => {
		if (newVal === 'red') {
			console.log(1111)

			import('./red.css')
		} else if (newVal === 'yellow') {
			import('./yellow.css')
		}
	},
	{
		immediate: true,
	}
)
</script>

<style scoped>
/* .box {
	width: 500px;
	height: 500px;
	background-color: v-bind(bgc);
} */
</style>
