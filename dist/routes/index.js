"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dashboard_router_1 = __importDefault(require("./dashboard-router"));
const auth_router_1 = __importDefault(require("./auth-router"));
const auth_middlewware_1 = require("../middleware/auth-middlewware");
const router = (0, express_1.default)();
router.use("/dashboard", auth_middlewware_1.authMiddleware, dashboard_router_1.default);
router.use("/auth", auth_router_1.default);
exports.default = router;
