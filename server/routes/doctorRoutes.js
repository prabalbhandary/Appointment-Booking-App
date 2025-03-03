import express from 'express'
import {authenticateToken, restrict} from "../middleware/authenticateToken.js";
import reviewRoutes from "./reviewRoutes.js";
import {getAllDoctors, getSingleDoctor, deleteDoctoor, updateDoctor, getDoctorProfile} from "../controllers/doctorController.js";

const router = express.Router();

router.use("/doctors/:doctorId/reviews", reviewRoutes);

router.get("/doctors", authenticateToken, restrict(["doctor"]), getAllDoctors);
router.get("/profile/me", authenticateToken, getDoctorProfile);
router.get("/doctors/:id", authenticateToken, getSingleDoctor);
router.delete("/doctors/:id", authenticateToken, restrict(["doctor"]), deleteDoctoor);
router.put("/doctors/:id", authenticateToken, restrict(["doctor"]), updateDoctor);

export default router;