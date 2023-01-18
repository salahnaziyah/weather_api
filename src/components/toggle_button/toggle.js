import{memo, useState,useRef} from 'react'
import './toggle.css'


export const ToggleButton=memo((props)=>{
    const [state,setState]=useState({...props})
    const bar=useRef(null);
    const change=()=>{
        bar.current.classList.toggle("move");
        setState({...state,left:!state.left,right:!state.right})
        if(state.toggelFunc){
            state.toggelFunc();
        }
    }
    return (
        <div className='units-control'>
            <span className={`${state.left?'active-unit units':"units"}`} onClick={!state.left?change:null}>{state.options[0]}</span>
            <div className='control-bar' onClick={change}>
                <div className='control-button' ref={bar}></div>
            </div>
            <span className={`${state.right?'active-unit units':"units"}`} onClick={!state.right?change:null}>{state.options[1]}</span>
        </div>
    )
})