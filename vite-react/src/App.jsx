import { useNavigate } from 'react-router-dom'
import './App.css'

function App() {
	const navigate = useNavigate()
	const routers = [
		{ path: '/', label: 'Home' },
		{ path: '/sse', label: 'SSE' },
	]
	return (
		<div className="App">
			{routers.map((route) => (
				<button
					style={{ marginRight: '12px' }}
					key={route.path}
					onClick={() => navigate(route.path)}
				>
					{route.label}
				</button>
			))}
		</div>
	)
}

export default App
