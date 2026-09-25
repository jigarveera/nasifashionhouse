import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { articles } from '../../data/catalog';

export default function ArticlePage() {
  const { slug } = useParams();
  const article = articles.find((item) => item.slug === slug);
  if (!article) return <div className="section container catalog-empty"><h1>Story not found.</h1><Link className="button button-dark" to="/blog">Back to the journal</Link></div>;
  const related = articles.filter((item) => item.slug !== slug).slice(0, 2);
  return <article className="article-page"><div className="container"><Link className="back-link" to="/blog"><ArrowLeft size={17} /> Back to journal</Link><header className="article-header"><span className="eyebrow">{article.category} · THE NFH JOURNAL</span><h1>{article.title}</h1><p>{article.excerpt}</p></header><img className="article-hero" src={article.image} alt={article.alt} /><div className="article-body">{article.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div><div className="related-articles"><h2>Keep reading</h2>{related.map((item) => <Link key={item.slug} to={`/blog/${item.slug}`}>{item.title}<ArrowRight size={17} /></Link>)}</div></div></article>;
}
