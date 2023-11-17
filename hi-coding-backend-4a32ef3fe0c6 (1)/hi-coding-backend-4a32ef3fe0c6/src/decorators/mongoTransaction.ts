import { ClientSession, createConnection } from 'mongoose';

export interface IMongoTransaction {
  session: ClientSession;
}

export function MongoTransaction() {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    descriptor.value = async function (...args: any[]) {
      const db = await createConnection(process.env.MONGO_URL).asPromise();
      const session = await db.startSession();
      try {
        session.startTransaction();
        const options = { session };
        const result = await originalMethod.apply(this, [...args, options]);
        await session.commitTransaction();
        return result;
      } catch (error) {
        await session.abortTransaction();
        console.error(error);
      } finally {
        session.endSession();
      }
    };
    return descriptor;
  };
}
