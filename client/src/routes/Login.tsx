import { useRef, useState } from 'react'
import { Form } from '../components/Form'
import { useLoginApiLoginPost } from '../api/generated/endpoints'
import { useNavigate } from 'react-router-dom'
import { Question } from '@phosphor-icons/react'
import { MyHoverCard } from '../components/ui/MyHoverCard'
import { LoadingSubmit } from '../components/LoadingSubmit'

export function Login() {
  const userRef = useRef<HTMLInputElement>(null)
  const passwordRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()
  const [res, setRes] = useState({
    message: '',
    color: 'white',
  })

  const { mutate, isLoading } = useLoginApiLoginPost({
    mutation: {
      onSuccess: () => navigate('/profile'),
      onError: (error) => {
        if (error.response?.status === 404) {
          setRes({
            message: 'Perfil não encontrado',
            color: 'text-red-500',
          })
        }
      },
    },
  })

  return (
    <Form.Root
      action={() =>
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
      <Form.ResField res={res.message} color={res.color} />
      <LoadingSubmit isLoading={isLoading} />
      <MyHoverCard trigger={<Question />}>
        <span className="font-bold text-xl">Test Login:</span> User: admin,
        Pass: admin
      </MyHoverCard>
    </Form.Root>
  )
}
