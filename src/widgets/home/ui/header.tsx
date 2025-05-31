'use client';

import { useState } from 'react';

import { Button } from '@/shadcn-ui/components/ui/button';
import { Input } from '@/shadcn-ui/components/ui/input';
import { Menu, X } from 'lucide-react';
import Link from 'next/link';

export function BlogHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className='bg-white shadow-md w-full'>
      <div className='container mx-auto px-4'>
        <div className='flex items-center justify-between h-16'>
          <div className='flex items-center'>
            <Link href='/' className='text-2xl font-bold text-gray-800'>
              TechBlog
            </Link>
          </div>

          <nav className='hidden md:flex space-x-4'>
            <Link href='/' className='text-gray-600 hover:text-gray-800'>
              Home
            </Link>
            <Link href='/' className='text-gray-600 hover:text-gray-800'>
              Categories
            </Link>
            <Link href='/' className='text-gray-600 hover:text-gray-800'>
              About
            </Link>
            <Link href='/' className='text-gray-600 hover:text-gray-800'>
              Contact
            </Link>
          </nav>

          <div className='hidden md:flex items-center space-x-4'>
            <form className='relative'>
              <Input
                type='search'
                placeholder='Search...'
                className='pl-8 pr-2 py-1 rounded-full border border-gray-300 focus:outline-none focus:border-blue-500'
              />
              <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                <svg
                  className='h-4 w-4 text-gray-400'
                  fill='none'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='2'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                >
                  <title>Search</title>
                  <path d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' />
                </svg>
              </div>
            </form>
            <Button asChild>
              <Link href='/blog/new'>New Post</Link>
            </Button>
          </div>

          <div className='md:hidden'>
            <Button variant='ghost' size='icon' onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label='Toggle menu'>
              {isMenuOpen ? <X /> : <Menu />}
            </Button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className='md:hidden'>
          <div className='px-2 pt-2 pb-3 space-y-1 sm:px-3'>
            <Link
              href='/'
              className='block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50'
            >
              Home
            </Link>
            <Link
              href='/'
              className='block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50'
            >
              Categories
            </Link>
            <Link
              href='/'
              className='block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50'
            >
              About
            </Link>
            <Link
              href='/'
              className='block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50'
            >
              Contact
            </Link>
          </div>
          <div className='px-4 py-3'>
            <form className='relative'>
              <Input
                type='search'
                placeholder='Search...'
                className='w-full pl-8 pr-2 py-1 rounded-full border border-gray-300 focus:outline-none focus:border-blue-500'
              />
              <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                <svg
                  className='h-4 w-4 text-gray-400'
                  fill='none'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='2'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                >
                  <title>Search</title>
                  <path d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' />
                </svg>
              </div>
            </form>
            <div className='mt-3'>
              <Button asChild className='w-full'>
                <Link href='/blog/new'>New Post</Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
