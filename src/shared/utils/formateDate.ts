export const formatDateToYMD = (dateString: string): string => {
  if (!dateString) {
    return '';
  }
  return new Date(dateString).toISOString().slice(0, 10);
};
