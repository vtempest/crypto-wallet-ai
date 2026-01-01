'use client';

import SettingsButton from '../Settings/SettingsButton';

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="bg-light-primary dark:bg-dark-primary min-h-screen">
      <div className="absolute top-4 right-4 z-50">
        <SettingsButton />
      </div>
      <div className="max-w-screen-lg lg:mx-auto">{children}</div>
    </main>
  );
};

export default Layout;
