import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCreateNewUserApiRegisterPost } from '../api/generated/endpoints'
import { Form } from '../components/Form'
import { LoadingSubmit } from '../components/LoadingSubmit'

export function Register() {
  const usernameRef = useRef<HTMLInputElement>(null)
  const nicknameRef = useRef<HTMLInputElement>(null)
  const emailRef = useRef<HTMLInputElement>(null)
  const passwordRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()
  const [res, setRes] = useState({
    message: '',
    color: 'white',
  })

  const { mutate, isLoading } = useCreateNewUserApiRegisterPost({
    mutation: {
      onSuccess: () => navigate('/login'),
      onError: (error) => {
        if (error.response?.status === 409) {
          setRes({
            message: 'Algo deu errado',
            color: 'text-red-500',
          })
        }
      },
    },
  })

  return (
    <Form.Root
      cautionMessage
      action={() =>
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
      <Form.ResField res={res.message} color={res.color} />
      <LoadingSubmit isLoading={isLoading} />
    </Form.Root>
  )
}
