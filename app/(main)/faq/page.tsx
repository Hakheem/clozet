import Container from '@/components/layout/Container';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import React from 'react';

const faqs = [
  {
    question: "How long does delivery take within Nairobi?",
    answer: "For orders within Nairobi, we offer same-day or next-day delivery. Standard shipping across Kenya typically takes 2-3 business days."
  },
  {
    question: "What is your return policy?",
    answer: "We accept returns within 7 days of delivery for items in original condition with tags attached. Please note that sale items and intimate wear are final sale."
  },
  {
    question: "Do you offer international shipping?",
    answer: "Currently, we primarily serve the Kenyan market, but we are working on expanding our logistics to support international orders soon. Stay tuned!"
  },
  {
    question: "How do I know my size?",
    answer: "Each product page features a detailed size guide. If you are between sizes, we generally recommend sizing up for a more comfortable fit, or contacting our team for specific measurements."
  },
  {
    question: "Can I cancel my order?",
    answer: "Orders can be cancelled within 2 hours of placement. After that, the order is likely processed and prepared for dispatch."
  }
];

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

