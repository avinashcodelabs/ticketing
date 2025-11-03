import { scryptSync, randomBytes } from "node:crypto";

// Todo => promisify scryptSync or check if promise version of module available in latest node version
class Password {
  static toHash(password: string) {
    const salt = randomBytes(16).toString("hex");
    const hashedPassword = scryptSync(password, salt, 64);
    const hashedPasswordPlusSalt = `${hashedPassword.toString("hex")}.${salt}`;
    return hashedPasswordPlusSalt;
  }

  static compare(storedPassword: string, suppliedPassword: string) {
    const [storedHashedPassword, salt] = storedPassword.split(".");
    const suppliedPasswordHash = scryptSync(
      suppliedPassword,
      salt!,
      64
    ).toString("hex"); // salt! mean Non-null Assertion - This tells TypeScript: “I know this is not undefined.”
    return suppliedPasswordHash === storedHashedPassword;
  }
}

export { Password };
