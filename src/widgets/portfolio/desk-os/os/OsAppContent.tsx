'use client';

import { experiences } from '@/entities/portfolio/model/constants/experienceConstants';
import { aboutMeData } from '@/widgets/portfolio/consts';
import { portfolioProjects } from '@/widgets/portfolio/consts/portfolioProject';
import { skillSections } from '@/widgets/portfolio/consts/skillSections';
import type { OsAppId } from '../types';

export const OsAppContent = ({ id }: { id: OsAppId }) => {
  if (id === 'welcome') {
    return (
      <div className='flex h-full flex-col gap-4'>
        <h3 className='text-2xl font-bold text-[#5ad8ff]'>VOID OS [Version 1.0]</h3>
        <p className='text-base leading-relaxed'>
          Welcome to the observatory. Open an icon, or use Start, to unfold a folder.
        </p>
        <p className='text-base'>
          This station belongs to {aboutMeData.name} — {aboutMeData.title}.
        </p>
        <ul className='grid grid-cols-2 gap-2 text-sm text-[#9ec4dc]'>
          <li className='border border-[#5ad8ff]/25 bg-[#101828] px-3 py-2'>Display: locked</li>
          <li className='border border-[#5ad8ff]/25 bg-[#101828] px-3 py-2'>Input: pointer + keys</li>
          <li className='border border-[#5ad8ff]/25 bg-[#101828] px-3 py-2'>Shell: VOID / 1.0</li>
          <li className='border border-[#5ad8ff]/25 bg-[#101828] px-3 py-2'>Locale: ko-KR</li>
        </ul>
        <p className='mt-auto text-[#7affc4]'>Tip: Press ESC to step back from the monitor.</p>
      </div>
    );
  }

  if (id === 'about') {
    return (
      <div className='flex flex-col gap-4'>
        {aboutMeData.sections.map((section) => (
          <section key={section.key}>
            <h3 className='mb-1 text-base font-bold text-[#5ad8ff]'>{section.label}</h3>
            {section.paragraphs.map((paragraph) => (
              <p key={paragraph} className='mb-2 leading-relaxed text-[#c8e4ff]'>
                {paragraph}
              </p>
            ))}
          </section>
        ))}
      </div>
    );
  }

  if (id === 'experience') {
    return (
      <div className='flex flex-col gap-4'>
        {experiences.map((item) => (
          <section key={item.id} className='border border-[#5ad8ff]/25 bg-[#101828] p-3'>
            <h3 className='font-bold text-[#d8f4ff]'>
              {item.role} — {item.company}
            </h3>
            <p className='mb-2 text-[#7aa0c0]'>
              {item.period} · {item.location}
            </p>
            <ul className='list-disc pl-4 text-[#c8e4ff]'>
              {item.description.map((line) => (
                <li key={line} className='mb-1'>
                  {line}
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    );
  }

  if (id === 'projects') {
    return (
      <div className='flex flex-col gap-4'>
        {portfolioProjects.map((project) => (
          <section key={project.id} className='border border-[#5ad8ff]/25 p-3'>
            <h3 className='font-bold text-[#d8f4ff]'>{project.title}</h3>
            <p className='mb-2 text-[#7aa0c0]'>{project.subtitle}</p>
            <p className='mb-2 text-[#c8e4ff]'>{project.description}</p>
            {project.liveUrl && (
              <a className='text-[#5ad8ff] underline' href={project.liveUrl} target='_blank' rel='noreferrer'>
                Open site
              </a>
            )}
            {project.sourceUrl && (
              <a className='ml-3 text-[#5ad8ff] underline' href={project.sourceUrl} target='_blank' rel='noreferrer'>
                Source
              </a>
            )}
          </section>
        ))}
      </div>
    );
  }

  if (id === 'skills') {
    return (
      <div className='grid grid-cols-2 gap-3'>
        {skillSections.map((section) => (
          <section key={section.title} className='border border-[#5ad8ff]/25 p-2'>
            <h3 className='mb-2 font-bold text-[#5ad8ff]'>{section.title}</h3>
            <ul className='flex flex-wrap gap-1'>
              {section.items.map((item) => (
                <li key={item.name} className='border border-[#5ad8ff]/20 bg-[#101828] px-2 py-0.5 text-[#d8f4ff]'>
                  {item.name}
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    );
  }

  return (
    <div className='flex flex-col gap-3'>
      <p>Send a ping across the void.</p>
      {aboutMeData.socials.map((social) => (
        <a key={social.type} className='text-[#5ad8ff] underline' href={social.url}>
          {social.type}: {social.url.replace('mailto:', '')}
        </a>
      ))}
    </div>
  );
};
