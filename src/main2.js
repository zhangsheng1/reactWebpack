import React from 'react'
import ReactDOM from 'react-dom'
import {Button} from 'antd'
import Counter from './pages/counter.js'
// const Counter=()=>{
//     return(
//         <Button type="primary">按钮</Button>
//     )
// }


ReactDOM.render(<Counter /> , document.getElementById("study"))
//document.getElementById("study").innerHTML="hello webpack"