import {
  createSlice,
  createAsyncThunk,
  createEntityAdapter,
} from '@reduxjs/toolkit'

import AuthService from "../../api/auth"

const authAdapter = createEntityAdapter({
  selectId: entity => entity.id,
})

const initialState = authAdapter.getInitialState({
  currentUser : null,
  opStatus : 'idle',
})

export const login = createAsyncThunk('auth/login', async (para) => {
  const response = await AuthService.login(para)
  return response.data
})

const authSlice = createSlice({
  name: 'auth',
  initialState,
  
  extraReducers: {
    [login.pending]: (state, action) => {
      state.opStatus = 'loading'
    },
    [login.fulfilled]: (state, action) => {
         
      state.currentUser = action.payload.username      
      localStorage.setItem("user", JSON.stringify(action.payload))
      state.opStatus = 'succeeded'
      // below is needed when "user" is stored using browser's localStorage
//      window.location.href = '/home'
      window.location.reload()
      
    },
    [login.rejected]: (state, action) => {
      
      state.opStatus = 'failed'
    },
  },
})

export default authSlice.reducer

export const {
  selectAll: selectAllData,
} = authAdapter.getSelectors((state) => state.auth)
