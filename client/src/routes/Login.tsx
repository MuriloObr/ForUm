import { useRef, useState } from 'react'
import { AxiosError } from 'axios'
import { Form } from '../components/Form'
import { useLogin } from '../api/generated/endpoints'
import { useNavigate } from 'react-router-dom'
import { Question } from '@phosphor-icons/react'
import { MyHoverCard } from '../components/ui/MyHoverCard'
import { LoadingSubmit } from '../components/LoadingSubmit'

export function Login() {
  const userRef = useRef<HTMLInputElement>(null)
  const passwordRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()
  const [feedback, setFeedback] = useState({
    message: '',
    colorClass: 'white',
  })

  const { mutate, isLoading } = useLogin({
    mutation: {
      onSuccess: () => navigate('/profile'),
      onError: (error) => {
        if (error instanceof AxiosError && error.response === undefined) {
          setFeedback({
            message: 'Não foi possível conectar ao servidor.',
            colorClass: 'text-red-500',
          })
        } else {
          setFeedback({
            message: 'Usuário ou senha inválidos.',
            colorClass: 'text-red-500',
          })
        }
      },
    },
  })

  return (
    <Form.Root
      onSubmit={() =>
        mutate({
          data: {
            user: userRef.current?.value ?? '',
            password: passwordRef.current?.value ?? '',
          },
        })
      }
    >
      <Form.Field label="User" name="user" type="text" ref={userRef} />
      <Form.Field
        label="Password"
        name="password"
        type="password"
        ref={passwordRef}
      />
      <Form.Feedback
        message={feedback.message}
        colorClass={feedback.colorClass}
      />
      <LoadingSubmit isLoading={isLoading} />
      <MyHoverCard trigger={<Question />}>
        <span className="font-bold text-xl">Test Login:</span> User: admin,
        Pass: admin
      </MyHoverCard>
    </Form.Root>
  )
}
