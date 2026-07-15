import type { ServerRecordInterface } from "./handlers";

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

    get(name:string) : ServerRecordInterface | undefined{
        return this.dict[name];
    }

    clear() {
        this.dict = {};
        this.hash = "";
        this.service = "";
        this.players="";
    }

}

export const storeInst = new Store(); 