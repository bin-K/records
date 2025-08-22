<template>
	<div class="overlay">
		<div class="overlay-dialog">
			<div class="dialog" ref="dialogRef">
				<div class="header" ref="dialogHeaderRef">
					<div class="title">弹窗头部</div>
				</div>
				<div class="body">
					<div class="content">弹窗内容</div>
					<ued-radio v-model="overflow" :value="false" label="不允许溢出" />
					<ued-radio v-model="overflow" :value="true" label="允许溢出" />
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
const overflow = ref(false)
const dialogRef = ref<HTMLDivElement>()
const dialogHeaderRef = ref<HTMLDivElement>()

const mousedown = (e: MouseEvent) => {
	const downX = e.clientX
	const downY = e.clientY

	const targetRect = dialogRef.value!.getBoundingClientRect()
	const targetLeft = targetRect.left
	const targetTop = targetRect.top
	const targetWidth = targetRect.width
	const targetHeight = targetRect.height

	const clientWidth = document.documentElement.clientWidth
	const clientHeight = document.documentElement.clientHeight

	// https://developer.mozilla.org/zh-CN/docs/Web/API/DOMMatrix 注意兼容性问题
	const matrix = new WebKitCSSMatrix(
		getComputedStyle(dialogRef.value!).transform
	)

	const mousemove = (e: MouseEvent) => {
		const moveX = e.clientX - downX
		const moveY = e.clientY - downY

		let top = targetTop + moveY
		let left = targetLeft + moveX

		if (!overflow.value) {
			top = Math.min(Math.max(top, 0), clientHeight - targetHeight)
			left = Math.min(Math.max(left, 0), clientWidth - targetWidth)
		}

		if (dialogRef.value) {
			dialogRef.value.style.top = `${top - matrix.m42}px`
			dialogRef.value.style.left = `${left - matrix.m41}px`
		}
	}

	const mouseup = () => {
		document.removeEventListener('mousemove', mousemove)
		document.removeEventListener('mouseup', mouseup)
	}

	document.addEventListener('mousemove', mousemove)
	document.addEventListener('mouseup', mouseup)
}

onMounted(() => {
	if (dialogRef.value && dialogHeaderRef.value) {
		dialogHeaderRef.value?.addEventListener('mousedown', mousedown)
	}
})
onBeforeUnmount(() => {
	if (dialogRef.value && dialogHeaderRef.value) {
		dialogHeaderRef.value?.removeEventListener('mousedown', mousedown)
	}
})
</script>

<style scoped>
.overlay {
	position: fixed;
	top: 0;
	right: 0;
	bottom: 0;
	left: 0;
	z-index: 2000;
	height: 100%;
}
.overlay-dialog {
	position: fixed;
	top: 0;
	right: 0;
	bottom: 0;
	left: 0;
	display: flex;
}
.dialog {
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	width: 50%;
	background-color: #fff;
	border-radius: 4px;
}
.dialog .header {
	padding: 10px;
	font-size: 14px;
	font-weight: 700;
	color: #000;
	cursor: move;
}
.dialog .body {
	padding: 20px;
	font-size: 14px;
	font-weight: 700;
	color: #000;
}
</style>
