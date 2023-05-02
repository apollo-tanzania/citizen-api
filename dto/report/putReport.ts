export interface PutReportDto {
  phone: {
    imei1: number,
    imei2?: number,
    imei3?: number,
    name: string,
    brand: string,
    model: string,
    manufacturer: string,
    imageUrl: string
  },
  incident: {
    date: string,
    place: string,
    depossession: Depossession,
    brief: string
  },
  flags: Flag,
  rb: string,
  verified: boolean,
  victim: {
    firstname: string,
    middlename: string,
    lastname: string,
    username?: string
  },
  reasonForUnverification?: string,
  originalReportId?: string,
  authorizedBy?:string
}

export enum Flag {
  clear,
  warning,
  caution,
}
export enum Depossession {
  lost,
  stolen
}