import ChatFAQ from '../ui/ChatFAQ';

const questions = [
  { question: 'How do I choose my size?', answer: 'Open a product to see its available sizes. Tap the info icon beside Size for a general size guide; exact garment measurements can vary by style.' },
  { question: 'Can I save a piece I like?', answer: 'Yes. Tap the heart on a product to mark it as a favorite during this visit.' },
  { question: 'How should I care for my piece?', answer: 'Each product page includes material and general care guidance. Follow the label on your item for exact washing and ironing instructions.' },
  { question: 'Can I place an order here?', answer: 'This storefront is a preview. You can explore products and use the demo bag, but checkout and payments are not connected yet.' },
];

export default function FAQ() {
  return <ChatFAQ className="home-faq" items={questions} />;
}
