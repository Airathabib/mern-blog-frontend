import React, { useState, useEffect } from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Grid from '@mui/material/Grid';
import { Post } from '../components/Post';
import { TagsBlock, } from '../components/TagsBlock';
import { useParams, Link } from 'react-router-dom';
import { CommentsBlock } from '../components/CommentsBlock';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPosts, fetchTags } from '../redux/slices/posts';
import { fetchComments } from '../redux/slices/comments';

export const Home = () => {

	const dispatch = useDispatch();
	const userData = useSelector((state) => state.auth.data)
	const { posts, tags } = useSelector((state) => state.posts);
	const { items: comments, status: commentsStatus } = useSelector((state) => state.comments);

	const [activeTab, setActiveTab] = useState(0)
	const { tagName } = useParams()
	const isPostLoading = posts.status === 'loading';
	const isTagsLoading = tags.status === 'loading';
	const isCommentsLoading = commentsStatus === 'loading';


	useEffect(() => {
		dispatch(fetchTags());
		dispatch(fetchComments());
	}, [dispatch]);

	useEffect(() => {
		const sortParam = activeTab === 0 ? 'new' : 'popular';
		dispatch(fetchPosts({ sort: sortParam, tag: tagName || null }));
	}, [dispatch, activeTab, tagName]);
	return (
		<>
			<Tabs
				style={{ marginBottom: 15 }}
				value={activeTab}
				onChange={(e, newValue) => setActiveTab(newValue)}
				aria-label="basic tabs example"
			>
				<Tab label="Новые" />
				<Tab label="Популярные" />
			</Tabs>
			{tagName && (
				<>
					<h2 style={{ marginBottom: 20, color: 'rgb(106 105 113 / 43%)', fontSize: '2.5rem' }}>#{decodeURIComponent(tagName)}</h2>
					<Link
						to="/"
						style={{
							display: 'inline-block',
							marginBottom: 20,
							padding: '8px 16px',
							background: 'rgb(79 159 139)',
							color: 'white',
							textDecoration: 'none',
							borderRadius: 4,
						}}
					>
						Сбросить фильтр
					</Link>
				</>
			)}
			<Grid container spacing={4}>
				<Grid xs={8} item >
					{(isPostLoading ? [...Array(5)] : posts.items).map((obj, idx) => {
						return isPostLoading ? (
							<Post key={idx} isLoading={true} />
						) : (
							<Post
								key={obj._id}
								id={obj._id}
								title={obj.title}
								imageUrl={obj.imageUrl ? `http://localhost:4444${obj.imageUrl}` : ''}
								user={obj.user}
								createdAt={obj.createdAt}
								viewsCount={obj.viewsCount}
								commentsCount={obj.commentsCount}
								tags={obj.tags}
								isEditable={userData?._id === (obj.user?._id || null)}
							/>
						);
					})}
				</Grid>
				<Grid xs={4} item>
					<TagsBlock items={tags.items} isLoading={isTagsLoading} />

					{/* Последние 5 комментариев из всей БД */}
					<CommentsBlock
						items={comments.slice(0, 5)} // ← последние 5
						isLoading={isCommentsLoading}
					/>
				</Grid>
			</Grid>
		</>
	);
};
