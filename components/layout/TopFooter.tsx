import { Clock, Mail, MapPin, Phone } from 'lucide-react';
import React from 'react';
import Container from './Container';

interface FooterLinkProps {
  title: string;
  subtitle?: string;
  icon: React.ReactNode;
  href: string;
}

const data: FooterLinkProps[] = [
  {
    title: "Visit Us",
    subtitle: "123 Fashion Street, Nairobi",
    icon: <MapPin size={20} />,
    href: "https://goo.gl/maps/your-store-location"
  },
  {
    title: "Prefer a Call?",
    subtitle: "+254 769 403162",
    icon: <Phone size={20} />,
    href: "tel:+254769403162"
  },
  {
    title: "Working Hours",
    subtitle: "Mon-Sat: 9AM - 6PM",
    icon: <Clock size={20} />,
    href: "#"
  },
  {
    title: "Email Us",
    subtitle: "hakheem.dev@gmail.com",
    icon: <Mail size={20} />, // Fixed icon to Mail
    href: "mailto:hakheem.dev@gmail.com"
  },
];

const TopFooter = () => {
  return (
    <div className="border-b border-gold-hairline mb-12">
      <Container>
        <div className="grid mx-auto grid-cols-2 lg:grid-cols-4 divide-x-[1px] divide-gold-hairline/30">
          {data.map((item, index) => (
            <a
              key={index}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col items-center text-center p-6 transition-colors"
            >
              <div className="mb-3 text-muted-foreground group-hover:text-[#BFA47A] transition-colors">
                {item.icon}
              </div>
              <h3 className="font-semibold text-sm group-hover:text-[#BFA47A] transition-colors">
                {item.title}
              </h3>
              <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                {item.subtitle}
              </p>
            </a>
          ))}
        </div>
      </Container>
    </div>
  );
};

export default TopFooter;

