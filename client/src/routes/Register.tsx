import { useRef, useState } from 'react'
import { AxiosError } from 'axios'
import { useNavigate } from 'react-router-dom'
import { useRegister } from '../api/generated/endpoints'
import { Form } from '../components/Form'
import { LoadingSubmit } from '../components/LoadingSubmit'

export function Register() {
  const usernameRef = useRef<HTMLInputElement>(null)
  const nicknameRef = useRef<HTMLInputElement>(null)
  const emailRef = useRef<HTMLInputElement>(null)
  const passwordRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()
  const [feedback, setFeedback] = useState({
    message: '',
    colorClass: 'white',
  })

  const { mutate, isLoading } = useRegister({
    mutation: {
      onSuccess: () => navigate('/login'),
      onError: (error) => {
        if (error instanceof AxiosError && error.response === undefined) {
          setFeedback({
            message: 'Não foi possível conectar ao servidor.',
            colorClass: 'text-red-500',
          })
        } else {
          setFeedback({
            message: 'Algo deu errado. Usuário ou email já cadastrados.',
            colorClass: 'text-red-500',
          })
        }
      },
    },
  })

  return (
    <Form.Root
      showCaution
      onSubmit={() =>
        mutate({
          data: {
            username: usernameRef.current?.value ?? '',
            nickname: nicknameRef.current?.value ?? '',
            email: emailRef.current?.value ?? '',
            password: passwordRef.current?.value ?? '',
          },
        })
      }
    >
      <Form.Field
        label="Username"
        name="username"
        type="text"
        ref={usernameRef}
      />
      <Form.Field
        label="Nickname"
        name="nickname"
        type="text"
        ref={nicknameRef}
      />
      <Form.Field label="Email" name="email" type="text" ref={emailRef} />
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
    </Form.Root>
  )
}
