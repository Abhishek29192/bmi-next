type GTM = {
  id: string;
  label?: string;
  action?: string;
};

export const getGtmData = (id, label, action) => {
  const data: GTM = {
    id,
    label,
    action
  };

  return JSON.stringify(data);
};
