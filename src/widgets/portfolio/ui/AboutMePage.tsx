export function AboutMePage() {
  const aboutMeData = {
    name: 'MEROUANE BALI',
    title: 'FULL STACK WEB DEVELOPER',
    bio: `Hi, I'm Merouane Bali, a passionate Full-Stack Web Developer with over three years of experience building dynamic, user-focused web applications and e-commerce platforms. I specialize in creating seamless digital experiences. From designing interactive front-end interfaces to architecting robust back-end systems, I thrive at every layer of the development stack. My expertise includes working with Frameworks like React.js, Next.js, and Express, as well as integrating APIs that enhance functionality and performance.\nAt the heart of my work is a commitment to combining creativity and functionality. I believe that great development goes beyond clean code--it's about crafting experiences that resonate with users and help businesses thrive. Whether I'm improving a platform's scalability, designing intuitive user interfaces, or exploring the latest technologies, my goal is to deliver solutions that make an impact.`,
    sections: [
      { key: 'quick-bio', label: 'QUICK BIO' },
      { key: 'background', label: 'BACKGROUND' },
      { key: 'focus', label: 'CURRENT FOCUS' },
      { key: 'hobbies', label: 'HOBBIES' },
    ],
    profileImage: '/profile.png',
    socials: [
      { type: 'github', url: 'https://github.com/yourid' },
      { type: 'linkedin', url: 'https://linkedin.com/in/yourid' },
      { type: 'email', url: 'mailto:your@email.com' },
    ],
  };

  return (
    <div
      className='fixed top-0 left-0 h-screen w-screen backdrop-blur-[2px] bg-transparent'
      style={{
        maxWidth: 'calc(4rem + 50vw)',
        maskImage: 'linear-gradient(to right, white 50%, transparent 100%)',
        opacity: 1,
      }}
    >
      <div
        className='fixed pl-4 mt-16 h-screen max-w-[50vw] flex flex-col gap-4 overflow-y-hidden'
        style={{
          top: '48px',
          maxHeight: 'calc(-128px - 8rem + 100vh)',
        }}
      >
        {/* 섹션 네온 탭 */}
        <div className='flex gap-4 ml-4'>
          {aboutMeData.sections.map((section, i) => (
            <div key={section.key} className='flex flex-col items-center'>
              <span className='text-cyan-200 text-xs font-mono neon-glow mb-1'>SEC-{i}</span>
              <span className='px-6 py-2 border-b-2 border-cyan-400 text-cyan-100 text-lg font-bold tracking-widest neon-glow uppercase'>
                {section.label}
              </span>
            </div>
          ))}
        </div>
        {/* 본문: 좌측 텍스트, 우측 프로필 */}
        <div className='flex flex-row gap-8 items-start mt-4'>
          <div className='flex-1 min-w-0'>
            <div className='bg-transparent rounded-xl p-2'>
              {aboutMeData.bio.split('\n').map((line, idx) => (
                <p key={line} className='text-cyan-100 text-base font-mono mb-2 leading-relaxed'>
                  {line}
                </p>
              ))}
            </div>
          </div>
          <div className='flex-shrink-0 ml-4'>
            <div className='w-64 h-64 rounded-md shadow-2xl neon-glow flex items-center justify-center bg-black/60 overflow-hidden'>
              <img src={aboutMeData.profileImage} alt='profile' className='w-56 h-56 object-cover' />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
