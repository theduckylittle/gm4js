import { useState } from 'react'
import reactLogo from './assets/react.svg'
import './App.css'

import { GeoMooseMap } from "./Map";

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <GeoMooseMap />
      </div>

    </>
  )
}

export default App
