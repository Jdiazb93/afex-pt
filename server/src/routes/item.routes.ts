import { Router } from "express";
import {
  CreateItem,
  EditItem,
  DeleteItem,
  ListItems,
  UpdateDate,
} from "../controller/item.controller";

const router = Router();

router.post("/create", CreateItem);
router.put("/edit/:id", EditItem);
router.delete("/delete/:id", DeleteItem);
router.get("/list", ListItems);
router.put("/date/:id", UpdateDate);

export default router;
