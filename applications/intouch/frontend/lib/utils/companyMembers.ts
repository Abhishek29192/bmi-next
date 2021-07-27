export const reorderMembers = (nodes) =>
  [...nodes].sort((a, b) =>
    a.account?.firstName?.localeCompare(b?.account?.firstName)
  );
