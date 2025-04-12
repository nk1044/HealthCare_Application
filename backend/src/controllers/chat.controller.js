import { Chat } from "../models/Chat.model.js";

const createChat = async (data) => {
    const { tag, doctorId, userId, description, chat=[] } = data;
    if (!tag || !doctorId || !userId || !description) {
        return { message: "Tag, doctorId and userId are required", chat: null };
    }
    try {
        const newChat = new Chat({
            tag,
            doctorId,
            userId,
            description,
            chat: chat.map((message) => ({
                sender: message.sender,
                message: message.message,
                timestamp: message.timestamp || Date.now()
            }))
        });

        await newChat.save();
        return {message: "Chat created successfully", chat: newChat};    
    } catch (error) {
        return { message: error.message, chat: null };
    }
};

const getUserChats = async (req, res) => {
    const userId = req?.user?._id;
    try {
        const chats = await Chat.find({ userId })
        console.log("chats", chats);
        if (!chats) {
            return res.status(404).json({ message: "No chats found", chats: null });
        }
        res.status(200).json({ message: "Chats retrieved successfully", chats });
    } catch (error) {
        res.status(500).json({ message: error.message, chats: null });
    }
}

const addMessage = async (data) => {
    const { chatId, sender, message } = data;
    try {
        const chat = await Chat.findById(chatId);
        if (!chat) {
            return { message: "Chat not found", chat: null };
        }
        chat.chat.push({
            sender,
            message,
            timestamp: Date.now()
        });
        console.log("chatId:", chatId);
        
        await chat.save();
        return { message: "Message added successfully", chat }; 
    } catch (error) {
        return { message: error.message, chat: null };
    }
}

const deleteChat = async (req, res) => {
    const { chatId } = req.body;
    try {
        const chat = await Chat.findById(chatId);
        if (!chat) {
            return res.status(404).json({ message: "Chat not found", status: false });
        }
        await chat.remove();
        res.status(200).json({ message: "Chat deleted successfully", status: true});
    } catch (error) {
        res.status(500).json({ message: error.message, status: false});
    }
}

export {
    createChat,
    getUserChats,
    addMessage,
    deleteChat
}