import { io } from "../../app.js";
import { Queue } from "../models/queue.model.js";
import { User } from "../models/user.model.js";
import { createChat, addMessage } from "./chat.controller.js";

const getQueueData = async (onlineUsers = {}) => {
    const queue = await Queue.find();
    if (!queue) {
        return []; // or handle this case appropriately
    }

    const queueData = queue.map((entry) => {
        return {
            _id: entry._id,
            tag: entry.tag,
            Entries: entry.Entries.map((e) => {
                return {
                    _id: e._id,
                    user: e.user,
                    doctorId: e.doctorId,
                    description: e.description,
                    roomID: e.roomID,
                    chat: e.chat,
                    status: onlineUsers[e.user] ? "online" : "offline",
                    time: Date.now()
                };
            })
        };
    });
    return queueData;
};

const AddEntryToQueue = async (req, res) => {
    try {
        const { tag, doctorId, description } = req.body;
        const userId = req?.user?._id;

        const chat = await createChat({ tag, doctorId, userId, description });
        if (!chat) {
            return res.status(400).json({ message: "Error creating chat" });
        }
        console.log(chat?.chat?._id, "chatId");
        
        const queue = await Queue.findOne({ tag: tag });
        const randomRoomID = Math.floor(Math.random() * 100000);
        if (!queue) {
            await Queue.create({
                tag,
                Entries: [{
                    user: userId,
                    tag: tag,
                    doctorId: doctorId,
                    description: description,
                    roomID: randomRoomID,
                    chatId: chat?.chat?._id,
                }]
            });
        } else {
            queue.Entries.unshift({
                user: userId,
                tag: tag,
                doctorId: doctorId,
                description: description,
                roomID: randomRoomID,
                chatId: chat?.chat?._id,
            });
            await queue.save();
        }
        
        const queueData = await getQueueData();
        io.to(String(process.env.ROOM_ID)).emit('queue-data', {...queueData, chatId: chat?.chat?._id});

        res
            .status(200)
            .json({
                roomID: randomRoomID
            })
    } catch (error) {
        res
            .status(500)
            .json({message:'Error adding user to queue in addEntrytoQueue',error});
    }
}

const RemoveEntryFromQueue = async (req, res) => {
    const { Queue_Id, userId } = req.body;
    console.log(Queue_Id, userId, "hello");

    try {
        const queue = await Queue.findById(Queue_Id);

        if (!queue) {
            return res.status(404).json({ message: "Queue entry does not exist" });
        }
        const entryIndex = queue.Entries.findIndex(entry => String(entry.user) === userId);

        if (entryIndex === -1) {
            return res.status(400).json({ message: "Entry is no longer available in the queue" });
        }
        queue.Entries.splice(entryIndex, 1);

        await queue.save({ validateBeforeSave: false });
        const queueData = await getQueueData();
        io.to(String(process.env.ROOM_ID)).emit('queue-data', queueData);
        return res.status(200).json({ message: "Entry removed successfully", queue });

    } catch (error) {
        return res.status(500).json({ error: error.message, message: "Error while deleting entry" });
    }
};

const getQueueByUser = async (req, res) => {
    try {
        const { userId } = req.params

        const queue = await Queue.findOne({
            Entries: { $elemMatch: { user: userId } }
        }).populate('Entries.user')

        if (!queue) {
            return res.status(200).json({ message: "Queue entry not found" });
        }

        const userEntry = queue.Entries.find(entry => entry.user._id.toString() === userId);

        if (!userEntry) {
            return res.status(200).json({ message: "User entry not found in queue" });
        }

        res.status(200).json({ userEntry, queueId: queue._id });
    } catch (error) {
        res
            .status(500)
            .send('Error adding user to queue');
    }
}

const getChatMessages = async (roomID) => {
    try {
        const numericRoomID = Number(roomID);

        // Find the queue document that contains the room
        const queue = await Queue.findOne({ "Entries.roomID": numericRoomID });

        if (!queue) {
            return { message: "Queue entry does not exist" };
        }

        // Find the specific entry inside the queue
        let entry = queue.Entries.find(e => e.roomID === numericRoomID);
        if (!entry || entry.chat.length === 0) {
            return { message: "No chat messages found for this room" };
        }

        return { chatMessages: entry.chat };
    } catch (error) {
        console.error(error);
        return { error: "Error getting chat messages" };
    }
};


const addChatMessage = async (roomID, message, chatId='') => {
    try {
        const numericRoomID = Number(roomID);
        addMessage({ chatId: chatId, sender: message.sender, message: message.message });

        // Find the queue entry that contains this roomID
        const queue = await Queue.findOne({ "Entries.roomID": numericRoomID });

        if (!queue) {
            return { message: "Queue entry does not exist" };
        }

        // Find the specific entry inside the queue
        let entry = queue.Entries.find(e => e.roomID === numericRoomID);
        if (!entry) {
            return { message: "No matching room found" };
        }

        // Add the new chat message
        entry.chat.push(message);

        // Save the updated queue document
        await queue.save();

        return { messages: entry.chat };
    } catch (error) {
        console.error(error);
        return { error: "Error adding chat message" };
    }
};

const GetAllDoctors = async (req, res) => {
    try {
        const doctors = await User.find({ role: 'doctor' }).select('-password -refreshToken -__v -email -role -createdAt -updatedAt');
        if (!doctors) {
            return res.status(404).json({ message: "No doctors found", doctors: [] });
        }
        return res.status(200).json({ message: "All doctors fetched successfully", doctors: doctors });
    } catch (error) {
        res.status(500).json({ message: "Error while getting doctors", doctors: [] });
    }
}


export {
    AddEntryToQueue,
    getQueueData,
    RemoveEntryFromQueue,
    getQueueByUser,
    getChatMessages,
    addChatMessage,
    GetAllDoctors
}