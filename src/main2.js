import React from 'react'
import ReactDOM from 'react-dom'
import {Provider} from 'react-redux'
import thunk from 'redux-thunk'
import {createStore,applyMiddleware} from 'redux'
import reducer from './reducer'
//import {Button} from 'antd'
import Counter from './pages/counter.js'
//  const Counter=(a)=>{
//     let b={...a,p:3}
//      return(
//          <Button type="primary">{b.p}</Button>
//      )
//  }
 const middleware=[thunk]
 console.log('thunk>>>>',thunk)
 console.log('middleware>>>>',middleware)
 const store=createStore(reducer,applyMiddleware(...middleware))
 console.log(store.getState());


ReactDOM.render(
    <Provider store={store}>
        <Counter />
    </Provider> , 
    document.getElementById("study")
)
//document.getElementById("study").innerHTML="hello webpack"