export interface CreatePhoneDto {
    imei1: number,
    imei2?: number,
    imei3?: number
    name: string,
    brand: string,
    modelName: string,
    manufacturer: string,
    color?: string,
    storage: string,
    imageUrl: string
}
