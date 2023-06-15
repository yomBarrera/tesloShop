import { useContext, useState } from 'react';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import NextLink from 'next/link';
import { getSession, signIn } from 'next-auth/react';

import { useForm } from 'react-hook-form';
import { Box, Button, Chip, Grid, Link, TextField, Typography } from "@mui/material"
import { ErrorOutlined } from '@mui/icons-material';

import { AuthContext } from '@/context';
import { tesloApi } from '@/api';
import { AuthLayout } from "@/components/layouts"
import { validations } from '@/utils';

type FormData = {
  name: string,
  email: string,
  password: string,
};

const RegisterPage = () => {

  const router = useRouter()
  const { registerUser } = useContext(AuthContext)
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();
  const [showError, setShowError] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const onRegisterUser = async ({ name, email, password }: FormData) => {

    setShowError(false)
    const { hasError, message } = await registerUser(name, email, password)
    if (hasError) {
      setShowError(true)
      setTimeout(() => setShowError(false), 3000);
      setErrorMessage(message!)
      return
    }
    // const destination = router.query.p?.toString() || '/';
    // router.replace(destination)

    await signIn('credentials', { email, password })
  }

  return (
    <AuthLayout title={"Registro Usuario"} >
      <form onSubmit={handleSubmit(onRegisterUser)} noValidate >
        <Box sx={{ width: 350, padding: '10px 20px' }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="h1" component='h1'>Registra tu cuenta</Typography>
              <Chip
                label='No register'
                color='error'
                icon={<ErrorOutlined />}
                className='fadeIn'
                sx={{ display: showError ? 'flex' : 'none' }} />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label='Nombre'
                variant="filled"
                fullWidth
                {...register('name', { required: 'Este campo es requerido', minLength: { value: 3, message: 'Minimo 3 caracteres' } })}
                error={!!errors.name}
                helperText={errors.name?.message} />
            </Grid>
            <Grid item xs={12}>
              <TextField
                type='email'
                label='Correo'
                variant="filled"
                fullWidth
                {...register('email', { required: 'Este campo es requerido', validate: validations.isEmail })}
                error={!!errors.email}
                helperText={errors.email?.message} />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label='Contraseña'
                type='password'
                variant="filled"
                fullWidth
                {...register('password', { required: 'Este campo es requerido', minLength: { value: 6, message: 'Minimo 6 caracteres' } })}
                error={!!errors.password}
                helperText={errors.password?.message} />
            </Grid>
            <Grid item xs={12}>
              <Button type='submit' color="secondary" className="circular-btn" size="large" fullWidth>Registrar</Button>
            </Grid>
            <Grid item xs={12} display='flex' justifyContent='end'>
              <NextLink href={router.query.p ? `/auth/login?p=${router.query.p} ` : '/auth/login'} passHref>
                <Link component={'span'} underline='always'>¿Ya tienes cuenta?</Link>
              </NextLink>
            </Grid>
          </Grid>
        </Box>
      </form>
    </AuthLayout>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ req, query }) => {

  const session = await getSession({ req });
  // console.log({session});

  const { p = '/' } = query;

  if (session) {
    return {
      redirect: {
        destination: p.toString(),
        permanent: false
      }
    }
  }


  return {
    props: {}
  }
}
export default RegisterPage
