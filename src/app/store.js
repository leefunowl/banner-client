import { configureStore } from '@reduxjs/toolkit'

import authSlice from '../features/auth/authSlice'
import BannerTableSlice from '../features/banner/BannerTableSlice'

export default configureStore({
  reducer: {
    auth: authSlice,
    BannerTable: BannerTableSlice,
  },
})
