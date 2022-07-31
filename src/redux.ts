import {configureStore, createSlice, createAsyncThunk} from '@reduxjs/toolkit'
import axios, {AxiosResponse} from 'axios'

// ============================================================================
// ================================ user slice ================================
// ============================================================================
interface UsersState {
	loading: 'idle' | 'fetching' | 'succeeded' | 'rejected'
	error: null | any
	users: any[]
	currentRequestId?: string
}

interface IUser {
	id: number
	name: string
	username: string
	email: string
	address: {
		street: string
		suite: string
		city: string
		zipcode: string
		geo: {
			lat: string
			lng: string
		}
	}
	phone: string
	website: string
	company: {
		name: string
		catchPhrase: string
		bs: string
	}
}

export const getUsers = createAsyncThunk('users/getUsers', async () => {
	return axios.get<IUser[]>('https://jsonplaceholder.typicode.com/users', {responseType: 'json'})
})

const userInitialState: UsersState = {
	users: [],
	loading: 'idle',
	error: null,
	currentRequestId: undefined
}

const usersSlice = createSlice({
	name: 'users',
	initialState: userInitialState,
	reducers: {
		clearUsers: state => {
			state.users = []
		}
	},
	extraReducers(builder) {
		builder
			.addCase(getUsers.pending, (state, action) => {
				state.loading = 'fetching'
			})
			.addCase(getUsers.fulfilled, (state, action) => {
				state.loading = 'succeeded'
				state.users = action.payload.data
			})
	}
})

const usersReducer = usersSlice.reducer
export const {clearUsers} = usersSlice.actions

// ============================================================================
// ================================== store ===================================
// ============================================================================
export const store = configureStore({
	reducer: {
		users: usersReducer
	},
	middleware: getDefaultMiddleware =>
		getDefaultMiddleware({
			serializableCheck: {
				// Ignore these action types
				ignoredActions: ['users/getUsers'],
				// Ignore these field paths in all actions
				ignoredActionPaths: ['meta.arg', 'payload'],
				// Ignore these paths in the state
				ignoredPaths: []
			}
		})
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
