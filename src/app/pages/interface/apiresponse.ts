import { Owner } from "./owner";
import { Restaurant } from "./restaurant";

export interface TableData{
    columns: string[];
    data: any[];
}

export interface ApiResponse {

  owners: TableData;

  restaurants: TableData;

}