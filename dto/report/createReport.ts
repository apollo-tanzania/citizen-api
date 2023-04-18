export interface CreateReportDto {
  phone: {
    imei: Number,
    name: String,
    brand: String,
    model: String,
    manufacturer: String,
    imageUrl: String
  },
  incident: {
    date: String,
    place: String,
    depossession: Depossession,
    brief: String
  },
  flags: Flag,
  rb: String,
  verified: Boolean,
  victim: {
    firstname: String,
    middlename: String,
    lastname: String,
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