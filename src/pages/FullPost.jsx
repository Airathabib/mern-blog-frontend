import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { Post } from "../components/Post";
import { Index } from "../components/AddComment";
import { CommentsBlock } from "../components/CommentsBlock";
import { useSelector, useDispatch } from "react-redux";
import { fetchComments, clearComments } from "../redux/slices/comments";
import { Box, Typography, Container, ToggleButtonGroup, ToggleButton } from '@mui/material';
import { CodeBlock } from '../components/CodeBlock';
import BoltIcon from '@mui/icons-material/Bolt';
import ScheduleIcon from '@mui/icons-material/Schedule';
import axios from '../axios';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import ReactMarkdown from "react-markdown";
import rehypeRaw from 'rehype-raw';



export const FullPost = () => {
	const dispatch = useDispatch();
	const [data, setData] = useState();
	const [isLoading, setIsLoading] = useState(true)
	const [isFetchingNextPage, setIsFetchingNextPage] = useState(false); // ← флаг загрузки
	const [sort, setSort] = useState(() => localStorage.getItem('commentSort') || 'new');
	const [viewMode, setViewMode] = useState(() => localStorage.getItem('postViewMode') || 'preview');
	const { items: comments, status: commentsStatus, pagination } = useSelector(state => state.comments);
	const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'error' });

	const { id } = useParams();
	const observer = useRef();
	const loadMoreTimer = useRef(null);

	const isCommentsLoading = commentsStatus === 'loading';

	useEffect(() => {
		localStorage.setItem('commentSort', sort);
	}, [sort]);

	useEffect(() => {
		localStorage.setItem('postViewMode', viewMode); // ← сохраняем выбор режима
	}, [viewMode]);

	// Загрузка поста
	useEffect(() => {
		axios.get(`/posts/${id}`)
			.then(res => {
				setData(res.data);
				setIsLoading(false);
			})
			.catch(err => {
				console.warn(err);
				showSnackbar('Ошибка при получении статьи!', 'error');
			});
	}, [id]);

	// Загрузка первой страницы комментариев
	useEffect(() => {
		if (id) {
			dispatch(clearComments())
			dispatch(fetchComments({ postId: id, page: 1, sort }));
		}
	}, [dispatch, id, sort]);


	// Infinite scroll с debounce
	useEffect(() => {
		if (!pagination || isCommentsLoading || isFetchingNextPage) return;

		const loadMoreDebounced = () => {
			if (loadMoreTimer.current) {
				clearTimeout(loadMoreTimer.current);
			}
			loadMoreTimer.current = setTimeout(() => {
				if (pagination.page < pagination.pages) {
					setIsFetchingNextPage(true);
					dispatch(fetchComments({ postId: id, page: pagination.page + 1, sort }))
						.finally(() => {
							setIsFetchingNextPage(false);
						});
				}
			}, 300); // ← задержка 300ms
		};

		const sentinel = document.querySelector('#scroll-sentinel');
		if (!sentinel) return;

		const callback = (entries) => {
			if (entries[0].isIntersecting) {
				loadMoreDebounced();
			}
		};

		observer.current = new IntersectionObserver(callback, {
			rootMargin: '100px',
		});

		observer.current.observe(sentinel);

		return () => {
			if (observer.current) observer.current.disconnect();
			if (loadMoreTimer.current) clearTimeout(loadMoreTimer.current);
		};
	}, [dispatch, id, pagination, isCommentsLoading, isFetchingNextPage, sort]);

	const showSnackbar = (message, severity = 'error') => {
		setSnackbar({ open: true, message, severity });
	};

	const handleCloseSnackbar = () => {
		setSnackbar(prev => ({ ...prev, open: false }));
	};

	const handleSortChange = (event, newSort) => {
		if (newSort !== null) {
			setSort(newSort);
		}
	};

	if (isLoading) {
		return <Post isLoading={true} isFullPost />;
	}

	const actualCommentsCount = comments.length || 0;

	return (
		<Container maxWidth="lg">
			<Box sx={{ mt: 4 }}>
				<Post
					id={data._id}
					title={data.title}
					imageUrl={data.imageUrl ? `http://localhost:4444${data.imageUrl}` : ''}
					user={data.user}
					createdAt={data.createdAt}
					viewsCount={data.viewsCount}
					commentsCount={actualCommentsCount}
					tags={data.tags}
					isFullPost
				>
					<Box
						sx={{
							textAlign: 'left',
							color: 'text.primary',
							'& h1, & h2, & h3, & h4, & h5, & h6': {
								color: 'text.primary',
								mt: 2,
								textAlign: 'left',
							},
							'& p': {
								mb: 1,
								textAlign: 'left',
							},
							'& a': {
								color: 'primary.main',
								textDecoration: 'underline',
							},
							'& ul, & ol': {
								ml: 2,
								mb: 2,
							},
							'& li': {
								mb: 0.5,
							},
						}}
					>
						{/* Переключатель режимов */}
						<Box sx={{ mb: 3, display: 'flex', justifyContent: 'center' }}>
							<ToggleButtonGroup
								value={viewMode}
								exclusive
								onChange={(e, newValue) => newValue && setViewMode(newValue)}
								size="small"
								sx={{
									'& .MuiToggleButton-root': {
										border: '1px solid',
										borderColor: 'divider',
										borderRadius: '8px',
										padding: '8px 16px',
										fontWeight: 500,
										fontSize: '0.875rem',
										textTransform: 'none',
										color: 'text.primary',
										backgroundColor: 'background.paper',
										boxShadow: 1,
										transition: 'all 0.3s ease',
										'&:hover': {
											backgroundColor: 'action.hover',
											boxShadow: 2,
										},
										'&.Mui-selected': {
											backgroundColor: 'primary.main',
											color: 'primary.contrastText',
											borderColor: 'primary.main',
											boxShadow: 3,
											'&:hover': {
												backgroundColor: 'primary.dark',
											},
										},
									},
								}}
							>
								<ToggleButton value="markdown" aria-label="режим markdown">
									Markdown
								</ToggleButton>
								<ToggleButton value="preview" aria-label="режим превью">
									Превью
								</ToggleButton>
							</ToggleButtonGroup>
						</Box>

						{/* Контент в зависимости от режима */}
						{viewMode === 'markdown' ? (
							<Box
								sx={{
									whiteSpace: 'pre-wrap',
									fontFamily: 'monospace',
									backgroundColor: 'action.hover',
									padding: 3,
									borderRadius: 2,
									border: '1px solid',
									borderColor: 'divider',
									mb: 4,
								}}
							>
								<Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
									Исходный Markdown:
								</Typography>
								{data.text}
							</Box>
						) : (
							<ReactMarkdown
								rehypePlugins={[rehypeRaw]}
								components={{
									code({ node, inline, className, children, ...props }) {
										const match = /language-(\w+)/.exec(className || '');
										return !inline && match ? (
											<CodeBlock
												language={match[1]}
												value={String(children).replace(/\n$/, '')}
												{...props}
											/>
										) : (
											<code className={className} {...props}>
												{children}
											</code>
										);
									},
								}}
							>
								{data.text}
							</ReactMarkdown>
						)}

						{/* Сортировка комментариев */}
						<Box sx={{ mt: 4, display: 'flex', alignItems: 'baseline', gap: 2, borderBottom: 1, borderColor: 'divider' }}>
							<Typography variant="subtitle1" sx={{ fontWeight: 500, color: 'text.secondary' }}>
								Сортировка:
							</Typography>
							<ToggleButtonGroup
								value={sort}
								exclusive
								onChange={handleSortChange}
								size="small"
								sx={{
									'& .MuiToggleButton-root': {
										border: '1px solid',
										borderColor: 'divider',
										borderRadius: '8px',
										padding: '6px 16px',
										fontWeight: 500,
										fontSize: '0.875rem',
										textTransform: 'none',
										color: 'text.primary',
										backgroundColor: 'background.paper',
										boxShadow: 1,
										transition: 'all 0.3s ease',
										'&:hover': {
											backgroundColor: 'action.hover',
											boxShadow: 2,
										},
										'&.Mui-selected': {
											backgroundColor: 'primary.main',
											color: 'primary.contrastText',
											borderColor: 'primary.main',
											boxShadow: 3,
											'&:hover': {
												backgroundColor: 'primary.dark',
											},
										},
									},
								}}
							>
								<ToggleButton value="new" aria-label="новые сверху">
									<BoltIcon sx={{ mr: 1, fontSize: '1rem' }} />
									Новые
								</ToggleButton>
								<ToggleButton value="old" aria-label="старые сверху">
									<ScheduleIcon sx={{ mr: 1, fontSize: '1rem' }} />
									Старые
								</ToggleButton>
							</ToggleButtonGroup>
						</Box>
					</Box>
				</Post>
			</Box>

			<Box sx={{ mt: 4 }}>
				<CommentsBlock
					items={comments}
					isLoading={isCommentsLoading}
				>
					<Index postId={id} />
				</CommentsBlock>
			</Box>

			<div
				id="scroll-sentinel"
				style={{
					height: '1px',
					width: '100%',
					background: 'transparent',
					margin: '0 auto',
				}}
			/>

			{isFetchingNextPage && (
				<div style={{ textAlign: 'center', padding: '16px', color: '#666' }}>
					Загрузка...
				</div>
			)}

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
		</Container>
	);
};
