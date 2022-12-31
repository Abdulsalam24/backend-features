import React, { useState } from 'react'
import {
  Container,
  Row,
  Col,
  InputGroup,
  Form,
  Button,
} from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { useProvideAuth } from 'hooks/useAuth'
import { LandingHeader, LoadingSpinner } from 'components'
import { setAuthToken } from 'utils/axiosConfig'

import bird from '../img/bird.svg'
import dog from '../img/dog.svg'
import fox from '../img/fox.svg'
import frog from '../img/frog.svg'
import owl from '../img/owl.svg'
import tiger from '../img/tiger.svg'
import whale from '../img/whale.svg'
import lion from '../img/lion.svg'
import { toast } from 'react-toastify'


const initialState = {
  username: '',
  email: '',
  password: '',
  isSubmitting: false,
  errorMessage: null,
}


export const avatars = [
  bird,
  dog,
  fox,
  frog,
  lion,
  owl,
  tiger,
  whale,
]

export default function RegisterPage() {
  const [data, setData] = useState(initialState)
  const auth = useProvideAuth()

  let navigate = useNavigate();

  const [profileImage, setProfileImage] = useState(getRandomProfileUrl())

  function getRandomProfileUrl() {
    //geneartes random pic in img
    var imgs = [
      bird,
      dog,
      fox,
      frog,
      lion,
      owl,
      tiger,
      whale,
    ]

    let img = imgs[Math.floor(Math.random() * imgs.length)]
    return `${img}`
  }

  const handleInputChange = (event) => {
    setData({
      ...data,
      [event.target.name]: event.target.value,
    })
  }



  const handleSignup = async (event) => {
    const form = event.currentTarget
    event.preventDefault()
    event.stopPropagation()

    if (form.checkValidity() === false) {

    }

    if (data.username === '' || data.email === '' || data.password === '') {
      toast.error("All filed are required")
      return;
    }

    setData({
      ...data,
      isSubmitting: true,
      errorMessage: null,
    })

    try {
      const res = await auth.signup(data.username, data.password, data.email, profileImage)
      console.log(res, 'resssssss')
      setData({
        ...data,
        isSubmitting: false,
        errorMessage: null,
      })

      setAuthToken(res.token)
      return navigate('/')

    } catch (error) {
      toast.error(error.response)
      console.log(error, 'errorerrorerrorerrorerrorerrorerror')

      setData({
        ...data,
        isSubmitting: false,
        errorMessage: error ? error.message || error.statusText : null,
      })
    }
  }

  const handleSelect = (index) => {
    if (avatars.indexOf(avatars[index]) === index) {
      setProfileImage(avatars[index])
    }
  }

  return (
    <div style={{ overflow: "auto", height: "100vh" }}>
      <LandingHeader />
      <Container className='mb-5'>
        <Row className='pt-5 justify-content-center'>
          <Form
            noValidate
            validated
            style={{ width: '350px' }}
            onSubmit={handleSignup}
          >
            <h3 className="mb-3">Join Us!</h3>

            <Form.Group controlId='username-register'>
              <Form.Label>Username</Form.Label>
              <InputGroup>
                <InputGroup.Prepend>
                  <InputGroup.Text id='inputGroupPrepend'>@</InputGroup.Text>
                </InputGroup.Prepend>
                <Form.Control
                  type='text'
                  name='username'
                  placeholder='Username'
                  aria-describedby='inputGroupPrepend'
                  required
                  value={data.username}
                  onChange={handleInputChange}
                />
              </InputGroup>
            </Form.Group>


            <div className="flex">
              <h3>Choose your Avatar</h3>
              <div className='avatars'>
                {
                  avatars.map((avatar, index) => (
                    <div className={`${profileImage === avatar && 'selected'}`} key={index} onClick={() => handleSelect(index)}>
                      <img src={avatar} alt="avatar" />
                    </div>
                  ))
                }
              </div>
            </div>

            <Form.Group>
              <Form.Label htmlFor='email'>email</Form.Label>
              <Form.Control
                type='email'
                name='email'
                required
                id='inputEmailRegister'
                value={data.email}
                onChange={handleInputChange}
              />
            </Form.Group>


            <Form.Group>
              <Form.Label htmlFor='Register'>Password</Form.Label>
              <Form.Control
                type='password'
                name='password'
                required
                id='inputPasswordRegister'
                value={data.password}
                onChange={handleInputChange}
              />
            </Form.Group>


            {data.errorMessage && (
              <span className='form-error text-warning'>{data.errorMessage}</span>
            )}

            <Row className='mr-0'>
              <Col>
                Already Registered?
                <Button
                  as='a'
                  variant='link'
                  onClick={() => navigate("/login")}
                >
                  Login
                </Button>
              </Col>
              <Button type='submit' disabled={data.isSubmitting}>
                {data.isSubmitting ? <LoadingSpinner /> : 'Sign up'}
              </Button>
            </Row>
          </Form>
        </Row>

      </Container>
    </div>
  )
}
