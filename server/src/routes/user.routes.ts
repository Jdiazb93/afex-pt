import { Router } from "express";
import {
  CreateUser,
  EditUser,
  DeleteUser,
  ListUsers,
  UpdateDate,
} from "../controller/user.controller";

const router = Router();

router.post("/create", CreateUser);
router.put("/edit/:id", EditUser);
router.delete("/delete/:id", DeleteUser);
router.get("/list", ListUsers);
router.put("/date/:id", UpdateDate);

export default router;
