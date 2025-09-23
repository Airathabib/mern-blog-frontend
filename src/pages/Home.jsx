import React, { useState, useEffect, useMemo } from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Grid from '@mui/material/Grid';
import { Box, Typography } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom';
import { Link } from '@mui/material'; // ← для стилизации через sx
import { Post } from '../components/Post';
import { TagsBlock, } from '../components/TagsBlock';
import { useParams } from 'react-router-dom';
import { CommentsBlock } from '../components/CommentsBlock';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPosts, fetchTags } from '../redux/slices/posts';
import { fetchComments } from '../redux/slices/comments';

export const Home = () => {

	const dispatch = useDispatch();
	const userData = useSelector((state) => state.auth.data)
	const { posts, tags } = useSelector((state) => state.posts);
	const { items: comments, status: commentsStatus } = useSelector((state) => state.comments);

	const [showAllTags, setShowAllTags] = useState(false);
	const [activeTab, setActiveTab] = useState(0);
	const [tagSort, setTagSort] = useState(() => localStorage.getItem('tagSort') || 'new');
	const { tagName } = useParams();
	const isPostLoading = posts.status === 'loading';
	const isTagsLoading = tags.status === 'loading';
	const isCommentsLoading = commentsStatus === 'loading';

	const tagsItems = tags.items || [];

	const tagsToShow = useMemo(() => {
		return showAllTags ? tagsItems : tagsItems.slice(0, 5);
	}, [tagsItems, showAllTags]);


	useEffect(() => {
		dispatch(fetchComments({}));
	}, [dispatch]);

	useEffect(() => {
		localStorage.setItem('tagSort', tagSort);
	}, [tagSort]);

	useEffect(() => {
		const sortParam = activeTab === 0 ? 'new' : 'popular';
		dispatch(fetchPosts({ sort: sortParam, tag: tagName || null }));
	}, [dispatch, activeTab, tagName]);

	// Эффект для загрузки тегов — только при смене сортировки тегов
	useEffect(() => {
		dispatch(fetchTags(tagSort));
	}, [dispatch, tagSort]); //

	// Обработчик смены сортировки тегов
	const handleTagSortChange = (event, newSort) => {
		if (newSort !== null) {
			setTagSort(newSort);
			dispatch(fetchTags(newSort)); // ← перезагружаем теги
		}
	};

	const handleShowLess = () => {
		setShowAllTags(false);
	};

	return (
		<>
			{/* Адаптивные табы */}
			<Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
				<Tabs
					value={activeTab}
					onChange={(e, newValue) => setActiveTab(newValue)}
					aria-label="basic tabs example"
					variant="scrollable"
					scrollButtons="auto"
					sx={{
						'& .MuiTabs-indicator': {
							display: 'none',
						},
						'& .MuiTab-root': {
							marginBottom: '14px',
							border: '1px solid',
							borderColor: 'divider',
							borderRadius: '8px',
							padding: '6px 16px',
							fontWeight: 500,
							fontSize: { xs: '0.875rem', sm: '1rem' },
							textTransform: 'none',
							color: 'text.primary',
							backgroundColor: 'background.paper',
							boxShadow: 1,
							transition: 'all 0.3s ease',
							mr: 1,
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
					<Tab label="Новые" />
					<Tab label="Популярные" />
				</Tabs>
			</Box>

			{tagName && (
				<>
					<Typography
						variant="h4"
						sx={{
							mb: 1,
							color: 'text.secondary',
							fontSize: { xs: '1.5rem', sm: '2.5rem' },
						}}
					>
						#{decodeURIComponent(tagName)}
					</Typography>
					<Link
						to="/"
						component={RouterLink}
						sx={{
							display: 'inline-block',
							mb: 3,
							px: 2,
							py: 1,
							backgroundColor: 'primary.main',
							color: 'primary.contrastText',
							textDecoration: 'none',
							borderRadius: 2,
							fontWeight: 500,
							fontSize: { xs: '0.875rem', sm: '1rem' },
							boxShadow: 1,
							transition: 'background-color 0.3s ease, transform 0.2s ease',
							'&:hover': {
								backgroundColor: 'primary.dark',
								transform: 'translateY(-2px)',
							},
							'&:active': {
								transform: 'translateY(0)',
							},
						}}
					>
						Сбросить фильтр
					</Link>
				</>
			)}

			<Box sx={{ px: { xs: 2, md: 0 } }}>
				<Grid container spacing={3}>
					<Grid xs={12} md={8} item>
						{(isPostLoading ? [...Array(5)] : posts.items).map((obj, idx) => {
							return isPostLoading ? (
								<Post key={idx} isLoading={true} />
							) : (
								<Post
									key={obj._id}
									id={obj._id}
									title={obj.title}
									imageUrl={obj.imageUrl ? `${process.env.REACT_APP_API_URL}${obj.imageUrl}` : ''}
									user={obj.user}
									createdAt={obj.createdAt}
									viewsCount={obj.viewsCount}
									commentsCount={obj.commentsCount || 0}
									tags={obj.tags}
									isEditable={String(userData?._id) === String(obj.user?._id)}
								/>
							);
						})}
					</Grid>
					<Grid xs={12} md={4} item>
						<TagsBlock
							items={tagsToShow}
							isLoading={isTagsLoading}
							onShowAll={() => setShowAllTags(true)}
							onShowLess={handleShowLess}
							showAll={showAllTags}
							onSortChange={handleTagSortChange}
							currentSort={tagSort}
						/>
						<CommentsBlock
							items={comments.slice(0, 5)}
							isLoading={isCommentsLoading}
							isCompact={true}
							isReadOnly={true}
						/>
					</Grid>
				</Grid>
			</Box>

		</>
	);
};
