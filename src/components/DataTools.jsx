import { useRef, useState } from 'react'

export default function DataTools({
  transactions,
  onImport,
  onReset,
  onClear,
}) {
  const fileInputRef = useRef(null)
  const [message, setMessage] = useState('')

  const exportTransactions = () => {
    const file = new Blob([JSON.stringify(transactions, null, 2)], {
      type: 'application/json',
    })
    const url = URL.createObjectURL(file)
    const link = document.createElement('a')
    link.href = url
    link.download = 'finance-transactions.json'
    link.click()
    URL.revokeObjectURL(url)
    setMessage('Exported your transactions as JSON.')
  }

  const handleImport = (event) => {
    const file = event.target.files?.[0]

    if (!file) {
      return
    }

    const reader = new FileReader()

    reader.onload = async () => {
      try {
        const importedTransactions = JSON.parse(reader.result)

        if (!Array.isArray(importedTransactions)) {
          throw new Error('Imported file must contain an array.')
        }

        await onImport(importedTransactions)
        setMessage(`Imported ${importedTransactions.length} transactions.`)
      } catch (error) {
        setMessage(`Import failed: ${error.message}`)
      } finally {
        event.target.value = ''
      }
    }

    reader.readAsText(file)
  }

  return (
    <section className="rounded-[2rem] border border-white/70 bg-slate-950 p-5 text-white shadow-xl shadow-slate-950/20">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.22em] text-emerald-300">
            Data tools
          </p>
          <h2 className="mt-2 text-2xl font-black">Own your records</h2>
          <p className="mt-2 max-w-2xl text-sm font-medium text-slate-300">
            Export a backup, import another JSON file, reset demo data, or
            clear everything from localStorage.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className="rounded-2xl bg-white px-4 py-3 text-sm font-black text-slate-950 transition hover:-translate-y-0.5"
            onClick={exportTransactions}
          >
            Export JSON
          </button>
          <button
            type="button"
            className="rounded-2xl bg-emerald-400 px-4 py-3 text-sm font-black text-slate-950 transition hover:-translate-y-0.5"
            onClick={() => fileInputRef.current?.click()}
          >
            Import JSON
          </button>
          <button
            type="button"
            className="rounded-2xl bg-slate-800 px-4 py-3 text-sm font-black text-white transition hover:bg-slate-700"
            onClick={async () => {
              await onReset()
              setMessage('Demo data restored from the backend.')
            }}
          >
            Reset demo
          </button>
          <button
            type="button"
            className="rounded-2xl bg-rose-500 px-4 py-3 text-sm font-black text-white transition hover:bg-rose-400"
            onClick={async () => {
              await onClear()
              setMessage('Transactions cleared on the backend.')
            }}
          >
            Clear all
          </button>
        </div>
      </div>

      <input
        ref={fileInputRef}
        className="hidden"
        type="file"
        accept="application/json"
        onChange={handleImport}
      />

      {message && (
        <p className="mt-4 rounded-2xl bg-white/10 px-4 py-3 text-sm font-bold text-slate-200">
          {message}
        </p>
      )}
    </section>
  )
}
