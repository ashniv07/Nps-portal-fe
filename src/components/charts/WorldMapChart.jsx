import { useState, useMemo } from 'react'
import { ComposableMap, Geographies, Geography, Marker, ZoomableGroup } from 'react-simple-maps'
import { motion, AnimatePresence } from 'framer-motion'
import { Star, MapPin, ChevronLeft, MessageSquare } from 'lucide-react'
import { regionHierarchy } from '../../data/dummyData'

const GEO_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json'

// ── Color helpers ─────────────────────────────────────────────────────────────

function npsColor(nps) {
  if (nps >= 9) return { pin: '#25A28F', label: 'Promoter',   bg: 'bg-emerald-50', text: 'text-emerald-700' }
  if (nps >= 7) return { pin: '#F59E0B', label: 'Passive',    bg: 'bg-amber-50',   text: 'text-amber-700' }
  return           { pin: '#EF4444', label: 'Detractor',  bg: 'bg-rose-50',    text: 'text-rose-600' }
}

function csatColor(csat) {
  if (csat >= 4) return { pin: '#CDDE33', label: 'Satisfied',    bg: 'bg-lime-50',  text: 'text-lime-700' }
  if (csat >= 3) return { pin: '#F59E0B', label: 'Neutral',      bg: 'bg-amber-50', text: 'text-amber-700' }
  return          { pin: '#EF4444', label: 'Dissatisfied', bg: 'bg-rose-50',  text: 'text-rose-600' }
}

// Spread pins that overlap visually — adjusts renderLat/renderLng without mutating source data
function spreadOverlappingPins(pins, lngThresh, latThresh, latSpread) {
  const out = pins.map(p => ({ ...p, _lat: p.lat, _lng: p.lng }))
  for (let i = 0; i < out.length; i++) {
    for (let j = i + 1; j < out.length; j++) {
      const dLng = Math.abs(out[j]._lng - out[i]._lng)
      const dLat = Math.abs(out[j]._lat - out[i]._lat)
      if (dLng < lngThresh && dLat < latThresh) {
        const dir = out[i]._lat >= out[j]._lat ? 1 : -1
        out[i]._lat += dir * latSpread
        out[j]._lat -= dir * latSpread
      }
    }
  }
  return out
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

// ── Score display ─────────────────────────────────────────────────────────────

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

// ── Region Pin (level 0) — labeled badge ──────────────────────────────────────

function RegionPin({ name, abbr, nps, color, isSelected }) {
  const w = 56, h = 28, r = 7
  return (
    <g style={{ cursor: 'pointer' }}>
      <title>{name} — NPS {nps}</title>
      {/* Shadow */}
      <rect x={-w / 2 + 1} y={-h / 2 + 2.5} width={w} height={h} rx={r} fill="rgba(0,0,0,0.20)" />
      {/* Badge */}
      <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={r} fill={color} />
      {/* Selection halo */}
      {isSelected && (
        <rect x={-w / 2 - 3} y={-h / 2 - 3} width={w + 6} height={h + 6} rx={r + 3}
          fill="none" stroke={color} strokeWidth={2} opacity={0.35} />
      )}
      {/* Divider */}
      <line x1={4} y1={-h / 2 + 7} x2={4} y2={h / 2 - 7} stroke="rgba(255,255,255,0.35)" strokeWidth={1} />
      {/* Abbr label */}
      <text x={-8} y={1} textAnchor="middle" dominantBaseline="middle"
        fontSize={9} fontWeight="700" fill="rgba(255,255,255,0.9)" fontFamily="'Karla', sans-serif">
        {abbr}
      </text>
      {/* NPS number */}
      <text x={14} y={1} textAnchor="middle" dominantBaseline="middle"
        fontSize={12} fontWeight="800" fill="#ffffff" fontFamily="'Playfair Display', serif">
        {nps}
      </text>
    </g>
  )
}

// ── Subregion Pin (level 1) — smaller badge ───────────────────────────────────

function SubregionPin({ name, nps, isSelected }) {
  const color = nps >= 70 ? '#25A28F' : nps >= 60 ? '#F59E0B' : '#EF4444'
  const short = name.length > 11 ? name.slice(0, 10) + '…' : name
  const w = 46, h = 22, r = 5
  return (
    <g style={{ cursor: 'pointer' }}>
      <title>{name} — NPS {nps}</title>
      <rect x={-w / 2 + 1} y={-h / 2 + 2} width={w} height={h} rx={r} fill="rgba(0,0,0,0.18)" />
      <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={r} fill={color} />
      {isSelected && (
        <rect x={-w / 2 - 3} y={-h / 2 - 3} width={w + 6} height={h + 6} rx={r + 3}
          fill="none" stroke={color} strokeWidth={1.5} opacity={0.38} />
      )}
      <text x={0} y={0} textAnchor="middle" dominantBaseline="middle"
        fontSize={7.5} fontWeight="700" fill="#ffffff" fontFamily="'Karla', sans-serif">
        {short}
      </text>
    </g>
  )
}

// ── City Pin (level 2) — teardrop with label ──────────────────────────────────

function CityPin({ color, city, isSelected }) {
  const r = 6
  const label = city.length > 13 ? city.slice(0, 12) + '…' : city
  return (
    <g style={{ cursor: 'pointer' }}>
      <title>{city}</title>
      {isSelected && (
        <circle cx={0} cy={0} r={r + 6} fill="none" stroke={color} strokeWidth={1.8} opacity={0.28} />
      )}
      {/* Drop shadow */}
      <circle cx={0.5} cy={1.5} r={r} fill="rgba(0,0,0,0.22)" />
      {/* Pin body */}
      <circle cx={0} cy={0} r={r} fill={color} stroke="#ffffff" strokeWidth={1.5} />
      {/* Teardrop pointer */}
      <polygon points="0,10 -3.5,4 3.5,4" fill={color} />
      {/* City label */}
      <text x={0} y={19} textAnchor="middle" dominantBaseline="middle"
        fontSize={6.5} fontWeight="600" fill="#1F2937" fontFamily="'Karla', sans-serif">
        {label}
      </text>
    </g>
  )
}

// ── Client row in subregion list ──────────────────────────────────────────────

function ClientListRow({ client, surveyType, onClick }) {
  const isCsat = surveyType === 'csat'
  const ini = client.name.split(' ').map(n => n[0]).join('')
  const responded = client.status === 'Responded'

  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:border-neon/30 hover:bg-neon/[0.02] transition-all group text-left"
    >
      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
        responded ? 'bg-neon/20 text-gray-800' : 'bg-gray-100 text-gray-400'
      }`}>
        {ini}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-800 font-body truncate">{client.name}</p>
        <p className="text-xs text-gray-400 font-body truncate">{client.company} · {client.city}</p>
      </div>
      <div className="flex flex-col items-end gap-1 shrink-0">
        {responded ? (
          isCsat && client.csat != null
            ? <CsatStars csat={client.csat} />
            : client.nps != null && <NpsChip nps={client.nps} />
        ) : (
          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded font-body ${
            client.status === 'Pending' ? 'bg-amber-100 text-amber-600' : 'bg-blue-100 text-blue-600'
          }`}>
            {client.status}
          </span>
        )}
      </div>
    </button>
  )
}

// ── SubregionClientList — right panel when subregion is selected ───────────────

function SubregionClientList({ heading, clients, surveyType, onSelectClient, onBack }) {
  const isCsat = surveyType === 'csat'
  const responded = clients.filter(c => c.status === 'Responded')
  const npsScores = responded.filter(c => c.nps != null).map(c => c.nps)
  const csatScores = responded.filter(c => c.csat != null).map(c => c.csat)
  const avgCsat = csatScores.length ? (csatScores.reduce((a, b) => a + b, 0) / csatScores.length).toFixed(1) : null
  const responseRate = clients.length ? Math.round((responded.length / clients.length) * 100) : 0
  const promoters = npsScores.filter(s => s >= 9)
  const passives = npsScores.filter(s => s >= 7 && s < 9)
  const detractors = npsScores.filter(s => s < 7)
  const computedNps = npsScores.length
    ? Math.round(((promoters.length - detractors.length) / npsScores.length) * 100)
    : null

  return (
    <motion.div
      key="subregion-list"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col h-full"
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-3 shrink-0">
        <button
          onClick={onBack}
          className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors shrink-0"
        >
          <ChevronLeft size={15} />
        </button>
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
            <MapPin size={14} className="text-gray-500" />
          </div>
          <div className="min-w-0">
            <h4 className="font-display font-semibold text-gray-900 text-sm truncate">{heading}</h4>
            <p className="text-[10px] text-gray-400 font-body">{clients.length} clients</p>
          </div>
        </div>
      </div>

      {/* Executive Summary */}
      <p className="text-[10px] font-bold font-body uppercase tracking-widest text-gray-400 mb-2 shrink-0">Executive Summary</p>
      <div className="grid grid-cols-2 gap-2 mb-3 shrink-0">
        {(!isCsat ? [
          { label: 'Sent',          value: clients.length },
          { label: 'Responded',     value: responded.length },
          { label: 'Response Rate', value: `${responseRate}%` },
          { label: 'NPS Score',     value: computedNps ?? '—' },
        ] : [
          { label: 'No. of Projects', value: clients.length },
          { label: 'Surveys Sent',    value: clients.length },
          { label: 'Responses',       value: responded.length },
          { label: 'Avg CSAT',        value: avgCsat ? `${avgCsat}/5` : '—' },
        ]).map(({ label, value }) => (
          <div key={label} className="border border-gray-100 rounded-xl p-2.5 text-center">
            <p className="text-base font-bold font-display text-gray-900">{value}</p>
            <p className="text-[10px] text-gray-400 font-body">{label}</p>
          </div>
        ))}
      </div>

      {/* NPS Breakdown bars */}
      {!isCsat && npsScores.length > 0 && (
        <div className="border border-gray-100 rounded-xl p-3 mb-3 shrink-0">
          <p className="text-xs font-semibold font-body text-gray-600 mb-2.5">NPS Breakdown</p>
          <div className="space-y-2">
            {[
              { label: 'Promoters',  count: promoters.length,  pct: Math.round((promoters.length  / npsScores.length) * 100), color: 'bg-emerald-500', text: 'text-emerald-600' },
              { label: 'Passives',   count: passives.length,   pct: Math.round((passives.length   / npsScores.length) * 100), color: 'bg-amber-400',   text: 'text-amber-500' },
              { label: 'Detractors', count: detractors.length, pct: Math.round((detractors.length / npsScores.length) * 100), color: 'bg-rose-500',    text: 'text-rose-500' },
            ].map(({ label, count, pct, color, text }) => (
              <div key={label} className="flex items-center gap-2">
                <span className="text-xs font-body text-gray-500 w-16 shrink-0">{label}</span>
                <div className="flex-1 h-1.5 rounded-full bg-gray-100">
                  <motion.div
                    className={`h-1.5 rounded-full ${color}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                  />
                </div>
                <span className={`text-xs font-bold font-display w-14 text-right shrink-0 ${text}`}>{count} ({pct}%)</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <p className="text-[10px] font-bold font-body uppercase tracking-widest text-gray-400 mb-2 shrink-0">Clients</p>
      <div className="flex-1 overflow-y-auto space-y-2 pr-0.5 min-h-0">
        {clients.length === 0
          ? <p className="text-sm text-gray-400 font-body text-center py-8">No clients here</p>
          : clients.map(c => (
              <ClientListRow
                key={c.id}
                client={c}
                surveyType={surveyType}
                onClick={() => onSelectClient(c)}
              />
            ))
        }
      </div>
    </motion.div>
  )
}

// ── ClientAnalyticsPanel — right panel when a client is selected ──────────────

function ClientAnalyticsPanel({ client, surveyType, onBack }) {
  const isCsat = surveyType === 'csat'
  const ini = client.name.split(' ').map(n => n[0]).join('')
  const responded = client.status === 'Responded'

  const npsCat = client.nps != null
    ? client.nps >= 9
      ? { label: 'Promoter',  bg: 'bg-emerald-50', text: 'text-emerald-700' }
      : client.nps >= 7
      ? { label: 'Passive',   bg: 'bg-amber-50',   text: 'text-amber-700' }
      : { label: 'Detractor', bg: 'bg-rose-50',     text: 'text-rose-600' }
    : null

  const npsTextColor = client.nps != null ? npsColor(client.nps).text : 'text-gray-400'
  const csatTextColor = client.csat != null ? csatColor(client.csat).text : 'text-gray-400'

  return (
    <motion.div
      key={`client-${client.id}`}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col h-full"
    >
      {/* Back */}
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-800 font-body font-semibold mb-4 shrink-0 transition-colors"
      >
        <ChevronLeft size={13} /> Back to clients
      </button>

      {/* Client header */}
      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl mb-4 shrink-0">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${
          responded ? 'bg-neon/20 text-gray-800' : 'bg-gray-200 text-gray-500'
        }`}>
          {ini}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-display font-semibold text-gray-900 text-sm truncate">{client.name}</p>
          <p className="text-xs text-gray-500 font-body truncate">{client.company}</p>
          <p className="text-[10px] text-gray-400 font-body flex items-center gap-1 mt-0.5">
            <MapPin size={8} />{client.city}, {client.country}
          </p>
        </div>
      </div>

      {/* Stats grid — conditional on mode */}
      <div className="grid grid-cols-2 gap-2 mb-4 shrink-0">
        {(!isCsat ? [
          {
            label: 'NPS Score',
            value: client.nps ?? '—',
            color: npsTextColor,
          },
          {
            label: 'Category',
            value: npsCat?.label ?? '—',
            color: npsCat ? npsCat.text : 'text-gray-400',
          },
          {
            label: 'Status',
            value: client.status,
            color: client.status === 'Responded' ? 'text-emerald-600' : client.status === 'Pending' ? 'text-amber-500' : 'text-blue-600',
          },
          {
            label: 'Region',
            value: client.subregion ? client.subregion.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : '—',
            color: 'text-gray-700',
          },
        ] : [
          {
            label: 'CSAT Score',
            value: client.csat != null ? `${client.csat}/5` : '—',
            color: csatTextColor,
          },
          {
            label: 'Rating',
            value: client.csat != null ? csatColor(client.csat).label : '—',
            color: client.csat != null ? csatColor(client.csat).text : 'text-gray-400',
          },
          {
            label: 'Status',
            value: client.status,
            color: client.status === 'Responded' ? 'text-emerald-600' : client.status === 'Pending' ? 'text-amber-500' : 'text-blue-600',
          },
          {
            label: 'Region',
            value: client.subregion ? client.subregion.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : '—',
            color: 'text-gray-700',
          },
        ]).map(({ label, value, color }) => (
          <div key={label} className="border border-gray-100 rounded-xl p-3">
            <p className="text-[10px] text-gray-400 font-body uppercase tracking-wide">{label}</p>
            <p className={`text-sm font-bold font-display mt-0.5 ${color}`}>{value}</p>
          </div>
        ))}
      </div>

      {/* CSAT stars */}
      {isCsat && client.csat != null && (
        <div className="flex items-center gap-2 mb-3 shrink-0 px-1">
          <CsatStars csat={client.csat} />
          <span className="text-xs text-gray-400 font-body">{client.csat} / 5 stars</span>
        </div>
      )}

      {/* Date */}
      {client.date && (
        <p className="text-[10px] text-gray-400 font-body mb-3 shrink-0 px-1">
          Responded {new Date(client.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
        </p>
      )}

      {/* Feedback */}
      <p className="text-[10px] font-bold font-body uppercase tracking-widest text-gray-400 mb-2 shrink-0">Feedback</p>
      <div className="flex-1 min-h-0 overflow-y-auto">
        {client.feedback ? (
          <div className="bg-neon/5 border border-neon/20 rounded-xl p-4">
            <div className="flex items-start gap-2">
              <MessageSquare size={13} className="text-gray-400 shrink-0 mt-0.5" />
              <p className="text-sm text-gray-600 font-body italic leading-relaxed">"{client.feedback}"</p>
            </div>
          </div>
        ) : (
          <div className="border border-dashed border-gray-200 rounded-xl p-5 text-center">
            <MessageSquare size={20} className="text-gray-200 mx-auto mb-1.5" />
            <p className="text-xs text-gray-400 font-body">No feedback provided</p>
          </div>
        )}
      </div>
    </motion.div>
  )
}

// ── Exported MapPanel (used in AnalyticsTab) ──────────────────────────────────

export function MapPanel({ clients, prospects, surveyType }) {
  const [drillLevel, setDrillLevel] = useState(0)
  const [selectedRegion, setSelectedRegion] = useState(null)
  const [selectedSubregion, setSelectedSubregion] = useState(null)
  const [selectedClient, setSelectedClient] = useState(null)
  const [selectedCityLoc, setSelectedCityLoc] = useState(null)
  const [zoom, setZoom] = useState(1)
  const [center, setCenter] = useState([15, 20])

  const regionAbbr = { na: 'NA', emea: 'EMEA', apac: 'APAC' }

  // Level 0: Region pins
  const regionPins = useMemo(() => regionHierarchy.regions.map(region => {
    const rc = clients.filter(c => c.region === region.id)
    const responded = rc.filter(c => c.status === 'Responded')
    const avgNps = responded.length
      ? Math.round(responded.reduce((s, c) => s + (c.nps || 0), 0) / responded.length)
      : region.nps
    return { ...region, avgNps, count: rc.length }
  }), [clients])

  // Level 1: Subregion pins — spread overlapping badges (badge ~46 SVG units ≈ 28 deg lng at mid-lat)
  const subregionPins = useMemo(() => {
    if (!selectedRegion) return []
    const pins = (regionHierarchy.subregions[selectedRegion] || []).map(sub => {
      const sc = clients.filter(c => c.region === selectedRegion && c.subregion === sub.id)
      const responded = sc.filter(c => c.status === 'Responded')
      const avgNps = responded.length
        ? Math.round(responded.reduce((s, c) => s + (c.nps || 0), 0) / responded.length)
        : sub.nps
      return { ...sub, avgNps, clients: sc, count: sc.length }
    })
    return spreadOverlappingPins(pins, 28, 12, 7)
  }, [selectedRegion, clients])

  // Level 2: City location pins — spread city pins that are geographically close
  const clientLocations = useMemo(() => {
    if (drillLevel !== 2 || !selectedSubregion) return []
    const sc = clients.filter(c => c.subregion === selectedSubregion)
    const map = {}
    for (const c of sc) {
      const key = `${Math.round(c.lat * 10) / 10}|${Math.round(c.lng * 10) / 10}`
      if (!map[key]) map[key] = { key, lat: c.lat, lng: c.lng, city: c.city, country: c.country, clients: [] }
      map[key].clients.push(c)
    }
    return spreadOverlappingPins(Object.values(map), 10, 12, 7)
  }, [selectedSubregion, drillLevel, clients])

  // Clients for right panel
  const subregionClients = useMemo(() => {
    if (drillLevel !== 2 || !selectedSubregion) return []
    return clients.filter(c => c.subregion === selectedSubregion)
  }, [selectedSubregion, drillLevel, clients])

  const subregionName = useMemo(() => {
    if (!selectedRegion || !selectedSubregion) return ''
    return (regionHierarchy.subregions[selectedRegion] || []).find(s => s.id === selectedSubregion)?.name ?? selectedSubregion
  }, [selectedRegion, selectedSubregion])

  const panelClients = selectedCityLoc ? selectedCityLoc.clients : subregionClients
  const panelHeading = selectedCityLoc ? selectedCityLoc.city : subregionName

  const handleRegionClick = (region) => {
    setSelectedRegion(region.id)
    setDrillLevel(1)
    setZoom(1.5)
    setCenter([region.lng, region.lat])
    setSelectedClient(null)
    setSelectedCityLoc(null)
  }

  const handleSubregionClick = (sub) => {
    setSelectedSubregion(sub.id)
    setDrillLevel(2)
    setZoom(2.5)
    setCenter([sub.lng, sub.lat])
    setSelectedClient(null)
    setSelectedCityLoc(null)
  }

  const handleCityClick = (loc) => {
    setSelectedCityLoc(loc)
    setSelectedClient(null)
  }

  const handleBack = () => {
    if (drillLevel === 2) {
      setDrillLevel(1)
      setSelectedSubregion(null)
      setSelectedClient(null)
      setSelectedCityLoc(null)
      setZoom(1.5)
    } else if (drillLevel === 1) {
      setDrillLevel(0)
      setSelectedRegion(null)
      setZoom(1)
      setCenter([15, 20])
    }
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-[320px] sm:min-h-[420px] lg:min-h-[500px]">
      {/* Map */}
      <div className="flex-1 bg-[#EEF2F7] relative overflow-hidden min-h-[280px] lg:min-h-0">
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
            <Geographies geography={GEO_URL}>
              {({ geographies }) =>
                geographies.map(geo => (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill="#D8E2EE"
                    stroke="#E8EDF5"
                    strokeWidth={0.5}
                    style={{
                      default: { outline: 'none' },
                      hover:   { fill: '#C8D4E4', outline: 'none' },
                      pressed: { outline: 'none' },
                    }}
                  />
                ))
              }
            </Geographies>

            {/* Region Pins */}
            {drillLevel === 0 && regionPins.map(pin => {
              const color = pin.avgNps >= 70 ? '#25A28F' : pin.avgNps >= 60 ? '#F59E0B' : '#EF4444'
              return (
                <Marker key={pin.id} coordinates={[pin.lng, pin.lat]} onClick={() => handleRegionClick(pin)}>
                  <RegionPin
                    name={pin.name}
                    abbr={regionAbbr[pin.id] || pin.id.toUpperCase()}
                    nps={pin.avgNps}
                    color={color}
                    isSelected={selectedRegion === pin.id}
                  />
                </Marker>
              )
            })}

            {/* Subregion Pins */}
            {drillLevel === 1 && subregionPins.map(pin => (
              <Marker key={pin.id} coordinates={[pin._lng, pin._lat]} onClick={() => handleSubregionClick(pin)}>
                <SubregionPin
                  name={pin.name}
                  nps={pin.avgNps}
                  isSelected={selectedSubregion === pin.id}
                />
              </Marker>
            ))}

            {/* City Pins */}
            {drillLevel === 2 && clientLocations.map(loc => {
              const pinColor = loc.clients?.length > 0
                ? locationPinColor(loc.clients, surveyType)
                : '#A78BFA'
              return (
                <Marker key={loc.key} coordinates={[loc._lng, loc._lat]} onClick={() => handleCityClick(loc)}>
                  <CityPin
                    color={pinColor}
                    city={loc.city}
                    isSelected={selectedCityLoc?.key === loc.key}
                  />
                </Marker>
              )
            })}
          </ZoomableGroup>
        </ComposableMap>

        {/* Back button */}
        {drillLevel > 0 && (
          <button
            onClick={handleBack}
            className="absolute top-3 left-3 z-10 flex items-center gap-1.5 px-3 h-8 bg-white rounded-lg shadow border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors text-xs font-semibold font-body"
          >
            <ChevronLeft size={14} />
            {drillLevel === 1 ? 'All Regions' : 'Subregions'}
          </button>
        )}

        {/* Drill breadcrumb */}
        {drillLevel > 0 && (
          <div className="absolute bottom-3 left-3 z-10 flex items-center gap-1.5 text-[10px] font-body text-gray-500 bg-white/80 backdrop-blur-sm px-2.5 py-1.5 rounded-lg border border-gray-100 shadow-sm">
            <span
              className="cursor-pointer hover:text-gray-800 transition-colors"
              onClick={() => { setDrillLevel(0); setSelectedRegion(null); setZoom(1); setCenter([15, 20]) }}
            >
              Global
            </span>
            {selectedRegion && (
              <>
                <span className="text-gray-300">/</span>
                <span
                  className="cursor-pointer hover:text-gray-800 transition-colors"
                  onClick={() => { if (drillLevel > 1) { setDrillLevel(1); setSelectedSubregion(null); setZoom(1.5); setSelectedClient(null); setSelectedCityLoc(null) } }}
                >
                  {regionAbbr[selectedRegion] || selectedRegion.toUpperCase()}
                </span>
              </>
            )}
            {selectedSubregion && (
              <>
                <span className="text-gray-300">/</span>
                <span className="text-gray-800 font-semibold">{subregionName}</span>
              </>
            )}
          </div>
        )}

        {/* Zoom controls */}
        <div className="absolute top-3 right-3 z-10 flex flex-col gap-1">
          <button onClick={() => setZoom(z => Math.min(z * 1.5, 8))} className="w-7 h-7 bg-white rounded-lg shadow border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors flex items-center justify-center text-base font-bold leading-none">+</button>
          <button onClick={() => setZoom(z => Math.max(z / 1.5, 1))} className="w-7 h-7 bg-white rounded-lg shadow border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors flex items-center justify-center text-base font-bold leading-none">−</button>
        </div>
      </div>

      {/* Side panel */}
      <div className="w-full lg:w-80 xl:w-96 bg-white border-t border-l-0 lg:border-t-0 lg:border-l border-gray-100 flex flex-col p-4 sm:p-5 overflow-hidden">
        <AnimatePresence mode="wait">
          {drillLevel === 2 && selectedClient ? (
            <ClientAnalyticsPanel
              key={`client-${selectedClient.id}`}
              client={selectedClient}
              surveyType={surveyType}
              onBack={() => setSelectedClient(null)}
            />
          ) : drillLevel === 2 ? (
            <SubregionClientList
              key={`list-${selectedSubregion}-${selectedCityLoc?.key ?? 'all'}`}
              heading={panelHeading}
              clients={panelClients}
              surveyType={surveyType}
              onSelectClient={setSelectedClient}
              onBack={() => {
                if (selectedCityLoc) {
                  setSelectedCityLoc(null)
                } else {
                  handleBack()
                }
              }}
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
                  {drillLevel === 0 ? 'Select a region' : 'Select a subregion'}
                </p>
                <p className="text-xs text-gray-400 font-body mt-1 max-w-[200px]">
                  {drillLevel === 0
                    ? 'Click any region badge on the map to explore'
                    : 'Click any subregion badge to view clients'}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
