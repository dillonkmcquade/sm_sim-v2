/**
 *
 * Validate the HTTP request body to make sure it receives the allowed fields
 * @param reqBody - The HTTP request body
 * @returns true if the request body only contains allowed fields
 */
// eslint-disable-next-line
export function validated(reqBody: any): boolean {
  const dummyData = {
    name: "string",
    nickname: "string",
    email: "string",
    address: "string",
    telephone: "string",
  };
  let result = true;
  Object.keys(reqBody).forEach((key) => {
    if (
      !Object.keys(dummyData).includes(key) ||
      typeof reqBody[key] !== "string"
    ) {
      result = false;
    }
  });
  return result;
}
