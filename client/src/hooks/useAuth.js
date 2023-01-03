import { useReducer, useEffect, useContext, createContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import axios from 'utils/axiosConfig.js'

const initialState = {
  isAuthenticated: null,
  user: null,
}

const reducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN':
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload,
      }
    case 'LOGOUT':
      localStorage.clear()
      return {
        ...state,
        isAuthenticated: false,
        user: null,
      }

    default:
      return state
  }
}

const authContext = createContext()

// Provider component that wraps your app and makes auth object ...
// ... available to any child component that calls useAuth().
export function ProvideAuth({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState)
  return (
    <authContext.Provider
      value={{
        state,
        dispatch,
      }}
    >
      {children}
    </authContext.Provider>
  )
}

// Hook for child components to get the auth object ...
// ... and re-render when it changes.
export const useAuth = () => {
  return useContext(authContext)
}

// Provider hook that creates auth object and handles state
export function useProvideAuth() {
  const { state, dispatch } = useAuth()

  let navigate = useNavigate();


  const signin = async (username, password) => {
    try {
      const response = await axios.post(`http://localhost:3001/api/auth/signin`, {
        username,
        passwordHash: password,
      })

      console.log(response.data, 'datadatadatadatadata')

      localStorage.setItem('MernAppUser', JSON.stringify(response.data))

      dispatch({
        type: 'LOGIN',
        payload: response.data,
      })

      return response
    } catch (error) {
      if (error.response) {
        throw new Error(error.response.data.message);
      } else {
        throw error;
      }
    }
  }

  const signup = async (username, password, email, profile_image) => {
    try {
      const res = await axios.post(`http://localhost:3001/api/auth/signup`, {
        username,
        passwordHash: password,
        email,
        profile_image,
      })

      await signin(username, password)

      return res.data

    } catch (error) {
      if (error.response) {
        throw new Error(error.response.data.message);

      } else {
        throw error;
      }
    }
  }

  const signout = () => {
    dispatch({
      type: 'LOGOUT',
    })
    navigate('/')
  }

  const getCurrentUser = () => {
    return JSON.parse(localStorage.getItem('MernAppUser'))
  }

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem('MernAppUser')) || false
    if (savedUser) {
      dispatch({
        type: 'LOGIN',
        payload: savedUser,
      })
    } else {
      dispatch({
        type: 'LOGOUT',
      })
    }
  }, [dispatch])

  // Return the user object and auth methods
  return {
    state,
    getCurrentUser,
    signin,
    signup,
    signout,
  }
}
