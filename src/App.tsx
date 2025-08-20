import { useState } from "react"
import HeatMap from "./components/HeatMap"
import Navigator from "./components/Navigator"

export const App = () => {
  const [showHeatMap, setShowHeatMap] = useState(true)

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f8f9fa',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    }}>
      <header style={{
        textAlign: 'center',
        padding: '2rem',
        background: 'linear-gradient(135deg, #1a73e8 0%, #0d47a1 100%)',
        color: 'white',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        marginBottom: '2rem'
      }}>
        <h1 style={{
          margin: 0,
          fontSize: '2.5rem',
          fontWeight: '600',
          letterSpacing: '-0.5px'
        }}>Road Defects Visualization</h1>
        <p style={{
          margin: '0.5rem 0 0',
          fontSize: '1.1rem',
          opacity: 0.9
        }}>Enhancing Urban Mobility Through Smart Visualization</p>
      </header>

      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 2rem'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          marginBottom: '2rem',
          gap: '1rem'
        }}>
          <button 
            onClick={() => setShowHeatMap(!showHeatMap)}
            style={{
              padding: '12px 24px',
              cursor: 'pointer',
              backgroundColor: showHeatMap ? '#1a73e8' : '#34a853',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: '500',
              transition: 'all 0.3s ease',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <span style={{ fontSize: '1.2rem' }}>🔄</span>
            Switch to {showHeatMap ? 'Navigator' : 'HeatMap'}
          </button>
        </div>

        <div style={{
          width: '100%',
          marginBottom: '2rem'
        }}>
          <div style={{
            width: '100%',
            height: '600px',
            border: 'none',
            borderRadius: '12px',
            overflow: 'hidden',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            transition: 'all 0.3s ease',
            backgroundColor: 'white',
            marginBottom: '2rem'
          }}>
            {showHeatMap ? <HeatMap /> : <Navigator />}
          </div>

          <div style={{
            backgroundColor: 'white',
            padding: '1.5rem',
            borderRadius: '12px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            marginBottom: '2rem'
          }}>
            <h2 style={{
              fontSize: '1.5rem',
              marginBottom: '1rem',
              color: '#1a73e8'
            }}>
              {showHeatMap ? 'Heat Map Insights' : 'Navigation Guide'}
            </h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '1rem'
            }}>
              {showHeatMap ? (
                <>
                  <div style={{
                    backgroundColor: '#e8f0fe',
                    padding: '1.5rem',
                    borderRadius: '8px'
                  }}>
                    <h3 style={{ margin: '0 0 0.5rem 0', color: '#1a73e8' }}>🔍 What You're Seeing</h3>
                    <p style={{ margin: 0, fontSize: '0.95rem', color: '#5f6368', lineHeight: '1.6' }}>
                      The heat map displays road defect concentrations across the city. Red areas indicate higher defect density.
                      The intensity of the color represents the severity and frequency of road defects in that area.
                    </p>
                  </div>
                  <div style={{
                    backgroundColor: '#fce8e6',
                    padding: '1.5rem',
                    borderRadius: '8px'
                  }}>
                    <h3 style={{ margin: '0 0 0.5rem 0', color: '#d93025' }}>⚠️ Key Areas</h3>
                    <p style={{ margin: 0, fontSize: '0.95rem', color: '#5f6368', lineHeight: '1.6' }}>
                      Focus on areas with intense red coloring - these represent critical zones requiring immediate attention.
                      These areas typically indicate high traffic zones or locations with severe road damage.
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <div style={{
                    backgroundColor: '#e8f0fe',
                    padding: '1.5rem',
                    borderRadius: '8px'
                  }}>
                    <h3 style={{ margin: '0 0 0.5rem 0', color: '#1a73e8' }}>🗺️ Navigation Tips</h3>
                    <p style={{ margin: 0, fontSize: '0.95rem', color: '#5f6368', lineHeight: '1.6' }}>
                      Use the navigator to explore specific locations and get detailed information about road conditions.
                      Zoom in/out to focus on particular areas and click on markers to view detailed defect information.
                    </p>
                  </div>
                  <div style={{
                    backgroundColor: '#e6f4ea',
                    padding: '1.5rem',
                    borderRadius: '8px'
                  }}>
                    <h3 style={{ margin: '0 0 0.5rem 0', color: '#137333' }}>📍 Features</h3>
                    <p style={{ margin: 0, fontSize: '0.95rem', color: '#5f6368', lineHeight: '1.6' }}>
                      Click on markers to view detailed information about specific road defects and their status.
                      The navigator provides real-time updates and allows you to track maintenance progress.
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        <div style={{
          backgroundColor: 'white',
          padding: '1.5rem',
          borderRadius: '12px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          marginBottom: '2rem'
        }}>
          <h2 style={{
            fontSize: '1.5rem',
            marginBottom: '1rem',
            color: '#1a73e8'
          }}>About This Tool</h2>
          <p style={{
            fontSize: '0.95rem',
            color: '#5f6368',
            lineHeight: '1.6'
          }}>
            This visualization tool helps urban planners and maintenance teams identify and track road defects across the city. 
            The heat map provides a high-level overview of problem areas, while the navigator allows for detailed inspection 
            of specific locations. Use these tools together to make informed decisions about road maintenance and improvements.
          </p>
        </div>
      </div>

      <footer style={{
        textAlign: 'center',
        padding: '2rem',
        marginTop: '2rem',
        color: '#666',
        fontSize: '0.9rem',
        backgroundColor: 'white',
        boxShadow: '0 -2px 4px rgba(0,0,0,0.05)'
      }}>
        <p>© 2024 Road Defects Visualization System</p>
      </footer>
    </div>
  )
}

// case "text": {
//   const anchor = { x: pointer.x, y: pointer.y }; // where user clicked

//   // sizing knobs
//   const padX = 24;
//   const padY = 16;
//   const arrowDepth = 28; // how far the V sticks out
//   const arrowSpan = 32;  // opening height of the V at the box edge

//   // editable text
//   const text = new fabric.IText("Double click to edit", {
//     fontSize: textOptions.fontSize,
//     fontFamily: textOptions.fontFamily,
//     fontWeight: textOptions.bold ? "bold" : "normal",
//     textAlign: textOptions.alignment || "center",
//     fill: "#000",
//     originX: "center",
//     originY: "center",
//     editable: true,
//   });

//   // helper to create outline points (rect + side arrow) centered at (0,0)
//   const makePoints = (w: number, h: number) => {
//     const s = Math.min(arrowSpan / 2, (h - 8) / 2); // keep V inside box height
//     return [
//       new fabric.Point(-w / 2, -h / 2), // TL
//       new fabric.Point( w / 2, -h / 2), // TR
//       new fabric.Point( w / 2, -s),     // notch top
//       new fabric.Point( w / 2 + arrowDepth, 0), // tip
//       new fabric.Point( w / 2,  s),     // notch bottom
//       new fabric.Point( w / 2,  h / 2), // BR
//       new fabric.Point(-w / 2,  h / 2), // BL
//     ];
//   };

//   // initial sizes
//   text.initDimensions(); // ensure text.width/height are up to date
//   let boxW = text.width + padX * 2;
//   let boxH = text.height + padY * 2;

//   // single outline — no gap possible
//   const frame = new fabric.Polygon(makePoints(boxW, boxH), {
//     fill: "", // transparent
//     stroke: "#0b7285",
//     strokeWidth: 6,
//     strokeLineJoin: "round",
//     objectCaching: false,
//     originX: "center",
//     originY: "center",
//   });

//   // group outline + text
//   const group = new fabric.Group([frame, text], {
//     originX: "center",
//     originY: "center",
//   });

//   // place so that the arrow tip sits exactly on the click
//   group.set({
//     left: anchor.x - (boxW / 2 + arrowDepth),
//     top: anchor.y,
//   });
//   group.setCoords();

//   fabricCanvas.add(group);
//   setAnnotationHistory(prev => [...prev, group]);

//   // keep the frame in sync with text changes
//   const resize = () => {
//     text.initDimensions(); // refresh text.width/height after edits
//     const w = Math.max(30, text.width + padX * 2);
//     const h = Math.max(20, text.height + padY * 2);

//     frame.set({ points: makePoints(w, h) });

//     // keep the arrow tip pinned at the original click point
//     group.set({
//       left: anchor.x - (w / 2 + arrowDepth),
//       top: anchor.y,
//     });

//     group.setCoords();
//     fabricCanvas.requestRenderAll();
//   };

//   text.on("changed", resize);
//   text.on("editing:entered", resize);
//   text.on("editing:exited", resize);

//   break;
// }

