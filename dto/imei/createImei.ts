export interface CreateImeiDto{
    tac: number;
    serial: number;
    checkDigit: number;
    valid: boolean | null,
    deviceId: number | null;
    deviceImageUrl: string | null;
    deviceSpecification: {
        simSlots: number | null;
        operatingSystem: string | null;
        operatingSystemFamily: string;
        aliases: string[] | null,
        bluetooth: string[] | null,
        usb: string[] | null,
        wlan: string[] | null,
        nfc: boolean | null,
        speed: string[] | null,
        nettech: string[] | null
    };
    name: string;
    brand: string;
    modelName: string;
    models: string[];
    manufacturer: string;
    deviceType: string;
    frequency: string[] | null;
    blackListStatus: boolean | null;
}