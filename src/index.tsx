import React, { useState } from 'react'
import ReactDom from 'react-dom'

function App() {
  const [count, setCount] = useState(0)

  return <div></div>
}

ReactDom.render(
  <App />,
  document.getElementById('root')
)