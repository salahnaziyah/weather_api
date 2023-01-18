import { configureStore } from "@reduxjs/toolkit"
import weatherReducer from 'weather_api/weatherSlice'

export const store=configureStore({
    reducer:{
        weather:weatherReducer,
    },
})