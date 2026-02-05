export function generateToken(length: number): string {
  const PASSWORD_CHARACTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const PASSWORD_CHARACTERS_LENGTH: number = PASSWORD_CHARACTERS.length;
  const PASSWORD_MX_LENGTH = length;

  let generated = '';

  for (let i = 0; i < PASSWORD_MX_LENGTH; i++) {
    generated += PASSWORD_CHARACTERS.charAt(Math.floor(Math.random() * PASSWORD_CHARACTERS_LENGTH));
  }

  return generated;
}

export function generatePassword(length: number = 12): string {
  if (length < 8) {
    throw new Error('Password length should be at least 8 characters for strength.');
  }

  const upperCase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowerCase = 'abcdefghijklmnopqrstuvwxyz';
  const numbers = '0123456789';
  const specialChars = '@#$%^&+=!';

  const allChars = upperCase + lowerCase + numbers + specialChars;

  const getRandomChar = (chars: string) => {
    const randomValues = new Uint32Array(1);
    crypto.getRandomValues(randomValues);
    return chars[(randomValues[0] ?? 0) % chars.length];
  };

  // Ensure the password contains at least one of each character type
  const password = [
    getRandomChar(upperCase),
    getRandomChar(lowerCase),
    getRandomChar(numbers),
    getRandomChar(specialChars),
  ];

  // Fill the rest of the password length with random characters from all types
  for (let i = password.length; i < length; i++) {
    password.push(getRandomChar(allChars));
  }

  // Shuffle the password to make it more random using Fisher-Yates and crypto.getRandomValues()
  for (let i = password.length - 1; i > 0; i--) {
    const randomValues = new Uint32Array(1);
    crypto.getRandomValues(randomValues);
    const j = (randomValues[0] ?? 0) % (i + 1);
    [password[i], password[j]] = [password[j], password[i]];
  }
  return password.join('');
}
