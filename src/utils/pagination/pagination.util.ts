/* eslint-disable prettier/prettier */
export const paginate = ({ page, limit }) => {
  page = Number(page);
  
  const skip: number = (page <= 1) ? 0 : (page - 1) * limit;
  return {
    skip,
    take: limit
  }
};
