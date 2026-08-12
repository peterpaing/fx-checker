"use client"

import { createContext, useContext, useState } from "react"

type ExchangeContextType = {
  amount: string;
  fromCurrency: string;
  toCurrency: string;
  setAmount: (amount: string) => void
  setFromCurrency: (currency: string) => void
  setToCurrency: (currency: string) => void
}

const ExchangeContext = createContext<ExchangeContextType | null>(null)

export function ExchangeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [amount, setAmount] = useState("")
  const [fromCurrency, setFromCurrency] = useState("USD")
  const [toCurrency, setToCurrency] = useState("EUR")

  return (
    <ExchangeContext.Provider
      value={{
        amount,
        fromCurrency,
        toCurrency,
        setAmount,
        setFromCurrency,
        setToCurrency,
      }}
    >
      {children}
    </ExchangeContext.Provider>
  )
}

export function useExchange() {
  const context = useContext(ExchangeContext);

  if (!context) {
    throw new Error("useExchange must be used inside ExchangeProvider")
  }

  return context
}