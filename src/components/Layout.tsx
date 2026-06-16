import type { ReactNode } from 'react';

type LayoutProps = {
  children: ReactNode;
};

export function Layout({ children }: LayoutProps) {
  return (
    <div className="layout">
      <header className="layout__header">
        <div>
          <p className="layout__eyebrow">Portfolio demo</p>
          <h1 className="layout__title">GitHub Insights Dashboard</h1>
        </div>
        <p className="layout__subtitle">
          Live data from the GitHub REST API
        </p>
      </header>
      <main className="layout__main">{children}</main>
    </div>
  );
}
