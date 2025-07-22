import { useRef, useState } from 'react'
import { fetchEventSource } from '@microsoft/fetch-event-source'
import { processSSEChunk, handleSSEChunkResult } from '../../hooks/useMessage'

export default function SsePage() {
	const [message, setMessage] = useState('')

	const sseChunkResult = useRef({
		message: {
			answer: '',
			done: false,
		},
	})
	const buffer = useRef('')
	const resetSseChunkResult = () => {
		sseChunkResult.current = {
			message: {
				conversationId: '',
				answer: '',
				done: false,
			},
		}
	}

	const handleChunk = (chunk) => {
		resetSseChunkResult()
		buffer.current = ''
		const { updatedSseResult, updatedBuffer } = processSSEChunk(
			chunk,
			sseChunkResult.current,
			buffer.current
		)
		sseChunkResult.current = updatedSseResult
		buffer.current = updatedBuffer
		const { answer: messageAnswer } = sseChunkResult.current.message
		setMessage((prev) => prev + messageAnswer)
	}
	const handleFetchGet = () => {
		setMessage('')
		fetch('http://localhost:3000/sse?method=FetchGet：', {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
			},
		}).then(async (response) => {
			if (response.ok) {
				const reader = response.body.getReader()
				const decoder = new TextDecoder('utf-8')
				while (true) {
					const { done, value } = await reader.read()
					if (done) break
					const chunk = decoder.decode(value, { stream: true })
					handleChunk(chunk)
				}
			} else {
				console.error('GET request failed')
			}
		})
	}
	const handleFetchPost = () => {
		setMessage('')
		fetch('http://localhost:3000/sse', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ method: 'FetchPost：' }),
		}).then(async (response) => {
			if (response.ok) {
				const reader = response.body.getReader()
				const decoder = new TextDecoder('utf-8')
				while (true) {
					const { done, value } = await reader.read()
					if (done) break
					const chunk = decoder.decode(value, { stream: true })
					handleChunk(chunk)
				}
			} else {
				console.error('POST request failed')
			}
		})
	}

	const handleEventSource = () => {
		resetSseChunkResult()
		buffer.current = ''
		setMessage('')
		const eventSource = new EventSource(
			'http://localhost:3000/sse?method=EventSourceGET：'
		)
		eventSource.onmessage = (event) => {
			if (event.data === '[DONE]') {
				eventSource.close()
				return
			}
			const updatedSseResult = handleSSEChunkResult(sseChunkResult.current, {
				event: event.type,
				data: JSON.parse(
					event.data === '[DONE]' ? '{"answer":"", "done": true}' : event.data
				),
			})
			sseChunkResult.current = updatedSseResult
			const { answer: messageAnswer } = sseChunkResult.current.message
			setMessage(messageAnswer)
		}
		eventSource.onerror = () => {
			eventSource.close()
		}
	}
	const handleFetchEventSourceGet = () => {
		resetSseChunkResult()
		buffer.current = ''
		setMessage('')
		fetchEventSource('http://localhost:3000/sse?method=FetchEventSourceGet：', {
			method: 'GET',
			onmessage: (event) => {
				if (event.data === '[DONE]') {
					return
				}
				const updatedSseResult = handleSSEChunkResult(sseChunkResult.current, {
					event: event.event,
					data: JSON.parse(
						event.data === '[DONE]' ? '{"answer":"", "done": true}' : event.data
					),
				})
				sseChunkResult.current = updatedSseResult
				const { answer: messageAnswer } = sseChunkResult.current.message
				setMessage(messageAnswer)
			},
			onerror: (error) => {
				console.error('fetch-event-source error:', error)
			},
		})
	}
	const handleFetchEventSourcePost = () => {
		resetSseChunkResult()
		buffer.current = ''
		setMessage('')
		fetchEventSource('http://localhost:3000/sse', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ method: 'FetchEventSourcePost：' }),
			onmessage: (event) => {
				if (event.data === '[DONE]') {
					return
				}
				const updatedSseResult = handleSSEChunkResult(sseChunkResult.current, {
					event: event.event,
					data: JSON.parse(
						event.data === '[DONE]' ? '{"answer":"", "done": true}' : event.data
					),
				})
				sseChunkResult.current = updatedSseResult
				const { answer: messageAnswer } = sseChunkResult.current.message
				setMessage(messageAnswer)
			},
			onerror: (error) => {
				console.error('fetch-event-source error:', error)
			},
		})
	}

	return (
		<div>
			<button onClick={handleFetchGet}>fetch GET</button>
			<button onClick={handleFetchPost}>fetch POST</button>
			<button onClick={handleEventSource}>EventSource</button>
			<button onClick={handleFetchEventSourceGet}>
				fetch-event-source GET
			</button>
			<button onClick={handleFetchEventSourcePost}>
				fetch-event-source POST
			</button>
			<div>
				<h3>Message:</h3>
				<p>{message}</p>
			</div>
		</div>
	)
}
