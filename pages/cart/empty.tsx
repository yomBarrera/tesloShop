import { Box, Link, Typography } from "@mui/material"
import { ShopLayout } from "@/components/layouts"

import { RemoveShoppingCartOutlined } from "@mui/icons-material"
import NextLink from 'next/link';

const emptyPage = () => {
  return (
    <ShopLayout title={"Carito vacío"} pageaDescription={"No hay articulos en el carrito de compras"} >
      <Box display={'flex'} justifyContent={'center'} alignItems={'center'} height={'calc(100vh - 200px)'} sx={{ flexDirection: { xs: 'column', sm: 'row' } }} >
        <RemoveShoppingCartOutlined sx={{ fontSize: 100 }} />
        <Box display={'flex'} flexDirection={'column'} alignItems={'center'}>
          <Typography variant='h2' component='h2' fontSize={40} > Su carrito está vacio</Typography>
          <Link href="/" typography='h4' color='secondary' >
            Regresar
          </Link>
        </Box>
      </Box>
    </ShopLayout>
  )
}

export default emptyPage

