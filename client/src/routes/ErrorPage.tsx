import { Link, isRouteErrorResponse, useRouteError } from 'react-router-dom'

export function ErrorPage() {
  const error = useRouteError()

  if (isRouteErrorResponse(error)) {
    return (
      <div className="w-full h-screen flex flex-col items-center justify-center gap-4 text-black">
        <h1 className="text-4xl font-bold">
          Oops! <span>{error.status}</span>
        </h1>
        <p className="text-xl italic">{error.statusText}</p>
        {error.data?.message && <span>{error.data.message}</span>}

        <button className="rounded bg-blue-500 text-white p-3">
          <Link to={'/'}>Go Back to Home Page</Link>
        </button>
      </div>
    )
  }

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center gap-4 text-black">
      <h1 className="text-4xl font-bold">Oops! Algo deu errado.</h1>
      <p className="text-xl italic">
        {error instanceof Error ? error.message : 'Unexpected error'}
      </p>
      <button className="rounded bg-blue-500 text-white p-3">
        <Link to={'/'}>Go Back to Home Page</Link>
      </button>
    </div>
  )
}
