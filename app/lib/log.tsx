export type Log = {
  id: string,
  fromCurrency: string
  toCurrency: string
  amount: string
  receiveAmount: string
  date: string
}

export function getLogs(): Log[] {
  const storedLogs = localStorage.getItem("logs")

  return storedLogs ? JSON.parse(storedLogs) : []
}

export function saveLog(
  fromCurrency: string,
  toCurrency: string,
  amount: string,
  receiveAmount: string,
) {
  const logs = getLogs()

  const newLog: Log = {
    id: crypto.randomUUID(),
    fromCurrency,
    toCurrency,
    amount,
    receiveAmount,
    date: new Date().toISOString(),
  }

  localStorage.setItem(
    "logs",
    JSON.stringify([...logs, newLog])
  )

  return newLog
}

export function removeLog(id: string): Log[] {
  const logs = getLogs()

  const updatedLogs = logs.filter(
    (log) => log.id !== id
  )

  localStorage.setItem(
    "logs",
    JSON.stringify(updatedLogs)
  )

  return updatedLogs
}