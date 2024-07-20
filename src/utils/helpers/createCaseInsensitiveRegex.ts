export const createCaseInsensitiveRegex = (name: string) => {
    return { $regex: new RegExp('^' + name + '$', 'i') };
  };