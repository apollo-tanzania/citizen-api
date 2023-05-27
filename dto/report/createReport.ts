export interface CreateReportDto {
  phone: {
    // imei1: number,
    // imei2?: number,
    // imei3?: number
    // imei:{
    //   number: string,
    // }[],
    imei: string[],
    //  object[],
    name: string,
    brand: string,
    model: string,
    manufacturer: string,
    imageUrl: string,
    storage: number
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
  }
}

enum Flag {
  clear,
  warning,
  caution,
}
enum Depossession {
  lost,
  stolen
}