import React from 'react'
import Container from '../layout/Container'
import Title from './Title'
import SocialIcons from './SocialIcons'

const Hero = () => {
  return (
    <Container className=''>

      <div className='text-center flex flex-col items-center space-y-3 '>
        <Title className='text-3xl md:text=4xl uppercase text-center'>Be seen, be remembered</Title>
        <p className='text-center text-muted-foreground max-w-[600px]  '>
          Make every outfit count with pieces that elevate your presence, sharpen your look, and leave a lasting impression wherever you go.
        </p>

      </div>
                        <SocialIcons theme="light" />



    </Container>
  )
}

export default Hero