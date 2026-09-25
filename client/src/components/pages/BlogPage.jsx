import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { articles } from '../../data/catalog';

export default function BlogPage() {
  const [featured, ...more] = articles;
  return <div className="container journal-page"><div className="journal-intro"><span className="eyebrow">THE NFH JOURNAL</span><h1>Stories to <em>wear.</em></h1><p>Thoughts on personal style, everyday rituals, and the pieces in between.</p></div><Link to={`/blog/${featured.slug}`} className="featured-article grid overflow-hidden rounded-[20px]"><img src={featured.image} alt={featured.alt} /><div><span className="eyebrow">FEATURED STORY · {featured.category}</span><h2>{featured.title}</h2><p>{featured.excerpt}</p><span className="text-link">Read the story <ArrowUpRight size={18} /></span></div></Link><div className="section-heading journal-heading"><div><span className="eyebrow">THE LATEST</span><h2>More to <em>explore.</em></h2></div></div><div className="article-grid grid grid-cols-2 gap-[25px]">{more.map((article) => <Link to={`/blog/${article.slug}`} className="article-card" key={article.slug}><img src={article.image} alt={article.alt} loading="lazy" /><span className="eyebrow small">{article.category}</span><h3>{article.title}</h3><p>{article.excerpt}</p><span className="text-link">Read story <ArrowRight size={17} /></span></Link>)}</div><p className="catalog-disclaimer">Editorial preview content.</p></div>;
}
