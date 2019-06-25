export class Store {
    private static stores = new WeakMap();

    private store = new Map();

    public get(key: string): any {
        return this.store.get(key);
    }
    public set(key: string, value: any) {
        this.store.set(key, value);
    }

    public static getStore(key: any): Store {
        let store = Store.stores.get(key);
        if (!store) {
            store = new Store();
            Store.stores.set(key, store);
        }
        return store;
    }

    public static hasStore(key: any) {
        return Store.stores.has(key);
    }

    public static removeStore(key: any) {
        Store.stores.delete(key);
    }
}
