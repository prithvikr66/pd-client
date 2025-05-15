import { useState } from "react"
import HeatMap from "./components/HeatMap"
import Navigator from "./components/Navigator"

export const App = () => {
  const [showHeatMap, setShowHeatMap] = useState(true)

  return (
    <div>
      <header style={{
        textAlign: 'center',
        padding: '20px',
        backgroundColor: '#f5f5f5',
        marginBottom: '20px'
      }}>
        <h1>Road Defects Detection for Urban Mobility</h1>
      </header>

      <div style={{
        display: 'flex',
        justifyContent: 'center',
        marginBottom: '20px'
      }}>
        <button 
          onClick={() => setShowHeatMap(!showHeatMap)}
          style={{
            padding: '10px 20px',
            cursor: 'pointer',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px'
          }}
        >
          Switch to {showHeatMap ? 'Navigator' : 'HeatMap'}
        </button>
      </div>

      <div style={{
        width: showHeatMap ? '70%' : '80%',
        margin: '0 auto',
        height: '600px',
        border: '1px solid #ccc',
        borderRadius: '8px',
        overflow: 'hidden'
      }}>
        {showHeatMap ? <HeatMap /> : <Navigator />}
      </div>
    </div>
  )
}