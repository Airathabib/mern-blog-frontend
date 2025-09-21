
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../axios';


// В начало файла, после импортов
export const removeComment = createAsyncThunk(
	'comments/removeComment',
	async (commentId, { rejectWithValue }) => {
		try {
			await axios.delete(`/comments/${commentId}`);
			return commentId; // возвращаем ID удалённого комментария
		} catch (err) {
			return rejectWithValue(err.response?.data?.message || 'Ошибка удаления');
		}
	}
);

// Асинхронный экшен: получить комментарии поста
export const fetchComments = createAsyncThunk(
	'comments/fetchComments',
	async ({ postId, page = 1, sort = 'new' } = {}, { rejectWithValue }) => { // ← добавили sort
		try {
			const url = postId
				? `/comments?post=${postId}&page=${page}&limit=10&sort=${sort}`
				: '/comments?page=1&limit=5&sort=new';

			const { data } = await axios.get(url);
			return {
				...data,
				postId,
				page,
				sort, // ← сохраняем для редьюсера
			};
		} catch (err) {
			return rejectWithValue(err.response?.data?.message || 'Ошибка загрузки');
		}
	}
);


// Асинхронный экшен: добавить комментарий
export const addComment = createAsyncThunk(
	'comments/addComment',
	async ({ postId, text, parentComment = null }, { rejectWithValue }) => { // ← добавили parentComment
		try {
			const response = await axios.post('/comments', {
				text,
				post: postId,
				parentComment, // ← передаём
			});
			return response.data;
		} catch (err) {
			return rejectWithValue(err.response?.data?.message || 'Ошибка отправки');
		}
	}
);


// Экшен для обновления комментария
export const updateComment = createAsyncThunk(
	'comments/updateComment',
	async ({ commentId, text }, { rejectWithValue }) => {
		try {
			const { data } = await axios.put(`/comments/${commentId}`, { text });
			return data; // возвращаем обновлённый комментарий
		} catch (err) {
			return rejectWithValue(err.response?.data?.message || 'Ошибка обновления');
		}
	}
);

// лайк
export const likeComment = createAsyncThunk(
	'comments/likeComment',
	async (commentId, { rejectWithValue, getState }) => {
		try {
			const { data } = await axios.post(`/comments/${commentId}/like`);
			return { commentId, ...data };
		} catch (err) {
			return rejectWithValue(err.response?.data?.message || 'Ошибка лайка');
		}
	}
);

// дизлайк
export const dislikeComment = createAsyncThunk(
	'comments/dislikeComment',
	async (commentId, { rejectWithValue, getState }) => {
		try {
			const { data } = await axios.post(`/comments/${commentId}/dislike`);
			return { commentId, ...data };
		} catch (err) {
			return rejectWithValue(err.response?.data?.message || 'Ошибка дизлайка');
		}
	}
);

const initialState = {
	items: [],
	status: 'idle',
	error: null,
	pagination: {
		page: 1,
		total: 0,
		pages: 0,
		postId: null,
		sort: 'new',
	},
};

const commentsSlice = createSlice({
	name: 'comments',
	initialState,
	reducers: {
		clearComments: (state) => {
			state.items = [];
			state.pagination = {
				page: 1,
				total: 0,
				pages: 0,
				postId: null
			};
		},
	},
	extraReducers: (builder) => {
		builder
			// Удаляем комментарий из списка по ID
			.addCase(removeComment.fulfilled, (state, action) => {
				state.items = state.items.filter(comment => comment._id !== action.payload);
				state.status = 'succeeded';
			})
			.addCase(removeComment.rejected, (state, action) => {
				state.status = 'failed';
				state.error = action.payload;
			})
			// fetchComments
			.addCase(fetchComments.pending, (state) => {
				state.status = 'loading';
				state.error = null;
			})
			.addCase(fetchComments.fulfilled, (state, action) => {
				state.status = 'succeeded';
				const { items, page, postId, sort } = action.payload;

				if (page === 1) {
					state.items = items;
				} else {
					state.items = [...state.items, ...items];
				}

				state.pagination = {
					...state.pagination,
					page,
					total: action.payload.total,
					pages: action.payload.pages,
					postId,
					sort, // ← сохраняем текущую сортировку
				};
			})
			.addCase(fetchComments.rejected, (state, action) => {
				state.status = 'failed';
				state.error = action.payload;
			})
			// addComment
			.addCase(addComment.pending, (state) => {
				state.status = 'loading';
				state.error = null;
			})
			.addCase(addComment.fulfilled, (state, action) => {
				// Добавляем новый комментарий в начало списка
				state.items = [action.payload, ...state.items];
				state.status = 'succeeded';
			})
			.addCase(addComment.rejected, (state, action) => {
				state.status = 'failed';
				state.error = action.payload;
			})
			.addCase(updateComment.fulfilled, (state, action) => {
				// Находим и заменяем комментарий в списке
				const index = state.items.findIndex(comment => comment._id === action.payload._id);
				if (index !== -1) {
					state.items[index] = action.payload;
				}
				state.status = 'succeeded';
			})
			.addCase(updateComment.rejected, (state, action) => {
				state.status = 'failed';
				state.error = action.payload;
			})
			.addCase(likeComment.fulfilled, (state, action) => {
				const { commentId, likes, dislikes, userAction } = action.payload;
				const comment = state.items.find(c => c._id === commentId);
				if (comment) {
					comment.likesCount = likes;      // ← число
					comment.dislikesCount = dislikes; // ← число
					comment.userAction = userAction;
				}
			})
			.addCase(dislikeComment.fulfilled, (state, action) => {
				const { commentId, likes, dislikes, userAction } = action.payload;
				const comment = state.items.find(c => c._id === commentId);
				if (comment) {
					comment.likesCount = likes;
					comment.dislikesCount = dislikes;
					comment.userAction = userAction;
				}
			})
	},
});

export const { clearComments } = commentsSlice.actions;


export const commentsReducer = commentsSlice.reducer;
