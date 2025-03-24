export type CropData = {
    _id?:number|string;
    name: string;
    variety: string;
    plantingDate: Date|string;
    harvestDate: Date|string    ;
    status: "Planting" | "Growing" | "Harvesting";
}