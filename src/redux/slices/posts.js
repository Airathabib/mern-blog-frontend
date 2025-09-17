import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from '../../axios';

export const fetchPosts = createAsyncThunk('posts/fetchPosts', async () => {
	try {
		const { data } = await axios.get('/posts');
		return data;
	} catch (err) {
		console.error('Ошибка при загрузке постов:', err);
		throw err;
	}
});

export const fetchTags = createAsyncThunk('posts/fetchTags', async () => {
	try {
		const { data } = await axios.get('/tags');
		return data;
	} catch (err) {
		console.error('Ошибка при загрузке тегов:', err);
		throw err;
	}
});

export const fetchRemovePost = createAsyncThunk('posts/fetchRemovePost', async (id) => await axios.delete(`/posts/${id}`));

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
		[fetchRemovePost.pending]: (state, action) => {
			state.posts.items = state.posts.items.filter(obj => obj._id !== action.meta.arg)
		},

		[fetchRemovePost.rejected]: (state) => {
			state.posts.status = 'error';
		},
	},
})

export const postsReducer = postsSlice.reducer;
