import { Workspace } from "@rbxts/services";

const DEFAULT_EXPANSION_SIZE = 10;

export interface PrefabCacheOptions<T extends Instance> {
    expansionSize?: number;
    parent?: Instance;
    onGet?: (instance: T) => void;
    onReturn?: (instance: T) => void;
}

export interface PrefabCacheContract<T extends Instance> {
    GetPrefab(): T;
    ReturnPrefab(instance: T): void;
    SetCacheParent(newParent: Instance): void;
    Expand(count?: number): void;
    Dispose(): void;

    ExpansionSize: number;
    CurrentCacheParent: Instance;
}

function cloneTemplateSafe<T extends Instance>(template: T): T {
    if (!template.Archivable) {
        warn("Template Archivable is false, it will be temporarily forced to true.");
    }

    const previous = template.Archivable;
    template.Archivable = true;
    const cloned = template.Clone();
    template.Archivable = previous;

    return cloned;
}

export class PrefabCache<T extends Instance>
    implements PrefabCacheContract<T>
{
    private readonly _open: T[] = [];
    private readonly _inUse: Set<T> = new Set();

    private readonly _template: T;
    private readonly _onGet?: (instance: T) => void;
    private readonly _onReturn?: (instance: T) => void;

    private _disposed = false;

    public ExpansionSize: number;
    public CurrentCacheParent: Instance;

    private constructor(
        template: T,
        numPrecreated: number,
        options?: PrefabCacheOptions<T>
    ) {
        if (template.IsDescendantOf(Workspace)) {
            warn("Template is inside Workspace. Consider keeping templates outside the live hierarchy.");
        }

        this.ExpansionSize = options?.expansionSize ?? DEFAULT_EXPANSION_SIZE;
        this.CurrentCacheParent = options?.parent ?? Workspace;

        this._onGet = options?.onGet;
        this._onReturn = options?.onReturn;

        this._template = cloneTemplateSafe(template);
        this._template.Parent = undefined;

        for (let i = 0; i < numPrecreated; i++) {
            this._open.push(this.createInstance());
        }
    }

    /**
     * Factory method to create a new generic PrefabCache instance.
     * @param template Instance used as cloning source.
     * @param numPrecreated Number of instances to pre-create in the pool.
     * @param options Optional configuration (callbacks, parent, expansion size).
     * @returns A new typed PrefabCache instance.
     */
    public static Create<T extends Instance>(
        template: T,
        numPrecreated = 5,
        options?: PrefabCacheOptions<T>
    ): PrefabCache<T> {
        assert(numPrecreated > 0, "numPrecreated must be greater than 0.");
        return new PrefabCache(template, numPrecreated, options);
    }

    private createInstance(): T {
        const instance = this._template.Clone();
        instance.Parent = this.CurrentCacheParent;
        return instance;
    }

    /**
     * Retrieves an instance from the pool.
     * Automatically expands the pool if no instances are available.
     * Executes the optional onGet callback before returning.
     * @returns A typed instance ready for use.
     */
    public GetPrefab(): T {
        if (this._disposed) error("Cannot call GetPrefab on a disposed cache.");

        let instance = this._open.pop();

        if (!instance) {
            warn(`PrefabCache empty. Expanding by ${this.ExpansionSize}.`);
            this.Expand(this.ExpansionSize);
            instance = this._open.pop()!;
        }

        this._inUse.add(instance);
        this._onGet?.(instance);

        return instance;
    }

    /**
     * Returns an instance back to the pool.
     * Executes the optional onReturn callback before storing it.
     * Throws if the instance does not belong to this cache.
     * @param instance The instance to return to the pool.
     */
    public ReturnPrefab(instance: T): void {
        if (this._disposed) error("Cannot call ReturnPrefab on a disposed cache.");

        if (!this._inUse.has(instance)) {
            error(
                `Attempted to return an instance not managed by this cache: ${instance.GetFullName()}`
            );
        }

        this._inUse.delete(instance);

        this._onReturn?.(instance);
        instance.Parent = this.CurrentCacheParent;

        this._open.push(instance);
    }

    /**
     * Changes the parent of all cached instances (both available and in-use).
     * Useful for moving pooled objects between containers.
     * @param newParent The new parent instance.
     */
    public SetCacheParent(newParent: Instance): void {
        if (this._disposed) error("Cannot call SetCacheParent on a disposed cache.");

        this.CurrentCacheParent = newParent;

        for (const instance of this._open) {
            instance.Parent = newParent;
        }

        for (const instance of this._inUse) {
            instance.Parent = newParent;
        }
    }

    /**
     * Expands the pool by creating additional instances.
     * If count is omitted, ExpansionSize is used.
     * @param count Optional number of instances to add.
     */
    public Expand(count?: number): void {
        if (this._disposed) error("Cannot call Expand on a disposed cache.");

        const amount = count ?? this.ExpansionSize;

        for (let i = 0; i < amount; i++) {
            this._open.push(this.createInstance());
        }
    }

    /**
     * Destroys all pooled instances and marks the cache as disposed.
     * After disposal, all public methods will throw if called.
     */
    public Dispose(): void {
        if (this._disposed) return;

        for (const instance of this._open) {
            instance.Destroy();
        }

        for (const instance of this._inUse) {
            instance.Destroy();
        }

        this._template.Destroy();

        this._open.clear();
        this._inUse.clear();

        this._disposed = true;
    }
}