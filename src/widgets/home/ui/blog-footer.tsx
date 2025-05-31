import Link from 'next/link';

export function BlogFooter() {
  return (
    <footer className='bg-gray-800 text-black py-8 w-full'>
      <div className='container mx-auto px-4'>
        <div className='flex flex-wrap justify-between'>
          <div className='w-full md:w-1/3 mb-6 md:mb-0'>
            <h2 className='text-2xl font-bold mb-4'>TechBlog</h2>
            <p className='text-gray-400'>Exploring the world of technology, one post at a time.</p>
          </div>
          <div className='w-full md:w-1/3 mb-6 md:mb-0'>
            <h3 className='text-xl font-bold mb-4'>Quick Links</h3>
            <ul className='space-y-2'>
              <li>
                <Link href='/' className='hover:text-gray-300'>
                  Home
                </Link>
              </li>
              <li>
                <Link href='/' className='hover:text-gray-300'>
                  About
                </Link>
              </li>
              <li>
                <Link href='/' className='hover:text-gray-300'>
                  Contact
                </Link>
              </li>
              <li>
                <Link href='/' className='hover:text-gray-300'>
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
          <div className='w-full md:w-1/3'>
            <h3 className='text-xl font-bold mb-4'>Connect With Us</h3>
            <ul className='space-y-2'>
              <li>
                <a
                  href='https://twitter.com/techblog'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='hover:text-gray-300'
                >
                  Twitter
                </a>
              </li>
              <li>
                <a
                  href='https://facebook.com/techblog'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='hover:text-gray-300'
                >
                  Facebook
                </a>
              </li>
              <li>
                <a
                  href='https://linkedin.com/company/techblog'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='hover:text-gray-300'
                >
                  LinkedIn
                </a>
              </li>
              <li>
                <a
                  href='https://github.com/techblog'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='hover:text-gray-300'
                >
                  GitHub
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className='mt-8 pt-8 border-t border-gray-700 text-center text-gray-400'>
          <p>&copy; {new Date().getFullYear()} TechBlog. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
