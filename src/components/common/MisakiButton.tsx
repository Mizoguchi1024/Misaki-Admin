import { Button } from 'antd'
import { useNavigate } from 'react-router-dom'
import MisakiLogo from '@/assets/img/misaki-logo-symbol.svg?react'
import React from 'react'
import { useUserStore } from '@/store/user'

export default function MisakiButton(): React.JSX.Element {
  const navigate = useNavigate()
  const { jwt } = useUserStore()

  return (
    <Button
      type="text"
      size="large"
      onClick={() => {
        if (jwt) {
          navigate('/workspace', { viewTransition: true })
        } else {
          navigate('/', { viewTransition: true })
        }
      }}
    >
      <div className="flex items-center gap-1">
        <MisakiLogo className="w-8" />
        <span className="text-xl font-semibold">Misaki</span>
      </div>
    </Button>
  )
}
