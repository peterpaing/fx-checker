"use client"

import { createContext, useContext, useEffect, useState } from "react"
import {
  getFavorites,
  toggleFavorite,
  type Favorite,
} from "@/app/lib/favorites"
import {
  getLogs,
  saveLog,
  removeLog,
  type Log,
} from "@/app/lib/log"

type ExchangeContextType = {
  amount: string
  fromCurrency: string
  toCurrency: string
  favorites: Favorite[]
  logs: Log[]
  setAmount: (amount: string) => void
  setFromCurrency: (currency: string) => void
  setToCurrency: (currency: string) => void
  handleFavorite: (fromCurrency: string, toCurrency: string) => void
  handleLog: (
    fromCurrency: string,
    toCurrency: string,
    amount: string,
    receiveAmount: string
  ) => void
  handleRemoveLog: (id: string) => void
}

const ExchangeContext = createContext<ExchangeContextType | null>(null)

export function ExchangeProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [amount, setAmount] = useState("")
  const [fromCurrency, setFromCurrency] = useState("USD")
  const [toCurrency, setToCurrency] = useState("EUR")
  const [favorites, setFavorites] = useState<Favorite[]>([])
  const [logs, setLogs] = useState<Log[]>([])

  useEffect(() => {
    setFavorites(getFavorites())
    setLogs(getLogs())
  }, [])

  function handleFavorite(
    fromCurrency: string,
    toCurrency: string
  ) {
    const updatedFavorites = toggleFavorite(
      fromCurrency,
      toCurrency
    )

    setFavorites(updatedFavorites)
  }

  function handleLog(
    fromCurrency: string,
    toCurrency: string,
    amount: string,
    receiveAmount: string
  ) {
    const updateLog = saveLog(
      fromCurrency,
      toCurrency,
      amount,
      receiveAmount
    )

    setLogs((currentLogs) => [...currentLogs, updateLog])
  }

  function handleRemoveLog(id: string) {
  const updatedLogs = removeLog(id)
  setLogs(updatedLogs)
}

  return (
    <ExchangeContext.Provider
      value={{
        amount,
        fromCurrency,
        toCurrency,
        favorites,
        logs,
        setAmount,
        setFromCurrency,
        setToCurrency,
        handleFavorite,
        handleLog,
        handleRemoveLog
      }}
    >
      {children}
    </ExchangeContext.Provider>
  )
}

export function useExchange() {
  const context = useContext(ExchangeContext)

  if (!context) {
    throw new Error("useExchange must be used inside ExchangeProvider")
  }

  return context
}