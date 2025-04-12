// userManager.js
import { redis } from './redis.js';

const ONLINE_USERS_PREFIX = process.env.ONLINE_USERS_KEY || 'online_users';

export const userOnline = {
    addUser: async (userId, socketId) => {
        const key = `${ONLINE_USERS_PREFIX}:${userId}`;
        await redis.set(key, socketId);
    },

    removeUserBySocketId: async (socketId) => {
        // Get all keys with the prefix
        const keys = await redis.keys(`${ONLINE_USERS_PREFIX}:*`);
        
        // Check each key to find the one with matching socketId
        for (const key of keys) {
            const storedSocketId = await redis.get(key);
            if (storedSocketId === socketId) {
                await redis.del(key);
                break;
            }
        }
    },

    removeUser: async (userId) => {
        const key = `${ONLINE_USERS_PREFIX}:${userId}`;
        await redis.del(key);
    },

    getOnlineUsers: async () => {
        // Get all keys with the prefix
        const keys = await redis.keys(`${ONLINE_USERS_PREFIX}:*`);
        const result = {};
        
        // Build a map of userId to socketId
        for (const key of keys) {
            const userId = key.split(':')[1]; // Extract userId from the key
            const socketId = await redis.get(key);
            result[userId] = socketId;
        }
        
        return result; // returns { userId: socketId }
    },

    getSocketIdByUserId: async (userId) => {
        const key = `${ONLINE_USERS_PREFIX}:${userId}`;
        return await redis.get(key);
    },
    
    isUserOnline: async (userId) => {
        const key = `${ONLINE_USERS_PREFIX}:${userId}`;
        return Boolean(await redis.get(key));
    }
};