import { Box, CircularProgress, Typography } from '@mui/material'
import React from 'react'

export const FullScreenLoading = () => {
  return (
    <Box display={'flex'} justifyContent={'center'} flexDirection='column' alignItems={'center'} height={'calc(100vh - 200px)'} sx={{ mb: 3 }} >
      <Typography variant='h2' component='h2' fontSize={40} fontWeight={500} >Cargando</Typography>
      <CircularProgress thickness={2} />
    </Box>
  )
}
