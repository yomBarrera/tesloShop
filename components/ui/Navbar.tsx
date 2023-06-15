import { useContext, useState } from "react"
import NextLink from "next/link"
import { useRouter } from "next/router"

import { AppBar, Badge, Box, Button, IconButton, Input, InputAdornment, Link, Toolbar, Typography } from "@mui/material"
import { ClearOutlined, SearchOutlined, ShoppingCartOutlined } from "@mui/icons-material"

import { CartContext, UiContext } from "@/context"

export const Navbar = () => {

  const { asPath, push } = useRouter()
  const { toggleSideMenu } = useContext(UiContext)
  const { numbersOfItems } = useContext(CartContext)

  const [searchTerm, setSearchTerm] = useState('');
  const [isSearchVisible, setIsSearchVisible] = useState(false);

  const onSearchTerm = () => {
    if (searchTerm.trim().length === 0) return
    push(`/search/${searchTerm}`)
  }

  return (
    <AppBar>
      <Toolbar>
        <NextLink href={'/'} passHref>
          <Link underline='always' component={'span'} display={'flex'} alignItems={'center'}>
            <Typography variant="h6">Teslo |</Typography>
            <Typography sx={{ ml: 0.5 }}>Shop </Typography>
          </Link>
        </NextLink>

        <Box flex={1} />

        <Box sx={{ display: isSearchVisible ? 'none' : { xs: 'none', sm: 'block' } }} className='fadeIn' >
          <NextLink href={'/category/men'} passHref>
            <Link component={'span'} >
              <Button color={asPath === '/category/men' ? 'primary' : 'info'} sx={{ ml: 0.5 }}>Hombres </Button>
            </Link>
          </NextLink>
          <NextLink href={'/category/women'} passHref>
            <Link component={'span'} >
              <Button color={asPath === '/category/women' ? 'primary' : 'info'} sx={{ ml: 0.5 }}>Mujeres </Button>
            </Link>
          </NextLink>
          <NextLink href={'/category/kid'} passHref>
            <Link component={'span'} >
              <Button color={asPath === '/category/kid' ? 'primary' : 'info'} sx={{ ml: 0.5 }}>Niños </Button>
            </Link>
          </NextLink>
          {/* <NextLink href={'/category/unisex'} passHref>
            <Link component={'span'} >
              <Button sx={{ ml: 0.5 }}>Unisex </Button>
            </Link>
          </NextLink> */}
        </Box>

        <Box flex={1} />

        {/* Desktop */}
        {isSearchVisible ? (
          <Input
            sx={{ display: { xs: 'none', sm: 'flex' } }}
            className="fadeIn"
            autoFocus
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' ? onSearchTerm() : null}
            type='text'
            placeholder="Buscar..."
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setIsSearchVisible(false)}
                >
                  <ClearOutlined />
                </IconButton>
              </InputAdornment>
            }
          />
        ) : (
          <IconButton onClick={() => setIsSearchVisible(true)} sx={{ display: { xs: 'none', sm: 'flex' } }} >
            <SearchOutlined />
          </IconButton>
        )}

        {/* Mobile */}
        <IconButton sx={{ display: { xs: 'flex', sm: 'none' } }} onClick={toggleSideMenu} className="fadeIn">
          <SearchOutlined />
        </IconButton>

        <NextLink href={'cart'} passHref>
          <Link component={'span'}>
            <IconButton>
              <Badge badgeContent={numbersOfItems > 9 ? '+9' : numbersOfItems} color="secondary" >
                <ShoppingCartOutlined />
              </Badge>
            </IconButton>
          </Link>
        </NextLink>

        <Button onClick={toggleSideMenu}>
          Menú
        </Button>

      </Toolbar>
    </AppBar>
  )
}
