import { Response, Request } from "express";
import { collections } from "../services/database.service";

export const queryTickerByName = async (req: Request, res: Response) => {
  const { name } = req.query;
  if (!name) {
    return res
      .status(400)
      .json({ status: 400, message: "No query string given" });
  }
  try {
    const { tickers } = collections;
    const agg = [
      {
        $search: {
          index: "tickers",
          autocomplete: {
            query: name,
            path: "symbol",
          },
        },
      },
      { $limit: 10 },
      { $project: { symbol: 1, description: 1 } },
    ];
    let data = await tickers.aggregate(agg).toArray();
    if (data.length === 0) {
      data = await tickers
        .aggregate([
          {
            $search: {
              index: "tickers",
              autocomplete: {
                query: name,
                path: "description",
              },
            },
          },
          { $limit: 10 },
          { $project: { symbol: 1, description: 1 } },
        ])
        .toArray();
    }
    if (data.length === 0) {
      return res.status(400).json({ status: 400, message: "Not found" });
    }
    res.status(200).json({
      status: 200,
      results: data,
    });
  } catch (error) {
    res.status(500).json({ status: 500, message: "Server error" });
  }
};
