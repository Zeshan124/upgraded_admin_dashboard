// Secret key for a simple XOR-based encryption (can be any number)
const SECRET_KEY = 12345;

// Function to encrypt a number
export const encryptData = (data) => {
  if (typeof data !== "number") {
    throw new Error("Input data must be a number.");
  }

  // XOR the input with the secret key, then convert to Base36 and take 5 characters
  const encrypted = (data ^ SECRET_KEY).toString(36).slice(-5);
  return encrypted;
};

// Function to decrypt the encoded string
export const decryptData = (encryptedData) => {
  if (typeof encryptedData !== "string") {
    // throw new Error("Input encryptedData must be a string.");
    return null
  }

  // Convert the encrypted Base36 string back to a number
  const decryptedNumber = parseInt(encryptedData, 36) ^ SECRET_KEY;

  if (isNaN(decryptedNumber)) {
    console.error("Decryption failed: Encrypted data is invalid.");
    return null;
  }

  return decryptedNumber;
};
