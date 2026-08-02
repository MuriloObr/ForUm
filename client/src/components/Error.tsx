import { AxiosError } from 'axios'

function getMessage(error: unknown): string {
  if (error instanceof AxiosError) {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          return 'Você precisa estar logado para acessar esta página!'
        case 404:
          return 'Não encontramos o que você estava procurando.'
        case 500:
          return 'Algo deu errado no servidor. Tente novamente em instantes.'
        default:
          return 'Algo deu errado ao carregar os dados.'
      }
    }
    return 'Não foi possível conectar ao servidor.'
  }

  return 'Algo deu errado ao carregar os dados.'
}

export function Error({ error }: { error: unknown }) {
  return (
    <div className="h-5/6 text-black text-3xl flex flex-col gap-3 items-center justify-center">
      <span>{getMessage(error)}</span>
      {error instanceof AxiosError && error.message ? (
        <span className="opacity-80 text-xl">{`${error.message}`}</span>
      ) : (
        ''
      )}
    </div>
  )
}
