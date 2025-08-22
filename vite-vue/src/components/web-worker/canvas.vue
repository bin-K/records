<template>
	<div>
		<button @click="makeWorker">开始绘图</button>
		<canvas id="myCanvas" width="300" height="150"></canvas>
	</div>
</template>

<script lang="ts" setup>
const makeWorker = () => {
	let worker = new Worker(
		new URL('./worker/canvasWorker.ts', import.meta.url),
		{
			type: 'module',
		}
	)
	let htmlCanvas = document.getElementById('myCanvas') as HTMLCanvasElement
	// 使用canvas的transferControlToOffscreen函数获取一个OffscreenCanvas对象
	let offscreen = htmlCanvas?.transferControlToOffscreen()
	// 注意：第二个参数不能省略
	worker.postMessage({ canvas: offscreen }, [offscreen])
}
</script>
