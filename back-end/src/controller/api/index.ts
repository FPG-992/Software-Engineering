import express from "express";

import adminRouter from "./admin";
import tollStationPassesRouter from "./tollStationPasses";
import passAnalysisRouter from "./passAnalysis";
import passesCostRouter from "./passesCost";
import chargesByRouter from "./chargesBy";

const apiRouter = express.Router();

apiRouter.use("/admin", adminRouter);
apiRouter.use("/tollStationPasses", tollStationPassesRouter);
apiRouter.use("/passAnalysis", passAnalysisRouter);
apiRouter.use("/passesCost", passesCostRouter);
apiRouter.use("/chargesBy", chargesByRouter);

export default apiRouter;
