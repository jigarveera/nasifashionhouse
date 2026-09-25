import { useState } from 'react';
import { Plus, Minus } from 'lucide-react';

const questions = [
  { question: 'How do I find a piece in my size?', answer: 'Open a product to see its sample size options, or use the size filter in the shop. Availability shown here is part of the preview catalog.' },
  { question: 'Can I save pieces for later?', answer: 'Yes. Tap the heart on a product to add it to your likemarks in this browser. Account syncing will be added when sign-in is connected.' },
  { question: 'Is checkout available?', answer: 'The bag and checkout screen are previews. Payments and order placement will become available after the store services are connected.' },
];

export default function FAQ() {
  const [open, setOpen] = useState(0);
  return <section className="section faq-section"><div className="container faq-grid"><div><span className="eyebrow">GOOD TO KNOW</span><h2>A few <em>answers.</em></h2><p>Explore how this storefront preview works.</p></div><div className="faq-items">{questions.map((item, index) => <div className="faq-item" key={item.question}><h3><button type="button" aria-expanded={open === index} aria-controls={`faq-answer-${index}`} onClick={() => setOpen(open === index ? -1 : index)}>{item.question}{open === index ? <Minus size={19} /> : <Plus size={19} />}</button></h3>{open === index && <p id={`faq-answer-${index}`}>{item.answer}</p>}</div>)}</div></div></section>;
}
