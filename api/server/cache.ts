export class TypedCache<K, V> {
    private capacity: number;
    private entries: number;
    public cache: Map<K, V[]>;

    constructor(capacity: number) {
        this.cache = new Map();
        this.capacity = capacity;
        this.entries = 0;
    }

    set(key: K, value: V[], skip: number = 0) {
        if (!this.has(key)) {
            if (this.entries >= this.capacity) {
                // Delete oldest key
                this.cache.delete(this.cache.keys()[0]);
            } else {
                this.entries++;
            }
        }

        const valueToSet = this.cache.get(key) ?? [];
        for (let i = 0; i < value.length; i++) {
            valueToSet[i + skip] = value[i];
        }

        this.cache.set(key, valueToSet);
    }

    get(key: K, skip: number, take: number): V[] | undefined {
        const value = this.cache.get(key);
        if (value) {
            const slice = value.slice(skip, skip + take);
            if (slice.filter((item) => item).length < take) {
                return undefined;
            }

            // Reinsert the value to keep the key at the end
            this.cache.delete(key);
            this.cache.set(key, value);
            return slice;
        }

        return undefined;
    }

    has(key: K): boolean {
        return this.cache.has(key);
    }
}
