import { app } from './app'
import { logger } from './logger'
import cluster from 'cluster';
import os from 'os';

const port = app.get('port')
const host = app.get('host')
const clusterCount = app.get('clusterCount')

process.on('unhandledRejection', (reason) => logger.error('Unhandled Rejection %O', reason))

const max_cpus = os.cpus().length - 1;
const clusterWorkerSize = clusterCount ? Math.min(clusterCount, max_cpus) : max_cpus;

if (cluster.isPrimary) {
  for (let i = 0; i < clusterWorkerSize; i++) {
    cluster.fork();
  }
} else {
  app.listen(port).then(() => {
    logger.info(`Feathers app listening on http://${host}:${port}`)
  })
}

