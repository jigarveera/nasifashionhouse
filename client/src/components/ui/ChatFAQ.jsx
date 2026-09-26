import { useEffect, useId, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Send, UserRound } from 'lucide-react';
import NasiWomanIcon from './NasiWomanIcon';

export default function ChatFAQ({ items, className = '' }) {
  const headingId = useId();
  const reducedMotion = useReducedMotion();
  const [statuses, setStatuses] = useState({});
  const timersRef = useRef([]);

  useEffect(() => {
    const timers = timersRef.current;
    return () => timers.forEach((timer) => window.clearTimeout(timer));
  }, []);

  function revealAnswer(question) {
    if (statuses[question]) return;
    setStatuses((current) => ({ ...current, [question]: 'typing' }));
    timersRef.current.push(window.setTimeout(() => {
      setStatuses((current) => ({ ...current, [question]: 'answered' }));
    }, 1000));
  }

  return (
    <section className={`chat-faq ${className}`} aria-labelledby={headingId}>
      <h2 id={headingId} className="m-0 text-[23px] font-medium">FAQs</h2>
      <div className="mt-5 space-y-4">
        {items.map((item, index) => {
          const status = index === 0 ? 'answered' : statuses[item.question];
          return (
            <div key={item.question} className="space-y-3">
              <div className={`product-chat-row flex items-end gap-2.5 ${index > 0 ? 'product-chat-prompt' : ''}`}>
                <span className="product-chat-avatar grid size-10 shrink-0 place-items-center rounded-[14px]" aria-hidden="true"><UserRound size={21} strokeWidth={1.7} /></span>
                <p className="product-chat-bubble product-chat-question m-0 min-w-0">{item.question}</p>
                {index > 0 && !status && <button className="product-chat-send ml-auto grid size-10 shrink-0 place-items-center rounded-full" type="button" onClick={() => revealAnswer(item.question)} aria-label={`Send question: ${item.question}`}><Send size={17} strokeWidth={1.8} aria-hidden="true" /></button>}
              </div>
              <AnimatePresence initial={false}>
                {status && (
                  <motion.div className="product-chat-row flex items-end justify-end gap-2.5" initial={{ opacity: 0, y: 7 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reducedMotion ? 0 : 0.2 }}>
                    {status === 'typing' ? (
                      <div className="product-chat-bubble product-chat-answer product-chat-typing flex items-center gap-1.5" role="status" aria-label="Nasi Fashion House is typing"><span /><span /><span /></div>
                    ) : <p className="product-chat-bubble product-chat-answer m-0" role={index > 0 ? 'status' : undefined}>{item.answer}</p>}
                    <NasiWomanIcon className="product-chat-woman size-10 shrink-0 rounded-[14px]" />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </section>
  );
}
