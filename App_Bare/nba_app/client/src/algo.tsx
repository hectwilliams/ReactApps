
const ONES_32 = 2**4 - 1;

/* non-cryptographic hashing DJB2 */
export function quickHash(key: string) : string {
    let hash = 5503;
    for(let i = 0; i < key.length; i++) {
        let code = key.charCodeAt(i);
        hash = (hash << 5) + hash + code;
        hash = hash & ONES_32; 
    }
    hash = Math.abs(hash);
    return hash.toString();;
}