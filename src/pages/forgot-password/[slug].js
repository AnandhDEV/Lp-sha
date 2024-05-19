import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import BlankLayout from 'src/@core/layouts/BlankLayout'
import ForgotPassword from 'src/pages/forgot-password'

const Signup = () => {
  const router = useRouter()
  const [decodedString, setDecodedString] = useState('')
  let secretString = router.query.slug

  useEffect(() => {
    if (secretString && secretString != '[slug]') {
      localStorage.setItem('slug', secretString)
    } else {
      secretString = localStorage.getItem('slug')
    }
    if (secretString != '[slug]' && secretString != '' && secretString) {
      const decode = secretString ? Buffer.from(secretString, 'base64').toString('utf-8') : ''
      router.replace({ pathname: `/forgot-password/${secretString}` })
      setDecodedString(decode)
    }
  }, [secretString])

  return <ForgotPassword data={decodedString}  secretString ={secretString} />
}

export const getServerSideProps = async ({ params }) => {
  const slug = params.slug

  return {
    props: {
      slug
    }
  }
}

Signup.getLayout = page => <BlankLayout>{page}</BlankLayout>

export default Signup
