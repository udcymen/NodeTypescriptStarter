"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_1 = require("../controller/user");
class UserRouter {
    constructor() {
        this.router = express_1.default.Router();
        this.userController = new user_1.UserController();
    }
    // Creates the routes for this router and returns a populated router object
    getRouter() {
        this.router.get("", this.userController.getUsers);
        this.router.get("/:userId", this.userController.getUserById);
        this.router.put("/:userId", this.userController.updateUser);
        this.router.delete("/:userId", this.userController.deleteUser);
        this.router.post("/login", this.userController.postLogin);
        this.router.post("/register", this.userController.register);
        return this.router;
    }
}
exports.UserRouter = UserRouter;
//# sourceMappingURL=user.js.map