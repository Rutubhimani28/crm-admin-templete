import { useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useSkin } from '@hooks/useSkin'
import { useDispatch } from 'react-redux'
import { handleLogin } from '@store/authentication'
import { useForm, Controller } from 'react-hook-form'
import { AbilityContext } from '@src/utility/context/Can'
import InputPasswordToggle from '@components/input-password-toggle'
import { Row, Col, CardTitle, CardText, Label, Button, Form, Input, FormFeedback } from 'reactstrap'
import illustrationsLight from '@src/assets/images/pages/register-v2.svg'
import illustrationsDark from '@src/assets/images/pages/register-v2-dark.svg'
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

  const onSubmit = async (data) => {
    const tempData = { ...data }
    delete tempData.terms

    if (Object.values(tempData).every(field => field.length > 0) && data.terms === true) {
      try {
        const resultAction = await dispatch(
          fetchUserData({
            userName: data.username,
            emailAddress: data.email,
            password: data.password
          })
        )

        if (fetchUserData.fulfilled.match(resultAction)) {
          const responseData = resultAction.payload
          const userData = {
            ...responseData.user,
            accessToken: responseData.accessToken,
            refreshToken: responseData.refreshToken
          }

          dispatch(handleLogin(userData))

          navigate('/')
        }
      } catch (err) {
        console.error('Registration error:', err)
      }
    } else {
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

          <img src={crm} alt='logo' height={100} width={120} />
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
                  rules={{
                    required: 'Username is required'
                  }}
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
                  rules={{
                    required: 'Email is required'
                  }}

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
                  rules={{
                    required: 'Password is required',
                  }}
                  render={({ field }) => (
                    <InputPasswordToggle className='input-group-merge' invalid={errors.password && true} {...field} />
                  )}
                />
                {errors.password && <FormFeedback>{errors.password.message}</FormFeedback>}
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
          </Col>
        </Col>
      </Row>
    </div>
  )
}

export default Register
