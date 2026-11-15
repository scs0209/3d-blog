import { createLabelTexture } from './textures';

type TextOptions = {
  align?: CanvasTextAlign;
  font?: 'mono' | 'display';
  alpha?: number;
  /** 이 너비(단위)를 넘으면 글씨를 줄여 맞춘다 */
  maxWidth?: number;
  /** 라디안. 세로로 세울 때 쓴다 */
  rotate?: number;
};

/** 실크 인쇄를 그리는 펜. 좌표와 크기는 모두 세계 단위이며 원점은 왼쪽 위 */
export type SilkPen = {
  text: (text: string, x: number, y: number, size: number, options?: TextOptions) => void;
  box: (x0: number, y0: number, x1: number, y1: number, alpha?: number) => void;
  line: (x0: number, y0: number, x1: number, y1: number, alpha?: number) => void;
  dot: (x: number, y: number, radius: number, alpha?: number) => void;
  /** 방향 표시 삼각형. angle 0은 오른쪽, 시계 방향으로 돈다 */
  arrow: (x: number, y: number, size: number, angle: number, alpha?: number) => void;
};

const INK = '225,232,238';

/**
 * 메인보드의 실크 인쇄와 같은 글씨를 만든다: 흰 잉크, 고정폭 글꼴, 부품 외곽선.
 * 칩 밖(보드)과 칩 안(다이)이 같은 표기법을 쓰게 하려는 것이다.
 */
export const createSilk = (width: number, height: number, ppu: number, draw: (pen: SilkPen) => void) =>
  createLabelTexture({
    width: Math.round(width * ppu),
    height: Math.round(height * ppu),
    draw: (c, fonts) => {
      const stroke = (alpha: number) => {
        c.strokeStyle = `rgba(${INK},${alpha})`;
        c.lineWidth = Math.max(2, 0.14 * ppu);
      };
      draw({
        text: (text, x, y, size, options = {}) => {
          const family = options.font === 'display' ? fonts.display : fonts.mono;
          const weight = options.font === 'display' ? '700' : '500';
          let pixels = size * ppu;
          c.font = `${weight} ${pixels}px ${family}`;
          if (options.maxWidth) {
            const measured = c.measureText(text).width;
            const limit = options.maxWidth * ppu;
            if (measured > limit) {
              pixels *= limit / measured;
              c.font = `${weight} ${pixels}px ${family}`;
            }
          }
          c.save();
          c.translate(x * ppu, y * ppu);
          c.rotate(options.rotate ?? 0);
          c.textAlign = options.align ?? 'left';
          c.textBaseline = 'middle';
          c.fillStyle = `rgba(${INK},${options.alpha ?? 0.85})`;
          c.fillText(text, 0, 0);
          c.restore();
        },
        box: (x0, y0, x1, y1, alpha = 0.5) => {
          stroke(alpha);
          c.strokeRect(x0 * ppu, y0 * ppu, (x1 - x0) * ppu, (y1 - y0) * ppu);
        },
        line: (x0, y0, x1, y1, alpha = 0.5) => {
          stroke(alpha);
          c.beginPath();
          c.moveTo(x0 * ppu, y0 * ppu);
          c.lineTo(x1 * ppu, y1 * ppu);
          c.stroke();
        },
        dot: (x, y, radius, alpha = 0.8) => {
          c.fillStyle = `rgba(${INK},${alpha})`;
          c.beginPath();
          c.arc(x * ppu, y * ppu, radius * ppu, 0, Math.PI * 2);
          c.fill();
        },
        arrow: (x, y, size, angle, alpha = 0.85) => {
          c.save();
          c.translate(x * ppu, y * ppu);
          c.rotate(angle);
          c.fillStyle = `rgba(${INK},${alpha})`;
          c.beginPath();
          c.moveTo(size * 0.6 * ppu, 0);
          c.lineTo(-size * 0.4 * ppu, -size * 0.5 * ppu);
          c.lineTo(-size * 0.4 * ppu, size * 0.5 * ppu);
          c.closePath();
          c.fill();
          c.restore();
        },
      });
    },
  });
