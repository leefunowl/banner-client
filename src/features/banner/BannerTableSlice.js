import {
  createSlice,
  createAsyncThunk,
  createEntityAdapter,
} from '@reduxjs/toolkit'

import DataService from "../../api/banner"
import { LogOut } from '../../util'
import { api2client } from './util'

const BannerTableAdapter = createEntityAdapter({
  selectId: entity => entity.id,
})

const initialState = BannerTableAdapter.getInitialState({
  found : null,
  opStatus : 'idle',
  error : null,
  maxIdx : null,
  Mastkey : null,
  table : 'Master',
  // multiple people
  multiP : null,
  // secondary table data dictionary
  secTs : [],
  secTD : {},
  // tnr = total # of records
  tnr : null,
  // table operation mode (client or server)
  mode : null,
})
// primary tables
export const search = createAsyncThunk('BannerTable/search', async (para) => {
  const response = await DataService.search(para)
  return response.data
})

export const fetch = createAsyncThunk('BannerTable/fetch', async (args) => {
  const response = await DataService.fetch(args)
  return response.data
})

export const insertRows = createAsyncThunk('BannerTable/insertRows', async (args) => {
  const response = await DataService.insertRows(args)
  return response.data
})

export const updateRows = createAsyncThunk('BannerTable/updateRows', async (args) => {
  const response = await DataService.updateRows(args)
  return response.data
})

export const removeRows = createAsyncThunk('BannerTable/removeRows', async (args) => {
  const response = await DataService.removeRows(args)
  return response.data
})
// secondary tables
export const fetchSecTs = createAsyncThunk('BannerTable/fetchSecTs', async (args) => {
  const res = await DataService.fetchSecTs(args)
  return res.data
})

const BannerTableSlice = createSlice({
  name: 'BannerTable',
  initialState,
  reducers: {
    updateStatus(state, action) {
      const { _opStatus } = action.payload
      state.opStatus = _opStatus
    },
    updateMastkey(state, action) {
      const { _Mastkey } = action.payload
      state.Mastkey = _Mastkey
    },
    updateTable(state, action) {
      const { _table } = action.payload
      state.table = _table
    },
    updateFound(state, action) {
      const { _found } = action.payload
      state.found = _found
    },
    insertStoreData(state, action) {
      const { _insert } = action.payload
      BannerTableAdapter.addMany(state, _insert)
    },
    setStoreData(state, action) {
      const { _data } = action.payload
      BannerTableAdapter.setAll(state, _data)
    },
    updateMaxIdx(state, action) {
      state.maxIdx = state.maxIdx + 1
    },
  },
  
  extraReducers: {
    [search.pending]: (state, action) => {
      state.opStatus = 'loading'
    },
    [search.fulfilled]: (state, action) => {
      let _data = action.payload.data      
      
      if (_data.length === 0) {
        state.found = false
      } else if (_data.length === 1) {
        state.Mastkey = Object.values(_data[0])[0]
        state.found = true
        state.opStatus = 'succeeded'
      } else {
        state.Mastkey = null
        state.multiP = [..._data]
      }
    },
    [search.rejected]: (state, action) => {
      state.error = action.error.message
      state.opStatus = 'failed'
      LogOut()
    },
    [fetch.pending]: (state, action) => {
      state.opStatus = 'loading'
    },
    [fetch.fulfilled]: (state, action) => {
      state.opStatus = 'succeeded'
      let _data = action.payload.data
      _data = api2client(_data, state.table)        
      BannerTableAdapter.setAll(state, _data)
      state.tnr = action.payload.tnr
      state.mode = action.payload.mode
      state.maxIdx = action.payload.maxIdx
      state.secTs = [... new Set([...state.secTs, ...action.payload.secTs])]
    },
    [fetch.rejected]: (state, action) => {
      state.opStatus = 'failed'
      state.error = action.error.message
      LogOut()
    },
    [insertRows.pending]: (state, action) => {
      state.opStatus = 'loading'
    },
    [insertRows.fulfilled]: (state, action) => {
      state.opStatus = 'succeeded'
    },
    [insertRows.rejected]: (state, action) => {
      state.opStatus = 'failed'
      state.error = action.error.message
      LogOut()
    },
    [updateRows.pending]: (state, action) => {
      state.opStatus = 'loading'
    },
    [updateRows.fulfilled]: (state, action) => {
      state.opStatus = 'succeeded'
    },
    [updateRows.rejected]: (state, action) => {
      state.opStatus = 'failed'
      state.error = action.error.message
      LogOut()
    },
    [removeRows.pending]: (state, action) => {
      state.opStatus = 'loading'
    },
    [removeRows.fulfilled]: (state, action) => {
      state.opStatus = 'succeeded'
    },
    [removeRows.rejected]: (state, action) => {
      state.opStatus = 'failed'
      state.error = action.error.message
      LogOut()
    },
    // secondary tables
    [fetchSecTs.pending]: (state, action) => {
    },
    [fetchSecTs.fulfilled]: (state, action) => {
      state.secTD[action.meta.arg.fk] = action.payload.dict
    },
    [fetchSecTs.rejected]: (state, action) => {
      state.error = action.error.message
      LogOut()
    },
  },
})

export const {
  updateStatus,
  updateMastkey,
  updateTable,
  updateFound,
  insertStoreData,
  setStoreData,
  updateMaxIdx,
} = BannerTableSlice.actions

export default BannerTableSlice.reducer

export const {
  selectAll: selectAllData,
} = BannerTableAdapter.getSelectors((state) => state.BannerTable)
