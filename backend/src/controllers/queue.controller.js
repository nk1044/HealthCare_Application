import { io } from "../../app.js";
import { Queue } from "../models/queue.model.js";

const getQueueData= async ()=>{
    const queue = await Queue.find();
    return queue
}

const AddEntryToQueue = async (req, res) => {
    try {
        const { tag, description} = req.body;
        const userId = req?.user?._id;
        const queue = await Queue.findOne({ tag: tag });
        const randomRoomID = Math.floor(Math.random() * 100000);
        if (!queue) {
            await Queue.create({ 
                tag, 
                Entries: [{ 
                    user: userId, 
                    tag:tag, 
                    description: description ,
                    roomID: randomRoomID
                }] 
            });
        } else {
            queue.Entries.unshift({ 
                user: userId, 
                tag: tag, 
                description: description,
                roomID: randomRoomID
            });
            await queue.save({ validateBeforeSave: false });            
        }
        const queueData = await getQueueData();
        io.to(String(process.env.ROOM_ID)).emit('queue-data', queueData);
         
        res
        .status(200)
        .json({
            roomID:randomRoomID
        })
    } catch (error) {
        res
        .status(500)
        .send('Error adding user to queue');
    }
}




export {
    AddEntryToQueue,
    getQueueData
}