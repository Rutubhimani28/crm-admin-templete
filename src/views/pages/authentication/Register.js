// ** React Imports
import { useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'

// ** Custom Hooks
import { useSkin } from '@hooks/useSkin'
import useJwt from '@src/auth/jwt/useJwt'

// ** Store & Actions
import { useDispatch } from 'react-redux'
import { handleLogin } from '@store/authentication'

// ** Third Party Components
import { useForm, Controller } from 'react-hook-form'
import { Facebook, Twitter, Mail, GitHub } from 'react-feather'

// ** Context
import { AbilityContext } from '@src/utility/context/Can'

// ** Custom Components
import InputPasswordToggle from '@components/input-password-toggle'

// ** Reactstrap Imports
import { Row, Col, CardTitle, CardText, Label, Button, Form, Input, FormFeedback } from 'reactstrap'

// ** Illustrations Imports
import illustrationsLight from '@src/assets/images/pages/register-v2.svg'
import illustrationsDark from '@src/assets/images/pages/register-v2-dark.svg'

// ** Styles
import '@styles/react/pages/page-authentication.scss'
import { fetchUserData } from '../../../redux/authentication'

import crm from '@src/assets/images/logo/crm1.png'


const defaultValues = {
  email: '',
  terms: false,
  username: '',
  password: ''
}

const Register = () => {
  // ** Hooks
  const ability = useContext(AbilityContext)
  const { skin } = useSkin()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const {
    control,
    setError,
    handleSubmit,
    formState: { errors }
  } = useForm({ defaultValues })

  const source = skin === 'dark' ? illustrationsDark : illustrationsLight

  // const onSubmit = data => {
  //   const tempData = { ...data }
  //   delete tempData.terms
  //   if (Object.values(tempData).every(field => field.length > 0) && data.terms === true) {
  //     const { username, email, password } = data
  //     useJwt
  //       .register({ username, email, password })
  //       .then(res => {
  //         if (res.data.error) {
  //           for (const property in res.data.error) {
  //             if (res.data.error[property] !== null) {
  //               setError(property, {
  //                 type: 'manual',
  //                 message: res.data.error[property]
  //               })
  //             }
  //           }
  //         } else {
  //           const data = { ...res.data.user, accessToken: res.data.accessToken }
  //           // ability.update(res.data.user.ability)
  //           dispatch(handleLogin(data))
  //             // dispatch(fetchUserData({data}))

  //           navigate('/')
  //         }
  //       })
  //       .catch(err => console.log(err))
  //   } else {
  //     for (const key in data) {
  //       if (data[key].length === 0) {
  //         setError(key, {
  //           type: 'manual',
  //           message: `Please enter a valid ${key}`
  //         })
  //       }
  //       if (key === 'terms' && data.terms === false) {
  //         setError('terms', {
  //           type: 'manual'
  //         })
  //       }
  //     }
  //   }
  // }

  const onSubmit = async (data) => {
    const tempData = { ...data }
    delete tempData.terms

    // Check all required fields
    if (Object.values(tempData).every(field => field.length > 0) && data.terms === true) {
      try {
        const resultAction = await dispatch(
          fetchUserData({
            userName: data.username,
            emailAddress: data.email,
            password: data.password
          })
        )

        // If registration is successful
        if (fetchUserData.fulfilled.match(resultAction)) {
          const responseData = resultAction.payload

          const userData = {
            ...responseData.user,
            accessToken: responseData.accessToken,
            refreshToken: responseData.refreshToken
          }

          // Dispatch login action and store tokens
          dispatch(handleLogin(userData))

          // Navigate to homepage
          navigate('/')
        } else {
          // If backend sends validation errors (e.g. email already exists)
          if (typeof resultAction.payload === 'string') {
            setError('email', {
              type: 'manual',
              message: resultAction.payload
            })
          } else if (typeof resultAction.payload === 'object') {
            for (const property in resultAction.payload) {
              setError(property, {
                type: 'manual',
                message: resultAction.payload[property]
              })
            }
          }
        }
      } catch (err) {
        console.error('Registration error:', err)
      }
    } else {
      // Handle field validation errors
      for (const key in data) {
        if (key !== 'terms' && data[key].length === 0) {
          setError(key, {
            type: 'manual',
            message: `Please enter a valid ${key}`
          })
        }
        if (key === 'terms' && data.terms === false) {
          setError('terms', {
            type: 'manual',
            message: 'You must agree to the terms'
          })
        }
      }
    }
  }

  return (
    <div className='auth-wrapper auth-cover'>
      <Row className='auth-inner m-0'>
        <Link className='brand-logo' to='/' onClick={e => e.preventDefault()}>
         
          <img src={crm} alt='logo' height={100} width={100} />
        </Link>
        <Col className='d-none d-lg-flex align-items-center p-5' lg='8' sm='12'>
          <div className='w-100 d-lg-flex align-items-center justify-content-center px-5'>
            <img className='img-fluid' src={source} alt='Login Cover' />
          </div>
        </Col>
        <Col className='d-flex align-items-center auth-bg px-2 p-lg-5' lg='4' sm='12'>
          <Col className='px-xl-2 mx-auto' sm='8' md='6' lg='12'>
            <CardTitle tag='h2' className='fw-bold mb-1'>
              Adventure starts here 🚀
            </CardTitle>
            <CardText className='mb-2'>Make your app management easy and fun!</CardText>

            <Form action='/' className='auth-register-form mt-2' onSubmit={handleSubmit(onSubmit)}>
              <div className='mb-1'>
                <Label className='form-label' for='register-username'>
                  Username
                </Label>
                <Controller
                  id='username'
                  name='username'
                  control={control}
                  render={({ field }) => (
                    <Input autoFocus placeholder='johndoe' invalid={errors.username && true} {...field} />
                  )}
                />
                {errors.username ? <FormFeedback>{errors.username.message}</FormFeedback> : null}
              </div>
              <div className='mb-1'>
                <Label className='form-label' for='register-email'>
                  Email
                </Label>
                <Controller
                  id='email'
                  name='email'
                  control={control}
                  render={({ field }) => (
                    <Input type='email' placeholder='john@example.com' invalid={errors.email && true} {...field} />
                  )}
                />
                {errors.email ? <FormFeedback>{errors.email.message}</FormFeedback> : null}
              </div>
              <div className='mb-1'>
                <Label className='form-label' for='register-password'>
                  Password
                </Label>
                <Controller
                  id='password'
                  name='password'
                  control={control}
                  render={({ field }) => (
                    <InputPasswordToggle className='input-group-merge' invalid={errors.password && true} {...field} />
                  )}
                />
              </div>
              <div className='form-check mb-1'>
                <Controller
                  name='terms'
                  control={control}
                  render={({ field }) => (
                    <Input {...field} id='terms' type='checkbox' checked={field.value} invalid={errors.terms && true} />
                  )}
                />
                <Label className='form-check-label' for='terms'>
                  I agree to
                  <a className='ms-25' href='/' onClick={e => e.preventDefault()}>
                    privacy policy & terms
                  </a>
                </Label>
              </div>
              <Button type='submit' block color='primary'>
                Sign up
              </Button>
            </Form>
            <p className='text-center mt-2'>
              <span className='me-25'>Already have an account?</span>
              <Link to='/login'>
                <span>Sign in instead</span>
              </Link>
            </p>
            {/* <div className='divider my-2'>
              <div className='divider-text'>or</div>
            </div>
            <div className='auth-footer-btn d-flex justify-content-center'>
              <Button color='facebook'>
                <Facebook size={14} />
              </Button>
              <Button color='twitter'>
                <Twitter size={14} />
              </Button>
              <Button color='google'>
                <Mail size={14} />
              </Button>
              <Button className='me-0' color='github'>
                <GitHub size={14} />
              </Button>
            </div> */}
          </Col>
        </Col>
      </Row>
    </div>
  )
}

export default Register
