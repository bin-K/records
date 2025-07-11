<template>
	<button @click="sendRequest">发送请求</button>
</template>

<script lang="ts" setup>
const sendRequest = () => {
	// 发送请求的逻辑
	fetch('http://localhost:3000')
		.then((response) => response.text())
		.then((data) => {
			console.log('响应数据:', data)
		})
		.catch((error) => {
			console.error('请求出错:', error)
		})
}
</script>
