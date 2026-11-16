import * as three from 'three';
import { BOARD, HALF_D, HALF_W, PARTS, type Route, seededRandom } from './layout';

const fontFamily = (variable: string, fallback: string) => {
  const value = getComputedStyle(document.body).getPropertyValue(variable).trim();
  return value ? `${value}, ${fallback}` : fallback;
};

const finish = (canvas: HTMLCanvasElement, srgb = true) => {
  const texture = new three.CanvasTexture(canvas);
  if (srgb) {
    texture.colorSpace = three.SRGBColorSpace;
  }
  texture.anisotropy = 16;
  return texture;
};

const PX_PER_UNIT = 2048 / BOARD.width;

/** 기판 좌표를 텍스처 픽셀로 */
const px = (x: number) => (x + HALF_W) * PX_PER_UNIT;
const py = (z: number) => (z + HALF_D) * PX_PER_UNIT;

/**
 * 기판 윗면: 솔더마스크, 배선, 비아, 그리고 실크스크린 글씨.
 * 실제 메인보드처럼 구역 이름을 기판에 인쇄해, 3D 안에서도 어디가 무엇인지 읽힌다.
 */
export const createBoardTextures = (routes: Route[]) => {
  const width = 2048;
  const height = Math.round(BOARD.depth * PX_PER_UNIT);
  const color = document.createElement('canvas');
  color.width = width;
  color.height = height;
  const rough = document.createElement('canvas');
  rough.width = width;
  rough.height = height;
  const c = color.getContext('2d');
  const r = rough.getContext('2d');
  if (!c || !r) {
    return { map: finish(color), roughnessMap: finish(rough, false) };
  }

  // 솔더마스크: 거의 검정에 가까운 무광
  c.fillStyle = '#080a0c';
  c.fillRect(0, 0, width, height);
  r.fillStyle = '#b4b4b4';
  r.fillRect(0, 0, width, height);

  // 섬유 결처럼 아주 옅은 격자
  c.strokeStyle = 'rgba(255,255,255,0.012)';
  c.lineWidth = 1;
  for (let x = 0; x < width; x += 6) {
    c.beginPath();
    c.moveTo(x, 0);
    c.lineTo(x, height);
    c.stroke();
  }

  // 배선: 마스크 아래로 비치는 구리. 조금 밝고 조금 더 매끈하다
  const drawRoutes = (context: CanvasRenderingContext2D, stroke: string, lineWidth: number) => {
    context.strokeStyle = stroke;
    context.lineWidth = lineWidth;
    context.lineJoin = 'round';
    context.lineCap = 'round';
    for (const route of routes) {
      context.beginPath();
      route.forEach(([x, z], index) => {
        if (index === 0) {
          context.moveTo(px(x), py(z));
        } else {
          context.lineTo(px(x), py(z));
        }
      });
      context.stroke();
    }
  };
  drawRoutes(c, '#131a1f', 3.4);
  drawRoutes(r, '#6a6a6a', 3.4);

  // 비아와 패드: 배선 끝의 금속 고리
  for (const route of routes) {
    for (const point of [route[0], route[route.length - 1]]) {
      if (!point) {
        continue;
      }
      const [x, z] = point;
      c.fillStyle = '#8f7a48';
      c.beginPath();
      c.arc(px(x), py(z), 5, 0, Math.PI * 2);
      c.fill();
      c.fillStyle = '#050607';
      c.beginPath();
      c.arc(px(x), py(z), 2.2, 0, Math.PI * 2);
      c.fill();
      r.fillStyle = '#3a3a3a';
      r.beginPath();
      r.arc(px(x), py(z), 5, 0, Math.PI * 2);
      r.fill();
    }
  }

  // 잔 비아들
  const random = seededRandom(31);
  for (let index = 0; index < 900; index += 1) {
    const x = (random() * 2 - 1) * (HALF_W - 2);
    const z = (random() * 2 - 1) * (HALF_D - 2);
    c.fillStyle = 'rgba(150,130,80,0.5)';
    c.beginPath();
    c.arc(px(x), py(z), 1.6, 0, Math.PI * 2);
    c.fill();
  }

  // 실크스크린
  const mono = fontFamily('--font-geist-mono', 'monospace');
  const display = fontFamily('--font-syne', 'sans-serif');
  const silk = (
    text: string,
    x: number,
    z: number,
    size: number,
    options: { align?: CanvasTextAlign; font?: string; rotate?: number; alpha?: number } = {},
  ) => {
    c.save();
    c.translate(px(x), py(z));
    c.rotate(options.rotate ?? 0);
    c.font = `${options.font === 'display' ? '700' : '500'} ${size * PX_PER_UNIT}px ${options.font === 'display' ? display : mono}`;
    c.textAlign = options.align ?? 'left';
    c.textBaseline = 'middle';
    c.fillStyle = `rgba(225,232,238,${options.alpha ?? 0.82})`;
    c.fillText(text, 0, 0);
    c.restore();
  };
  const box = (x0: number, z0: number, x1: number, z1: number, alpha = 0.5) => {
    c.strokeStyle = `rgba(225,232,238,${alpha})`;
    c.lineWidth = 2;
    c.strokeRect(px(x0), py(z0), (x1 - x0) * PX_PER_UNIT, (z1 - z0) * PX_PER_UNIT);
  };

  // 보드 이름
  silk('AYAAN', 20, 33, 2.6, { font: 'display', align: 'left' });
  silk('MAINBOARD  REV 2026.11  /  SEOUL KR', 20, 35.6, 0.72, { alpha: 0.6 });

  // 구역 표기
  box(PARTS.cpu.x - 10.5, PARTS.cpu.z - 10.5, PARTS.cpu.x + 10.5, PARTS.cpu.z + 10.5, 0.4);
  silk('CPU_1  ABOUT', PARTS.cpu.x - 10.3, PARTS.cpu.z + 11.8, 0.9);

  PARTS.ram.xs.forEach((x, index) => {
    silk(`DIMM_${index + 1}`, x, PARTS.ram.z + PARTS.ram.length / 2 + 2.2, 0.62, { align: 'center', alpha: 0.7 });
  });
  silk('MEMORY  SKILLS', 26, PARTS.ram.z + PARTS.ram.length / 2 + 4, 0.9, { align: 'center' });

  PARTS.ssd.forEach((slot, index) => {
    silk(`M2_${index + 1}`, slot.x - 14.2, slot.z, 0.7, { align: 'right', alpha: 0.7 });
  });
  silk('STORAGE  PROJECTS', -5.4, 17.6, 0.9);

  silk('ROM  EXPERIENCE', -38.5, 13.8, 0.9);
  // 경력 순서를 잇는 실크 선
  c.strokeStyle = 'rgba(225,232,238,0.55)';
  c.lineWidth = 2;
  c.setLineDash([10, 8]);
  c.beginPath();
  c.moveTo(px(-15), py(29 - 5));
  c.lineTo(px(-15), py(21));
  c.lineTo(px(-31 + 6.5), py(21));
  c.stroke();
  c.setLineDash([]);

  silk('I/O  CONTACT', -47, -25.8, 0.9);
  silk('PCIE_1', -45.6, 3.4, 0.62, { alpha: 0.7 });
  silk('PCIE_2', -45.6, 9.4, 0.62, { alpha: 0.7 });
  silk('ATX_PWR', 41.5, -19.5, 0.62, { alpha: 0.7, align: 'center' });
  silk('CHIPSET', PARTS.chipset.x, PARTS.chipset.z - 7.4, 0.7, { align: 'center', alpha: 0.7 });
  silk('VRM', -25.5, -21, 0.7, { align: 'center', alpha: 0.7 });
  silk('CMOS', -40, 18.8, 0.6, { align: 'center', alpha: 0.7 });

  // 가장자리 눈금: 보드 테두리를 따라 찍힌 작은 표식
  c.fillStyle = 'rgba(225,232,238,0.4)';
  for (let x = -HALF_W + 4; x < HALF_W - 3; x += 4) {
    c.fillRect(px(x), py(HALF_D - 1.3), 2, 8);
    c.fillRect(px(x), py(-HALF_D + 0.9), 2, 8);
  }

  return { map: finish(color), roughnessMap: finish(rough, false) };
};

type LabelOptions = {
  width: number;
  height: number;
  background?: string;
  draw: (context: CanvasRenderingContext2D, fonts: { mono: string; display: string; sans: string }) => void;
};

/** 부품 위에 얹는 글씨 (각인·스티커·인쇄) */
export const createLabelTexture = ({ width, height, background, draw }: LabelOptions) => {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext('2d');
  if (context) {
    if (background) {
      context.fillStyle = background;
      context.fillRect(0, 0, width, height);
    }
    draw(context, {
      mono: fontFamily('--font-geist-mono', 'monospace'),
      display: fontFamily('--font-syne', 'sans-serif'),
      sans: fontFamily('--font-geist-sans', 'sans-serif'),
    });
  }
  return finish(canvas);
};
