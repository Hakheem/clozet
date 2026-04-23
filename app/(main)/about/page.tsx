import Container from '@/components/layout/Container';
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ShoppingBag, Shirt, Footprints, Gem, Users, Globe, Star, TrendingUp } from 'lucide-react';

const stats = [
  { value: '2,000+', label: 'Monthly Customers' },
  { value: '700+', label: 'Curated Pieces' },
  { value: '3', label: 'Years of Style' },
  { value: '4.9★', label: 'Average Rating' },
];

const categories = [
  {
    icon: Shirt,
    title: 'Clothing',
    description: 'From everyday essentials to statement outerwear, tops, trousers, dresses, co-ords and more.',
  },
  {
    icon: Footprints,
    title: 'Footwear',
    description: 'Sneakers, heels, boots, loafers — footwear that finishes the look the right way.',
  },
  {
    icon: ShoppingBag,
    title: 'Bags',
    description: 'Totes, cross-body bags, clutches and backpacks curated for function without sacrificing style.',
  },
  {
    icon: Gem,
    title: 'Accessories',
    description: 'Jewellery, belts, scarves and sunglasses that turn an outfit into a statement.',
  },
];

const values = [
  {
    icon: Star,
    title: 'Uncompromising Quality',
    description:
      'Every item passes a strict curation process. We handle, inspect, and wear-test pieces before they ever reach your door. Premium fabrics, solid construction, lasting style.',
  },
  {
    icon: TrendingUp,
    title: 'Trend Intelligence',
    description:
      "Our buyers track runways in Milan, street style in Lagos, and the feeds of the most influential creatives on the continent — so you always have access to what's next.",
  },
  {
    icon: Globe,
    title: 'Rooted in Nairobi',
    description:
      "We are proudly Nairobi-born. We understand the city's energy — its bold creativity, its warmth, and the way people here dress with genuine intention.",
  },
  {
    icon: Users,
    title: 'Community Over Commerce',
    description:
      'Lukuu is more than a store. We host styling sessions, support emerging local designers, and build real relationships with everyone who shops with us.',
  },
];

const AboutPage = () => {
  return (
    <div className="overflow-x-hidden">
      {/* Hero */}
      <section className="bg-primary text-gray-200 py-24 lg:py-25 ">
        <Container className="mx-auto text-center max-w-4xl">
          <Badge variant="secondary" className="mb-6 py-1 px-4 text-xs tracking-widest uppercase">
            Est. 2022 · Nairobi, Kenya
          </Badge>
          <h1 className="text-5xl md:text-7xl font-bold title leading-tight mb-6 tracking-tight">
            Dress with <br />
            <span className="italic font-light">intention.</span>
          </h1>
          <p className="text-lg md:text-xl text-primary-foreground/70 max-w-2xl mx-auto ">
            Lukuu is Nairobi&apos;s premium fashion destination, stocking clothes, footwear, bags, accessories and many more
             for people who care deeply about how they show up in the world.
          </p>
        </Container>
      </section>

      {/* Stats Bar */}
      <section className="bg-secondary border-b border-border">
        <Container className="mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-border">
            {stats.map((stat) => (
              <div key={stat.label} className="py-10 px-6 text-center">
                <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Our Story */}
      <section className="py-20 md:py-28">
        <Container className="mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div className="aspect-[4/5] bg-muted rounded-2xl flex items-center justify-center border border-border overflow-hidden">
              {/* Replace with a Next.js <Image> component */}
              <span className="text-muted-foreground text-sm italic">Brand Imagery</span>
            </div>
            <div className="space-y-7">
              <div>
                <p className="text-xs tracking-widest uppercase text-muted-foreground mb-3">Our Story</p>
                <h2 className="text-3xl md:text-4xl font-bold leading-snug">
                  Born from a gap in the market — and a love for great clothes.
                </h2>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                Lukuu started in 2022 when our founder noticed something frustrating: Nairobi&apos;s fashion
                scene was buzzing with creativity, but finding genuinely high-quality, well-curated
                pieces — without flying abroad or spending hours hunting — was harder than it should be.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                We launched with a small but carefully chosen collection. Word spread quickly, not through
                advertising, but because customers kept coming back — and kept telling their friends.
                Today, Lukuu carries over 1,200 pieces spanning clothing, footwear, bags and accessories,
                all selected with the same original intention: make it easier for people in Nairobi to
                dress exceptionally well.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                We are not a fast fashion brand. We are not chasing volume. We exist to help you build a
                wardrobe that actually works — timeless enough to last, current enough to turn heads.
              </p>
            </div>
          </div>
        </Container>
      </section>

      <Separator />

      {/* What We Offer */}
      <section className="py-20 md:py-28 bg-secondary/40">
        <Container className="mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs tracking-widest uppercase text-muted-foreground mb-3">What We Carry</p>
            <h2 className="text-3xl md:text-4xl font-bold">Everything you wear, in one place.</h2>
            <p className="text-muted-foreground mt-4 max-w-xl mx-auto">
              From the ground up — footwear, clothing, bags and finishing touches that tie it all together.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((cat) => {
              const Icon = cat.icon;
              return (
                <div
                  key={cat.title}
                  className="bg-card border border-border rounded-2xl p-7 flex flex-col gap-4 hover:shadow-md transition-shadow"
                >
                  <div className="w-11 h-11 bg-primary/10 rounded-xl flex items-center justify-center">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg">{cat.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{cat.description}</p>
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      {/* Values */}
      <section className="py-20 md:py-28">
        <Container className="mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs tracking-widest uppercase text-muted-foreground mb-3">How We Work</p>
            <h2 className="text-3xl md:text-4xl font-bold">The principles behind every decision we make.</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {values.map((v) => {
              const Icon = v.icon;
              return (
                <div key={v.title} className="flex gap-6 p-8 rounded-2xl border border-border bg-card">
                  <div className="shrink-0 w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
                    <Icon className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">{v.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{v.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      {/* Mission Banner */}
      <section className="bg-primary text-primary-foreground py-20 md:py-28">
        <Container className="mx-auto text-center max-w-3xl">
          <p className="text-xs tracking-widest uppercase text-primary-foreground/60 mb-6">Our Mission</p>
          <blockquote className="text-3xl md:text-5xl font-bold leading-tight">
            &ldquo;To make dressing well the easiest, most enjoyable part of your day.&rdquo;
          </blockquote>
          <p className="mt-8 text-primary-foreground/70 max-w-xl mx-auto leading-relaxed">
            Style should not be stressful. We do the sourcing, the curation, and the quality checks — so
            you can focus on wearing great clothes and getting on with your life.
          </p>
        </Container>
      </section>
    </div>
  );
};

export default AboutPage;

