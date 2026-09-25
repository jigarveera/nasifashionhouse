import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function PageNotFound() {
  return <div className="not-found container"><span className="eyebrow">404 · A LITTLE DETOUR</span><div className="not-found-number">4<span>✳</span>4</div><h1>Not quite your <em>look.</em></h1><p>That page is not here, but there is plenty more to discover.</p><div><Link to="/shop" className="button button-dark">Explore the shop <ArrowRight size={17} /></Link><Link to="/" className="button button-outline">Back home</Link></div></div>;
}
