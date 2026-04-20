import { useState, useMemo } from 'react'
import { ComposableMap, Geographies, Geography, Marker, ZoomableGroup } from 'react-simple-maps'
import { motion, AnimatePresence } from 'framer-motion'
import { Star, X, MapPin, TrendingUp, Building2, ChevronDown, ChevronUp, Briefcase, ChevronLeft } from 'lucide-react'
import { regionHierarchy } from '../../data/dummyData'

const GEO_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json'

// ── helpers ──────────────────────────────────────────────────────────────────

function locKey(lat, lng) {
  return `${Math.round(lat * 10) / 10}|${Math.round(lng * 10) / 10}`
}

function npsColor(nps) {
  if (nps >= 9) return { pin: '#10B981', label: 'Promoter', bg: 'bg-emerald-50', text: 'text-emerald-700', ring: 'ring-emerald-200' }
  if (nps >= 7) return { pin: '#F59E0B', label: 'Passive',  bg: 'bg-amber-50',   text: 'text-amber-700',   ring: 'ring-amber-200' }
  return           { pin: '#EF4444', label: 'Detractor', bg: 'bg-rose-50',     text: 'text-rose-600',    ring: 'ring-rose-200' }
}

function csatColor(csat) {
  if (csat >= 4) return { pin: '#CDDE33', label: 'Satisfied',    bg: 'bg-lime-50',   text: 'text-lime-700',   ring: 'ring-lime-200' }
  if (csat >= 3) return { pin: '#F59E0B', label: 'Neutral',      bg: 'bg-amber-50',  text: 'text-amber-700',  ring: 'ring-amber-200' }
  return          { pin: '#EF4444', label: 'Dissatisfied', bg: 'bg-rose-50',   text: 'text-rose-600',   ring: 'ring-rose-200' }
}

function locationPinColor(clients, surveyType) {
  const responded = clients.filter(c => c.status === 'Responded')
  if (!responded.length) return '#9CA3AF'
  if (surveyType === 'csat') {
    const avg = responded.reduce((s, c) => s + (c.csat || 0), 0) / responded.length
    return csatColor(avg).pin
  }
  const avg = responded.reduce((s, c) => s + (c.nps || 0), 0) / responded.length
  return npsColor(avg).pin
}

// ── NpsChip / CsatStars ──────────────────────────────────────────────────────

function NpsChip({ nps }) {
  const c = npsColor(nps)
  return (
    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-lg font-body ${c.bg} ${c.text}`}>
      NPS {nps}
    </span>
  )
}

function CsatStars({ csat }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} size={10} className={i < csat ? 'fill-teal text-teal' : 'fill-gray-200 text-gray-200'} />
      ))}
    </div>
  )
}

// ── Client row in the side panel ─────────────────────────────────────────────

function ClientRow({ client, surveyType, isOpen, onToggle }) {
  const isCsat = surveyType === 'csat'
  const ini = client.name.split(' ').map(n => n[0]).join('')
  const responded = client.status === 'Responded'

  return (
    <div className={`rounded-xl border transition-all duration-150 ${isOpen ? 'border-neon/40 bg-neon/4' : 'border-gray-100 hover:border-gray-200'}`}>
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-3 p-3 text-left"
      >
        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${responded ? 'bg-neon/20 text-gray-800' : 'bg-gray-100 text-gray-400'}`}>
          {ini}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-800 font-body truncate">{client.name}</p>
          <p className="text-xs text-gray-400 font-body truncate">{client.company}</p>
        </div>
        <div className="flex flex-col items-end gap-1 shrink-0">
          {responded ? (
            isCsat && client.csat != null
              ? <CsatStars csat={client.csat} />
              : client.nps != null && <NpsChip nps={client.nps} />
          ) : (
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded font-body ${client.status === 'Pending' ? 'bg-amber-100 text-amber-600' : 'bg-blue-100 text-blue-600'}`}>
              {client.status}
            </span>
          )}
        </div>
        {responded && (client.feedback ? (isOpen ? <ChevronUp size={13} className="text-gray-400 shrink-0" /> : <ChevronDown size={13} className="text-gray-400 shrink-0" />) : null)}
      </button>

      <AnimatePresence>
        {isOpen && client.feedback && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="overflow-hidden"
          >
            <div className="px-3 pb-3 pt-0">
              <p className="text-xs text-gray-600 font-body italic leading-relaxed border-t border-gray-100 pt-2.5">
                "{client.feedback}"
              </p>
              {client.date && (
                <p className="text-[10px] text-gray-400 font-body mt-1.5">
                  {new Date(client.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ── Prospect row ─────────────────────────────────────────────────────────────

function ProspectRow({ prospect }) {
  const stageBg = {
    Discovery:    'bg-blue-100 text-blue-700',
    Proposal:     'bg-amber-100 text-amber-700',
    Negotiation:  'bg-purple-100 text-purple-700',
  }

  return (
    <div className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:border-gray-200 transition-colors">
      <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center shrink-0">
        <Briefcase size={13} className="text-purple-500" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-800 font-body truncate">{prospect.name}</p>
        <p className="text-xs text-gray-400 font-body truncate">{prospect.company} · {prospect.industry}</p>
      </div>
      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded font-body shrink-0 ${stageBg[prospect.stage] || 'bg-gray-100 text-gray-500'}`}>
        {prospect.stage}
      </span>
    </div>
  )
}

// ── Location side panel ───────────────────────────────────────────────────────

function LocationPanel({ location, onClose, surveyType }) {
  const [tab, setTab] = useState('clients')
  const [openClient, setOpenClient] = useState(null)

  const { city, country, clients = [], prospects = [] } = location

  return (
    <motion.div
      key={`${city}-${country}`}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col h-full"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center">
            <MapPin size={16} className="text-gray-500" />
          </div>
          <div>
            <h4 className="font-display font-semibold text-gray-900 text-base leading-tight">{city}</h4>
            <p className="text-xs text-gray-400 font-body">{country}</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={15} />
        </button>
      </div>

      {/* Stats row */}
      <div className="flex gap-2 mb-4 shrink-0">
        <div className="flex-1 bg-gray-50 rounded-xl p-2.5 text-center">
          <p className="text-lg font-bold font-display text-gray-900">{clients.length}</p>
          <p className="text-[10px] text-gray-400 font-body uppercase tracking-wider">Clients</p>
        </div>
        <div className="flex-1 bg-purple-50 rounded-xl p-2.5 text-center">
          <p className="text-lg font-bold font-display text-purple-700">{prospects.length}</p>
          <p className="text-[10px] text-purple-400 font-body uppercase tracking-wider">Prospects</p>
        </div>
        <div className="flex-1 bg-neon/10 rounded-xl p-2.5 text-center">
          <p className="text-lg font-bold font-display text-gray-900">
            {clients.filter(c => c.status === 'Responded').length}
          </p>
          <p className="text-[10px] text-gray-400 font-body uppercase tracking-wider">Responded</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-gray-100 rounded-[2px] border border-gray-200 mb-4 shrink-0">
        {[
          { id: 'clients',   label: `Clients (${clients.length})` },
          { id: 'prospects', label: `Prospects (${prospects.length})` },
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex-1 py-1.5 text-xs font-semibold font-body rounded-[2px] transition-all duration-200 ${
              tab === t.id ? 'bg-gray-900 text-neon shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto space-y-2 pr-0.5">
        {tab === 'clients' ? (
          clients.length === 0
            ? <p className="text-sm text-gray-400 font-body text-center py-8">No clients at this location</p>
            : clients.map(c => (
                <ClientRow
                  key={c.id}
                  client={c}
                  surveyType={surveyType}
                  isOpen={openClient === c.id}
                  onToggle={() => setOpenClient(openClient === c.id ? null : c.id)}
                />
              ))
        ) : (
          prospects.length === 0
            ? <p className="text-sm text-gray-400 font-body text-center py-8">No prospects at this location</p>
            : prospects.map(p => <ProspectRow key={p.id} prospect={p} />)
        )}
      </div>
    </motion.div>
  )
}

// ── Pin SVG ───────────────────────────────────────────────────────────────────


// Modern glassy pin with gradient, shadow, and animated pop

// Improved simple pin with styled label
function PinIcon({ color, label, isSelected }) {
  const size = 10;
  return (
    <g style={{ cursor: 'pointer' }}>
      {/* Tooltip with name on hover */}
      {label && <title>{label}</title>}
      <circle cx={0} cy={0} r={size} fill={color} stroke="#fff" strokeWidth={1.5} opacity={isSelected ? 1 : 0.92} />
      {isSelected && (
        <circle cx={0} cy={0} r={size + 4} fill="none" stroke={color} strokeWidth={1.5} opacity={0.28} />
      )}
    </g>
  );
}

// ── Main WorldMapChart ────────────────────────────────────────────────────────



// ── Exported panel component (used in AnalyticsTab) ──────────────────────────

export function MapPanel({ clients, prospects, surveyType }) {
  const [selectedLocation, setSelectedLocation] = useState(null)
  const [drillLevel, setDrillLevel] = useState(0) // 0: regions, 1: subregions, 2: clients
  const [selectedRegion, setSelectedRegion] = useState(null) // region id
  const [selectedSubregion, setSelectedSubregion] = useState(null) // subregion id
  const [zoom, setZoom] = useState(1)
  const [center, setCenter] = useState([15, 20])

  // Level 0: Aggregated pins for regions
  const regionPins = useMemo(() => {
    return regionHierarchy.regions.map(region => {
      const regionClients = clients.filter(c => c.region === region.id)
      const responded = regionClients.filter(c => c.status === 'Responded')
      const avgNps = responded.length > 0 
        ? Math.round(responded.reduce((s, c) => s + (c.nps || 0), 0) / responded.length)
        : null
      return { ...region, clients: regionClients, avgNps, count: regionClients.length }
    })
  }, [clients])

  // Level 1: Subregion pins for selected region
  const subregionPins = useMemo(() => {
    if (!selectedRegion) return []
    const subs = regionHierarchy.subregions[selectedRegion] || []
    return subs.map(sub => {
      const subClients = clients.filter(c => c.region === selectedRegion && c.subregion === sub.id)
      const responded = subClients.filter(c => c.status === 'Responded')
      const avgNps = responded.length > 0 
        ? Math.round(responded.reduce((s, c) => s + (c.nps || 0), 0) / responded.length)
        : null
      return { ...sub, clients: subClients, avgNps, count: subClients.length }
    })
  }, [selectedRegion, clients])

  // Level 2: Client locations for selected subregion
  const clientLocations = useMemo(() => {
    if (drillLevel !== 2 || !selectedSubregion) return []
    const subClients = clients.filter(c => c.subregion === selectedSubregion)
    // Group by city/location
    const map = {}
    for (const c of subClients) {
      const key = `${Math.round(c.lat * 10) / 10}|${Math.round(c.lng * 10) / 10}`
      if (!map[key]) {
        map[key] = { key, lat: c.lat, lng: c.lng, city: c.city, country: c.country, clients: [] }
      }
      map[key].clients.push(c)
    }
    return Object.values(map)
  }, [selectedSubregion, drillLevel, clients])

  // Determine which pins to show
  const displayPins = drillLevel === 0 ? regionPins : drillLevel === 1 ? subregionPins : clientLocations

  const handleRegionClick = (region) => {
    setSelectedRegion(region.id)
    setDrillLevel(1)
    setZoom(1.5)
    setCenter([region.lng, region.lat])
    setSelectedLocation(null)
  }

  const handleSubregionClick = (subregion) => {
    setSelectedSubregion(subregion.id)
    setDrillLevel(2)
    setZoom(2.5)
    setCenter([subregion.lng, subregion.lat])
    setSelectedLocation(null)
  }

  const handleBack = () => {
    if (drillLevel === 2) {
      setDrillLevel(1)
      setSelectedSubregion(null)
      setZoom(1.5)
      setSelectedLocation(null)
    } else if (drillLevel === 1) {
      setDrillLevel(0)
      setSelectedRegion(null)
      setZoom(1)
      setCenter([15, 20])
      setSelectedLocation(null)
    }
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-[320px] sm:min-h-[420px] lg:min-h-[500px]">
      {/* Map */}
      <div className="flex-1 bg-[#F0F4F8] relative overflow-hidden min-h-[280px] lg:min-h-0">
        <ComposableMap
          projection="geoNaturalEarth1"
          style={{ width: '100%', height: '100%' }}
          projectionConfig={{ scale: 145, center: [15, 10] }}
        >
          <ZoomableGroup
            zoom={zoom}
            center={center}
            onMoveEnd={({ zoom: z, coordinates }) => { setZoom(z); setCenter(coordinates) }}
            minZoom={1}
            maxZoom={8}
          >
            {/* Countries */}
            <Geographies geography={GEO_URL}>
              {({ geographies }) =>
                geographies.map(geo => (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill="#DDE3ED"
                    stroke="#EEF1F6"
                    strokeWidth={0.5}
                    style={{
                      default: { outline: 'none' },
                      hover:   { fill: '#CDD5E0', outline: 'none' },
                      pressed: { outline: 'none' },
                    }}
                  />
                ))
              }
            </Geographies>

            {/* Region/Subregion/Client Pins */}
            {drillLevel === 0 && regionPins.map(pin => (
              <Marker
                key={pin.id}
                coordinates={[pin.lng, pin.lat]}
                onClick={() => handleRegionClick(pin)}
              >
                <PinIcon
                  color={pin.color === 'bg-emerald-500' ? '#10B981' : '#F59E0B'}
                  label={pin.name}
                  isSelected={false}
                />
              </Marker>
            ))}

            {drillLevel === 1 && subregionPins.map(pin => (
              <Marker
                key={pin.id}
                coordinates={[pin.lng, pin.lat]}
                onClick={() => handleSubregionClick(pin)}
              >
                <PinIcon
                  color="#3B82F6"
                  label={pin.name}
                  isSelected={false}
                />
              </Marker>
            ))}

            {drillLevel === 2 && clientLocations.map(loc => {
              const hasClients = loc.clients?.length > 0
              const isSelected = selectedLocation?.key === loc.key
              const pinColor = hasClients
                ? locationPinColor(loc.clients, surveyType)
                : '#A78BFA'
              return (
                <Marker
                  key={loc.key}
                  coordinates={[loc.lng, loc.lat]}
                  onClick={() => setSelectedLocation(loc)}
                >
                  <PinIcon
                    color={pinColor}
                    label={loc.city}
                    isSelected={isSelected}
                  />
                </Marker>
              )
            })}
          </ZoomableGroup>
        </ComposableMap>

        {/* Back Button */}
        {drillLevel > 0 && (
          <button
            onClick={handleBack}
            className="absolute top-3 left-3 z-10 w-8 h-8 bg-white rounded-lg shadow border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors flex items-center justify-center"
          >
            <ChevronLeft size={16} />
          </button>
        )}

        {/* Zoom controls */}
        <div className="absolute top-3 right-3 z-10 flex flex-col gap-1">
          <button
            onClick={() => setZoom(z => Math.min(z * 1.5, 8))}
            className="w-7 h-7 bg-white rounded-lg shadow border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors flex items-center justify-center text-base font-bold font-body leading-none"
          >+</button>
          <button
            onClick={() => setZoom(z => Math.max(z / 1.5, 1))}
            className="w-7 h-7 bg-white rounded-lg shadow border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors flex items-center justify-center text-base font-bold font-body leading-none"
          >−</button>
        </div>
      </div>

      {/* Side panel */}
      <div className="w-full lg:w-80 xl:w-96 bg-white border-t border-l-0 lg:border-t-0 lg:border-l border-gray-100 flex flex-col p-4 sm:p-5 overflow-hidden">
        <AnimatePresence mode="wait">
          {selectedLocation && drillLevel === 2 ? (
            <LocationPanel
              key={selectedLocation.key}
              location={selectedLocation}
              onClose={() => setSelectedLocation(null)}
              surveyType={surveyType}
            />
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 flex flex-col items-center justify-center text-center gap-3"
            >
              <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center">
                <MapPin size={22} className="text-gray-400" />
              </div>
              <div>
                <p className="font-display font-semibold text-gray-400">
                  {drillLevel === 0 ? 'Select a region' : drillLevel === 1 ? 'Select a subregion' : 'Select a location'}
                </p>
                <p className="text-xs text-gray-400 font-body mt-1 max-w-[200px]">
                  {drillLevel === 0 
                    ? 'Click any region pin to explore' 
                    : drillLevel === 1 
                    ? 'Click any subregion pin to view clients'
                    : 'Click any client pin to view details'}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
