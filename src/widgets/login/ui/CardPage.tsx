'use client';

import { useMemo, useRef, Suspense } from 'react';
import { useFrame } from '@react-three/fiber';
import { easing, geometry } from 'maath';
import { Root, Container, Text, Content } from '@react-three/uikit';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Button,
  Switch,
  colors,
} from '@react-three/uikit-default';
import { BellRing, Check } from '@react-three/uikit-lucide';
import {
  Environment,
  MeshPortalMaterial,
  PerspectiveCamera,
} from '@react-three/drei';
import { signal } from '@preact/signals-core';
import { Physical } from './Simulation';

const notifications = [
  { title: 'Your call has been confirmed.', description: '1 hour ago' },
];
const cardGeometry = new geometry.RoundedPlaneGeometry(1, 1, 0.025);

export function CardPage() {
  const openRef = useRef(false);
  const translateY = useMemo(() => signal(-460), []);
  const translateZ = useMemo(() => signal(0), []);

  useFrame((_, delta) => {
    easing.damp(translateY, 'current', openRef.current ? 0 : -460, 0.2, delta);
    easing.damp(translateZ, 'current', openRef.current ? 200 : 0, 0.2, delta);
  });

  return (
    <Root flexDirection="column" pixelSize={0.01} sizeX={4.4}>
      <Container
        backgroundColor={0xffffff}
        dark={{ backgroundColor: 0x0 }}
        borderRadius={20}
        onClick={(e) => {
          e.stopPropagation();
          openRef.current = !openRef.current;
        }}
        cursor="pointer"
        flexDirection="column"
        zIndexOffset={10}
        transformTranslateZ={translateZ}
      >
        <Content
          transformTranslateZ={1}
          padding={14}
          keepAspectRatio={false}
          width={440}
          height={400}
        >
          <mesh geometry={cardGeometry}>
            <MeshPortalMaterial transparent>
              <color attach="background" args={['white']} />
              <ambientLight intensity={Math.PI} />
              <Environment preset="city" />
              <Physical />
              <PerspectiveCamera makeDefault position={[0, 0, 10]} fov={50} />
            </MeshPortalMaterial>
          </mesh>
        </Content>
        <Container
          backgroundColor={0xffffff}
          dark={{ backgroundColor: 0x0 }}
          flexDirection="row"
          padding={28}
          paddingTop={28 + 4}
          alignItems="center"
          justifyContent="space-between"
          borderBottomRadius={20}
          castShadow
        >
          <Container flexDirection="column" gap={8}>
            <Text fontWeight="normal" fontSize={24} lineHeight="100%">
              VanArsdel Marketing
            </Text>
            <Text
              fontSize={20}
              fontWeight="medium"
              letterSpacing={-0.4}
              color={colors.primary}
            >
              1 activities for you
            </Text>
          </Container>
          <Container flexDirection="row" />
        </Container>
      </Container>
      <Container
        flexDirection="column"
        transformTranslateY={-40}
        overflow="hidden"
      >
        <Container
          paddingTop={40}
          // transformTranslateY={translateY}
          backgroundColor={colors.secondary}
          borderRadius={20}
          flexDirection="column"
        >
          <CardHeader>
            <CardTitle>
              <Text>Notifications</Text>
            </CardTitle>
            <CardDescription>
              <Text>You have 3 unread messages.</Text>
            </CardDescription>
          </CardHeader>
          <CardContent flexDirection="column" gap={16}>
            <Container
              flexDirection="row"
              alignItems="center"
              gap={16}
              borderRadius={6}
              borderWidth={1}
              padding={16}
            >
              <BellRing />
              <Container flexDirection="column" gap={4}>
                <Text fontSize={14} lineHeight="100%">
                  Push Notifications
                </Text>
                <Text
                  fontSize={14}
                  lineHeight={20}
                  color={colors.mutedForeground}
                >
                  Send notifications to device.
                </Text>
              </Container>
              <Container flexGrow={1} />
              <Switch />
            </Container>
            <Container flexDirection="column">
              {notifications.map((notification, index) => (
                <Container
                  key={index}
                  marginBottom={index === notifications.length - 1 ? 0 : 16}
                  paddingBottom={index === notifications.length - 1 ? 0 : 16}
                  alignItems="flex-start"
                  flexDirection="row"
                  gap={17}
                >
                  <Container
                    height={8}
                    width={8}
                    transformTranslateY={4}
                    borderRadius={1000}
                    backgroundColor={colors.primary}
                  />
                  <Container gap={4} flexDirection="column">
                    <Text fontSize={14} lineHeight="100%">
                      {notification.title}
                    </Text>
                    <Text
                      fontSize={14}
                      lineHeight={20}
                      color={colors.mutedForeground}
                    >
                      {notification.description}
                    </Text>
                  </Container>
                </Container>
              ))}
            </Container>
          </CardContent>
          <CardFooter>
            <Button
              onClick={(e) => (
                e.stopPropagation(), (openRef.current = !openRef.current)
              )}
              flexDirection="row"
              width="100%"
            >
              <Check marginRight={8} height={16} width={16} />
              <Text>Mark all as read</Text>
            </Button>
          </CardFooter>
        </Container>
      </Container>
    </Root>
  );
}
