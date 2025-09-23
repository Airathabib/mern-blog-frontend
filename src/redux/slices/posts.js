import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from '../../axios';

export const fetchPosts = createAsyncThunk('posts/fetchPosts', async ({ sort = 'new', tag, signal } = {}, { rejectWithValue }) => {
	try {
		const response = await axios.get('/posts', {
			params: { sort, tag },
			signal, // ← для отмены запроса
		});
		return response.data;
	} catch (err) {
		if (err.name === 'AbortError') {
			return rejectWithValue('Запрос отменён');
		}
		return rejectWithValue(err.response?.data?.message || 'Ошибка загрузки');
	}
});

export const fetchTags = createAsyncThunk('posts/fetchTags', async (sort = 'new', { rejectWithValue }) => {
	try {
		const { data } = await axios.get(`/tags?sort=${sort}`);
		return data;
	} catch (err) {
		console.error(err);
		return rejectWithValue(err.response?.data?.message || 'Ошибка загрузки');
	}
});

export const fetchRemovePost = createAsyncThunk('posts/fetchRemovePost', async (id) => {
	const response = await axios.delete(`/posts/${id}`);
	return response.data; // ← Возвращаем ТОЛЬКО данные
});

const initialState = {
	posts: {
		items: [],
		status: 'loading'
	},
	tags: {
		items: [],
		status: 'loading'
	},
}

const postsSlice = createSlice({
	name: 'posts',
	initialState,
	reducers: {},
	extraReducers: {
		// Получение статьи
		[fetchPosts.pending]: (state) => {
			state.posts.items = [];
			state.posts.status = 'loading';
		},
		[fetchPosts.fulfilled]: (state, action) => {
			state.posts.items = action.payload;
			state.posts.status = 'loaded';
		},
		[fetchPosts.rejected]: (state) => {
			state.posts.items = [];
			state.posts.status = 'error';
		},
		// Получение тегов
		[fetchTags.pending]: (state) => {
			state.tags.items = [];
			state.tags.status = 'loading';
		},
		[fetchTags.fulfilled]: (state, action) => {
			state.tags.items = action.payload;
			state.tags.status = 'loaded';
		},
		[fetchTags.rejected]: (state) => {
			state.tags.items = [];
			state.tags.status = 'error';
		},
		// Удаление статьи
		[fetchRemovePost.pending]: (state) => {
			state.posts.status = 'loading';
		},
		[fetchRemovePost.fulfilled]: (state, action) => {
			const idToRemove = action.meta.arg;
			state.posts.items = state.posts.items.filter(post => post._id !== idToRemove);
			state.posts.status = 'loaded';
		},
		[fetchRemovePost.rejected]: (state) => {
			state.posts.status = 'error';
		},
	},
})

export const postsReducer = postsSlice.reducer;
