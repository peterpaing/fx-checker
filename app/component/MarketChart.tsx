"use client"

import { useExchange } from "@/app/component/ExchangeContext"
import { useEffect, useState } from "react"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
} from "recharts"
import { AiOutlineLoading3Quarters } from "react-icons/ai"

type MarketChartProps = {
  range: string
}

type MarketData = {
  date: string
  rate: number
}

export default function MarketChart({ range }: MarketChartProps) {
  const { fromCurrency, toCurrency } = useExchange()

  const [marketData, setMarketData] = useState<MarketData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchMarketData() {
      setIsLoading(true)
      setError(null)

      try {
        const today = new Date()
        const startDate = new Date(today)

        if (range === "1D") {
          startDate.setDate(today.getDate() - 1)
        }

        if (range === "1W") {
          startDate.setDate(today.getDate() - 7)
        }

        if (range === "1M") {
          startDate.setMonth(today.getMonth() - 1)
        }

        if (range === "3M") {
          startDate.setMonth(today.getMonth() - 3)
        }

        if (range === "1Y") {
          startDate.setFullYear(today.getFullYear() - 1)
        }

        if (range === "5Y") {
          startDate.setFullYear(today.getFullYear() - 5)
        }

        const todayString = today.toISOString().split("T")[0]
        const startDateString = startDate.toISOString().split("T")[0]

        const res = await fetch(
          `https://api.frankfurter.dev/v2/rates?base=${fromCurrency}&quotes=${toCurrency}&from=${startDateString}&to=${todayString}`
        )

        if (!res.ok) {
          throw new Error(
            `Failed to fetch market data: ${res.status}`
          )
        }

        const data = await res.json()

        setMarketData(data)
      } catch {
        setMarketData([])
        setError("Unable to load market chart.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchMarketData()
  }, [range, fromCurrency, toCurrency])

  const latestRate =
    marketData[marketData.length - 1]?.rate ?? 0

  const latestDate =
    marketData[marketData.length - 1]?.date ?? ""

  const formattedDate = latestDate
    ? new Date(latestDate)
        .toLocaleString("en-US", {
          month: "short",
          day: "numeric",
          timeZoneName: "short",
        })
        .replace(",", "")
        .toUpperCase()
    : ""

  return (
    <div className="w-full px-4 my-6">
      <div className="w-full rounded-2xl bg-neutral-900 p-5">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm">
            {fromCurrency}/{toCurrency}
          </p>

          {!isLoading && !error && marketData.length > 0 && (
            <p
              className="text-[10px] text-neutral-400 whitespace-nowrap"
              aria-label={`Latest rate ${latestRate.toFixed(
                4
              )}, ${formattedDate}`}
            >
              {latestRate.toFixed(4)} · {formattedDate}
            </p>
          )}
        </div>

        {isLoading ? (
          <div
            role="status"
            aria-live="polite"
            className="w-full h-[280px] flex items-center justify-center gap-2 text-base text-green-500"
          >
            <AiOutlineLoading3Quarters
              aria-hidden="true"
              className="animate-spin"
            />

            <p>Loading chart</p>
          </div>
        ) : error ? (
          <div
            role="alert"
            className="w-full h-[280px] flex flex-col items-center justify-center gap-2"
          >
            <p className="text-sm text-red-400">
              {error}
            </p>

            <p className="text-sm text-lime-400">
              Please refresh the page and try again.
            </p>
          </div>
        ) : marketData.length === 0 ? (
          <div
            role="status"
            className="w-full h-[280px] flex items-center justify-center"
          >
            <p className="text-sm text-neutral-400">
              No market data available.
            </p>
          </div>
        ) : (
          <>
            <p className="sr-only">
              Exchange rate history for {fromCurrency} to{" "}
              {toCurrency} over the selected {range} period.
              The latest rate is {latestRate.toFixed(4)}.
            </p>

            <div
              role="img"
              aria-label={`${fromCurrency} to ${toCurrency} exchange rate chart for the selected ${range} period`}
              className="w-full h-[280px] [&_svg:focus]:outline-none"
            >
              <ResponsiveContainer
                width="100%"
                height="100%"
              >
                <AreaChart
                  data={marketData}
                  margin={{
                    top: 10,
                    right: 10,
                    left: 0,
                    bottom: 0,
                  }}
                >
                  <defs>
                    <linearGradient
                      id="marketGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="0%"
                        stopColor="#a3e600"
                        stopOpacity={0.7}
                      />

                      <stop
                        offset="100%"
                        stopColor="#a3e600"
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>

                  <CartesianGrid
                    vertical={false}
                    stroke="#333"
                    strokeDasharray="2 4"
                  />

                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 10 }}
                    tickLine={false}
                    axisLine={false}
                    minTickGap={50}
                    tickFormatter={(date) =>
                      new Date(
                        String(date)
                      ).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })
                    }
                  />

                  <YAxis
                    domain={["auto", "auto"]}
                    tick={{ fontSize: 10 }}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) =>
                      value.toFixed(4)
                    }
                    width={45}
                  />

                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#171717",
                      border: "1px solid #444",
                      borderRadius: "8px",
                      padding: "8px 10px",
                      fontSize: "12px",
                    }}
                    labelFormatter={(date) =>
                      new Date(
                        String(date)
                      ).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })
                    }
                    formatter={(value) => [
                      Number(value ?? 0).toFixed(4),
                      `${fromCurrency}/${toCurrency}`,
                    ]}
                  />

                  <Area
                    type="monotone"
                    dataKey="rate"
                    stroke="#a3e600"
                    strokeWidth={2}
                    fill="url(#marketGradient)"
                    isAnimationActive={false}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </>
        )}
      </div>
    </div>
  )
}