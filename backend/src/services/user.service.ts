import type { Response } from "express";
import { AppDataSource } from "../db";
import { User } from "../entities/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const repo = AppDataSource.getRepository(User);
const tokenSecret =
  process.env.JWT_SECRET || "idohwaouhfoihfeiosdlfliieohsioehfsioehg";
const accessTTL = process.env.JWT_ACCESS_TTL || "15s";
const refreshTTL = process.env.JWT_REFRESH_TTL || "30d";

export class UserService {
  static async login(email: string, password: string) {
    const user = await this.getUserByEmail(email);

    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      const payload = {
        id: user.userId,
        email: user.email,
      };

      return {
        email: user.email,
        access: jwt.sign(payload, tokenSecret!, {
          expiresIn: accessTTL as any,
        }),
        refresh: jwt.sign(payload, tokenSecret!, {
          expiresIn: refreshTTL as any,
        }),
      };
    }

    throw new Error("EMAIL_OR_PASSWORD_INCORRECT");
  }

  static async refreshToken(token: string) {
    const decoded: any = jwt.verify(token, tokenSecret!);
    const user = await this.getUserByEmail(decoded.email);
    const payload = {
      id: user.userId,
      email: user.email,
    };

    return {
      email: user.email,
      access: jwt.sign(payload, tokenSecret!, { expiresIn: accessTTL as any }),
      refresh: token,
    };
  }

  static async self(email: string) {
    const data = await repo.findOne({
      select: {
        userId: true,
        email: true,
      },
      where: {
        email: email,
        active: true,
      },
    });

    if (data == null) throw new Error("NOT_FOUND");

    return data;
  }

  static async validateToken(req: any, res: Response, next: Function) {
    const whitelisted = ["/api/user/login", "/api/user/refresh"];

    if (whitelisted.find((w) => req.path.startsWith(w))) {
      next();
      return;
    }

    const auth = req.headers["authorization"];
    const token = auth && auth.split(" ")[1];

    if (token == undefined) {
      res.status(401).json({
        message: "NO_TOKEN_FOUND",
        timestamp: new Date(),
      });
      return;
    }

    jwt.verify(token, tokenSecret!, (err: any, user: any) => {
      if (err) {
        res.status(403).json({
          message: "INVALID_TOKEN",
          timestamp: new Date(),
        });
        return;
      }

      req.user = user;
      next();
    });
  }

  static async getUserByEmail(email: string) {
    const data = await repo.findOne({
      where: {
        email: email,
        active: true,
      },
    });

    if (data == null) throw new Error("NOT_FOUND");

    return data;
  }
}
