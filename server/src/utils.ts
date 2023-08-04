export async function getPrice(symbol: string) {
  try {
    const request = await fetch(
      `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${process.env.FINNHUB_KEY}`,
    );
    const data = await request.json();
    if (data["c"]) {
      return data.c;
    } else {
      throw new Error("Error fetching quote");
    }
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
    }
  }
}
