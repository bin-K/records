<template>
	<div>
		<button @click="makeWorker">开始线程</button>
		<!--在计算时 往input输入值时 没有发生卡顿-->
		<p><input type="text" /></p>
	</div>
</template>

<script lang="ts" setup>
import { ref, onBeforeUnmount } from 'vue'
const workerList = ref<any>([])
const arr = new Array(100000).fill(1).map(() => Math.random() * 10000)
const weightedList = new Array(100000).fill(1).map(() => Math.random() * 10000)
const calcList = ref<any[]>([
	{ type: 'sum', name: '总和' },
	{ type: 'average', name: '算术平均' },
	{ type: 'weightedAverage', name: '加权平均' },
	{ type: 'max', name: '最大' },
	{ type: 'middleNum', name: '中位数' },
	{ type: 'min', name: '最小' },
	{ type: 'variance', name: '样本方差' },
	{ type: 'popVariance', name: '总体方差' },
	{ type: 'stdDeviation', name: '样本标准差' },
	{ type: 'popStandardDeviation', name: '总体标准差' },
])

const makeWorker = () => {
	calcList.value.forEach((item) => {
		let workerName = `worker${workerList.value.length}`
		// 新建一个线程
		let worker = new Worker(new URL('./worker/worker.ts', import.meta.url), {
			type: 'module',
		})
		let start = performance.now()
		worker.postMessage({
			arr,
			type: item.type,
			weightedList,
		})
		worker.addEventListener('message', (e) => {
			worker.terminate()

			let tastName = ''
			calcList.value.forEach((item) => {
				if (item.type === e.data.type) {
					item.value = e.data.value
					tastName = item.name
				}
			})

			let end = performance.now()
			let duration = end - start
			console.log(`当前任务: ${tastName}, 计算用时: ${duration} 毫秒`)
		})
		workerList.value.push({ [workerName]: worker })
	})
}

const clearWorker = () => {
	if (workerList.value.length > 0) {
		workerList.value.forEach((item: any, key: number) => {
			item[`worker${key}`].terminate && item[`worker${key}`].terminate() // 终止所有线程
		})
	}
}

onBeforeUnmount(() => {
	clearWorker()
})
</script>
