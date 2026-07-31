import { Link, isRouteErrorResponse, useRouteError } from 'react-router-dom'

export function ErrorPage() {
  const error = useRouteError()
  console.log(error)

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
  } else if (error instanceof Error) {
    return (
      <div>
        <h1>Oops! Unexpected Error</h1>
        <p>Something went wrong.</p>
        <p>
          <i>{error.message}</i>
        </p>
      </div>
    )
  } else {
    return <></>
  }
}
