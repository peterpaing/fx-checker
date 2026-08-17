"use client"

import { useEffect, useState } from "react"
import { useExchange } from "@/app/component/ExchangeContext"
import { RiDeleteBin7Line } from "react-icons/ri"

function formatTime(dateString: string, now: Date) {
  const date = new Date(dateString)

  const difference = now.getTime() - date.getTime()

  const minutes = Math.floor(difference / (1000 * 60))
  const hours = Math.floor(difference / (1000 * 60 * 60))
  const days = Math.floor(difference / (1000 * 60 * 60 * 24))

  if (minutes < 60) {
    return `${minutes}M`
  }

  if (hours < 24) {
    return `${hours}H`
  }

  if (days < 7) {
    return `${days}D`
  }

  return date.toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
  })
}

export default function Log() {
  const {
    logs,
    handleRemoveLog,
    handleClearLogs,
  } = useExchange()

  const [now, setNow] = useState(new Date())

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date())
    }, 60000)

    return () => clearInterval(interval)
  }, [])

  if (!logs.length) {
    return (
      <div className="w-full max-w-[700px] p-4 mx-auto text-center my-10 md:my-18">
        <h3 className="text-base mb-4">
          No conversions logged yet
        </h3>

        <p className="text-sm text-neutral-400">
          Every conversion is recorded here automatically when you tap
          LOG CONVERSION. Your log is private to this session and this
          browser.
        </p>
      </div>
    )
  }

  return (
    <section className="w-6/7 max-w-[1036px] my-6 px-4 pt-2 pb-4 bg-neutral-900 mx-auto rounded-xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 px-4 pt-4">
        <h3 className="text-base">
          CONVERSION LOG
        </h3>

        <div className="flex justify-between md:justify-end items-center gap-6">
          <p className="text-sm text-neutral-400">
            {logs.length} LOGGED
          </p>

          <button
            type="button"
            onClick={handleClearLogs}
            className="w-[93px] h-[30px] text-xs text-neutral-400
            border border-neutral-600 rounded-lg
            transition-all duration-200
            active:scale-95
            focus:outline-none
            focus-visible:ring-2
            focus-visible:ring-lime-400
            focus-visible:ring-offset-2
            focus-visible:ring-offset-black"
          >
            CLEAR ALL
          </button>
        </div>
      </div>

      {logs.map((log) => (
        <div
          key={log.id}
          className="p-4 flex justify-between items-center mt-4 bg-neutral-800 rounded-xl"
        >
          <div className="flex gap-4">
            <p className="text-sm text-neutral-400">
              {formatTime(log.date, now)}
            </p>

            <p className="text-sm">
              {log.fromCurrency} → {log.toCurrency}
            </p>
          </div>

          <div className="flex items-center gap-6">
            <p className="text-base">
              {log.amount}
            </p>

            <p className="text-base text-lime-400">
              {log.receiveAmount}
            </p>

            <button
              type="button"
              aria-label={`Delete ${log.fromCurrency} to ${log.toCurrency} conversion`}
              onClick={() => handleRemoveLog(log.id)}
              className="w-[32px] h-[32px] border border-neutral-600 rounded-lg
              transition-all duration-200
              active:scale-95
              focus:outline-none
              focus-visible:ring-2
              focus-visible:ring-lime-400
              focus-visible:ring-offset-2
              focus-visible:ring-offset-black"
            >
              <RiDeleteBin7Line
                aria-hidden="true"
                className="mx-auto"
              />
            </button>
          </div>
        </div>
      ))}
    </section>
  )
}