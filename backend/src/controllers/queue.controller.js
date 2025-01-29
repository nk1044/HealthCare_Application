import { Queue } from "../models/queue.model.js";

const AddEntryToQueue = async (req, res) => {
    try {
        const { tag, description} = req.body;
        const userId = req?.user?._id;
        const queue = await Queue.findOne({ tag: tag });
        if (!queue) {
            await Queue.create({ 
                tag, 
                Entries: [{ 
                    user: userId, 
                    tag:tag, 
                    description: description 
                }] 
            });
        } else {
            queue.Entries.push({ 
                user: userId, 
                tag:tag, 
                description: description 
            });
            await queue.save({ validateBeforeSave: false});
        }
        res
        .status(200)
        .send('User added to queue successfully');
    } catch (error) {
        res
        .status(500)
        .send('Error adding user to queue');
    }
}


const GetQueue = async (req, res) => {
    try {
        const queue = await Queue.find();
        // let queue = null;
        // if(tag=='All'){
        //     queue = await Queue.find();
        // }else {
        //     queue = await Queue.findOne({ tag: tag });
        // }
        if (!queue) {
            res
            .status(404)
            .send('Queue not found');
        } else {
            res
            .status(200)
            .send(queue);
        }
    } catch (error) {
        res
        .status(500)
        .send('Error fetching queue');
    }
}


export {
    AddEntryToQueue,
    GetQueue,
}