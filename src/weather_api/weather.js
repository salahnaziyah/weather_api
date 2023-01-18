import { useState,useEffect,useRef,memo} from 'react';
import {changeUnits,getWeather,getSuggestedCities} from './weatherSlice';
import { useDispatch,useSelector } from 'react-redux';

import {Form} from 'components/form/form'
import { ToggleButton } from 'components/toggle_button/toggle';

import './weather.css'

const Weather=(props)=>{
    document.title='WeatherApi';
    const disPatch=useDispatch();
    const weatherInfo=useSelector(state =>state.weather.data);
    const suggestedCities=useSelector(state=>state.weather.suggestedCities);
    const request=useSelector(state =>state.weather.request);

    const [city,setCity]=useState({name:'Baghdad',ID:98182});
    const citiesCurser=useRef(-1);
    const citiesList=useRef(null);
    const input=useRef(null);

    const inputHandel=(e)=>{
        citiesCurser.current=-1;
        let value=e.target.value;
        setCity({name:value,ID:null});
        disPatch(getSuggestedCities(value.trim()));        
    }

    const formSubmit=(e,cityInfo)=>{
        e.preventDefault();
        if(cityInfo){
            setCity(cityInfo)
            disPatch(getWeather(cityInfo))
            return;
        }
        let value=city.name.trim();
        if(value){
            disPatch(getWeather({...city,name:value}))
        }
    }


    const keyValueChecker=(e)=>{
        const key=e.code;
        if((key==="ArrowDown" || key==="ArrowUp")&&suggestedCities){
            const citiesNodes=citiesList.current.children;
            const CLASS='city-active';
            if(key==='ArrowDown'){
                if(citiesCurser.current>=0 && citiesCurser.current<suggestedCities.length-1){
                    citiesNodes[citiesCurser.current].classList.toggle(CLASS);
                    citiesCurser.current+=1;
                    citiesNodes[citiesCurser.current].classList.toggle(CLASS);
                }
                else if(citiesCurser.current<0){
                    citiesCurser.current+=1;
                    citiesNodes[citiesCurser.current].classList.toggle(CLASS);
                }
                else if(citiesCurser.current===suggestedCities.length-1){
                    citiesNodes[citiesCurser.current].classList.toggle(CLASS);
                    citiesCurser.current=0;
                    citiesNodes[citiesCurser.current].classList.toggle(CLASS);
                }
            }

            if(key==='ArrowUp'){
                if(citiesCurser.current===0){
                    citiesNodes[citiesCurser.current].classList.toggle(CLASS);
                    citiesCurser.current=suggestedCities.length-1;
                    citiesNodes[citiesCurser.current].classList.toggle(CLASS);
                }
                else if(citiesCurser.current>0 && citiesCurser.current<=suggestedCities.length-1){
                    citiesNodes[citiesCurser.current].classList.toggle(CLASS);
                    citiesCurser.current-=1;
                    citiesNodes[citiesCurser.current].classList.toggle(CLASS);
                }
            }
            if(citiesCurser.current>-1){
                const{name,cityId}=suggestedCities[citiesCurser.current];
                setCity({name:name,ID:cityId})
            }
        }
    }

    

    useEffect(()=>{
        disPatch(getWeather(city));
        input.current.focus();
    },[]);

    return (
        <div className='weather' onKeyDown={(e)=>{keyValueChecker(e)}}>
            <Form placeHolder={'search for a city'}  onSubmit={formSubmit} buttonValue="Search" inputValue={city.name} inputHandel={inputHandel} inputRef={input}/>
            {suggestedCities&&city.name.trim()&&
                <div className='cities-wrapper'>
                    <ul ref={citiesList}>
                        {suggestedCities.map(({id,name,cityId,country})=>
                        <li key={id} onClick={(e)=>{formSubmit(e,{name:name,ID:cityId})}}>{`${name} , ${country}`}</li>
                        )}
                    </ul>
                </div>}
            {request.isLoading?<Waiting/>:request.error&&<h2 className={'error'}>{request.errMessage}</h2>}
            {!request.isLoading&&!request.error&&weatherInfo.exist&&
                <Details {...weatherInfo}/>
            }
        </div>
    )
}

const Waiting=(props)=>{
    const circilesCont=useRef(null);
    useEffect(()=>{
        const items=circilesCont.current.children;
        let counter=0;
        const show=setInterval(()=>{
            if(counter>=items.length){
                counter=0;
            }
            items[counter].classList.toggle("show");
            counter+=1;
        },1000)
        return ()=>{clearInterval(show)}
    },[])
    
    return(
        <div className='waiting'>
            <h2>Waiting...</h2>
            <div ref={circilesCont}>
                <span className='circle'></span>
                <span className='circle'></span>
                <span className='circle'></span>
                <span className='circle'></span>
                <span className='circle'></span>
            </div>
        </div>
    )
    
}

const Details=memo(({metric,cityName,main,icon,wind,temp})=>{
    const disPatch=useDispatch();
    const toggelProps={
        options:['°C','°F'],
        left:metric?true:false,
        right:!metric?true:false,
        toggelFunc:()=>disPatch(changeUnits())
    }
    return(
        <div className='details'>
            <ToggleButton {...toggelProps}/>
            <h2 className='city'>{cityName}</h2>
            <div>
                <img className='image' alt={main} src={`assets/weather_icons/${icon}.png`}/><span><b>{main}</b></span>
                <span className='temp'>{Math.round(temp)}</span>
            </div>
            <div className='wind'>
                <h2>Wind</h2>
                <span className='speed'>{Math.round(wind.speed)} </span><span><b>{metric?"Km/h":"M/h"}</b></span>
                <h1 className='arrow' style={{transform:`rotate(${wind.deg}deg)`}}>&uarr;</h1>
            </div>
        </div>
    )
})



export default Weather;