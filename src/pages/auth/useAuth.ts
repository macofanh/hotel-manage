import { ref } from 'vue'

const isLoggedIn = ref(!!localStorage.getItem('access_token'))
const currentUser = ref(JSON.parse(localStorage.getItem('user_info') || 'null'))

export function useAuth() {
    const login = (token: string, user: any) => {
        localStorage.setItem('access_token', token)
        localStorage.setItem('user_info', JSON.stringify(user))
        
        isLoggedIn.value = true
        currentUser.value = user
    }

    const logout = () => {
        localStorage.removeItem('access_token')
        localStorage.removeItem('user_info')
        
        isLoggedIn.value = false
        currentUser.value = null
    }

    return {
        isLoggedIn,
        currentUser,
        login,
        logout
    }
}