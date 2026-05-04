import React from 'react'
import Container from '../layout/Container'
import Title from './Title'
import SocialIcons from './SocialIcons'
import { Cormorant_Garamond } from 'next/font/google'
import { getSiteContent } from '@/actions/contents'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '600'],
  variable: '--font-cormorant',
})


export default async function Hero() {
  const content = await getSiteContent()

  const heroHeadline = content.hero_headline || 'Be Seen, Be Remembered'
  const heroSubtext = content.hero_subtext || 'Make every outfit count with pieces that elevate your presence, sharpen your look, and leave a lasting impression wherever you go.'

  return (
    <Container className={`mx-auto text-center ${cormorant.variable}`}>

      <div className="text-center flex flex-col items-center">

        {/* Eyebrow */}
        <div className="flex items-center gap-3 mb-6">
          <span
            className="block h-px w-6 md:w-8"
            style={{ background: 'rgba(191,164,122,0.6)' }}
          />
          <span
            className="text-[0.48rem] md:text-[0.62rem] uppercase tracking-[0.28em] font-semibold"
            style={{
              color: 'rgba(28,26,23,0.45)',
            }}
          >
            Apparels · Bags · Shoes · Accessories
          </span>
          <span
            className="block h-px w-8"
            style={{ background: 'rgba(191,164,122,0.6)' }}
          />
        </div>

        {/* Headline */}
        <div
          className="space-y-0 leading-none mb-5 title"
        >
          <p
            className="text-[clamp(2rem,4.5vw,3rem)] text-foreground font-semibold leading-none tracking-tight"
            style={{ letterSpacing: '-0.02em' }}
          >
            {heroHeadline}
            <span className='text-accent'>.</span>
          </p>

        </div>

        {/* Subheading */}
        <p
          className="text-center max-w-xl leading-relaxed text-muted-foreground text-sm md:text-base"
        >
          {heroSubtext}
        </p>

      </div>

    </Container>
  )
}