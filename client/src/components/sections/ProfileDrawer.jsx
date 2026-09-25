import { X, UserRound, Package, Heart } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { useStore } from '../../app/useStore';
import { getProductById } from '../../features/catalog/api';
import MerchCard from '../ui/MerchCard';

const tabs = [{ id: 'profile', label: 'Profile', icon: UserRound }, { id: 'orders', label: 'Orders', icon: Package }, { id: 'likemarks', label: 'Likemarks', icon: Heart }];
export default function ProfileDrawer({ onClose }) {
  const [params, setParams] = useSearchParams();
  const tab = tabs.some((item) => item.id === params.get('tab')) ? params.get('tab') : 'profile';
  const { likes } = useStore();
  const saved = likes.map(getProductById).filter(Boolean);
  function select(id) { const next = new URLSearchParams(params); next.set('tab', id); setParams(next, { replace: true }); }
  return <div className="profile-drawer"><div className="drawer-header"><div><span className="eyebrow small">YOUR SPACE</span><h2>Account</h2></div><button data-dialog-close type="button" className="icon-button" onClick={onClose} aria-label="Close account"><X size={23} /></button></div><div className="profile-body"><nav className="profile-tabs" aria-label="Account sections">{tabs.map(({ id, label, icon: Icon }) => <button type="button" key={id} className={tab === id ? 'active' : ''} onClick={() => select(id)} aria-current={tab === id ? 'page' : undefined}><Icon size={18} />{label}</button>)}</nav><div className="profile-content">{tab === 'profile' && <div className="account-empty"><span className="empty-icon">✳</span><h3>Your style, all in one place.</h3><p>Account features will be available when sign-in is connected. For now, you can explore the collection and save likemarks in this browser.</p><Link className="button button-dark" to="/login" onClick={onClose}>Go to login</Link></div>}{tab === 'orders' && <div className="account-empty"><h3>No orders to show</h3><p>Order history will appear here after account and checkout services are available.</p></div>}{tab === 'likemarks' && (saved.length ? <div className="profile-likes">{saved.map((product) => <MerchCard key={product.id} product={product} />)}</div> : <div className="account-empty"><h3>Nothing saved yet.</h3><p>Tap the heart on any piece to keep it close.</p><Link className="button button-dark" to="/shop" onClick={onClose}>Discover pieces</Link></div>)}</div></div></div>;
}
