import './form.css'
import {memo} from 'react';

export const Form=memo(({onSubmit,inputRef,placeHolder,buttonValue,inputHandel,inputValue})=>{
    return(
            <form onSubmit={(e)=>onSubmit(e)}>
                <input id='input' type='text' ref={inputRef} placeholder={placeHolder} onChange={(e)=>inputHandel(e)} value={inputValue} />
                <input type='submit' value={buttonValue}/>
            </form>
    )

})

