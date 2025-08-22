import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import App from '../App'
import SsePage from '../pages/sse'

export default function AppRouter() {
	return (
		<Router
			basename={import.meta.env.MODE === 'development' ? '/' : '/vite-react'}
		>
			<Routes>
				<Route path="/" element={<App />} />
				<Route path="/sse" element={<SsePage />} />
			</Routes>
		</Router>
	)
}
