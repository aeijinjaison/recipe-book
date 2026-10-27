import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="container">
      <div className="empty">
        <h2>This page does not exist</h2>
        <p>The address may be mistyped.</p>
        <Link to="/" className="btn btn--solid">
          Back to recipes
        </Link>
      </div>
    </div>
  );
}
