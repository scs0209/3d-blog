import { experiences } from '@/entities/portfolio/model/constants/experienceConstants';
import { aboutMeData, portfolioProjects, skillSections } from '@/widgets/portfolio/consts';
import { DISTRICTS, type DistrictId } from './district';
import { createLabelTexture } from './textures';

/** 패널 위에서 누를 수 있는 영역 (캔버스 픽셀 기준) */
export type Hit = { x: number; y: number; w: number; h: number; url: string };

const INK = '#eef2f5';
const BODY = '#c3ccd4';
const DIM = '#7f8a95';
const RULE = 'rgba(255,255,255,0.14)';

const SOCIAL_LABEL: Record<string, string> = { github: 'GitHub', linkedin: 'LinkedIn', email: 'Email' };

/** 한글은 낱말 단위로, 너무 긴 낱말은 글자 단위로 줄을 나눈다 */
export const wrap = (context: CanvasRenderingContext2D, text: string, maxWidth: number) => {
  const lines: string[] = [];
  let line = '';
  for (const word of text.split(' ')) {
    const trial = line ? `${line} ${word}` : word;
    if (context.measureText(trial).width <= maxWidth) {
      line = trial;
      continue;
    }
    if (line) {
      lines.push(line);
    }
    line = word;
    while (line.length > 1 && context.measureText(line).width > maxWidth) {
      let cut = line.length - 1;
      while (cut > 1 && context.measureText(line.slice(0, cut)).width > maxWidth) {
        cut -= 1;
      }
      lines.push(line.slice(0, cut));
      line = line.slice(cut);
    }
  }
  if (line) {
    lines.push(line);
  }
  return lines;
};

/**
 * 지구마다 서 있는 내용 패널. 글은 캔버스에 그려 3D 표면에 붙인다.
 * 링크 자리는 hits로 돌려주어, 3D 안에서 그대로 누를 수 있게 한다.
 */
export const createPanel = (id: DistrictId, portrait: boolean, accent: string) => {
  const width = portrait ? 1020 : 2040;
  const height = portrait ? 1800 : 1200;
  const hits: Hit[] = [];
  const district = DISTRICTS.find((item) => item.id === id);

  const texture = createLabelTexture({
    width,
    height,
    background: '#06090c',
    draw: (c, fonts) => {
      const pad = portrait ? 64 : 88;
      const inner = width - pad * 2;
      const mono = (size: number) => `500 ${size}px ${fonts.mono}`;
      const display = (size: number) => `700 ${size}px ${fonts.display}`;
      const sans = (size: number, weight = 400) => `${weight} ${size}px ${fonts.sans}`;
      c.textBaseline = 'top';

      const write = (
        text: string,
        x: number,
        y: number,
        maxWidth: number,
        font: string,
        color: string,
        lineHeight: number,
      ) => {
        c.font = font;
        c.fillStyle = color;
        c.textAlign = 'left';
        let cursor = y;
        for (const line of wrap(c, text, maxWidth)) {
          c.fillText(line, x, cursor);
          cursor += lineHeight;
        }
        return cursor;
      };
      const rule = (x: number, y: number, w: number) => {
        c.fillStyle = RULE;
        c.fillRect(x, y, w, 2);
      };

      // 머리줄
      c.font = mono(24);
      c.fillStyle = accent;
      c.textAlign = 'left';
      // AI 메모리의 한 항목처럼: 번호, 파일 이름, 종류
      c.fillText(`${district?.code ?? ''}`, pad, pad - 14);
      c.fillStyle = DIM;
      c.fillText(`memory / ${district?.file ?? ''}`, pad + 64, pad - 14);
      c.textAlign = 'right';
      c.fillText(
        portrait ? `type: ${district?.kind ?? ''}` : `type: ${district?.kind ?? ''}  ·  about: AYAAN`,
        pad + inner,
        pad - 14,
      );
      const top = pad + 70;
      const body = portrait ? 32 : 33;
      const leading = portrait ? 49 : 51;
      const gap = 80;
      const columns: [number, number][] = portrait
        ? [[pad, inner]]
        : [
            [pad, (inner - gap) / 2],
            [pad + (inner + gap) / 2, (inner - gap) / 2],
          ];

      if (id === 'about') {
        const bio = aboutMeData.sections[0];
        const left = portrait ? inner : inner * 0.62;
        let y = top;
        c.font = display(portrait ? 124 : 168);
        c.fillStyle = INK;
        c.textAlign = 'left';
        c.fillText(aboutMeData.name, pad - 6, y);
        y += portrait ? 138 : 186;
        c.font = mono(26);
        c.fillStyle = accent;
        c.fillText(aboutMeData.title, pad, y);
        y += 70;
        for (const paragraph of bio?.paragraphs ?? []) {
          y = write(paragraph, pad, y, left, sans(body), BODY, leading) + 22;
        }
        const stats = [
          { value: '3,000 × 255', label: '행·열 테이블 가상화' },
          { value: '52 → 80', label: '블로그 Lighthouse 성능 점수' },
          { value: '2024.07 —', label: 'SHOPL & COMPANY' },
        ];
        if (portrait) {
          y += 26;
          rule(pad, y, inner);
          y += 36;
          for (const stat of stats) {
            c.font = display(54);
            c.fillStyle = INK;
            c.fillText(stat.value, pad, y);
            c.font = sans(24);
            c.fillStyle = DIM;
            c.fillText(stat.label, pad, y + 68);
            y += 136;
          }
        } else {
          const x = pad + inner * 0.7;
          let statY = top + 20;
          for (const stat of stats) {
            rule(x, statY, inner * 0.3);
            c.font = display(64);
            c.fillStyle = INK;
            c.fillText(stat.value, x, statY + 34);
            c.font = sans(25);
            c.fillStyle = DIM;
            c.fillText(stat.label, x, statY + 118);
            statY += 208;
          }
        }
      }

      if (id === 'experience') {
        let y = top;
        experiences.forEach((item, index) => {
          const column = columns[portrait ? 0 : index] ?? columns[0];
          if (!column) {
            return;
          }
          const [x, w] = column;
          let cursor = portrait ? y : top;
          c.font = mono(24);
          c.fillStyle = accent;
          c.textAlign = 'left';
          c.fillText(item.period, x, cursor);
          cursor += 44;
          cursor = write(item.company, x, cursor, w, display(portrait ? 46 : 54), INK, portrait ? 54 : 62);
          c.font = mono(22);
          c.fillStyle = DIM;
          c.fillText(`${item.role} · ${item.location}`, x, cursor + 6);
          cursor += 62;
          for (const line of item.description) {
            c.fillStyle = accent;
            c.fillRect(x, cursor + 20, 16, 2);
            cursor = write(line, x + 34, cursor, w - 34, sans(body - 3), BODY, leading - 6) + 14;
          }
          y = cursor + 34;
        });
      }

      if (id === 'projects') {
        let y = top;
        portfolioProjects.forEach((project, index) => {
          const column = columns[portrait ? 0 : index] ?? columns[0];
          if (!column) {
            return;
          }
          const [x, w] = column;
          let cursor = portrait ? y : top;
          c.font = mono(24);
          c.fillStyle = DIM;
          c.textAlign = 'left';
          c.fillText(`M2_${index + 1}`, x, cursor);
          cursor += 46;
          cursor = write(project.title, x, cursor, w, display(portrait ? 52 : 62), INK, portrait ? 60 : 72);
          cursor = write(project.subtitle, x, cursor + 4, w, sans(24), accent, 36) + 26;
          cursor = write(project.description, x, cursor, w, sans(body), BODY, leading) + 34;

          const link = project.liveUrl ?? project.sourceUrl;
          if (link) {
            const label = project.liveUrl ? '사이트 보기  ↗' : '소스 보기  ↗';
            c.font = sans(27, 600);
            const buttonWidth = c.measureText(label).width + 84;
            const buttonHeight = 72;
            c.beginPath();
            c.roundRect(x, cursor, buttonWidth, buttonHeight, buttonHeight / 2);
            if (project.liveUrl) {
              c.fillStyle = INK;
              c.fill();
              c.fillStyle = '#06090c';
            } else {
              c.strokeStyle = accent;
              c.lineWidth = 3;
              c.stroke();
              c.fillStyle = INK;
            }
            c.textAlign = 'left';
            c.fillText(label, x + 42, cursor + 21);
            hits.push({ x, y: cursor, w: buttonWidth, h: buttonHeight, url: link });
            cursor += buttonHeight;
          }
          y = cursor + 70;
        });
      }

      if (id === 'skills') {
        let y = top;
        skillSections.forEach((section, index) => {
          rule(pad, y, inner);
          y += 30;
          c.font = mono(22);
          c.fillStyle = DIM;
          c.textAlign = 'left';
          c.fillText(`DIMM_${index + 1}`, pad, y);
          c.fillStyle = accent;
          c.fillText(section.title, pad, y + 34);
          const names = section.items.map((item) => item.name).join('     ');
          if (portrait) {
            y = write(names, pad, y + 84, inner, sans(36, 500), INK, 54) + 30;
          } else {
            const end = write(names, pad + 360, y + 6, inner - 360, sans(40, 500), INK, 58);
            y = Math.max(end, y + 84) + 30;
          }
        });
        const focus = aboutMeData.sections.find((section) => section.key === 'focus')?.paragraphs[0];
        if (focus) {
          rule(pad, y, inner);
          write(focus, pad, y + 30, portrait ? inner : inner * 0.7, sans(body - 3), DIM, leading - 6);
        }
      }

      if (id === 'contact') {
        let y = top + 10;
        const rowHeight = portrait ? 190 : 176;
        for (const social of aboutMeData.socials) {
          const isMail = social.url.startsWith('mailto:');
          const address = isMail ? social.url.replace('mailto:', '') : decodeURI(social.url.replace('https://', ''));
          rule(pad, y, inner);
          c.font = display(portrait ? 66 : 84);
          c.fillStyle = INK;
          c.textAlign = 'left';
          c.fillText(SOCIAL_LABEL[social.type] ?? social.type, pad, y + (portrait ? 30 : 44));
          c.font = mono(portrait ? 24 : 27);
          c.fillStyle = DIM;
          if (portrait) {
            c.fillText(`${address}  ↗`, pad, y + 122);
          } else {
            c.textAlign = 'right';
            c.fillText(`${address}  ↗`, pad + inner, y + 76);
          }
          hits.push({ x: pad, y, w: inner, h: rowHeight, url: social.url });
          y += rowHeight;
        }
        rule(pad, y, inner);
        c.font = mono(22);
        c.fillStyle = DIM;
        c.textAlign = 'left';
        c.fillText('SEOUL, SOUTH KOREA', pad, y + 36);
      }
    },
  });

  return { texture, hits, width, height };
};

/** 멀리서 지구를 알아볼 수 있게 띄우는 이름표 */
export const createBeaconLabel = (code: string, label: string, accent: string) =>
  createLabelTexture({
    width: 1024,
    height: 220,
    draw: (c, fonts) => {
      c.textBaseline = 'middle';
      c.font = `500 44px ${fonts.mono}`;
      c.fillStyle = accent;
      c.textAlign = 'left';
      c.fillText(code, 20, 112);
      c.font = `700 104px ${fonts.display}`;
      c.fillStyle = INK;
      c.fillText(label, 110, 112);
    },
  });
