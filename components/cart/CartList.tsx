import { FC, useContext } from 'react';
import NextLink from 'next/link';
import { Box, Button, CardActionArea, CardMedia, Grid, Link, Typography } from '@mui/material';

import { ItemCounter } from '../ui';
import { CartContext } from '@/context';
import { ICartProduct, IOrderItem } from '@/interfaces';


interface Props {
  editable?: boolean
  products?: IOrderItem[];
}

export const CartList: FC<Props> = ({ editable = false, products }) => {

  const { cart, updateCartQuantity, removeCartProduct } = useContext(CartContext)

  const onNewQuantityProduct = (product: ICartProduct, newQuantity: number) => {
    // updateCartQuantity(product = { ...product, quantity: newQuantity })
    product.quantity = newQuantity
    updateCartQuantity(product)

  }

  const productsToShow = products ? products : cart;

  return (
    <>
      {
        productsToShow.map(product => (
          <Grid container spacing={2} key={product.slug + product.size} sx={{ mb: 1 }}>
            <Grid item xs={3} >
              {/* todo: llevar ala pagina del producto */}
              <Link href={`/product/${product.slug}`}>
                <CardActionArea>
                  <CardMedia image={product.image} component={'img'} sx={{ borderRadius: '5px' }} />
                </CardActionArea>
              </Link>
            </Grid>
            <Grid item xs={7} >
              <Box display={'flex'} flexDirection={'column'}>
                <Typography variant='body1'>{product.title}</Typography>
                <Typography variant='body1'>Talla: <strong>{product.size}</strong></Typography>

                {editable ?
                  <ItemCounter
                    currentValue={product.quantity}
                    updatedQuantity={(value) => onNewQuantityProduct(product as ICartProduct, value)}
                    maxValue={10}
                  />
                  : <Typography
                    variant='h5'>{product.quantity} {product.quantity > 1 ? 'productos' : 'producto'}
                  </Typography>}

              </Box>
            </Grid>
            <Grid item xs={2} display={'flex'} alignItems={'center'} flexDirection={'column'}>
              <Typography variant='subtitle1'>{`$${product.price * product.quantity}`}</Typography>

              {editable && (<Button
                variant='text'
                color='secondary'
                onClick={() => removeCartProduct(product as ICartProduct)}>Remover</Button>
              )}

            </Grid>
          </Grid >
        ))
      }
    </>
  )
}
