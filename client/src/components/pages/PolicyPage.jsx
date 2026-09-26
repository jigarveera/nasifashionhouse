import { useEffect } from 'react';
import { ArrowLeft, ArrowUpRight, Mail, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';
import { storeContact } from '../../data/legalPages';

export default function PolicyPage({ page }) {
  useEffect(() => {
    document.title = `${page.title} | Nasi Fashion House`;
    document.querySelector('meta[name="description"]')?.setAttribute('content', page.description);
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [page]);

  return <main className="policy-page mobile-page mx-auto min-h-screen max-w-[880px] pb-24 pt-[112px]" aria-labelledby="policy-title">
    <Link className="policy-back" to="/"><ArrowLeft size={17} aria-hidden="true" /> Back to home</Link>
    <header className="policy-header">
      <p className="policy-eyebrow">NASI FASHION HOUSE / LEGAL</p>
      <h1 id="policy-title">{page.title}</h1>
      <p className="policy-lead">{page.intro}</p>
      <span className="policy-updated">Last updated {page.updated}</span>
    </header>

    <div className="policy-sections">
      {page.sections.map((section, index) => <section className="policy-section" key={section.heading} aria-labelledby={`policy-section-${index}`}>
        <span className="policy-section-number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
        <div><h2 id={`policy-section-${index}`}>{section.heading}</h2>{section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div>
      </section>)}
    </div>

    <aside className="policy-contact" aria-labelledby="policy-contact-title">
      <p className="policy-eyebrow">NEED HELP?</p>
      <h2 id="policy-contact-title">Talk to us directly.</h2>
      <p>For a question about this policy or a purchase, use the contact details below.</p>
      <div className="policy-contact-links">
        <a href={storeContact.emailHref}><Mail size={17} aria-hidden="true" /> {storeContact.email} <ArrowUpRight size={15} aria-hidden="true" /></a>
        <a href={storeContact.phoneHref}><Phone size={17} aria-hidden="true" /> {storeContact.phoneDisplay} <ArrowUpRight size={15} aria-hidden="true" /></a>
      </div>
    </aside>
  </main>;
}
