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
  const { logs, handleRemoveLog } = useExchange()

  const [now, setNow] = useState(new Date())

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date())
    }, 60000)

    return () => clearInterval(interval)
  }, [])

  if (!logs.length) {
    return null
  }

  return (
    <section className="w-6/7 max-w-[1036px] my-6 px-4 pt-2 pb-4 bg-neutral-900 mx-auto rounded-xl">
    <div className="flex justify-between items-center px-4 pt-4">
        <h3 className="text-base">CONVERSION LOG</h3>
        <div className="flex items-center gap-6">
        <p className="text-sm text-neutral-400">{logs.length} LOGGED</p>
        <button
        className="w-[93px] h-[30px] text-xs text-neutral-400 border-1 border-neutral-600 rounded-lg">
            CLEAR ALL
        </button>
        </div>
      </div>

      {logs.map((log) => (
        <div key={log.id} className="p-4 flex justify-between items-center mt-4 bg-neutral-800 rounded-xl">
        <div className="flex gap-4">
            <p className="text-sm">{formatTime(log.date, now)}</p>
            <p className="text-sm">{log.fromCurrency} → {log.toCurrency} </p>
        </div>

        <div className="flex items-center gap-6">
            <p className="text-base">{log.amount}</p>
            <p className="text-base text-lime-400">{log.receiveAmount}</p>
            <button
            type="button"
            onClick={() => handleRemoveLog(log.id)}
            className="w-[32px] h-[32px] border-1 border-neutral-600 rounded-lg"
            >
            <RiDeleteBin7Line className="mx-auto" />
          </button>
        </div>
        </div>
      ))}
    </section>
  )
}