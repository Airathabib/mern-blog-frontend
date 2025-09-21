import Container from "@mui/material/Container";
import { Box } from '@mui/material';
import { Route, Routes } from "react-router-dom";
import { Header } from "./components";
import { Home, FullPost, Registration, AddPost, Login } from "./pages";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { fetchAuthMe, selectIsAuth } from "./redux/slices/auth";

function App() {
	const dispatch = useDispatch();

	const isAuth = useSelector(selectIsAuth); // ← получаем статус авторизации

	useEffect(() => {
		const token = window.localStorage.getItem('token');
		if (token) {
			dispatch(fetchAuthMe()); // ← вызываем ТОЛЬКО если есть токен
		}
	}, [dispatch]);
	return (
		<>
			<Box sx={{ backgroundColor: 'background.default', minHeight: '100vh' }}>

				<Header />
				<Container maxWidth="lg">
					<Routes>
						<Route path="/" element={<Home />} />
						<Route path="/tags/:tagName" element={<Home />} /> {/* ← один и тот же компонент */}
						<Route path="/posts/:id" element={<FullPost />} />
						<Route path="/posts/:id/edit" element={<AddPost />} />
						<Route path="/add-post" element={<AddPost />} />
						<Route path="/login" element={<Login />} />
						<Route path="/register" element={<Registration />} />
					</Routes>
				</Container>
			</Box>
		</>
	);
}

export default App;
