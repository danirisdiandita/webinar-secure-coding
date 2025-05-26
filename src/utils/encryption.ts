import Hashids from 'hashids';
const SECRET_KEY = process.env.HASHIDS_ENCRYPTION_KEY! as string; // Use a securely generated key (store this securely)


export function encrypt(text: string | number | bigint): string {
    const hashids = new Hashids(SECRET_KEY, 18, 'abcdefghijklmnopqrstuvwxyz0123456789');
    return hashids.encode(text as string);
}

export function decrypt(hash: string): string | number | bigint {
    const hashids = new Hashids(SECRET_KEY, 18, 'abcdefghijklmnopqrstuvwxyz0123456789');
    const text = hashids.decode(hash)[0];
    if (typeof text === 'string') {
        return text;
    }

    if (typeof text === 'bigint') {
        return text.toString();
    }

    return text;
}