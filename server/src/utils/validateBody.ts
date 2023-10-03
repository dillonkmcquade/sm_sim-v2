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
