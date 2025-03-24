export type CropData = {
    _id?:number|string;
    name: string;
    variety: string;
    plantingDate: Date | string;
    harvestDate: Date | string    ;
    status: "Planting" | "Growing" | "Harvesting";
}
export type ActivityData = {
    _id?:number|string;
    description: string;
    date: Date;
    cropId: string|CropData;
    activity?:string;
}
export type ResourceData = { 
    _id?:number|string;
    name: string;
    quantity: number;
    type: string;
    cropId: string|CropData;
}
export type DbResponse<T>={
    success:boolean;
    data:T[]|T
}