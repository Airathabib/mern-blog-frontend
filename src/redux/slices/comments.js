
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
	async ({ postId, page = 1 }, { rejectWithValue }) => {
		try {
			const url = postId
				? `/comments?post=${postId}&page=${page}&limit=10`
				: '/comments?page=1&limit=5'; // для главной — последние 5

			const { data } = await axios.get(url);
			return {
				...data,
				postId, // чтобы знать, к какому посту относятся
				page,
			};
		} catch (err) {
			return rejectWithValue(err.response?.data?.message || 'Ошибка загрузки');
		}
	}
);


// Асинхронный экшен: добавить комментарий
export const addComment = createAsyncThunk(
	'comments/addComment',
	async ({ postId, text }, { rejectWithValue }) => {
		try {
			const response = await axios.post('/comments', {
				text,
				post: postId,
			});
			return response.data;
		} catch (err) {
			return rejectWithValue(err.response?.data?.message || 'Ошибка отправки');
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
	},
};

const commentsSlice = createSlice({
	name: 'comments',
	initialState,
	reducers: {
		clearComments: (state) => {
			state.items = [];
			state.pagination = { page: 1, total: 0, pages: 0, postId: null };
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
				const { items, page, postId } = action.payload;

				if (page === 1) {
					// Первая страница — заменяем список
					state.items = items;
				} else {
					// Последующие — добавляем в конец
					state.items = [...state.items, ...items];
				}

				state.pagination = {
					page,
					total: action.payload.total,
					pages: action.payload.pages,
					postId, // чтобы не смешивать комментарии разных постов
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
			});
	},
});

export const { clearComments } = commentsSlice.actions;


export const commentsReducer = commentsSlice.reducer;
