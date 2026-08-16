export type DeskCameraMode = 'idle' | 'desk' | 'monitor';

export type OsAppId = 'welcome' | 'about' | 'experience' | 'projects' | 'skills' | 'contact';

export type OsWindowState = {
  id: OsAppId;
  x: number;
  y: number;
  z: number;
  minimized: boolean;
  maximized: boolean;
};
