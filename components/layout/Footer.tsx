import React from 'react';
import Link from 'next/link';
import { LuFacebook, LuInstagram } from 'react-icons/lu';
import { PiTiktokLogo } from 'react-icons/pi';
import Container from './Container';
import { categoriesLinks, FooterLinks } from '@/lib/static-data';
import TopFooter from './TopFooter';
import Logo from './header/Logo';
import { Input } from '../ui/input';
import { ArrowRight, MoveUpRight } from 'lucide-react';

const socials = [
  { name: 'Facebook', icon: LuFacebook, href: 'https://facebook.com' },
  { name: 'Instagram', icon: LuInstagram, href: 'https://instagram.com' },
  { name: 'TikTok', icon: PiTiktokLogo, href: 'https://tiktok.com' },
];

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gold-hairline py-12">
      <TopFooter />

      <Container className="mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {/* Brand & Socials */}
          <div className="flex flex-col space-y-6">
            <div>
              <Logo />
              <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
                Your trusted fashion destination for the latest trends and styles.
              </p>
            </div>
            
            {/* Custom Social Icons UI */}
            <div className="flex gap-4">
              {socials.map((social) => (
                <a 
                  key={social.name} 
                  href={social.href} 
                  target="_blank" 
                  className="group flex flex-col items-center gap-2"
                >
                  <div className="p-2 border border-gold-hairline rounded-full group-hover:bg-[#BFA47A] group-hover:text-white transition-all duration-300">
                    <social.icon className="size-5 text-muted-foreground " />
                  </div>
                  <span className="text-[10px] uppercase tracking-wider font-medium text-muted-foreground group-hover:text-[#BFA47A]">
                    {social.name}
                  </span>
                </a>
              ))}
            </div>
          </div>


   {/* Categories Links  */}
          <div className="lg:mx-aut">
            <h3 className="text-md font-semibold mb-4 text-foreground">Categories</h3>
            <div className="flex flex-col gap-3">
              {categoriesLinks.map((item, idx) => (
                <Link 
                  key={idx}
                  href={item.href} 
                  className=" flex items-center gap-1 w-fit text-sm text-muted-foreground hover:text-[#BFA47A] transition-colors"
                >
                  {item.title} <ArrowRight className="text-muted-foreground size-2 " />
                </Link>
              ))}
            </div>
          </div>


          {/* Quick Links */}
          <div className="">
            <h3 className="text-md font-semibold mb-4 text-foreground">Quick Links</h3>
            <div className="flex flex-col gap-3">
              {FooterLinks.map((item, idx) => (
                <Link 
                  key={idx}
                  href={item.href} 
                  className="w-fit text-sm text-muted-foreground hover:text-[#BFA47A] transition-colors"
                >
                  {item.title}
                </Link>
              ))}
            </div>
          </div>

       

          {/* Newsletter */}
          <div className="flex flex-col">
            <h3 className="text-md font-semibold mb-2 text-foreground">Newsletter</h3>
            <p className="text-sm text-muted-foreground mb-4">
Subscribe for updates on new arrivals, offers, sales and styling tips.
            </p>
            <form className="space-y-3">
              <Input
                type="email"
                placeholder="Email address"
                className="bg-[#F9F8F6] border-[#E4E0D9] focus-visible:ring-[#BFA47A]"
              />
              <button
                type="submit"
                className="cursor-pointer w-full py-2 rounded-md bg-[#BFA47A] text-white hover:bg-[#A88A66] transition-colors text-sm font-medium"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-gold-hairline flex justify-center items-center">
          <p className="text-xs text-center text-muted-foreground">
            © {currentYear} Lukuu. All rights reserved. Built by{" "}
            <a href="https://kheem.netlify.app" target="_blank" className="text-primary/70 font-medium hover:underline">
              Kheem Technologies
            </a>.
          </p>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;

