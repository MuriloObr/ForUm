import { useRouteError } from 'react-router-dom'
import { Error } from '../components/Error'
import { Header } from '../components/Header'

export function ErrorPage() {
  const error = useRouteError()

  return (
    <div className="flex h-screen-d flex-col">
      <Header />
      <Error error={error} context="route" />
    </div>
  )
}
