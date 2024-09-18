const Header = () => {
  return (
    <header className="absolute top-0 left-0 right-0 z-10 p-4">
      <nav>
        <ul className="flex justify-center space-x-4">
          {[
            'Home',
            'Memento',
            'Designs',
            'Discover',
            'Trends',
            'Albums',
            'Blogs',
          ].map((item) => (
            <li key={item}>
              <a
                href={`/${item.toLowerCase()}`}
                className="text-black transition-colors hover:text-gray-600"
              >
                {item}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
