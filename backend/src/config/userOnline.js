// userManager.js
const createUserManager = () => {
    const onlineUsers = {};

    return {
        addUser: (userId, socketId) => {
            onlineUsers[userId] = socketId;
        },

        removeUserBySocketId: (socketId) => {
            for (const userId in onlineUsers) {
                if (onlineUsers[userId] === socketId) {
                    delete onlineUsers[userId];
                    break;
                }
            }
        },

        getOnlineUsers: () => {
            return { ...onlineUsers }; // return a shallow copy
        },

        getSocketIdByUserId: (userId) => {
            return onlineUsers[userId];
        }
    };
};

export const userOnline = createUserManager();
