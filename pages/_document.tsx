import Document, {
  Html,
  Head,
  Main,
  NextScript,
  type DocumentContext,
} from 'next/document'
import { ColorModeScript } from '@chakra-ui/react'
import theme from 'config/theme'

type MyDocumentProps = {
  locale?: string
}

class MyDocument extends Document<MyDocumentProps> {
  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx)
    return {
      ...initialProps,
      locale: ctx.locale || 'en',
    }
  }

  render() {
    return (
      <Html lang={this.props.locale || 'en'}>
        <Head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link
            rel="preconnect"
            href="https://fonts.gstatic.com"
            crossOrigin="true"
          ></link>
          <link
            href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,300;0,400;0,500;0,600;1,100;1,300;1,400;1,500;1,600&display=swap"
            rel="stylesheet"
          ></link>
        </Head>
        <body>
          <script
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{
              __html:
                "try{var p=localStorage.getItem('cb-color-mode-preference');if(p==='light'||p==='dark'){localStorage.setItem('chakra-ui-color-mode',p)}else{localStorage.removeItem('chakra-ui-color-mode')}}catch(e){}",
            }}
          />
          <ColorModeScript initialColorMode={theme.config.initialColorMode} />
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
