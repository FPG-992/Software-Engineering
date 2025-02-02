import express from 'express';

import adminRouter from './admin';


const apiRouter = express.Router();

apiRouter.use("/admin", adminRouter);


export default apiRouter




