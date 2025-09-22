import React, { useState } from 'react';
import Button from '@mui/material/Button';
import {
	IconButton,
	Box,
	Drawer,
	List,
	ListItem,
	ListItemButton,
	ListItemText,
	Divider,
	Typography
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import MenuIcon from '@mui/icons-material/Menu';
import { Link } from 'react-router-dom';
import Container from '@mui/material/Container';
import { useSelector, useDispatch } from 'react-redux';
import { logout, selectIsAuth } from '../../redux/slices/auth';
import { ToggleThemeButton } from '../ToggleThemeButtomn';
import { ConfirmDialog } from '../confirmDialog';

export const Header = () => {
	const dispatch = useDispatch()
	const isAuth = useSelector(selectIsAuth);
	const [confirmOpen, setConfirmOpen] = useState(false);
	const [mobileOpen, setMobileOpen] = useState(false);

	const handleDrawerToggle = () => {
		setMobileOpen(!mobileOpen);
	};

	const handleOpenConfirm = () => setConfirmOpen(true);
	const handleCloseConfirm = () => setConfirmOpen(false);

	const handleConfirmLogout = () => {
		dispatch(logout());
		window.localStorage.removeItem('token');
		handleCloseConfirm();
	};

	const drawer = (
		<Box
			onClick={handleDrawerToggle}
			sx={{
				textAlign: 'center',
				height: '100%',
				display: 'flex',
				flexDirection: 'column',
			}}
		>
			{/* Стильная кнопка "Главная" */}
			<Link
				to="/"
				style={{
					textDecoration: 'none',
					color: 'inherit',
					display: 'block',
					padding: '16px 24px',
				}}
			>
				<Box
					sx={{
						display: 'flex',
						alignItems: 'center',
						gap: 1.5,
						backgroundColor: 'primary.main',
						color: 'primary.contrastText',
						borderRadius: 2,
						padding: '8px 16px',
						fontWeight: 600,
						fontSize: '1rem',
						transition: 'background-color 0.3s ease',
						'&:hover': {
							backgroundColor: 'primary.dark',
						},
					}}
				>
					<HomeIcon fontSize="small" />
					<Typography variant="button" sx={{ textTransform: 'none' }}>
						Главная
					</Typography>
				</Box>
			</Link>

			<Divider sx={{ my: 2 }} />

			<List sx={{ flex: 1, py: 0 }}>
				{isAuth ? (
					<>
						<ListItem disablePadding>
							<ListItemButton
								component={Link}
								to="/add-post"
								sx={{
									justifyContent: 'center',
									fontWeight: 500,
									'&:hover': {
										backgroundColor: 'action.hover',
									},
								}}
							>
								<ListItemText primary="Написать статью" />
							</ListItemButton>
						</ListItem>
						<ListItem disablePadding>
							<ListItemButton
								onClick={handleOpenConfirm}
								sx={{
									justifyContent: 'center',
									fontWeight: 500,
									color: 'error.main',
									'&:hover': {
										backgroundColor: 'action.hover',
									},
								}}
							>
								<ListItemText primary="Выйти" />
							</ListItemButton>
						</ListItem>
					</>
				) : (
					<>
						<ListItem disablePadding>
							<ListItemButton
								component={Link}
								to="/login"
								sx={{
									justifyContent: 'center',
									fontWeight: 500,
									'&:hover': {
										backgroundColor: 'action.hover',
									},
								}}
							>
								<ListItemText primary="Войти" />
							</ListItemButton>
						</ListItem>
						<ListItem disablePadding>
							<ListItemButton
								component={Link}
								to="/register"
								sx={{
									justifyContent: 'center',
									fontWeight: 500,
									'&:hover': {
										backgroundColor: 'action.hover',
									},
								}}
							>
								<ListItemText primary="Создать аккаунт" />
							</ListItemButton>
						</ListItem>
					</>
				)}
			</List>

			{/* ToggleThemeButton внизу */}
			<Box sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider' }}>
				<ToggleThemeButton />
			</Box>
		</Box>
	);

	return (
		<div style={{ marginBottom: 30 }}>
			<Container maxWidth="lg">
				<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 0' }}>
					<Link to="/" style={{ textDecoration: 'none' }}>
						<Box
							sx={{
								display: 'flex',
								alignItems: 'center',
								gap: 1,
								backgroundColor: 'primary.main',
								color: 'primary.contrastText',
								borderRadius: 2,
								padding: '6px 12px',
								fontWeight: 600,
								fontSize: { xs: '0.875rem', sm: '1rem' },
								transition: 'background-color 0.3s ease',
								'&:hover': {
									backgroundColor: 'primary.dark',
								},
							}}
						>
							<HomeIcon fontSize="small" />
							<Typography variant="button" sx={{ textTransform: 'none' }}>
								Главная
							</Typography>
						</Box>
					</Link>

					{/* Desktop buttons */}
					<Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 2 }}>
						{isAuth ? (
							<>
								<Link to="/add-post">
									<Button variant="contained" size="small">Написать статью</Button>
								</Link>
								<Button
									onClick={handleOpenConfirm}
									variant="contained"
									color="error"
									size="small"
								>
									Выйти
								</Button>
								<ToggleThemeButton />
							</>
						) : (
							<>
								<Link to="/login">
									<Button variant="outlined" size="small">Войти</Button>
								</Link>
								<Link to="/register">
									<Button variant="contained" size="small">Создать аккаунт</Button>
								</Link>
								<ToggleThemeButton />
							</>
						)}
					</Box>

					{/* Mobile menu button */}
					<IconButton
						color="inherit"
						aria-label="open drawer"
						edge="start"
						onClick={handleDrawerToggle}
						sx={{ ml: 2, display: { md: 'none' } }}
					>
						<MenuIcon />
					</IconButton>
				</div>
			</Container>

			<Drawer
				variant="temporary"
				open={mobileOpen}
				onClose={handleDrawerToggle}
				ModalProps={{
					keepMounted: true,
				}}
				sx={{
					display: { xs: 'block', md: 'none' },
					'& .MuiDrawer-paper': {
						boxSizing: 'border-box',
						width: 280,
						paddingTop: 0,
					},
				}}
			>
				{drawer}
			</Drawer>

			<ConfirmDialog
				open={confirmOpen}
				title="Подтверждение выхода"
				message="Вы действительно хотите выйти из аккаунта?"
				confirmText="Выйти"
				cancelText="Отмена"
				onConfirm={handleConfirmLogout}
				onCancel={handleCloseConfirm}
			/>
		</div>
	);
};
