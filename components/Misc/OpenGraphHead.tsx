import Head from 'next/head'
const OpenGraphHead = () => (
  <Head>
    <title>Cantin Bartel | Full-Stack Developer</title>
    <meta name="description" content="My portfolio" />
    <meta property="og:title" content="Cantin Bartel | Full-Stack Developer" />
    <meta property="og:site_name" content="Cantin Bartel" />
    <meta property="og:url" content="https://cantinbartel.dev" />
    <meta
      property="og:description"
      content="Hi there! I am Cantin Bartel, a passionate Full-Stack Developer, , solving real-world problems with clean code and modern tools. I work across the stack — from modernizing legacy codebases, building backend features and architecture, integrating APIs, to implementing and maintaining frontend integration."
    />
    <meta property="og:type" content="profile" />
    <meta
      property="og:image"
      content="https://cantinbartel.dev/avatars/CB_avatar.png"
    ></meta>
  </Head>
)
export default OpenGraphHead
