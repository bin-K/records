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

let transform = {
	offsetX: 0,
	offsetY: 0,
}

const mousedown = (e: MouseEvent) => {
	const downX = e.clientX
	const downY = e.clientY
	const { offsetX, offsetY } = transform

	const targetRect = dialogHeaderRef.value!.getBoundingClientRect()
	const targetLeft = targetRect.left
	const targetTop = targetRect.top
	const targetWidth = targetRect.width
	const targetHeight = targetRect.height

	const clientWidth = document.documentElement.clientWidth
	const clientHeight = document.documentElement.clientHeight

	const minLeft = -targetLeft + offsetX
	const minTop = -targetTop + offsetY
	const maxLeft = clientWidth - targetLeft - targetWidth + offsetX
	const maxTop = clientHeight - targetTop - targetHeight + offsetY

	const mousemove = (e: MouseEvent) => {
		// 移动部分减去偏移部分加上原始的偏移量即为最后该移动的偏移量
		let moveX = offsetX + e.clientX - downX
		let moveY = offsetY + e.clientY - downY

		if (!overflow.value) {
			moveX = Math.min(Math.max(moveX, minLeft), maxLeft)
			moveY = Math.min(Math.max(moveY, minTop), maxTop)
		}

		transform = {
			offsetX: moveX,
			offsetY: moveY,
		}

		if (dialogRef.value) {
			dialogRef.value.style.transform = `translate(${moveX}px, ${moveY}px)`
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
	margin: auto;
	position: relative;
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
