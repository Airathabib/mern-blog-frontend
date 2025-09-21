import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addComment } from "../../redux/slices/comments";
import { selectIsAuth, selectUserData } from '../../redux/slices/auth';
import { Navigate } from "react-router-dom";
import TextField from "@mui/material/TextField";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import styles from "./AddComment.module.scss";

export const Index = ({ postId }) => {
	const dispatch = useDispatch();
	const isAuth = useSelector(selectIsAuth);
	const userData = useSelector(selectUserData);// ← чтобы показать аватар авторизованного пользователя
	const [text, setText] = useState('');
	const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });


	if (!isAuth) {
		return <Navigate to="/" />;
	}

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!text.trim() || !postId) return;

		try {
			await dispatch(addComment({ postId, text })).unwrap();
			setText('');
			showSnackbar('Комментарий добавлен!', 'success');
		} catch (err) {
			showSnackbar('Ошибка при добавлении', 'error');
		}
	};

	const showSnackbar = (message, severity = 'success') => {
		setSnackbar({ open: true, message, severity });
	};

	const handleCloseSnackbar = () => {
		setSnackbar({ ...snackbar, open: false });
	};

	return (
		<>
			<form onSubmit={handleSubmit} className={styles.root}>
				<Avatar
					classes={{ root: styles.avatar }}
					src={userData?.avatarUrl || "https://mui.com/static/images/avatar/5.jpg"}
					alt={userData?.fullName || "User"}
				/>
				<div className={styles.form}>
					<TextField
						label="Написать комментарий"
						variant="outlined"
						maxRows={10}
						multiline
						fullWidth
						value={text}
						onChange={(e) => setText(e.target.value)}
					/>
					<Button
						variant="contained"
						type="submit"
						disabled={!text.trim()}
						sx={{ marginTop: 1 }}
					>
						Отправить
					</Button>
				</div>

				{/* Snackbar */}
				<Snackbar
					open={snackbar.open}
					autoHideDuration={3000}
					onClose={handleCloseSnackbar}
					anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
				>
					<Alert
						onClose={handleCloseSnackbar}
						severity={snackbar.severity}
						sx={{ width: '100%' }}
					>
						{snackbar.message}
					</Alert>
				</Snackbar>
			</form>
		</>
	);
};
