import React, { useState } from 'react';
import clsx from 'clsx';
import { Typography } from '@mui/material'
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
import { Box } from '@mui/material';
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
				maxWidth: isFullPost ? '1440x' : '100%', // ← ограничиваем ширину на FullPost
				width: '100%',
				mx: 'auto', // ← центрируем
				backgroundColor: 'background.paper',
				border: '1px solid',
				borderColor: 'divider',
				borderRadius: 2,
				padding: { xs: 2, md: isFullPost ? 4 : 3 },
				boxShadow: 1,
				mb: 4,
				position: 'relative',
				overflow: 'visible',
			}}
		>
			{isEditable && (
				<div className={styles.editButtons}>
					<Link to={`/posts/${id}/edit`}>
						<IconButton color="primary" sx={{ color: 'primary.main' }}>
							<EditIcon />
						</IconButton>
					</Link>
					<IconButton onClick={handleOpenConfirm} color="error"
						sx={{ color: 'error.main' }}>
						<DeleteIcon />
					</IconButton>
				</div>
			)}
			{imageUrl && (
				<img
					className={clsx(styles.image, { [styles.imageFull]: isFullPost })}
					src={imageUrl}
					alt={title}
				/>
			)}
			<div className={styles.wrapper}>
				<UserInfo {...user} additionalText={createdAt} />
				<div className={styles.indention}>
					{isFullPost ? (
						<Typography
							variant={isFullPost ? "h2" : "h4"}
							component="h2"
							sx={{
								color: 'text.primary',
								fontSize: isFullPost ? '42px' : '28px',
								fontWeight: isFullPost ? 900 : 'normal',
								margin: 0,
								'&:hover': {
									color: 'primary.main', // ← цвет из темы при наведении
								},
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
								fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' },
								lineHeight: 1.3,
								fontWeight: 700,
								margin: 0,
								textDecoration: 'none',
								display: 'block',
								wordBreak: 'break-word',
								overflowWrap: 'break-word',
								'&:hover': {
									color: 'primary.main',
								},
							}}
						>
							{title}
						</Typography>
					)}
					<ul className={styles.tags}>
						{tags.map((name) => (
							<li key={name}>
								<Typography
									component={Link}
									to={`/tags/${encodeURIComponent(name)}`}
									sx={{
										textDecoration: 'none',
										color: 'primary.main',
										fontWeight: 'bold',
										'&:hover': { textDecoration: 'underline' },
									}}
								>
									#{name}
								</Typography>
							</li>
						))}
					</ul>
					{children && (
						<Box className={styles.content} sx={{ color: 'text.primary' }}> 
							{children}
						</Box>
					)}
					<ul className={styles.postDetails}>
						<li>
							<EyeIcon />
							<span>{viewsCount}</span>
						</li>
						<li>
							<CommentIcon />
							<span>{commentsCount}</span>
						</li>
					</ul>
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
