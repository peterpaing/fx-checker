"use client"

import { useExchange } from "@/app/component/ExchangeContext"
import { useEffect, useState } from "react"

type MarketRate = {
  base: string
  quote: string
  date: string
  rate: number
}

export default function MarketStats(){

  const { fromCurrency, toCurrency } = useExchange()
  const [marketStats,setMarketStats] = useState<MarketRate[]>([])
  const [range, setRange] = useState("1M")
  const ranges = ["1D", "1W", "1M", "3M", "1Y", "5Y"]

  const today = new Date()
  const previousDay = new Date(today)

  previousDay.setDate(today.getDate() - 1)

  const todayString = today.toISOString().split("T")[0]
  const previousDayString = previousDay.toISOString().split("T")[0]

  useEffect(() => {
    async function marketRate() {
      const res = await fetch(
        `https://api.frankfurter.dev/v2/rates?base=${fromCurrency}&quotes=${toCurrency}&from=${previousDayString}&to=${todayString}`
      )

      if (!res.ok) {
        throw new Error(`Failed to fetch rate: ${res.status}`)
      }

      const data = await res.json()

      console.log(data)
      setMarketStats(data)
    }

    marketRate()
  }, [fromCurrency, toCurrency])

  const open = marketStats[0]?.rate ?? 0
  const last = marketStats[marketStats.length - 1]?.rate ?? 0
  const change = last - open
  const percentChange = open ? (change / open) * 100 : 0

  const stats = [
    {
      label: "OPEN",
      value: open.toFixed(4),
    },
    {
      label: "LAST",
      value: last.toFixed(4),
    },
    {
      label: "CHANGE",
      value: `${change >= 0 ? "+" : ""}${change.toFixed(4)}`,
      color: change >= 0 ? "text-lime-400" : "text-red-400"
    },
    {
      label: "% CHANGE",
      value: `${percentChange >= 0 ? "▲ +" : "▼ "}${percentChange.toFixed(2)}%`,
      color: change >= 0 ? "text-lime-400" : "text-red-400"
    }
  ]

  return (
    <section className="w-full lg:mx-auto md:px-6 md:w-[650px] lg:w-[1036px] py-2 px-4 my-6">
        <div className="lg:flex lg:items-center justify-between">
      <div className="w-full lg:w-3/5 grid grid-cols-2 md:grid-cols-4 gap-2">
        {stats.map((stat) => (
          <div key={stat.label}className="w-full md:w-[140px] md:h-[81px] p-4 flex flex-col items-center justify-center rounded-xl bg-neutral-900">
            <p className="text-xs text-neutral-400"> {stat.label}</p>
            <p className={`mt-2 text-sm whitespace-nowrap ${stat.color ?? ""}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="w-[286px] mt-5 lg:mt-0 flex rounded-lg bg-neutral-900 p-1">
        {ranges.map((item) => (
            <button
            key={item}
            type="button"
            onClick={() => setRange(item)}
            className={`px-4 py-2 text-xs rounded-md ${
                range === item
                ? "bg-neutral-700 text-white"
                : "text-neutral-400"
            }`}
            >
            {item}
            </button>
        ))}
        </div>
        </div>
    </section>
  )
}