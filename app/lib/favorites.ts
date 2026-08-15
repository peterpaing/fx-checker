export type Favorite = {
  fromCurrency: string
  toCurrency: string
}

export function getFavorites(): Favorite[] {
  const storedFavorites = localStorage.getItem("favorites")

  return storedFavorites ? JSON.parse(storedFavorites) : []
}

export function toggleFavorite(
  fromCurrency: string,
  toCurrency: string
): Favorite[] {
  const favorites = getFavorites()

  const exists = favorites.some(
    (favorite) =>
      favorite.fromCurrency === fromCurrency &&
      favorite.toCurrency === toCurrency
  )

  const updatedFavorites = exists
    ? favorites.filter(
        (favorite) =>
          !(
            favorite.fromCurrency === fromCurrency &&
            favorite.toCurrency === toCurrency
          )
      )
    : [...favorites,{fromCurrency,toCurrency}]

  localStorage.setItem(
    "favorites",
    JSON.stringify(updatedFavorites)
  )

  return updatedFavorites
}