import { Link, Outlet } from '@tanstack/react-router';
import styles from './app.module.css';

// Persistent chrome for the shell. <Outlet /> renders the active route - the
// home overview or a federated provider page.
export function Layout() {
  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <Link to="/" className={styles.brand}>
            <span className={styles.brandMark}>◆</span> MFE Store
          </Link>
          <nav className={styles.nav}>
            <Link
              to="/"
              className={styles.navLink}
              activeProps={{ className: styles.navLinkActive }}
              activeOptions={{ exact: true }}
            >
              Home
            </Link>
            <Link
              to="/shop"
              className={styles.navLink}
              activeProps={{ className: styles.navLinkActive }}
            >
              Shop
            </Link>
            <Link
              to="/cart"
              className={styles.navLink}
              activeProps={{ className: styles.navLinkActive }}
            >
              Cart
            </Link>
          </nav>
        </div>
      </header>

      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
