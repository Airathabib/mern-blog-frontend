import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "./AddComment.module.scss";
import { addComment } from "../../redux/slices/comments";
import { selectIsAuth, selectUserData } from '../../redux/slices/auth';
import { Navigate } from "react-router-dom";
import TextField from "@mui/material/TextField";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";

export const Index = ({ postId }) => {
	const dispatch = useDispatch();
	const isAuth = useSelector(selectIsAuth);
	const userData = useSelector(selectUserData); // ← чтобы показать аватар авторизованного пользователя
	const [text, setText] = useState('');

	if (!isAuth) {
		return <Navigate to="/" />;
	}
	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!text.trim() || !postId) return;

		await dispatch(addComment({ postId, text }));
		setText(''); // Очистить поле после отправки
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
						autoFocus
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
			</form>
		</>
	);
};
