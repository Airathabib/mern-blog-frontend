import React from 'react';
import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogContentText,
	DialogActions,
	Button,
} from '@mui/material';

export const ConfirmDialog = ({
	open,
	title = "Подтверждение",
	message = "Вы уверены?",
	confirmText = "Да",
	cancelText = "Отмена",
	onConfirm,
	onCancel,
}) => {
	return (
		<Dialog
			open={open}
			onClose={onCancel}
			aria-labelledby="confirm-dialog-title"
			aria-describedby="confirm-dialog-description"
		>
			<DialogTitle id="confirm-dialog-title">{title}</DialogTitle>
			<DialogContent>
				<DialogContentText id="confirm-dialog-description">
					{message}
				</DialogContentText>
			</DialogContent>
			<DialogActions>
				<Button onClick={onCancel} color="secondary">
					{cancelText}
				</Button>
				<Button onClick={onConfirm} color="primary" variant="contained" autoFocus>
					{confirmText}
				</Button>
			</DialogActions>
		</Dialog>
	);
};
