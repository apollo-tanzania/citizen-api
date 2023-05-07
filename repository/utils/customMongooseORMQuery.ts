import { Model, Document } from "mongoose"
import { Pagination, QueryParams } from "../../types";

class CustomMongooseORMQuery {
    //  1.  find query

    find(): void;
    /**
     *  Query documents with pagination, filtering and sorting
     * @param Model 
     * @param queryParams 
     * @returns 
     */
    async find<T extends Document>(model: Model<T>, queryParams: QueryParams, populate?: any): Promise<Pagination>;

    // implementation of all `find` method overloads
    async find<T extends Document>(arg?: Model<T>, queryParams?: QueryParams, populate?: any) {

        if (arg === undefined) {

        } else if (typeof arg === 'object' && arg !== null && typeof queryParams === 'object') {
            try {
                const { page, limit, filter = {}, sort = {} } = queryParams;

                const query = Model.find(filter)
                    .select('-__v')
                    .sort(sort)
                    .skip(Number(limit) * (Number(page) - 1))
                    .limit(Number(limit))

                if (populate) {
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
    }

    //  2. findById query

    /**
     * Returns model document, otherwise returns null
     * @param Model 
     * @param documentId 
     * @returns 
     */
    async findById<T extends Document>(
        Model: Model<T>,
        documentId: string
    ) {

        try {
            const query = Model.findById(documentId)
            // filter return properties of the model document
            query.select('-__v')
            // execute query
            const data = await query.exec()
            return {
                query: documentId,
                data
            }
        } catch (error) {
            throw error
        }

    }
}

export default new CustomMongooseORMQuery();