'use client';

import { createContext, useContext } from 'react';

export const BlogScrollContext = createContext<HTMLElement | null>(null);

export const useBlogScrollRoot = () => useContext(BlogScrollContext);
