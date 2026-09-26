import { Link } from 'react-router-dom';
import { mobileCategories } from '../../data/mobileCategories';

export default function CategoryRail({ navigation = false, selectedCategories = ['all'], onToggle }) {
  return (
    <div className="category-rail flex gap-2 overflow-x-auto pb-2" role="group" aria-label="Shop by category">
      {mobileCategories.map(({ id, name, icon: Icon }) => {
        const content = <>
          <span className="category-pill-icon grid size-[36px] shrink-0 place-items-center rounded-full">
            <Icon size={17} strokeWidth={1.65} aria-hidden="true" />
          </span>
          <span>{name}</span>
        </>;
        const className = `category-pill inline-flex h-[46px] shrink-0 items-center gap-[9px] rounded-full py-1 pl-1 pr-4 text-[14px] font-medium whitespace-nowrap ${!navigation && selectedCategories.includes(id) ? 'is-selected' : ''}`;

        return navigation ? (
          <Link key={id} className={className} to={id === 'all' ? '/shop' : `/shop?category=${id}`}>{content}</Link>
        ) : (
          <button key={id} className={className} type="button" onClick={() => onToggle(id)} aria-pressed={selectedCategories.includes(id)}>{content}</button>
        );
      })}
    </div>
  );
}
