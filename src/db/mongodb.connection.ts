import { mongoose } from '@typegoose/typegoose';
import configCommon from "../common/config.common";

const { mongo_url, db_name } = configCommon;
export const MongooseConnection = async () => await mongoose.connect(mongo_url,{
    dbName: db_name
});
