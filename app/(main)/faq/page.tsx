import Container from '@/components/layout/Container';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import React from 'react';
import { faqs } from '@/lib/static-data';


const FAQPage = () => {
  return (
    <Container className="py-16 max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold mb-4 text-foreground">Frequently Asked Questions</h1>
        <p className="text-muted-foreground">Everything you need to know about shopping with Lukuu.</p>
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

      <div className="mt-16 p-8 bg-[#F9F8F6] rounded-lg text-center border border-gold-hairline">
        <p className="font-semibold mb-2 text-foreground">Still have questions?</p>
        <p className="text-sm text-muted-foreground mb-4">We are here to help you 24/7.</p>
        <a href="/contact" className="text-[#BFA47A] font-medium hover:underline text-sm inline-flex items-center gap-2">
          Contact Support <span>→</span>
        </a>
      </div>
    </Container>
  );
};

export default FAQPage;

