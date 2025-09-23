import React, { useState } from "react";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import { useForm } from "react-hook-form";
import styles from "./Login.module.scss";
import { Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchAuth, selectIsAuth } from "../../redux/slices/auth";
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

export const Login = () => {
	const dispatch = useDispatch()
	const isAuth = useSelector(selectIsAuth)
	const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'error' });

	const {
		register,
		handleSubmit,
		formState: { errors, isValid }
	} = useForm({
		defaultValues: {
			email: '',
			password: ''
		},
		mode: 'onChange'
	});

	const onSubmit = async (values) => {
		try {
			const result = await dispatch(fetchAuth(values)).unwrap();
			if ('token' in result) {
				window.localStorage.setItem('token', result.token);
			}
		} catch (error) {
			showSnackbar(
				typeof error === 'string' ? error : 'Не удалось авторизоваться!',
				'error'
			);
		}
	};

	const showSnackbar = (message, severity = 'error') => {
		setSnackbar({ open: true, message, severity });
	};

	const handleCloseSnackbar = () => {
		setSnackbar(prev => ({ ...prev, open: false }));
	};

	if (isAuth) {
		return <Navigate to="/" />
	};

	return (
		<Paper classes={{ root: styles.root }}>
			<Typography classes={{ root: styles.title }} variant="h5">
				Вход в аккаунт
			</Typography>
			<form onSubmit={handleSubmit(onSubmit)}>
				<TextField
					className={styles.field}
					label="E-Mail"
					type="email"
					error={Boolean(errors.email?.message)}
					helperText={errors.email?.message}
					{...register('email', { required: "Укажите почту!" })}
					fullWidth
				/>
				<TextField
					className={styles.field}
					label="Пароль"
					error={Boolean(errors.password?.message)}
					helperText={errors.password?.message}
					{...register('password', { required: "Укажите пароль!" })}
					fullWidth
				/>
				<Button
					disabled={!isValid}
					type="submit"
					size="large"
					variant="contained"
					fullWidth
					sx={{ mt: 2 }}
				>
					Войти
				</Button>
			</form>

			<Snackbar
				open={snackbar.open}
				autoHideDuration={4000}
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
		</Paper>
	);
};
