"use client"

import { useExchange } from "@/app/component/ExchangeContext"
import { IoSwapVerticalOutline } from "react-icons/io5"
import { FaRegStar, FaStar } from "react-icons/fa6"
import { VscArrowSwap } from "react-icons/vsc"
import Currency from "@/app/component/Currency"
import { useEffect, useState } from "react"

export default function ExchangeInput() {
  const {
    amount,
    fromCurrency,
    toCurrency,
    setAmount,
    setFromCurrency,
    setToCurrency,
    favorites,
    handleFavorite,
    handleLog,
  } = useExchange()

  const [rate, setRate] = useState(0)
  const [receiveAmount, setReceiveAmount] = useState("")
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchRate() {
      setError(null)

      try {
        const res = await fetch(
          `https://api.frankfurter.dev/v2/rates?base=${fromCurrency}&quotes=${toCurrency}`
        )

        if (!res.ok) {
          throw new Error(`Failed to fetch rate: ${res.status}`)
        }

        const data = await res.json()

        setRate(data[0]?.rate ?? 0)
      } catch {
        setRate(0)
        setError("Unable to load exchange rate.")
      }
    }

    fetchRate()
  }, [fromCurrency, toCurrency])

  const isFavorite = favorites.some(
    (favorite) =>
      favorite.fromCurrency === fromCurrency &&
      favorite.toCurrency === toCurrency
  )

  const exchangeRate = rate
    ? `1 ${fromCurrency} = ${rate.toFixed(4)} ${toCurrency}`
    : "Loading..."

  function swapCurrencies() {
    const oldAmount = amount
    const oldReceiveAmount = receiveAmount

    setFromCurrency(toCurrency)
    setToCurrency(fromCurrency)
    setAmount(oldReceiveAmount)
    setReceiveAmount(oldAmount)
  }

  function handleSendChange(value: string) {
    setAmount(value)

    if (rate && value) {
      setReceiveAmount((Number(value) * rate).toFixed(2))
    } else {
      setReceiveAmount("")
    }
  }

  function handleReceiveChange(value: string) {
    setReceiveAmount(value)

    if (rate && value) {
      setAmount((Number(value) / rate).toFixed(2))
    } else {
      setAmount("")
    }
  }

  return (
    <section className="w-full mt-8 px-4">
      <div className="w-full max-w-[440px] md:max-w-[1036px] mx-auto">
        <h2 className="text-base uppercase mb-4 lg:my-4">
          Check the rate
        </h2>

        <div className="w-full max-w-[440px] md:max-w-[1036px] mx-auto rounded-3xl bg-neutral-900 p-4 md:p-5">
          <div className="md:flex md:gap-4 md:justify-between md:items-center">

            <div className="w-full md:w-[450px] mx-auto rounded-2xl border border-neutral-700 bg-neutral-800 p-4 md:p-5 lg:p-4">
              <label
                htmlFor="send"
                className="sr-only"
              >
                Send amount
              </label>

              <p className="text-sm uppercase text-neutral-400 mb-3">
                Send
              </p>

              <div className="w-full flex items-end justify-between gap-3">
                <input
                  id="send"
                  type="number"
                  name="send"
                  value={amount}
                  placeholder="0.00"
                  onChange={(e) => handleSendChange(e.target.value)}
                  className="
                    w-full min-w-0
                    rounded-lg
                    bg-transparent
                    text-2xl
                    font-semibold
                    outline-none
                    focus:ring-1
                    focus:ring-lime-400
                    [appearance:textfield]
                    [&::-webkit-outer-spin-button]:appearance-none
                    [&::-webkit-inner-spin-button]:appearance-none
                  "
                />

                <Currency type="from" />
              </div>
            </div>

            <div className="flex justify-center py-3">

              <button
                type="button"
                aria-label="Swap currencies"
                onClick={swapCurrencies}
                className="md:hidden flex h-12 w-12 items-center justify-center rounded-xl
                border border-neutral-800 bg-neutral-700 text-xl transition-all duration-200 ease-in-out
                hover:bg-neutral-600 active:scale-95
                focus:outline-none focus-visible:ring-2 focus:ring-lime-400
                focus:ring-offset-2 focus:ring-offset-black"
              >
                <IoSwapVerticalOutline />
              </button>

              <button
                type="button"
                aria-label="Swap currencies"
                onClick={swapCurrencies}
                className="hidden md:flex w-12 h-12 items-center justify-center
                rounded-xl border border-neutral-800 bg-neutral-700 text-xl text-white
                transition-all duration-300 ease-in-out hover:bg-neutral-600 active:scale-95
                focus:outline-none focus-visible:ring-2 focus:ring-lime-400
                focus:ring-offset-2 focus:ring-offset-black"
              >
                <VscArrowSwap />
              </button>

            </div>

            <div className="w-full md:w-[450px] mx-auto rounded-2xl border border-neutral-700 bg-neutral-800 p-4 md:p-5 lg:p-4">

              <label
                htmlFor="receive"
                className="sr-only"
              >
                Receive amount
              </label>

              <p className="text-sm uppercase text-neutral-400 mb-3">
                Receive
              </p>

              <div className="w-full flex items-end justify-between gap-3">
                <input
                  id="receive"
                  type="number"
                  name="receive"
                  value={receiveAmount}
                  placeholder="0.00"
                  onChange={(e) => handleReceiveChange(e.target.value)}
                  className="
                    w-full min-w-0
                    rounded-lg
                    bg-transparent
                    text-2xl
                    font-semibold
                    outline-none
                    focus:ring-1
                    focus:ring-lime-400
                    [appearance:textfield]
                    [&::-webkit-outer-spin-button]:appearance-none
                    [&::-webkit-inner-spin-button]:appearance-none
                  "
                />

                <Currency type="to" />
              </div>
            </div>
          </div>

          <div className="mt-5 md:pt-6 pt-4 text-center border-t-2 border-neutral-700 border-dashed md:flex md:justify-between md:items-center">

            {error ? (
              <p
                className="text-xs text-red-500"
                role="alert"
              >
                {error}
              </p>
            ) : (
              <p
                className="text-xs"
                aria-live="polite"
              >
                {exchangeRate}
              </p>
            )}

            <div className="mt-4 md:mt-0 flex gap-3 justify-center">

              <button
                type="button"
                aria-pressed={isFavorite}
                onClick={() =>
                  handleFavorite(fromCurrency, toCurrency)
                }
                className="w-[117px] h-[32px] bg-lime-400
                text-neutral-900 flex items-center justify-center gap-2 rounded-lg text-xs
                leading-none
                transition-all duration-300 ease-in-out
                hover:bg-lime-600
                active:scale-95
                focus:outline-none focus-visible:ring-2 focus:ring-lime-400
                focus:ring-offset-2 focus:ring-offset-black"
              >
                {isFavorite ? (
                  <>
                    <FaStar />
                    FAVORITED
                  </>
                ) : (
                  <>
                    <FaRegStar />
                    FAVORITE
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() =>
                  handleLog(
                    fromCurrency,
                    toCurrency,
                    amount,
                    receiveAmount
                  )
                }
                className="w-[132px] h-[32px] border-2 border-lime-400
                rounded-lg whitespace-nowrap text-xs leading-none
                transition-all duration-200 ease-in-out
                hover:border-lime-600 hover:text-neutral-300
                active:scale-95
                focus:outline-none focus-visible:ring-2 focus:ring-lime-400
                focus:ring-offset-2 focus:ring-offset-black"
              >
                LOG CONVERSION
              </button>

            </div>
          </div>
        </div>
      </div>
    </section>
  )
}