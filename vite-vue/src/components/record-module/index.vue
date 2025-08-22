<template>
  <div id="scrollContainer">
    <div id="index" class="scrollIndex" data-type="scrollIndex"></div>
    <div class="container">
      <div id="other1" class="otherElement" data-type="other1"></div>
      <div id="element1" class="scrollElement" data-type="scrollElement1"></div>
      <div id="other2" class="otherElement" data-type="other2"></div>
      <div id="element2" class="scrollElement" data-type="scrollElement2"></div>
      <div id="other3" class="otherElement" data-type="other3"></div>
      <div id="element3" class="scrollElement" data-type="scrollElement3"></div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, nextTick } from 'vue'

const enterTimes = [] as any; // 进入时间数组
const leaveTimes = [] as any; // 离开时间数组

// 进入页面开始计时
let startTime: Date | null = new Date();
// 记录上一个元素
let preElement: any = null
let isEnter = false
// 最后一次滚动动卷去的距离，用于判断下一次滑动是上滑还是下滑
// let lastScrollPositionTop = scrollContainer.scrollTop

const list = [] as any


const judgeEnterCenter = (clientHeight: number, element: any, index: number) => {
  const rect = element.getBoundingClientRect();
  const elementTop = rect.top; // 元素顶部相对于顶部的距离
  const elementBottom = rect.bottom; // 元素底部相对于顶部的距离

  if (clientHeight / 2 >= elementTop && clientHeight / 2 < elementBottom) {
    if (!isEnter) {
      if (enterTimes[index] === undefined) {
        // 页面刚刷新时，开始计算第一块元素的停留时间
        if (index === 0 && startTime !== null) {
          enterTimes[index] = startTime
          startTime = null
        } else {
          enterTimes[index] = new Date();
        }
        isEnter = true
        preElement = element
        leaveTimes[index] = undefined;
        console.log(
          `元素 ${element.dataset.type} 进入可视区域中线，进入时间为：${enterTimes[index]}`
        );
        return
      }
    }

  } else {
    if (preElement !== null && preElement === element) {
      isEnter = false
      preElement = null
      if (leaveTimes[index] === undefined) {
        leaveTimes[index] = new Date();
        console.log(
          `元素 ${element.dataset.type} 离开可视区域中线，离开时间为：${leaveTimes[index]}`
        );
        console.log(
          `停留时间：${leaveTimes[index] - enterTimes[index]} `
        );
        if (list.find((item: any) => item.type === element.dataset.type)) {
          list[list.findIndex((item: any) => item.type === element.dataset.type)].totalTime += leaveTimes[index] - enterTimes[index]
        } else {
          list.push({
            type: element.dataset.type,
            totalTime: leaveTimes[index] - enterTimes[index]
          })
        }
        console.log(list)
        enterTimes[index] = undefined
        return
      }
    }
  }
}

onMounted(() => {
  nextTick(() => {
    const scrollContainer = document.querySelector('#scrollContainer') as HTMLElement
    const index = document.querySelector('.scrollIndex')
    const elements = document.querySelectorAll(".scrollElement"); // 获取所有需要监听的元素
    const otherElements = document.querySelectorAll('.otherElement')
    let otherElementsArr = Array.from(otherElements)
    let elementsArr = Array.from(elements)
    scrollContainer.addEventListener("scroll", function () {
      // // 当前滚动卷去的距离，对比最后一次滚动卷去的距离判断是上滑还是下滑
      // let currentScrollPositionTop = scrollContainer.scrollTop
      // 滚动区域的高
      const clientHeight = scrollContainer.clientHeight;
      // // 页面滚动的距离
      // const scrollTop = scrollContainer.scrollTop;
      judgeEnterCenter(clientHeight, index, 0)
      otherElementsArr.forEach((element, index) => {
        judgeEnterCenter(clientHeight, element, index)
      })

      elementsArr.forEach((element, index) => {
        judgeEnterCenter(clientHeight, element, index)
      })
    });
  })
})

</script>

<style scoped>
#scrollContainer {
  width: 300px;
  height: 300px;
  border: 1px solid black;
  overflow-y: scroll;
}

.container {
  margin-top: 50px;
}

.scrollIndex {
  height: 250px;
  width: 200px;
  margin: 0px auto;
  border: 1px solid black;
  background-color: blue;
}

.otherElement {
  margin: 0px auto;
  border: 1px solid black;
  height: 100px;
  width: 200px;
  background-color: yellowgreen;
}

.scrollElement {
  margin: 20px auto;
  border: 1px solid black;
  height: 200px;
  width: 200px;
  background-color: red;
}
</style>