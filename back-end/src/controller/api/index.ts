import express from 'express';

import adminRouter from './admin';
import tollStationPassesRouter from './tollStationPasses';


const apiRouter = express.Router();

apiRouter.use("/admin", adminRouter);
apiRouter.use("/tollStationPasses", tollStationPassesRouter);


export default apiRouter




