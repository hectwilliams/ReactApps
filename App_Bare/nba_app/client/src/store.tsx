import type { ServerRecordInterface } from "./handlers";

interface StoreInterface {
    serverName: string;
    pad: ServerRecordInterface;
}

export type StoreDictionary = Record<string, ServerRecordInterface>;

/* cache every valid  page request. Each service has a landing spot in this systen */

class  Store  {

    dict: StoreDictionary;
    hash: string; 
    service: string;
    players: string;

    constructor() {
        this.dict = {};
        this.hash = "";
        this.service = "";
        this.players="";
    }

    load(name: string, data: ServerRecordInterface) {
        this.dict[name] = data;
    }

    get(namr:string) : ServerRecordInterface | undefined{
        return this.dict[namr];
    }

}

export const storeInst = new Store(); 