import { Model, Document, FilterQuery } from "mongoose";

export interface QueryParams {
    page?: number;
    limit?: number;
    filter?: FilterQuery<{}>;
    sort?: any;
}
// type MongooseModel<T> = Model<T & Document>;
/**
 *  Query documents with pagination, filtering and sorting
 * @param Model 
 * @param queryParams 
 * @returns 
 */
async function queryWithPagination<T extends Document>(
    Model: Model<T>,
    queryParams: QueryParams,
    populate?: any
) {

    try {
        const { page, limit, filter = {}, sort = {} } = queryParams;

        const query = Model.find(filter)
            .sort(sort)
            .skip(Number(limit) * (Number(page) - 1))
            .limit(Number(limit))

        if(populate){
            query.populate(populate);
        }
        const data = await query.exec()

        const count = await Model.countDocuments(filter)

        return {
            data,
            totalPages: Math.ceil(count / Number(limit)),
            currentPage: page,
            totalCount: count,
            perPage: Number(limit)
        }
    } catch (error) {
        throw error
    }

}

/**
 * Query documents with pagination, filtering and sorting
 * @param Model 
 * @param id 
 * @param queryParams 
 * @returns 
 */
async function queryByIdWithPagination<T extends Document>(
    Model: Model<T>,
    id: string,
    queryParams: QueryParams
) {

    try {
        const { page, limit, filter = {}, sort = {} } = queryParams;

        // First query the document by id
        const query = Model.findById(id)

        // Apply filtering and sorting to the query
        query.where(filter)
            .sort(sort)
            .skip(Number(limit) * (Number(page) - 1))
            .limit(Number(limit))

        const results = await query.exec()

        const count = await Model.countDocuments(filter)

        return {
            results,
            totalPages: Math.ceil(count / Number(limit)),
            currentPage: page,
            totalCount: count,
        }
    } catch (error) {
        throw error
    }


}

export {
    queryWithPagination,
    queryByIdWithPagination
}