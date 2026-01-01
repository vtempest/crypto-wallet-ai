const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className=" bg-light-primary dark:bg-dark-primary min-h-screen">
      <div className="max-w-screen-lg lg:mx-auto ">{children}</div>

    </main>
  );
};

export default Layout;
