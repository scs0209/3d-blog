import { useGLTF, Html } from '@react-three/drei';
import * as three from 'three';
import { useState, useEffect } from 'react';

const screenGlowMaterial = new three.MeshStandardMaterial({
  color: '#8ff0ff',
  emissive: '#8ff0ff',
  emissiveIntensity: 0.5,
  toneMapped: false,
});

interface ComputerProps {
  showLoading?: boolean;
  [key: string]: any;
}

// 포트폴리오 프로젝트 데이터
const portfolioProjects = [
  {
    id: 1,
    title: 'PAWSITIVE DOG FOOD',
    subtitle: 'International e-commerce platform',
    description:
      'A custom-made, responsive, fully-fledged e-commerce platform for a UK company, serving over 13K monthly visitors across the UK and Ireland. It includes a public e-commerce portal and a private customer portal, a POS, Shopify store integration, a payment gateway, detailed analytics, and more.',
    image: '/assets/images/project1.jpg',
    liveUrl: 'https://example.com',
  },
  {
    id: 2,
    title: "MERCHIANE BALI'S PORTFOLIO V1",
    subtitle: 'Personal portfolio website',
    description:
      'The first version of my portfolio website, showcasing my skills, projects, and experience as a developer. It features a 3D design and smooth navigation, emphasizing responsiveness across devices.',
    image: '/assets/images/project2.jpg',
    liveUrl: 'https://example.com',
  },
  {
    id: 3,
    title: "ZIME FUMUDOH'S PORTFOLIO",
    subtitle: 'Creative personal website',
    description:
      "A remake of Fumudoh's personal website, inspired by an award-winning Squarespace template. Built using standard web technologies, it features engaging animations created with GSAP and WebGL, enhancing the site's visual appeal and interactivity.",
    image: '/assets/images/project3.jpg',
    liveUrl: 'https://example.com',
  },
];

export function Computer({ showLoading = false, ...props }: ComputerProps) {
  const { nodes } = useGLTF('/computer.glb');
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [showPortfolio, setShowPortfolio] = useState(false);
  const [loadingBarExpanded, setLoadingBarExpanded] = useState(false);

  // 로딩 진행률 애니메이션
  useEffect(() => {
    if (showLoading) {
      setLoadingProgress(0);
      setShowPortfolio(false);
      setLoadingBarExpanded(false);

      const interval = setInterval(() => {
        setLoadingProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            console.log('로딩 완료!');
            // 로딩 완료 후 로딩바 확장 애니메이션
            setTimeout(() => {
              console.log('로딩바 확장!');
              setLoadingBarExpanded(true);
              setTimeout(() => {
                console.log('포트폴리오 갤러리 표시!');
                setShowPortfolio(true);
              }, 300);
            }, 300);
            return 100;
          }
          return prev + 4; // 4%씩 증가
        });
      }, 80); // 80ms마다 업데이트 (2초 동안)

      return () => clearInterval(interval);
    }

    setShowPortfolio(false);
    setLoadingBarExpanded(false);
  }, [showLoading]);

  return (
    <group {...props} dispose={null}>
      <mesh
        castShadow
        receiveShadow
        geometry={(nodes.Object_5 as three.Mesh)?.geometry}
        material={screenGlowMaterial}
        position={[-0.056, 0.066, 0.3]}
        scale={[0.531, 0.354, 0.001]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={(nodes.Object_7 as three.Mesh)?.geometry}
        material={screenGlowMaterial}
        position={[0.15, -0.078, 0.383]}
        scale={[0.513, 0.342, 0.001]}
      />

      {/* 메인 화면 - 로딩 또는 포트폴리오 */}
      {showLoading && (
        <Html
          position={[-0.056, 0.066, 0.301]}
          transform
          occlude
          scale={0.1}
          style={{
            width: '320px',
            height: '240px',
            background: showPortfolio ? 'rgba(0, 0, 0, 0.98)' : 'rgba(0, 0, 0, 0.95)',
            border: '2px solid #00ffff',
            borderRadius: '8px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: showPortfolio ? 'flex-start' : 'center',
            gap: showPortfolio ? '8px' : '15px',
            fontFamily: 'monospace',
            fontSize: '24px',
            color: '#00ffff',
            textShadow: '0 0 10px #00ffff',
            pointerEvents: 'none',
            boxShadow: '0 0 20px rgba(0, 255, 255, 0.3)',
            overflow: 'hidden',
            padding: showPortfolio ? '8px' : '0',
            transition: 'all 0.5s ease-out',
          }}
        >
          {!showPortfolio ? (
            // 로딩 화면
            <>
              <div
                style={{
                  fontSize: '32px',
                  fontWeight: 'bold',
                  letterSpacing: '4px',
                  textShadow: '0 0 15px #00ffff',
                  marginBottom: '10px',
                }}
              >
                WORKS
              </div>

              <div
                style={{
                  width: loadingBarExpanded ? '100%' : '240px',
                  height: loadingBarExpanded ? '100%' : '8px',
                  background: '#222',
                  borderRadius: '4px',
                  overflow: 'hidden',
                  border: '2px solid #00ffff',
                  boxShadow: '0 0 10px rgba(0, 255, 255, 0.5)',
                  transition: 'all 0.5s ease-out',
                  position: loadingBarExpanded ? 'absolute' : 'relative',
                  top: loadingBarExpanded ? '0' : 'auto',
                  left: loadingBarExpanded ? '0' : 'auto',
                }}
              >
                <div
                  style={{
                    width: `${loadingProgress}%`,
                    height: '100%',
                    background: 'linear-gradient(90deg, #00ffff, #0088ff)',
                    borderRadius: '2px',
                    boxShadow: '0 0 15px #00ffff',
                    transition: 'width 0.1s ease-out',
                  }}
                />
              </div>

              {!loadingBarExpanded && (
                <div
                  style={{
                    fontSize: '18px',
                    opacity: 0.9,
                    animation: 'pulse 2s infinite',
                    textAlign: 'center',
                  }}
                >
                  Loading projects...
                </div>
              )}
            </>
          ) : (
            // 포트폴리오 갤러리
            <>
              <div
                style={{
                  fontSize: '16px',
                  fontWeight: 'bold',
                  letterSpacing: '2px',
                  textAlign: 'center',
                  marginBottom: '8px',
                  borderBottom: '1px solid #00ffff',
                  paddingBottom: '4px',
                  width: '100%',
                }}
              >
                WORKS
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: '6px',
                  width: '100%',
                  height: '100%',
                  overflow: 'auto',
                  fontSize: '8px',
                }}
              >
                {portfolioProjects.slice(0, 4).map((project, index) => (
                  <div
                    key={project.id}
                    style={{
                      background: 'rgba(0, 20, 30, 0.8)',
                      border: '1px solid #00ffff',
                      borderRadius: '4px',
                      padding: '6px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '3px',
                    }}
                  >
                    <div
                      style={{
                        width: '100%',
                        height: '30px',
                        background: 'linear-gradient(45deg, #001122, #002244)',
                        borderRadius: '2px',
                        border: '1px solid #004466',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '6px',
                        color: '#00aacc',
                      }}
                    >
                      PROJECT {index + 1}
                    </div>

                    <div
                      style={{
                        fontWeight: 'bold',
                        fontSize: '7px',
                        lineHeight: '1.2',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {project.title}
                    </div>

                    <div
                      style={{
                        fontSize: '5px',
                        opacity: 0.8,
                        lineHeight: '1.2',
                        overflow: 'hidden',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                      }}
                    >
                      {project.subtitle}
                    </div>

                    <div
                      style={{
                        marginTop: 'auto',
                        padding: '2px 4px',
                        background: 'rgba(0, 255, 255, 0.1)',
                        border: '1px solid #00ffff',
                        borderRadius: '2px',
                        fontSize: '5px',
                        textAlign: 'center',
                        cursor: 'pointer',
                      }}
                    >
                      VIEW LIVE
                    </div>
                  </div>
                ))}
              </div>

              <div
                style={{
                  position: 'absolute',
                  top: '8px',
                  right: '8px',
                  padding: '2px 6px',
                  background: 'rgba(0, 0, 0, 0.8)',
                  border: '1px solid #00ffff',
                  borderRadius: '2px',
                  fontSize: '6px',
                  cursor: 'pointer',
                }}
              >
                EXIT
              </div>
            </>
          )}
        </Html>
      )}

      {/* 보조 화면에도 간단한 로딩 표시 */}
      {showLoading && !showPortfolio && (
        <Html
          position={[0.15, -0.078, 0.384]}
          transform
          occlude
          scale={0.08}
          style={{
            width: '300px',
            height: '200px',
            background: 'rgba(0, 0, 0, 0.9)',
            border: '2px solid #00ffff',
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'monospace',
            fontSize: '20px',
            color: '#00ffff',
            textShadow: '0 0 8px #00ffff',
            pointerEvents: 'none',
            boxShadow: '0 0 15px rgba(0, 255, 255, 0.2)',
          }}
        >
          <div
            style={{
              textAlign: 'center',
              animation: 'pulse 1.5s infinite',
              fontWeight: 'bold',
              letterSpacing: '2px',
            }}
          >
            SYSTEM
            <br />
            LOADING...
          </div>
        </Html>
      )}
    </group>
  );
}

useGLTF.preload('/computer.glb');
