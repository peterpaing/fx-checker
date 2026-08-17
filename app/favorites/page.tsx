"use client"

import { useEffect, useState } from "react"
import { useExchange } from "@/app/component/ExchangeContext"
import { FaStar } from "react-icons/fa6"
import { AiOutlineLoading3Quarters } from "react-icons/ai"

type FavoriteRate = {
  fromCurrency: string
  toCurrency: string
  rate: number
  change: number
}

export default function Favorite() {
  const { favorites, handleFavorite } = useExchange()

  const [favoriteRates, setFavoriteRates] = useState<FavoriteRate[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchFavoriteRates() {
      if (!favorites.length) {
        setFavoriteRates([])
        setIsLoading(false)
        setError(null)
        return
      }

      setIsLoading(true)
      setError(null)

      try {
        const today = new Date()
        const previousDay = new Date(today)

        previousDay.setDate(today.getDate() - 1)

        const todayString = today.toISOString().split("T")[0]
        const previousDayString =
          previousDay.toISOString().split("T")[0]

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
            const currentRate =
              data[1]?.rate ?? previousRate

            const change = previousRate
              ? ((currentRate - previousRate) / previousRate) *
                100
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
      } catch {
        setFavoriteRates([])
        setError("Unable to load favorite rates.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchFavoriteRates()
  }, [favorites])

  if (!favorites.length) {
    return (
      <div className="w-full max-w-[460px] p-4 mx-auto text-center my-10 md:my-18">
        <h3 className="text-base mb-4">
          No pinned pairs yet
        </h3>

        <p className="text-sm text-neutral-400">
          Pin a pair to track its rate here. Tap the star icon
          on any conversion or comparison row.
        </p>
      </div>
    )
  }

  return (
    <section className="w-6/7 max-w-[1036px] my-6 px-4 pt-2 pb-4 bg-neutral-900 mx-auto rounded-xl">
      <div className="flex justify-between items-center px-4 pt-4">
        <h3 className="text-base">
          PINNED PAIRS
        </h3>

        <p className="text-sm text-neutral-400">
          {favorites.length}{" "}
          {favorites.length === 1
            ? "FAVORITE"
            : "FAVORITES"}
        </p>
      </div>

      {isLoading ? (
        <div
          role="status"
          aria-live="polite"
          className="flex items-center justify-center gap-2 py-10 text-green-500"
        >
          <AiOutlineLoading3Quarters
            aria-hidden="true"
            className="animate-spin"
          />

          <p>Loading favorite rates</p>
        </div>
      ) : error ? (
        <div
          role="alert"
          className="py-10 text-center"
        >
          <p className="text-sm text-red-400">
            {error}
          </p>

          <p className="text-sm text-lime-400 mt-1">
            Please refresh the page and try again.
          </p>
        </div>
      ) : (
        favoriteRates.map((favorite) => (
          <div
            key={`${favorite.fromCurrency}-${favorite.toCurrency}`}
            className="p-4 flex justify-between items-center mt-4 bg-neutral-800 rounded-xl"
          >
            <p className="text-sm">
              {favorite.fromCurrency} →{" "}
              {favorite.toCurrency}
            </p>

            <div className="flex items-center gap-6">
              <div className="flex flex-col items-center">
                <p className="text-base">
                  {favorite.rate.toFixed(4)}
                </p>

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
                aria-label={`Remove ${favorite.fromCurrency} to ${favorite.toCurrency} from favorites`}
                aria-pressed={true}
                onClick={() =>
                  handleFavorite(
                    favorite.fromCurrency,
                    favorite.toCurrency
                  )
                }
                className="w-[32px] h-[32px] border border-lime-400 rounded-lg
                transition-all duration-200
                active:scale-95
                focus:outline-none
                focus-visible:ring-2
                focus-visible:ring-lime-400
                focus-visible:ring-offset-2
                focus-visible:ring-offset-black"
              >
                <FaStar
                  aria-hidden="true"
                  className="mx-auto text-lime-400"
                />
              </button>
            </div>
          </div>
        ))
      )}
    </section>
  )
}