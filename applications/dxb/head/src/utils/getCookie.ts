const getCookie = (name: string): string | undefined => {
  if (typeof document === "undefined") {
    return undefined;
  }
  const cookies = `; ${document.cookie}`;
  const parts = cookies.split(`; ${name}=`);
  if (parts.length !== 2) {
    return undefined;
  }
  const value = parts.pop()?.split(";").shift();
  if (!value) {
    return undefined;
  }
  return value;
};

export default getCookie;
