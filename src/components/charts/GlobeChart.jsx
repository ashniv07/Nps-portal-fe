import { useRef, useEffect, useState } from 'react'
import Globe from 'react-globe.gl'

function getPinColor(client, surveyType) {
  if (client.status !== 'Responded') return '#6b7280'
  if (surveyType === 'csat') {
    return client.csat >= 4 ? '#0F7E6D' : client.csat >= 3 ? '#CDDE33' : '#ef4444'
  }
  return client.nps >= 9 ? '#0F7E6D' : client.nps >= 7 ? '#CDDE33' : '#ef4444'
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
    const size = d.isSelected ? 18 : 11
    pin.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      border-radius: 50%;
      background: ${d.color};
      border: ${d.isSelected ? '2.5px solid #CDDE33' : '2px solid rgba(255,255,255,0.85)'};
      box-shadow: ${d.isSelected
        ? `0 0 0 3px rgba(205,222,51,0.35), 0 0 14px ${d.color}`
        : `0 1px 6px ${d.color}80`};
      transition: transform 0.15s ease, box-shadow 0.15s ease;
    `

    // Pulse ring for selected
    if (d.isSelected) {
      const ring = document.createElement('div')
      ring.style.cssText = `
        position: absolute;
        width: 28px;
        height: 28px;
        border-radius: 50%;
        border: 1.5px solid #CDDE33;
        opacity: 0.5;
        animation: pulse 1.8s ease-out infinite;
        pointer-events: none;
      `
      outer.appendChild(ring)
    }

    outer.appendChild(pin)

    outer.addEventListener('mouseenter', () => {
      pin.style.transform = 'scale(1.55)'
      pin.style.boxShadow = `0 0 12px ${d.color}`
    })
    outer.addEventListener('mouseleave', () => {
      pin.style.transform = 'scale(1)'
      pin.style.boxShadow = d.isSelected
        ? `0 0 0 3px rgba(205,222,51,0.35), 0 0 14px ${d.color}`
        : `0 1px 6px ${d.color}80`
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
          0% { transform: scale(0.8); opacity: 0.6; }
          100% { transform: scale(2.2); opacity: 0; }
        }
      `}</style>
      <div ref={containerRef} className="w-full" style={{ height: HEIGHT }}>
        {width > 0 && (
          <Globe
            ref={globeRef}
            width={width}
            height={HEIGHT}
            globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
            backgroundColor="rgba(0,0,0,0)"
            atmosphereColor="#CDDE33"
            atmosphereAltitude={0.12}
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
