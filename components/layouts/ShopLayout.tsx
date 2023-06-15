import { FC, ReactNode } from "react"
import Head from "next/head"
import { Navbar, SideMenu } from "../ui"

interface Props {
  title: string,
  pageaDescription: string,
  imageFullUrl?: string
  children: ReactNode
}

export const ShopLayout: FC<Props> = ({ children, title, pageaDescription, imageFullUrl }) => {
  return (
    <>
      <Head>
        <title>{title}</title>

        <meta name="description" content={pageaDescription} />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        <meta name="og:title" content={title} />
        <meta name="og:description" content={pageaDescription} />
        {imageFullUrl && (<meta name="og:image" content={imageFullUrl} />)}
      </Head>
      <nav>
        <Navbar />
      </nav>
      <SideMenu />
      <main style={{ margin: '80px auto', maxWidth: '1440px', padding: '0px 30px' }}>
        {children}
      </main>

      <footer>
        {/* todo: custom footer*/}
      </footer>
    </>
  )
}
