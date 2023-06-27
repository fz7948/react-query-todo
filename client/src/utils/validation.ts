export const emailValidation = (value: string) => {
    const exptext = /^[A-Za-z0-9_\.\-]+@[A-Za-z0-9\-]+\.[A-Za-z0-9\-]+/;
    return exptext.test(value);
};

export const passwordValidation = (value: string) => {
    return value.length >= 8;
};
