import { logger } from "../src/logger";

export const runAsync = (cb: ((...args: any[]) => Promise<any>), ...args: any[]) => async (count: number) => {
    while(count--) {
    try {
      await cb(...args)
    } catch (error) {
      logger.error(error);
    }
    }
  }
export const defaultIterations = 1000;


// iterate through all the services
// Object.keys(app.services).forEach(async (path) => {
  
//   const service = app.service(path as ServiceGenericType<Application>);
//   // if (path === "users") {
//     const serviceOptions = getServiceOptions(service);
//     if (serviceOptions?.createFake) {
//       logger.info(`${path}: start generating fakes`);
//       await runAsync(serviceOptions?.createFake)(serviceOptions?.fakerOptions?.iterations ?? defaultIterations);
//       logger.info(`${path}: generate is a success`);
//     }
// })
