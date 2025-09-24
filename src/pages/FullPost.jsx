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
	const [isLoading, setIsLoading] = useState(true);
	const [isFetchingNextPage, setIsFetchingNextPage] = useState(false);
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
		localStorage.setItem('postViewMode', viewMode);
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
			dispatch(clearComments());
			dispatch(fetchComments({ postId: id, page: 1, sort }));
		}
	}, [dispatch, id, sort]);

	// Infinite scroll
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
			}, 300);
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
		<Container maxWidth="lg" sx={{ px: { xs: 1, sm: 2 } }}> {/* ← меньше отступы на 320px */}
			<Box sx={{ mt: { xs: 2, md: 4 } }}>
				<Post
					id={data._id}
					title={data.title}
					imageUrl={data.imageUrl ? `${process.env.REACT_APP_API_URL}${data.imageUrl}` : ''}
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
								mt: { xs: 1.5, sm: 2 },
								textAlign: 'left',
								fontSize: {
									xs: '1.25rem',   // ← 320px
									sm: '1.5rem',    // ← 375px
									md: '2rem',      // ← 430px+
								},
							},
							'& p': {
								mb: { xs: 0.5, sm: 1 },
								fontSize: {
									xs: '0.875rem',  // ← 320px
									sm: '1rem',      // ← 375px
								},
								textAlign: 'left',
								lineHeight: 1.6,
							},
							'& a': {
								color: 'primary.main',
								textDecoration: 'underline',
							},
							'& ul, & ol': {
								ml: { xs: 1, sm: 2 },
								mb: { xs: 1, sm: 2 },
								fontSize: {
									xs: '0.875rem',
									sm: '1rem',
								},
							},
							'& li': {
								mb: { xs: 0.25, sm: 0.5 },
							},
						}}
					>
						{/* Переключатель режимов */}
						<Box sx={{ mb: { xs: 2, sm: 3 }, display: 'flex', justifyContent: 'center' }}>
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
										padding: {
											xs: '4px 8px',   // ← 320px
											sm: '6px 12px',  // ← 375px
											md: '8px 16px',  // ← 430px+
										},
										fontWeight: 500,
										fontSize: {
											xs: '0.75rem',   // ← 320px
											sm: '0.875rem',  // ← 375px
										},
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

						{/* Контент */}
						{viewMode === 'markdown' ? (
							<Box
								sx={{
									whiteSpace: 'pre-wrap',
									fontFamily: 'monospace',
									backgroundColor: 'action.hover',
									padding: { xs: 2, sm: 3 },
									borderRadius: { xs: 1, sm: 2 },
									border: '1px solid',
									borderColor: 'divider',
									mb: { xs: 3, sm: 4 },
									fontSize: {
										xs: '0.875rem',
										sm: '1rem',
									},
									overflowX: 'auto',
								}}
							>
								<Typography variant="body2" sx={{ color: 'text.secondary', mb: 1, fontSize: 'inherit' }}>
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
												sx={{
													fontSize: {
														xs: '0.875rem',
														sm: '1rem',
													},
													padding: {
														xs: '8px',
														sm: '12px',
													},
												}}
											/>
										) : (
											<code className={className} {...props} style={{ fontSize: '0.875rem' }}>
												{children}
											</code>
										);
									},
									p: ({ children }) => (
										<Typography
											component="p"
											sx={{
												mb: { xs: 0.5, sm: 1 },
												fontSize: {
													xs: '0.875rem',
													sm: '1rem',
												},
												lineHeight: 1.6,
											}}
										>
											{children}
										</Typography>
									),
								}}
							>
								{data.text}
							</ReactMarkdown>
						)}

						{/* Сортировка комментариев */}
						<Box sx={{ mt: { xs: 3, sm: 4 }, display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 2 }, flexWrap: 'wrap' }}>
							<Typography variant="subtitle1" sx={{ fontWeight: 500, color: 'text.secondary', fontSize: { xs: '0.875rem', sm: '1rem' } }}>
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
										padding: {
											xs: '4px 8px',
											sm: '6px 12px',
										},
										fontWeight: 500,
										fontSize: {
											xs: '0.75rem',
											sm: '0.875rem',
										},
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
									<BoltIcon sx={{ mr: { xs: 0.5, sm: 1 }, fontSize: '0.875rem' }} />
									Новые
								</ToggleButton>
								<ToggleButton value="old" aria-label="старые сверху">
									<ScheduleIcon sx={{ mr: { xs: 0.5, sm: 1 }, fontSize: '0.875rem' }} />
									Старые
								</ToggleButton>
							</ToggleButtonGroup>
						</Box>
					</Box>
				</Post>
			</Box>

			<Box sx={{ mt: { xs: 3, sm: 4 } }}>
				<CommentsBlock
					items={comments}
					isLoading={isCommentsLoading}
					isReadOnly={false}
				>
					<Index postId={id} />
				</CommentsBlock>
			</Box>

			<div id="scroll-sentinel" style={{ height: '1px', width: '100%', background: 'transparent', margin: '0 auto' }} />

			{isFetchingNextPage && (
				<Box sx={{ textAlign: 'center', py: 2, color: 'text.secondary', fontSize: '0.875rem' }}>
					Загрузка...
				</Box>
			)}

			<Snackbar
				open={snackbar.open}
				autoHideDuration={4000}
				onClose={handleCloseSnackbar}
				anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
			>
				<Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
					{snackbar.message}
				</Alert>
			</Snackbar>
		</Container>
	);
};
