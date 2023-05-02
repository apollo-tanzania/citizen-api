import { Model, Document } from "mongoose";

/**
 * Returns documents, otherwise returns null
 * @param Model 
 * @param documentId 
 * @returns 
 */
async function queryById<T extends Document>(
    Model: Model<T>,
    documentId: string
) {

    try {
        const query = Model.findById(documentId)
        const result = await query.exec()
        return result;
    } catch (error) {
        return null
        // throw error
    }

}

export {
    queryById
}