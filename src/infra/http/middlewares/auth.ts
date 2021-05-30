import { UserRoleEnum } from "@entities";
import { InternalServerError, UnauthorizedError } from "@shared/errors";
import GetUserByAccessTokenBs from "@useCases/user/get-user-by-access-token/get-user-by-access-token.bs";
import { Request, Response, NextFunction } from "express";

const authMiddleware = (role: UserRoleEnum) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      let accessToken: string = <string>req.headers["authorization"];
      if (!accessToken) {
        throw new UnauthorizedError();
      }

      accessToken = req.headers.authorization.replace("Bearer ", "").trim();

      const { container } = req;
      const getUserByAccessTokenBs: GetUserByAccessTokenBs = container.resolve(
        "getUserByAccessTokenBs"
      );

      const user = await getUserByAccessTokenBs.execute({ accessToken, role });

      if (!user) {
        throw new UnauthorizedError();
      }

      req.currentUser = user;
      
      next();
    } catch (err) {
      if (err instanceof UnauthorizedError) {
        return res.status(401).json({ error: new UnauthorizedError().message });
      }

      return res.status(500).json({ error: new InternalServerError().message });
    }
  };
};

export const adminAuth = authMiddleware(UserRoleEnum.ADMIN);
export const auth = authMiddleware(UserRoleEnum.USER);
