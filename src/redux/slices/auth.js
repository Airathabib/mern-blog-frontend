import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from '../../axios';

export const fetchAuth = createAsyncThunk('auth/fetchAuth', async (params, { rejectWithValue }) => {
	try {
		const { data } = await axios.post('/auth/login', params);
		return data;
	} catch (error) {
		console.error('Ошибка входа в систему:', error.response?.data || error.message);
		return rejectWithValue(error.response?.data || 'Что-то пошло  не так!');
	}
});


export const fetchRegister = createAsyncThunk('auth/fetchRegister', async (params, { rejectWithValue }) => {
	try {
		const { data } = await axios.post('/auth/register', params);
		return data;
	} catch (error) {
		console.error('Ошибка регистрации!:', error.response?.data || error.message);
		return rejectWithValue(error.response?.data || 'Что-то пошло  не так!');
	}
});


export const fetchAuthMe = createAsyncThunk('auth/fetchAuthMe', async (__, { rejectWithValue }) => {
	try {
		const { data } = await axios.get('/auth/me');
		return data;
	} catch (error) {
		console.error('Ошибка входа в систему:', error.response?.data || error.message);
		return rejectWithValue(error.response?.data || 'Что-то пошло  не так!');
	}
});

const initialState = {
	data: null,
	status: 'loading',

}

const authSlice = createSlice({
	name: 'auth',
	initialState,
	reducers: {
		logout: (state) => {
			state.data = null;
		}
	},
	extraReducers: {
		[fetchAuth.pending]: (state) => {
			state.status = 'loading'
			state.data = null;
		},
		[fetchAuth.fulfilled]: (state, action) => {
			state.status = 'loaded'
			state.data = action.payload
		},
		[fetchAuth.rejected]: (state) => {
			state.status = 'error'
			state.data = null
		},
		[fetchAuthMe.pending]: (state) => {
			state.status = 'loading'
			state.data = null;
		},
		[fetchAuthMe.fulfilled]: (state, action) => {
			state.status = 'loaded'
			state.data = action.payload
		},
		[fetchAuthMe.rejected]: (state) => {
			state.status = 'error'
			state.data = null
		},
		[fetchRegister.pending]: (state) => {
			state.status = 'loading'
			state.data = null;
		},
		[fetchRegister.fulfilled]: (state, action) => {
			state.status = 'loaded'
			state.data = action.payload
		},
		[fetchRegister.rejected]: (state) => {
			state.status = 'error'
			state.data = null
		}
	}
})

export const selectIsAuth = state => Boolean(state.auth.data)

export const authReducer = authSlice.reducer;

export const { logout } = authSlice.actions;
