import {createClient} from "redis";

export const redis = createClient()

export const connectRedis = () => redis.connect();