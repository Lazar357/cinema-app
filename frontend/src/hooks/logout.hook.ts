import { AuthService } from '@/services/auth.service'
import { useRouter } from 'vue-router'

export function useLogout() {
  const router = useRouter()

  const logout = (e: any) => {
    if (e.message != undefined) {
      alert(e.message)
    }
    AuthService.clearTokens()
    router.push('/login')
  }

  return logout
}
