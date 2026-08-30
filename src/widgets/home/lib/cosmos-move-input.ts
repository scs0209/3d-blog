let touchDx = 0;
let touchDz = 0;

export const setCosmosTouchMove = (dx: number, dz: number) => {
  touchDx = dx;
  touchDz = dz;
};

export const getCosmosTouchMove = () => ({ dx: touchDx, dz: touchDz });

export const clearCosmosTouchMove = () => {
  touchDx = 0;
  touchDz = 0;
};
