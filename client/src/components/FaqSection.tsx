import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Link } from "wouter";

const faqItems = [
  {
    question: "How long does shipping take?",
    answer: "Standard shipping typically takes 3-5 business days within the continental US. Express shipping options are available at checkout for 1-2 business day delivery."
  },
  {
    question: "Do you offer international shipping?",
    answer: "Yes, we ship to select international destinations. Shipping times and costs vary by location. Please check our shipping policy page for more details."
  },
  {
    question: "What is your return policy?",
    answer: "We offer a 30-day return policy on most items. Products must be in their original condition with all packaging. Custom-made items are not eligible for return unless damaged."
  },
  {
    question: "Do you offer assembly services?",
    answer: "Yes, we offer professional assembly services in select areas for an additional fee. You can add this service during checkout if it's available in your location."
  },
  {
    question: "What warranty do your products have?",
    answer: "Our products come with varying warranties depending on the item and manufacturer. Most furniture items include a 1-year warranty against manufacturing defects. Premium collections may offer extended warranties."
  }
];

export default function FaqSection() {
  return (
    <section className="section-medium bg-[hsl(var(--theme-light))]">
      <div className="container h-full flex flex-col justify-center">
        <div className="max-w-3xl mx-auto w-full">
          <h2 className="text-2xl md:text-3xl font-heading font-bold mb-10 text-center">
            Frequently Asked Questions
          </h2>
          
          <Accordion type="single" collapsible className="space-y-4">
            {faqItems.map((item, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="bg-white rounded-lg overflow-hidden shadow-sm"
              >
                <AccordionTrigger className="px-4 py-4 font-medium hover:no-underline">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4 pt-0 text-[hsl(var(--theme-secondary))]">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
          
          <div className="mt-8 text-center">
            <Link href="/faq">
              <Button className="btn-primary rounded-full">
                View All FAQs
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
