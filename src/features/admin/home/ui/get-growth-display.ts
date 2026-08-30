export type GrowthDisplay = {
  label: string;
  isPositive: boolean;
};

export const getGrowthDisplay = (thisMonth: number, lastMonth: number): GrowthDisplay => {
  if (lastMonth > 0) {
    const growthRate = ((thisMonth - lastMonth) / lastMonth) * 100;
    return {
      label: `${Math.abs(growthRate).toFixed(1)}%`,
      isPositive: growthRate >= 0,
    };
  }

  if (thisMonth > 0) {
    return { label: '신규', isPositive: true };
  }

  return { label: '0.0%', isPositive: true };
};
