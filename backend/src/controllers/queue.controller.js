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


export {
    AddEntryToQueue,
}