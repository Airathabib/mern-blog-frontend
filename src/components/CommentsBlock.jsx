import React, { useRef, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { removeComment, updateComment, addComment, likeComment, dislikeComment } from "../redux/slices/comments";
import { selectUserData } from "../redux/slices/auth";
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { SideBlock } from "./SideBlock";
import ListItem from "@mui/material/ListItem";
import ReplyIcon from '@mui/icons-material/Reply';
import { Typography, Box, Paper } from "@mui/material";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import Skeleton from "@mui/material/Skeleton";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { ConfirmDialog } from "./confirmDialog";


export const CommentsBlock = ({ items, children, isLoading = true, isCompact = false }) => {
	const dispatch = useDispatch();
	const userData = useSelector(selectUserData);
	const [editingId, setEditingId] = useState(null);
	const [editText, setEditText] = useState('');
	const [replyingTo, setReplyingTo] = useState(null);
	const [replyText, setReplyText] = useState('');
	const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
	const [confirmOpen, setConfirmOpen] = useState(false);
	const [commentToDelete, setCommentToDelete] = useState(null);
	const [highlightedCommentId, setHighlightedCommentId] = useState(null);

	const textFieldRef = useRef();

	useEffect(() => {
		if (editingId && textFieldRef.current) {
			textFieldRef.current.focus();
		}
	}, [editingId]);

	useEffect(() => {
		const handleKeyDown = (e) => {
			if (editingId) {
				if (e.key === 'Escape') {
					handleCancelEdit();
				}
				if (e.key === 'Enter' && !e.shiftKey) {
					e.preventDefault();
					handleSaveEdit(editingId);
				}
			}
		};

		window.addEventListener('keydown', handleKeyDown);
		return () => window.removeEventListener('keydown', handleKeyDown);
	}, [editingId, editText]);

	const handleDeleteClick = (commentId) => {
		setCommentToDelete(commentId);
		setConfirmOpen(true);
	};

	const handleConfirmDelete = () => {
		dispatch(removeComment(commentToDelete))
			.unwrap()
			.then(() => {
				showSnackbar('Комментарий удалён', 'success');
			})
			.catch(() => {
				showSnackbar('Ошибка удаления', 'error');
			});
		setConfirmOpen(false);
		setCommentToDelete(null);
	};

	const handleCancelDelete = () => {
		setConfirmOpen(false);
		setCommentToDelete(null);
	};

	const handleEdit = (comment) => {
		setEditingId(comment._id);
		setEditText(comment.text);
	};

	const handleSaveEdit = (commentId) => {
		if (!editText.trim()) return;
		dispatch(updateComment({ commentId, text: editText }))
			.unwrap()
			.then(() => {
				showSnackbar('Комментарий обновлён', 'success');
				setEditingId(null);
			})
			.catch(() => {
				showSnackbar('Ошибка обновления', 'error');
			});
	};

	const handleCancelEdit = () => {
		setEditingId(null);
		setEditText('');
	};

	const showSnackbar = (message, severity = 'success') => {
		setSnackbar({ open: true, message, severity });
	};

	const handleCloseSnackbar = () => {
		setSnackbar({ ...snackbar, open: false });
	};

	const handleReply = (commentId) => {
		setReplyingTo(commentId);
		setReplyText('');
		setHighlightedCommentId(commentId);
	};

	const handleCancelReply = () => {
		setReplyingTo(null);
		setReplyText('');

		setTimeout(() => {
			setHighlightedCommentId(null)
		}, 3000)
	};



	const handleSaveReply = async (postId, parentCommentId) => {
		if (!replyText.trim()) return;

		try {
			await dispatch(addComment({ postId, text: replyText, parentComment: parentCommentId })).unwrap();
			showSnackbar('Ответ добавлен!', 'success');
			setReplyingTo(null);
			setReplyText('');
		} catch (err) {
			showSnackbar('Ошибка добавления ответа', 'error');
		}
	};

	const buildCommentTree = (comments) => {
		const commentMap = {};
		const rootComments = [];

		const commentsCopy = structuredClone(comments);

		commentsCopy.forEach(comment => {
			comment.replies = [];
			commentMap[comment._id] = comment;
		});

		commentsCopy.forEach(comment => {
			if (comment.parentComment && commentMap[comment.parentComment]) {
				commentMap[comment.parentComment].replies.push(comment);
			} else {
				rootComments.push(comment);
			}
		});

		return rootComments;
	};

	const MAX_DEPTH = 3;

	const renderComment = (comment, depth = 0) => {
		const actualDepth = Math.min(depth, MAX_DEPTH); // ← сначала вычисляем actualDepth
		const paddingLeft = actualDepth * 4;

		return (
			<React.Fragment key={comment._id}>
				<Paper
					elevation={0}
					sx={{
						pl: 2 + paddingLeft,
						pr: 2,
						pt: 2,
						pb: 2,
						mb: 2,
						borderRadius: 2,
						border: '1px solid',
						borderColor: 'divider',
						backgroundColor: highlightedCommentId === comment._id
							? '#0a1fe633' 
							: 'background.paper',
						transition: 'background-color 0.5s ease', // ← плавный переход
					}}
				>
					<Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 2 }}>
						{actualDepth > 0 && (
							<ReplyIcon
								sx={{
									color: 'text.secondary',
									fontSize: isCompact ? '1rem' : '1.25rem',
									transform: 'rotate(180deg)',
									mt: isCompact ? 0.5 : 1,
									flexShrink: 0,
								}}
							/>
						)}
						<Avatar
							alt={comment.user.fullName}
							src={comment.user.avatarUrl}
							sx={{ width: isCompact ? 32 : 40, height: isCompact ? 32 : 40 }}
						/>
						<Box sx={{ flex: 1 }}>
							{depth > MAX_DEPTH && (
								<Typography
									variant="caption"
									sx={{
										color: 'text.secondary',
										mb: 0.5,
										display: 'block',
									}}
								>
									В ответ на комментарий...
								</Typography>
							)}
							<Typography
								component="div"
								variant={isCompact ? "subtitle2" : "subtitle1"}
								sx={{ fontWeight: 500, mb: 0.5 }}
							>
								{comment.user.fullName}
							</Typography>
							{isLoading ? (
								<Skeleton variant="text" width="100%" height={40} />
							) : editingId === comment._id ? (
								<TextField
									inputRef={textFieldRef}
									value={editText}
									onChange={(e) => setEditText(e.target.value)}
									multiline
									rows={isCompact ? 2 : 3}
									variant="outlined"
									fullWidth
									sx={{ mb: 2 }}
								/>
							) : (
								<Typography
									variant="body1"
									sx={{
										fontSize: isCompact ? '0.875rem' : '1rem',
										lineHeight: 1.6,
										whiteSpace: 'pre-wrap',
										wordBreak: 'break-word',
									}}
								>
									{comment.text}
								</Typography>
							)}
						</Box>
					</Box>

					{/* Все кнопки внизу */}
					<Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap', mt: 2 }}>
						{/* Кнопки лайков */}
						<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
							<IconButton
								size="small"
								onClick={() => dispatch(likeComment(comment._id))}
								sx={{
									color: comment.userAction === 'liked' ? 'primary.main' : 'text.secondary',
									'&:hover': {
										backgroundColor: 'action.hover',
									},
								}}
							>
								<ThumbUpIcon fontSize="small" />
							</IconButton>
							<Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500 }}>
								{comment.likesCount || 0}
							</Typography>

							<IconButton
								size="small"
								onClick={() => dispatch(dislikeComment(comment._id))}
								sx={{
									color: comment.userAction === 'disliked' ? 'error.main' : 'text.secondary',
									'&:hover': {
										backgroundColor: 'action.hover',
									},
								}}
							>
								<ThumbDownIcon fontSize="small" />
							</IconButton>
							<Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500 }}>
								{comment.dislikesCount || 0}
							</Typography>
						</Box>

						{/* Разделитель */}
						<Divider orientation="vertical" flexItem sx={{ mx: 1 }} />

						{/* Основные кнопки */}
						<Button
							size="small"
							onClick={() => handleReply(comment._id)}
							sx={{
								textTransform: 'none',
								fontSize: isCompact ? '0.75rem' : '0.875rem',
								color: 'text.secondary',
								'&:hover': {
									backgroundColor: 'action.hover',
								},
							}}
						>
							Ответить
						</Button>

						{userData?._id === String(comment.user._id) && (
							<>
								<IconButton
									size="small"
									aria-label="edit"
									onClick={() => handleEdit(comment)}
									sx={{
										color: 'primary.main',
										'&:hover': {
											backgroundColor: 'action.hover',
										},
									}}
								>
									<EditIcon fontSize="small" />
								</IconButton>
								<IconButton
									size="small"
									aria-label="delete"
									onClick={() => handleDeleteClick(comment._id)}
									sx={{
										color: 'error.main',
										'&:hover': {
											backgroundColor: 'action.hover',
										},
									}}
								>
									<DeleteIcon fontSize="small" />
								</IconButton>
							</>
						)}
					</Box>

					{/* Форма ответа */}
					{replyingTo === comment._id && (
						<Box sx={{ mt: 2, pl: 4 }}>
							<TextField
								value={replyText}
								onChange={(e) => setReplyText(e.target.value)}
								multiline
								rows={isCompact ? 2 : 3}
								variant="outlined"
								fullWidth
								placeholder="Напишите ответ..."
								sx={{ mb: 2 }}
							/>
							<Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
								<Button
									size="small"
									variant="outlined"
									onClick={handleCancelReply}
									sx={{ textTransform: 'none' }}
								>
									Отмена
								</Button>
								<Button
									size="small"
									variant="contained"
									onClick={() => handleSaveReply(comment.post, comment._id)}
									disabled={!replyText.trim()}
									sx={{ textTransform: 'none' }}
								>
									Отправить
								</Button>
							</Box>
						</Box>
					)}
				</Paper>

				{/* Рекурсивный рендер ответов */}
				{comment.replies && comment.replies.map(reply => renderComment(reply, depth + 1))}
			</React.Fragment >
		);
	};

	const commentTree = buildCommentTree(items);

	return (
		<SideBlock title="Комментарии">
			{isLoading
				? [...Array(5)].map((_, idx) => (
					<Paper
						key={idx}
						elevation={0}
						sx={{
							p: 2,
							mb: 2,
							borderRadius: 2,
							border: '1px solid',
							borderColor: 'divider',
						}}
					>
						<Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 2 }}>
							<Skeleton variant="circular" width={40} height={40} />
							<Box sx={{ flex: 1 }}>
								<Skeleton variant="text" width="60%" height={20} />
								<Skeleton variant="text" width="100%" height={40} />
							</Box>
						</Box>
						<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
							<Skeleton variant="text" width={40} height={20} />
							<Skeleton variant="text" width={40} height={20} />
						</Box>
					</Paper>
				))
				: commentTree.map(comment => renderComment(comment))
			}

			{children}

			<Snackbar
				open={snackbar.open}
				autoHideDuration={3000}
				onClose={handleCloseSnackbar}
				anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
			>
				<Alert
					onClose={handleCloseSnackbar}
					severity={snackbar.severity}
					sx={{ width: '100%' }}
				>
					{snackbar.message}
				</Alert>
			</Snackbar>

			<ConfirmDialog
				open={confirmOpen}
				title="Удаление комментария"
				message="Вы действительно хотите удалить этот комментарий?"
				confirmText="Удалить"
				cancelText="Отмена"
				onConfirm={handleConfirmDelete}
				onCancel={handleCancelDelete}
			/>
		</SideBlock>
	);
};
