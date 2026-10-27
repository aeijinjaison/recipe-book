import { Link, NavLink } from 'react-router-dom';

export default function Header() {
  return (
    <header className="site-header">
      <div className="container site-header__inner">
        <Link to="/" className="wordmark">
          Larder<span>.</span>
        </Link>
        <nav className="site-nav">
          <NavLink to="/" end className="site-nav__link">
            Recipes
          </NavLink>
          <Link to="/new" className="btn btn--solid">
            New recipe
          </Link>
        </nav>
      </div>
    </header>
  );
}
