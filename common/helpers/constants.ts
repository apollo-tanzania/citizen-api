export const strings = Object.freeze({
    REPORT_REMARK_PHRASE: {
        // if the phone has never been reported stolen before
        PHRASE1: 'This phone never been reported stolen before',
        // if the phone has been reported stolen once 
        PHRASE2: 'This phone has been reported stolen once before',
        // if the phone has been reported stolen multiple times
        PHRASE3: 'This phone has been reported stolen a few times before',
        // if the phone has been reported stolen many times (6 or more times)
        PHRASE4: 'This phone has a history of being reported stolen'
    },
    IMEI: {
        IMEI: "imei",
        IMEI1: "imei1",
        IMEI2: "imei2",
        IMEI3: "imei3"
    },
    PHONE_IMEI: {
        IMEI1: "phone.imei1",
        IMEI2: "phone.imei2",
        IMEI3: "phone.imei3"
    },
    BRAND: 'brand',
    MODEL: 'model',
    NAME: 'name',
    DEVICE_SPECIFICATION: 'deviceSpecification',
    TAC:'tac',
    MODELS: 'models',
    SIM_SLOTS: 'simSlots',
    ERROR_MESSAGES: {
        DUPLICATE_REPORT: 'The information in this phone report matches a report that has already been submitted. We consider this to be a duplicate report'
    }
})