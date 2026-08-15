"use client"

import { useEffect, useState } from "react"
import { useExchange } from "@/app/component/ExchangeContext"
import { FaStar } from "react-icons/fa6"

type FavoriteRate = {
  fromCurrency: string
  toCurrency: string
  rate: number
  change: number
}

export default function Favorite() {
  const { favorites, handleFavorite } = useExchange()
  const [favoriteRates, setFavoriteRates] = useState<FavoriteRate[]>([])

  useEffect(() => {
    async function fetchFavoriteRates() {
      if (!favorites.length) {
        setFavoriteRates([])
        return
      }

      const today = new Date()
      const previousDay = new Date(today)

      previousDay.setDate(today.getDate() - 1)

      const todayString = today.toISOString().split("T")[0]
      const previousDayString = previousDay.toISOString().split("T")[0]

      const rates = await Promise.all(
        favorites.map(async (favorite) => {
          const res = await fetch(
            `https://api.frankfurter.dev/v2/rates?base=${favorite.fromCurrency}&quotes=${favorite.toCurrency}&from=${previousDayString}&to=${todayString}`
          )

          if (!res.ok) {
            throw new Error(
              `Failed to fetch rate: ${res.status}`
            )
          }

          const data = await res.json()

          const previousRate = data[0]?.rate ?? 0
          const currentRate = data[1]?.rate ?? previousRate

          const change =
            previousRate
              ? ((currentRate - previousRate) / previousRate) * 100
              : 0

          return {
            fromCurrency: favorite.fromCurrency,
            toCurrency: favorite.toCurrency,
            rate: currentRate,
            change,
          }
        })
      )

      setFavoriteRates(rates)
    }

    fetchFavoriteRates()
  }, [favorites])


  if (!favorites.length) {
    return (
      <div className="w-[460px] mx-auto text-center my-18">
        <h3 className="text-base mb-4">No pinned pairs yet</h3>
        <p className="text-sm text-neutral-400">Pin a pair to track its rate here. Tap the star icon on any conversion or comparison row.</p>
        </div>
    )
  }

  return (
    <section className="w-6/7 max-w-[1036px] my-6 px-4 pt-2 pb-4 bg-neutral-900 mx-auto rounded-xl">
      <div className="flex justify-between items-center px-4 pt-4">
        <h3 className="text-base">PINNED PAIRS</h3>
        <p className="text-sm text-neutral-400">{favorites.length} {favorites.length===1 ? 'FAVORITE' : 'FAVORITES'}</p>
      </div>
    {favoriteRates.map((favorite) => (
        <div
          key={`${favorite.fromCurrency}-${favorite.toCurrency}`}
          className="p-4 flex justify-between items-center mt-4 bg-neutral-800 rounded-xl"
        >
          <p className="text-sm"> {favorite.fromCurrency} → {favorite.toCurrency}</p>
          <div className="flex items-center gap-6">
            <div className="flex flex-col items-center">
          <p className="text-base"> {favorite.rate.toFixed(4)}</p>
          <p
            className={`text-xs mt-1 ${
              favorite.change >= 0
                ? "text-green-500"
                : "text-red-500"
            }`}
          >
            {favorite.change >= 0 ? "▲" : "▼"}{" "}
            {favorite.change >= 0 ? "+" : ""}
            {favorite.change.toFixed(2)}%
          </p>
            </div>
          <button
            type="button"
            onClick={() =>
              handleFavorite(
                favorite.fromCurrency,
                favorite.toCurrency
              )
            }
            className="w-[32px] h-[32px] border-1 border-lime-400 rounded-lg"
          >
            <FaStar className="mx-auto text-lime-400"/>
          </button>
          </div>
        </div>
      ))}
    </section>
  )
}