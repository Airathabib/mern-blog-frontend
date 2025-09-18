import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Post } from "../components/Post";
import { Index } from "../components/AddComment";
import { CommentsBlock } from "../components/CommentsBlock";
import ReactMarkdown from "react-markdown";
import { useSelector, useDispatch } from "react-redux";
import { fetchComments } from "../redux/slices/comments";
import { clearComments } from "../redux/slices/comments";
import Button from '@mui/material/Button';
import axios from '../axios';

export const FullPost = () => {
	const dispatch = useDispatch();
	const [data, setData] = useState();
	const [isLoading, setIsLoading] = useState(true)
	const { items: comments, status: commentsStatus, pagination } = useSelector(state => state.comments);
	const isCommentsLoading = commentsStatus === 'loading';

	const { id } = useParams();

	// Загрузка поста
	useEffect(() => {
		axios.get(`/posts/${id}`)
			.then(res => {
				setData(res.data);
				setIsLoading(false);
			})
			.catch(err => {
				console.warn(err);
				alert('Ошибка при получении статьи!');
			});
	}, [id]);

	// Загрузка первой страницы комментариев
	useEffect(() => {
		if (id) {
			// Сбросить комментарии и загрузить первую страницу
			dispatch(clearComments())
			dispatch(fetchComments({ postId: id, page: 1 }));
		}
	}, [dispatch, id]);

	if (isLoading) {
		return <Post isLoading={true} isFullPost />;
	}

	const loadMore = () => {
		if (pagination.page < pagination.pages) {
			dispatch(fetchComments({ postId: id, page: pagination.page + 1 }));
		}
	};

	const hasMore = pagination.page < pagination.pages;

	const actualCommentsCount = comments.length;

	return (
		<>
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
				<ReactMarkdown children={data.text} />

			</Post>
			<CommentsBlock
				items={comments}
				isLoading={isCommentsLoading}
			>
				<Index postId={id} /> {/* ← передаём postId в форму */}
			</CommentsBlock>
			{hasMore && (
				<div style={{ textAlign: 'center', marginTop: 20 }}>
					<Button
						variant="outlined"
						onClick={loadMore}
						disabled={isCommentsLoading}
					>
						{isCommentsLoading ? 'Загрузка...' : 'Загрузить ещё'}
					</Button>
				</div>
			)}
		</>
	);
};
