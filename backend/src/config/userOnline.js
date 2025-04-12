// userManager.js
import { redis } from './redis.js';

const ONLINE_USERS_KEY = process.env.ONLINE_USERS_KEY

export const userOnline = {
    addUser: async (userId, socketId) => {
        await redis.hset(ONLINE_USERS_KEY, userId, socketId);
    },

    removeUserBySocketId: async (socketId) => {
        const users = await redis.hgetall(ONLINE_USERS_KEY);
        for (const [userId, storedSocketId] of Object.entries(users)) {
            if (storedSocketId === socketId) {
                await redis.hdel(ONLINE_USERS_KEY, userId);
                break;
            }
        }
    },

    getOnlineUsers: async () => {
        return await redis.hgetall(ONLINE_USERS_KEY); // returns { userId: socketId }
    },

    getSocketIdByUserId: async (userId) => {
        return await redis.hget(ONLINE_USERS_KEY, userId);
    }
};
