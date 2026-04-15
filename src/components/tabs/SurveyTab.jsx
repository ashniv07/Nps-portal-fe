import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, FileSpreadsheet, Send, Bell, Search, Eye, X, CheckCircle2 } from 'lucide-react'
import { Card, CardHeader, CardContent } from '../ui/Card'
import { Button } from '../ui/Button'
import { StatusBadge } from '../ui/Badge'
import { EmailPreviewModal } from '../modals/EmailPreviewModal'
import { clientsData } from '../../data/dummyData'

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
}
const item = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] } },
}

function FileDropzone({ onFile }) {
  const [dragging, setDragging] = useState(false)
  const [uploaded, setUploaded] = useState(null)
  const inputRef = useRef(null)

  const handleDrop = (e) => {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) {
      setUploaded(file.name)
      onFile?.(file)
    }
  }

  const handleFile = (e) => {
    const file = e.target.files[0]
    if (file) {
      setUploaded(file.name)
      onFile?.(file)
    }
  }

  return (
    <div>
      <motion.div
        className={`relative border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all duration-200 ${
          dragging
            ? 'border-neon bg-neon/8 shadow-neon'
            : uploaded
            ? 'border-emerald-400 bg-emerald-50'
            : 'border-gray-200 bg-gray-50/50 hover:border-neon/60 hover:bg-neon/4'
        }`}
        onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => !uploaded && inputRef.current?.click()}
        animate={dragging ? { scale: 1.01 } : { scale: 1 }}
        transition={{ duration: 0.15 }}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".xlsx,.xls,.csv"
          className="hidden"
          onChange={handleFile}
        />

        <AnimatePresence mode="wait">
          {uploaded ? (
            <motion.div
              key="uploaded"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-3"
            >
              <div className="w-14 h-14 rounded-2xl bg-emerald-100 flex items-center justify-center">
                <CheckCircle2 size={28} className="text-emerald-600" />
              </div>
              <div>
                <p className="font-body font-semibold text-emerald-700">{uploaded}</p>
                <p className="text-xs text-gray-400 mt-0.5">File ready to import</p>
              </div>
              <button
                className="text-xs text-gray-400 hover:text-gray-600 underline font-body"
                onClick={(e) => { e.stopPropagation(); setUploaded(null) }}
              >
                Remove
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-3"
            >
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-colors ${dragging ? 'bg-neon shadow-neon' : 'bg-gray-100'}`}>
                {dragging ? (
                  <Upload size={26} className="text-black" />
                ) : (
                  <FileSpreadsheet size={26} className="text-gray-400" />
                )}
              </div>
              <div>
                <p className="font-body font-semibold text-gray-700">
                  {dragging ? 'Release to upload' : 'Drag & drop your Excel file'}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Supports .xlsx, .xls, .csv · Up to 10MB
                </p>
              </div>
              <span className="px-4 py-1.5 rounded-lg border border-gray-200 text-sm text-gray-500 font-body bg-white hover:bg-gray-50 transition-colors">
                Browse Files
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}

export function SurveyTab({ surveyType = 'nps' }) {
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState([])
  const [previewClient, setPreviewClient] = useState(null)

  const filtered = clientsData.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.company.toLowerCase().includes(search.toLowerCase())
  )

  const toggleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    )
  }

  const toggleAll = () => {
    setSelected(selected.length === filtered.length ? [] : filtered.map((c) => c.id))
  }

  return (
    <>
      <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">

        {/* Upload Section */}
        <motion.div variants={item}>
          <Card hover={false}>
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-neon/15 flex items-center justify-center">
                  <Upload size={14} className="text-yellow-700" />
                </div>
                <h2 className="font-display font-semibold text-gray-900">Import Contacts</h2>
              </div>
              <p className="text-xs text-gray-400 font-body mt-1">
                Upload a spreadsheet with client details to bulk-import contacts
              </p>
            </CardHeader>
            <CardContent>
              <FileDropzone />
              <div className="mt-4 flex gap-3">
                <a
                  href="#"
                  className="text-xs text-teal underline font-body hover:text-teal-light transition-colors"
                >
                  Download template (.xlsx)
                </a>
                <span className="text-gray-200">|</span>
                <a
                  href="#"
                  className="text-xs text-teal underline font-body hover:text-teal-light transition-colors"
                >
                  View import guide
                </a>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Client Table */}
        <motion.div variants={item}>
          <Card hover={false}>
            <CardHeader>
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="font-display font-semibold text-gray-900">Client List</h2>
                  <p className="text-xs text-gray-400 font-body mt-0.5">
                    {clientsData.length} contacts · {clientsData.filter((c) => c.status === 'Responded').length} responded
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  {selected.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex items-center gap-2"
                    >
                      <span className="text-xs text-gray-500 font-body">{selected.length} selected</span>
                      <Button
                        variant="primary"
                        size="sm"
                        icon={<Send size={13} />}
                      >
                        Send Survey
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        icon={<Bell size={13} />}
                      >
                        Remind
                      </Button>
                    </motion.div>
                  )}

                  <div className="relative">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search clients..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="pl-8 pr-4 py-2 text-sm rounded-xl border border-gray-200 bg-gray-50 font-body focus:outline-none focus:ring-2 focus:ring-neon/30 focus:border-neon/60 w-48 transition-all"
                    />
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent className="pt-0 overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="pb-3 pr-4 text-left">
                      <input
                        type="checkbox"
                        checked={selected.length === filtered.length && filtered.length > 0}
                        onChange={toggleAll}
                        className="rounded accent-gray-900 w-3.5 h-3.5 cursor-pointer"
                      />
                    </th>
                    {['Name', 'Email', 'Company', 'Status', 'Actions'].map((h) => (
                      <th
                        key={h}
                        className="pb-3 pr-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider font-body"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence>
                    {filtered.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-12 text-center">
                          <div className="flex flex-col items-center gap-2">
                            <Search size={28} className="text-gray-200" />
                            <p className="text-sm text-gray-400 font-body">No clients match your search</p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      filtered.map((client, idx) => (
                        <motion.tr
                          key={client.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ delay: idx * 0.04 }}
                          className={`border-b border-gray-50 last:border-0 hover:bg-gray-50/60 transition-colors group ${
                            selected.includes(client.id) ? 'bg-neon/4' : ''
                          }`}
                        >
                          <td className="py-3.5 pr-4">
                            <input
                              type="checkbox"
                              checked={selected.includes(client.id)}
                              onChange={() => toggleSelect(client.id)}
                              className="rounded accent-gray-900 w-3.5 h-3.5 cursor-pointer"
                            />
                          </td>
                          <td className="py-3.5 pr-4">
                            <div className="flex items-center gap-2.5">
                              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center text-xs font-bold text-gray-600">
                                {client.name.split(' ').map((n) => n[0]).join('')}
                              </div>
                              <span className="text-sm font-body font-medium text-gray-800 whitespace-nowrap">
                                {client.name}
                              </span>
                            </div>
                          </td>
                          <td className="py-3.5 pr-4">
                            <span className="text-sm text-gray-500 font-body">{client.email}</span>
                          </td>
                          <td className="py-3.5 pr-4">
                            <span className="text-sm font-body text-gray-700 font-medium">{client.company}</span>
                          </td>
                          <td className="py-3.5 pr-4">
                            <StatusBadge status={client.status} />
                          </td>
                          <td className="py-3.5">
                            <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={() => setPreviewClient(client)}
                                className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
                                title="Preview email"
                              >
                                <Eye size={14} />
                              </button>
                              <button
                                className="p-1.5 rounded-lg hover:bg-neon/10 text-gray-400 hover:text-yellow-700 transition-colors"
                                title="Send survey"
                              >
                                <Send size={14} />
                              </button>
                              <button
                                className="p-1.5 rounded-lg hover:bg-blue-50 text-gray-400 hover:text-blue-500 transition-colors"
                                title="Send reminder"
                              >
                                <Bell size={14} />
                              </button>
                            </div>
                          </td>
                        </motion.tr>
                      ))
                    )}
                  </AnimatePresence>
                </tbody>
              </table>
            </CardContent>
          </Card>
        </motion.div>

      </motion.div>

      <EmailPreviewModal
        isOpen={!!previewClient}
        onClose={() => setPreviewClient(null)}
        client={previewClient}
        surveyType={surveyType}
      />
    </>
  )
}
