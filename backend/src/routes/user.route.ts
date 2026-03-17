import { Router } from "express";
import { UserService } from "../services/user.service";
import { defineRequest } from "../utils";

export const UserRoute = Router();

UserRoute.post("/login", async (req, res) => {
  await defineRequest(
    res,
    async () => await UserService.login(req.body.email, req.body.password),
  );
});

UserRoute.post("/register", UserService.isAdmin as any, async (req, res) => {
  await defineRequest(
    res,
    async () =>
      await UserService.register(
        req.body.email,
        req.body.password,
        req.body.role,
      ),
  );
});

UserRoute.get("/self", async (req: any, res) => {
  await defineRequest(res, async () => await UserService.self(req.user.email));
});

UserRoute.post("/refresh", async (req, res) => {
  await defineRequest(res, async () => {
    const auth = req.headers["authorization"];
    const token = auth && auth.split(" ")[1];

    if (token == undefined) throw new Error("REFRESH_TOKEN_MISSING");

    return await UserService.refreshToken(token);
  });
});
