
/**
 * @description 给对应的信息类型赋值
 * @param {Object} sseChunkResult 当前SSE结果对象
 * @param {Object} params
 * @param {string} params.event 信息类型（reasoning, message, resp, reference, error）
 * @param {Object} params.data 回答的JSON
 * @returns {Object} 更新后的SSE结果
 */
export const handleSSEChunkResult = (sseChunkResult, { event, data }) => {
  // 先检查类型是否有效
  if (!sseChunkResult[event]) {
    return sseChunkResult;
  }

  const result = { ...sseChunkResult };
  const { answer, done } = data;

  result[event] = {
    ...result[event],
    answer: (result[event].answer || "") + (answer || "")
  };


  // 处理完成标志
  if (done) {
    result.message = {
      ...result.message,
      done: true
    };
  }

  return result;
};

/**
 * @description 处理流式信息
 * @param {string} chunk 流式信息
 * @param {Object} sseChunkResult 当前SSE结果对象
 * @param {string} buffer 响应结果缓存
 * @param {Array} referenceList 引用列表引用
 * @returns {Object} 返回处理结果 { updatedSseResult, updatedBuffer }
 */
export const processSSEChunk = (chunk, sseChunkResult, buffer) => {
  let updatedBuffer = buffer + chunk;
  let updatedSseResult = { ...sseChunkResult };

  const lines = [];
  let position = 0;

  while (position < updatedBuffer.length) {
    // 查找下一个 event 块起始位置
    const exgMatch =
      /event:message/g;
    exgMatch.lastIndex = position;
    const match = exgMatch.exec(updatedBuffer);
    const eventStartIndex = match ? match.index : -1;

    if (eventStartIndex === -1) break;

    // 查找下一个 event 的开始位置，作为当前块的结束
    exgMatch.lastIndex = eventStartIndex + 6;
    const nextMatch = exgMatch.exec(updatedBuffer);
    const nextEventIndex = nextMatch ? nextMatch.index : -1;

    let eventEndIndex;
    if (nextEventIndex !== -1) {
      // 下一个 event 存在，结束于前一个 event 开始之前
      eventEndIndex = nextEventIndex;
    } else {
      // 当前是最后一个 event 块，结束于字符串末尾
      eventEndIndex = updatedBuffer.length;
    }

    // 提取当前 event 块
    const eventBlock = updatedBuffer.slice(eventStartIndex, eventEndIndex);
    position = eventEndIndex;
    const splitStr = eventBlock.split("\n", 2);
    lines.push(splitStr);
  }

  // 处理完所有完整事件块后，清除已处理的部分
  if (position > 0) {
    updatedBuffer = updatedBuffer.substring(position);
  }

  for (const line of lines) {
    if (line.length === 2) {
      try {
        const event = line[0]?.substring("event:".length);
        let data = line[1]?.substring("data:".length);

        if (data === "[DONE]") {
          data = { answer: " ", done: true };
        } else {
          // JSON Parse 错误代表数据块没有完全返回
          data = JSON.parse(data);
        }

        if (event && data) {
          updatedSseResult = handleSSEChunkResult(updatedSseResult, { event, data });
        }
      } catch {
        // 如果解析失败，将当前块放回缓冲区
        updatedBuffer += line.join("\n");
      }
    }
  }

  return { updatedSseResult, updatedBuffer };
};
