import Container from '@/components/layout/Container';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { MapPin, Phone, Mail, Clock, MessageCircle } from 'lucide-react';
import { LuFacebook, LuInstagram } from 'react-icons/lu'
import { PiTiktokLogo } from 'react-icons/pi'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { faqs } from '@/lib/static-data';


const contactDetails = [
  {
    icon: MapPin,
    label: 'Visit Our Studio',
    value: '123 Fashion Street, Suite 456, Nairobi, Kenya',
  },
  {
    icon: Phone,
    label: 'Call or WhatsApp',
    value: '+254 769 403162',
  },
  {
    icon: Mail,
    label: 'Email Us',
    value: 'hakheem.dev@gmail.com',
  },
  {
    icon: Clock,
    label: 'Working Hours',
    value: 'Mon–Sat: 9AM – 6PM · Sun: 2PM – 8PM',
  },
];

const socials = [
  { icon: LuInstagram, label: 'Instagram', handle: '@lukuu.ea', href: 'https://www.instagram.com/lukuu.ea' },
  { icon: LuFacebook, label: 'Facebook', handle: 'Lukuu Fashion', href: 'https://www.facebook.com/lukuu EA' },
  { icon: PiTiktokLogo, label: 'TikTok', handle: 'Lukuu', href: 'https://www.tiktok.com/@lukuu' },
  { icon: MessageCircle, label: 'WhatsApp', handle: '+254 769 403162', href: 'https://wa.me/254769403162' },
];

const ContactPage = () => {
  return (
    <div className="overflow-x-hidden">
      {/* Hero */}
      <section className="bg-primary text-primary-foreground py-20 md:py-28">
        <Container className="mx-auto max-w-3xl text-center">
          <Badge variant="secondary" className="mb-6 px-4 py-1  text-xs tracking-widest uppercase">
            We respond within 24 hours
          </Badge>
          <h1 className="text-4xl md:text-6xl title font-bold leading-tight mb-4">
            Let's talk <span className="italic font-light">fashion.</span>
          </h1>
          <p className="text-primary-foreground/70 text-lg max-w-xl mx-auto ">
            Whether it's a question about an order, a styling question, or just a great outfit idea —
            we are here and happy to help.
          </p>
        </Container>
      </section>

      {/* Main Grid: Form + Contact Info */}
      <section className="py-20">
        <Container className="mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">

            {/* Form */}
            <div className="space-y-8">
              <div>
                <p className="text-xs tracking-widest uppercase text-muted-foreground mb-2">Send a Message</p>
                <h2 className="text-2xl font-bold">Drop us a note</h2>
                <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                  Fill in the form below and a member of our team will get back to you within one business
                  day. For urgent matters, WhatsApp us directly.
                </p>
              </div>

              <form className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Input placeholder="First Name" className="bg-secondary border-border" />
                  <Input placeholder="Last Name" className="bg-secondary border-border" />
                </div>
                <Input type="email" placeholder="Email Address" className="bg-secondary border-border" />
                <Input placeholder="Subject (e.g. Order #1234)" className="bg-secondary border-border" />
                <Textarea
                  placeholder="How can we help you? The more detail, the better."
                  className="min-h-[160px] bg-secondary border-border"
                />
                <Button type="submit" className="w-full" size="lg">
                  Send Message
                </Button>
              </form>
            </div>

            {/* Contact Info + Socials */}
            <div className="space-y-10">
              <div className="bg-secondary rounded-2xl border border-border p-8 space-y-7">
                <div>
                  <p className="text-xs tracking-widest uppercase text-muted-foreground mb-1">Store Information</p>
                  <h2 className="text-xl font-semibold">Find us, call us, or write to us.</h2>
                </div>
                <div className="space-y-6">
                  {contactDetails.map((item) => {
                    const Icon = item.icon;
                    return (
                      <div key={item.label} className="flex gap-4 items-start">
                        <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                          <Icon className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">{item.label}</p>
                          <p className="text-muted-foreground text-sm">{item.value}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Socials */}
              <div>
                <p className="text-xs tracking-widest uppercase text-muted-foreground mb-4">Follow Along</p>
                <div className="grid grid-cols-2 gap-3">
                  {socials.map((s) => {
                    const Icon = s.icon;
                    return (
                      <a
                        key={s.label}
                        href={s.href}
                        className="flex items-center gap-3 p-4 rounded-xl border border-border bg-card hover:bg-secondary transition-colors"
                      >
                        <Icon className="w-4 h-4 text-primary shrink-0" />
                        <div>
                          <p className="text-xs font-semibold">{s.label}</p>
                          <p className="text-xs text-muted-foreground">{s.handle}</p>
                        </div>
                      </a>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <Separator />

      {/* FAQ */}
      <section className="py-20 md:py-28 bg-secondary/40">
        <Container className="mx-auto max-w-3xl">
          <div className="text-center mb-12">
            <p className="text-xs tracking-widest uppercase text-muted-foreground mb-2">Got Questions?</p>
            <h2 className="text-3xl font-bold">Frequently Asked Questions</h2>
            <p className="text-muted-foreground mt-3 text-sm">
              Quick answers to the things people ask us most. Still need help? Just send us a message above.
            </p>
          </div>
        
          <Accordion 
                multiple={false} 
                className="w-full" 
                defaultValue={["item-0"]}
              >
                {faqs.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`} className="border-b border-gold-hairline">
                    <AccordionTrigger className="py-4 text-left font-medium hover:text-[#BFA47A] transition-colors hover:no-underline">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="pb-4 text-sm text-muted-foreground leading-relaxed">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
        
        </Container>
      </section>

      {/* CTA Banner */}
      <section className="bg-primary text-primary-foreground py-16">
        <Container className="mx-auto text-center max-w-xl">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">Prefer to chat directly?</h2>
          <p className="text-primary-foreground/70 mb-6 text-sm">
            WhatsApp is the fastest way to reach us for order updates, styling advice or anything urgent.
          </p>
          <Button variant="secondary" size="lg">
            <a href="https://wa.me/254769403162" target="_blank" rel="noreferrer" className="flex items-center">
              <MessageCircle className="w-4 h-4 mr-2" />
              Chat on WhatsApp
            </a>
          </Button>
        </Container>
      </section>
    </div>
  );
};

export default ContactPage;


