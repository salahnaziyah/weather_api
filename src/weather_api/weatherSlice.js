import { createSlice,createAsyncThunk } from "@reduxjs/toolkit";

const key=process.env.REACT_APP_CODE
export const getWeather=createAsyncThunk(
    'weather/getWeather',
    async(city)=>{
        const get=city.ID?`id=${city.ID}`:`q=${city.name}`;
        const respons=await fetch(`https://api.openweathermap.org/data/2.5/weather?${get}&appid=${key}&units=metric`);
        const resData=await respons.json();
        if (resData.cod!==200){
            resData['error']=true;
            return resData;
        }
        return{
            exist:true,
            metric:true,
            cityName:`${resData.name}, ${resData.sys.country}`,
            temp:resData.main.temp,
            main:resData.weather[0].main,
            icon:resData.weather[0].icon,
            wind:{speed:resData.wind.speed,deg:resData.wind.deg},
        }
    }
);

export const getSuggestedCities=createAsyncThunk(
    'weather/getSuggestedCities',
    async(cityName)=>{
        const resp= await fetch('assets/jsons/cities.json');
        const data=await resp.json();
        const cities=data.filter(({name})=>name.toLowerCase().startsWith(cityName.trim().toLowerCase())).splice(0,7);
        if(cities.length){
            return cities.map((el)=>{
                return{
                    id:String(Math.random()),
                    name:el.name,
                    country:el.country,
                    cityId:el.geonameid,
                }
            })
        }
        return null; 
    }
)
export const weatherSlice= createSlice({
    name:'weather',
    initialState:{
        data:{},
        request:{
            isLoading:false,
            error:false,
            errMessage:'',
        },
        suggestedCities:null,
    },
    reducers:{
        changeUnits:(state)=>{
            if(state.data.metric){
                const newTemp = Math.round((state.data.temp * 1.8)+ 32);
                const windSpeed= Math.round(state.data.wind.speed*0.6214);
                state.data={...state.data,metric:false,temp:newTemp,wind:{...state.data.wind,speed:windSpeed}}
                return;
            }else{
                const newTemp = Math.round((state.data.temp -32)* 5/9);
                const windSpeed = Math.round(state.data.wind.speed/0.6214);
                state.data={...state.data,metric:true,temp:newTemp,wind:{...state.data.wind,speed:windSpeed}}
                return;
            }
        },

    },
    extraReducers:{
        [getWeather.pending]:(state)=>{
            state.request.isLoading=true;
            state.suggestedCities=null;
        },
        [getWeather.fulfilled]:(state,action)=>{
            state.suggestedCities=null;
            state.request.isLoading=false;            
            if(action.payload.error){
                state.request.error=true;
                state.request.errMessage=action.payload.message;
                return;
            }
            state.data=action.payload;
            state.request.error=false;
        },
        [getWeather.rejected]:(state,action)=>{
            state.request.error=true;
            state.request.errMessage='some thing went wrong';
            state.request.isLoading=false;
            state.suggestedCities=null;
        },

        [getSuggestedCities.fulfilled]:(state,action)=>{
            state.suggestedCities=action.payload;
        }
    }
})

export const {changeUnits} =weatherSlice.actions;
export default weatherSlice.reducer;