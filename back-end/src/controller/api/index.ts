import express from 'express';

import adminRouter from './admin';
import tollStationPassesRouter from './tollStationPasses';
import passAnalysisRouter from './passAnalysis';


const apiRouter = express.Router();

apiRouter.use("/admin", adminRouter);
apiRouter.use("/tollStationPasses", tollStationPassesRouter);
apiRouter.use("/passAnalysis", passAnalysisRouter)


export default apiRouter




