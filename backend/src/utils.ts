import type { Response } from "express";

export function errorReponse(
  rsp: Response,
  e: Error = new Error("BAD_REQUEST"),
) {
  const msg = e.message;
  rsp.status(msg == "NOT_FOUND" ? 404 : 400).json({
    message: msg,
    timestamp: new Date(),
  });
}

export function isDefined<T>(data: T | null) {
  if (data == null) throw new Error("NOT_FOUND");

  return data;
}

export async function defineRequest(res: Response, callback: Function) {
  try {
    const data = await callback();
    if (data == null) {
      res.status(204).send();
      return;
    }

    res.json(data);
  } catch (e: any) {
    const code = e.message == "NOT_FOUND" ? 404 : 400;
    res.status(code).json({
      message: e.message ?? "SERVER_ERROR",
      timestamp: new Date(),
    });
  }
}
