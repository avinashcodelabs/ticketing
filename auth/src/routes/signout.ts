import { Router } from "express";
import { currentUser, requireAuth } from "@avinashcodelabs/common";

const router = Router();

router.post("/api/users/signout", currentUser, requireAuth, (req, res) => {
  req.session = null;
  res.send({});
});

export { router as signoutRouter };
