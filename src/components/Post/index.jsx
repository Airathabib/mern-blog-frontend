import React, { useState } from 'react';
import clsx from 'clsx';
import { Typography, Box } from '@mui/material';
import CommentIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Clear';
import EditIcon from '@mui/icons-material/Edit';
import EyeIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import { Link } from 'react-router-dom';
import { UserInfo } from '../UserInfo';
import { PostSkeleton } from './Skeleton';
import { useDispatch } from 'react-redux';
import styles from './Post.module.scss';
import { fetchRemovePost } from '../../redux/slices/posts';
import { ConfirmDialog } from '../confirmDialog';

export const Post = ({
	id,
	title,
	createdAt,
	imageUrl,
	user,
	viewsCount,
	commentsCount,
	tags,
	children,
	isFullPost,
	isLoading,
	isEditable,
}) => {
	const dispatch = useDispatch();
	const [confirmOpen, setConfirmOpen] = useState(false);

	const handleOpenConfirm = () => setConfirmOpen(true);
	const handleCloseConfirm = () => setConfirmOpen(false);
	const handleConfirmRemove = () => {
		dispatch(fetchRemovePost(id));
		setConfirmOpen(false);
	};

	if (isLoading) {
		return <PostSkeleton />;
	}

	return (
		<Box
			sx={{
				maxWidth: isFullPost ? '1440px' : '100%',
				width: '100%',
				mx: 'auto',
				backgroundColor: 'background.paper',
				border: '1px solid',
				borderColor: 'divider',
				borderRadius: { xs: 1.5, sm: 2 }, // ← меньше радиус на мобильных
				padding: {
					xs: isFullPost ? 2 : 1.5,      // ← 320px
					sm: isFullPost ? 3 : 2,        // ← 375px
					md: isFullPost ? 4 : 3,        // ← 430px+
				},
				boxShadow: 1,
				mb: { xs: 2, md: 4 },           // ← меньше отступ снизу на мобильных
				position: 'relative',
				overflow: 'visible',
			}}
		>
			{isEditable && (
				<Box
					sx={{
						position: 'absolute',
						top: { xs: 8, sm: 12 },
						right: { xs: 8, sm: 12 },
						display: 'flex',
						gap: 0.5,
					}}
				>
					<Link to={`/posts/${id}/edit`}>
						<IconButton color="primary" size="small" sx={{ color: 'primary.main' }}>
							<EditIcon fontSize="small" />
						</IconButton>
					</Link>
					<IconButton
						onClick={handleOpenConfirm}
						color="error"
						size="small"
						sx={{ color: 'error.main' }}
					>
						<DeleteIcon fontSize="small" />
					</IconButton>
				</Box>
			)}

			{imageUrl && (
				<img
					className={clsx(styles.image, { [styles.imageFull]: isFullPost })}
					src={imageUrl}
					alt={title}
					style={{
						width: '100%',
						height: 'auto',
						borderRadius: '8px',
						marginBottom: isFullPost ? 24 : 16,
					}}
				/>
			)}

			<div className={styles.wrapper}>
				<UserInfo {...user} additionalText={createdAt} />

				<div className={styles.indention}>
					{isFullPost ? (
						<Typography
							variant="h2"
							component="h2"
							sx={{
								color: 'text.primary',
								fontSize: {
									xs: '1.75rem',   // ← 320px — 28px
									sm: '2.5rem',    // ← 375px — 40px
									md: '3.5rem',    // ← 430px+ — 56px
								},
								fontWeight: 900,
								margin: 0,
								lineHeight: 1.2,
								'&:hover': { color: 'primary.main' },
							}}
						>
							{title}
						</Typography>
					) : (
						<Typography
							variant="h4"
							component={Link}
							to={`/posts/${id}`}
							sx={{
								color: 'text.primary',
								fontSize: {
									xs: '1.25rem',   // ← 320px — 20px
									sm: '1.5rem',    // ← 375px — 24px
									md: '2rem',      // ← 430px+ — 32px
								},
								lineHeight: 1.3,
								fontWeight: 700,
								margin: 0,
								textDecoration: 'none',
								display: 'block',
								wordBreak: 'break-word',
								overflowWrap: 'break-word',
								'&:hover': { color: 'primary.main' },
							}}
						>
							{title}
						</Typography>
					)}

					{/* Адаптивные теги */}
					{/* Адаптивные теги */}
					<Box
						component="ul"
						sx={{
							display: 'flex',
							flexWrap: 'wrap',
							gap: {
								xs: 0.5,    // ← 320px
								sm: 1,      // ← 768px
								md: 1.5,    // ← 1024px
								lg: 2,      // ← 1280px+
							},
							padding: 0,
							margin: {
								xs: '12px 0 8px 0',
								sm: '16px 0 12px 0',
								md: '20px 0 16px 0',
							},
							listStyle: 'none',
						}}
					>
						{tags.map((name, index) => (
							<Box
								component="li"
								key={index}
								sx={{
									margin: 0,
								}}
							>
								<Typography
									component={Link}
									to={`/tags/${encodeURIComponent(name)}`}
									sx={{
										display: 'inline-flex',
										alignItems: 'center',
										textDecoration: 'none',
										color: 'primary.main',
										fontWeight: 'bold',
										fontSize: {
											xs: '0.875rem',    // ← 14px на 320px
											sm: '0.95rem',     // ← 15px на 768px
											md: '1.05rem',     // ← 17px на 1024px
											lg: '1.15rem',     // ← 18px на 1280px+
										},
										padding: {
											xs: '6px 10px',    // ← 320px
											sm: '8px 14px',    // ← 768px
											md: '10px 18px',   // ← 1024px
											lg: '12px 22px',   // ← 1280px+
										},
										borderRadius: {
											xs: '12px',
											sm: '16px',
											md: '20px',
										},
										backgroundColor: 'action.hover',
										boxShadow: 1,
										transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
										'&:hover': {
											backgroundColor: 'action.selected',
											boxShadow: 2,
											textDecoration: 'underline',
											transform: 'translateY(-1px)',
										},
										'&:active': {
											transform: 'translateY(0)',
										},
									}}
								>
									#{name}
								</Typography>
							</Box>
						))}
					</Box>

					{children && (
						<Box className={styles.content} sx={{ color: 'text.primary', mb: 2 }}>
							{children}
						</Box>
					)}

					{/* Детали поста */}
					<Box
						component="ul"
						sx={{
							display: 'flex',
							gap: { xs: 1, sm: 2 },
							padding: 0,
							margin: 0,
							listStyle: 'none',
							color: 'text.secondary',
							fontSize: {
								xs: '0.75rem',   // ← 320px
								sm: '0.875rem',  // ← 375px
							},
						}}
					>
						<Box component="li" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
							<EyeIcon sx={{ fontSize: '1rem' }} />
							<span>{viewsCount}</span>
						</Box>
						<Box component="li" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
							<CommentIcon sx={{ fontSize: '1rem' }} />
							<span>{commentsCount}</span>
						</Box>
					</Box>
				</div>
			</div>

			<ConfirmDialog
				open={confirmOpen}
				title="Удаление статьи"
				message="Вы действительно хотите удалить эту статью?"
				confirmText="Удалить"
				cancelText="Отмена"
				onConfirm={handleConfirmRemove}
				onCancel={handleCloseConfirm}
			/>
		</Box>
	);
};
