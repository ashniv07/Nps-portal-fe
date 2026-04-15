import { useRef, useEffect, useState } from 'react'
import Globe from 'react-globe.gl'

function getPinColor(client, surveyType) {
  if (client.status !== 'Responded') return '#D5E7E7'  // Neutral gray from design system
  if (surveyType === 'csat') {
    return client.csat >= 4 ? '#25A28F' : client.csat >= 3 ? '#CDDE33' : '#731A42'  // Turquoise 3 for positive, Neon for neutral, Magenta for negative
  }
  return client.nps >= 9 ? '#25A28F' : client.nps >= 7 ? '#CDDE33' : '#731A42'
}

export function GlobeChart({ clients, surveyType, onClientSelect, selectedClient }) {
  const globeRef = useRef()
  const containerRef = useRef()
  const [width, setWidth] = useState(0)
  const HEIGHT = 440

  // Keep latest callback in a ref so element closures stay fresh across renders
  const onSelectRef = useRef(onClientSelect)
  useEffect(() => { onSelectRef.current = onClientSelect }, [onClientSelect])

  // Track container width dynamically
  useEffect(() => {
    const observer = new ResizeObserver(([entry]) => {
      setWidth(entry.contentRect.width)
    })
    if (containerRef.current) observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [])

  // Setup globe controls after ready
  const handleGlobeReady = () => {
    const ctrl = globeRef.current?.controls()
    if (!ctrl) return
    ctrl.autoRotate = true
    ctrl.autoRotateSpeed = 0.7
    ctrl.enableZoom = true
    ctrl.enablePan = false
    ctrl.minDistance = 200
    ctrl.maxDistance = 500
    globeRef.current.pointOfView({ altitude: 2.2 }, 0)
  }

  const markers = clients
    .filter((c) => c.lat != null && c.lng != null)
    .map((c) => ({
      ...c,
      color: getPinColor(c, surveyType),
      isSelected: selectedClient?.id === c.id,
    }))

  // Build a real DOM element for each pin — actual DOM elements bypass OrbitControls
  function createElement(d) {
    const outer = document.createElement('div')
    outer.style.cssText = `
      position: relative;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
    `

    const pin = document.createElement('div')
    const size = d.isSelected ? 14 : 8
    pin.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      border-radius: 50%;
      background: ${d.color};
      border: ${d.isSelected ? '2px solid #CDDE33' : 'none'};
      box-shadow: ${d.isSelected
        ? `0 0 0 2px rgba(205,222,51,0.4), 0 2px 8px rgba(0,0,0,0.12)`
        : `0 1px 4px rgba(0,0,0,0.08)`};
      transition: transform 0.15s ease, box-shadow 0.15s ease;
    `

    // Subtle pulse ring for selected
    if (d.isSelected) {
      const ring = document.createElement('div')
      ring.style.cssText = `
        position: absolute;
        width: 24px;
        height: 24px;
        border-radius: 50%;
        border: 1.2px solid #CDDE33;
        opacity: 0.3;
        animation: pulse 2s ease-out infinite;
        pointer-events: none;
      `
      outer.appendChild(ring)
    }

    outer.appendChild(pin)

    outer.addEventListener('mouseenter', () => {
      pin.style.transform = 'scale(1.5)'
      pin.style.boxShadow = `0 2px 8px rgba(0,0,0,0.15)`
    })
    outer.addEventListener('mouseleave', () => {
      pin.style.transform = 'scale(1)'
      pin.style.boxShadow = d.isSelected
        ? `0 0 0 2px rgba(205,222,51,0.4), 0 2px 8px rgba(0,0,0,0.12)`
        : `0 1px 4px rgba(0,0,0,0.08)`
    })
    outer.addEventListener('click', (e) => {
      e.stopPropagation()
      const ctrl = globeRef.current?.controls()
      if (ctrl) ctrl.autoRotate = false
      globeRef.current?.pointOfView({ lat: d.lat, lng: d.lng, altitude: 1.8 }, 600)
      onSelectRef.current(d)
    })

    return outer
  }

  return (
    <>
      <style>{`
        @keyframes pulse {
          0% { transform: scale(1); opacity: 0.4; }
          100% { transform: scale(2.0); opacity: 0; }
        }
      `}</style>
      <div ref={containerRef} className="w-full" style={{ height: HEIGHT, backgroundColor: 'transparent' }}>
        {width > 0 && (
          <Globe
            ref={globeRef}
            width={width}
            height={HEIGHT}
            globeImageUrl="//unpkg.com/three-globe/example/img/earth-day.jpg"
            backgroundColor="rgba(0,0,0,0)"
            atmosphereColor="#D5E7E7"
            atmosphereAltitude={0.1}
            htmlElementsData={markers}
            htmlLat="lat"
            htmlLng="lng"
            htmlAltitude={0.01}
            htmlElement={createElement}
            onGlobeReady={handleGlobeReady}
          />
        )}
      </div>
    </>
  )
}
