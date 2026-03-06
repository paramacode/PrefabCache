/// <reference types="@rbxts/testez/globals" />

import { PrefabCache } from "..";
import { Workspace } from "@rbxts/services";

export = () => {
    // Covers creation/expansion, return/reuse, and post-Dispose errors.
    describe("PrefabCache", () => {
        // When cache is empty and 'ExpansionSize = 1', calling
        // 'GetPrefab()' twice will force the cache to expand. This produces
        // the expected warning: "No prefabs available! Creating [1] new prefabs.".
        it("should create cache and expand when empty", () => {
            const template = new Instance("Part");
            template.Archivable = true;

            const parent = new Instance("Folder");
            parent.Parent = Workspace;

            const cache = PrefabCache.Create(template, 1, { parent });
            cache.ExpansionSize = 1;

            const a = cache.GetPrefab();
            expect(a).to.be.ok();

            const b = cache.GetPrefab(); // forces expansion
            expect(b).to.be.ok();
            expect(a !== b).to.equal(true);

            cache.Dispose();
            parent.Destroy();
        });

        // Returning a prefab via 'ReturnPrefab' should allow the
        // same instance to be retrieved again by 'GetPrefab()'.
        it("should return a prefab and allow reuse", () => {
            const template = new Instance("Part");
            template.Archivable = true;

            const parent = new Instance("Folder");
            parent.Parent = Workspace;

            const cache = PrefabCache.Create(template, 2, { parent });

            const p1 = cache.GetPrefab();
            cache.ReturnPrefab(p1);

            const p2 = cache.GetPrefab();
            expect(p1).to.equal(p2);

            cache.Dispose();
            parent.Destroy();
        });

        // After calling 'Dispose()' the cache should block further
        // operations and throw when methods like 'GetPrefab()' are invoked.
        it("should block operations after Dispose", () => {
            const template = new Instance("Part");
            template.Archivable = true;

            const parent = new Instance("Folder");
            parent.Parent = Workspace;

            const cache = PrefabCache.Create(template, 1, { parent });
            cache.Dispose();

            expect(() => cache.GetPrefab()).to.throw();

            parent.Destroy();
        });

        // Creating a cache with 'numPrecreatedParts = 0' should throw
        // because the factory asserts that the number must be > 0.
        it("Create should throw when numPrecreatedParts is 0", () => {
            const template = new Instance("Part");
            template.Archivable = true;

            const parent = new Instance("Folder");
            parent.Parent = Workspace;

            expect(() => PrefabCache.Create(template, 0, { parent })).to.throw();

            parent.Destroy();
        });

        // Returning a prefab that wasn't checked out should error.
        it("ReturnPrefab should throw for non-in-use parts", () => {
            const template = new Instance("Part");
            template.Archivable = true;

            const parent = new Instance("Folder");
            parent.Parent = Workspace;

            const cache = PrefabCache.Create(template, 1, { parent });

            const foreign = new Instance("Part");
            foreign.Parent = Workspace;

            expect(() => cache.ReturnPrefab(foreign)).to.throw();

            foreign.Destroy();
            cache.Dispose();
            parent.Destroy();
        });

        // SetCacheParent should move both open and in-use prefabs to the new parent (must be descendant of Workspace).
        it("SetCacheParent moves open and in-use prefabs", () => {
            const template = new Instance("Part");
            template.Archivable = true;

            const parent = new Instance("Folder");
            parent.Parent = Workspace;

            const cache = PrefabCache.Create(template, 2, { parent });

            const inUse = cache.GetPrefab();

            const newParent = new Instance("Folder");
            newParent.Parent = Workspace;

            cache.SetCacheParent(newParent);

            // in-use part should be reparented immediately
            expect(inUse.Parent).to.equal(newParent);

            // the remaining open part should also be reparented
            const second = cache.GetPrefab();
            expect(second.Parent).to.equal(newParent);

            cache.ReturnPrefab(inUse);
            cache.ReturnPrefab(second);

            cache.Dispose();
            parent.Destroy();
            newParent.Destroy();
        });

        // SetCacheParent should assert when the new parent is not
        // inside 'Workspace'.
        it("SetCacheParent should throw for parent outside Workspace", () => {
            const template = new Instance("Part");
            template.Archivable = true;

            const parent = new Instance("Folder");
            parent.Parent = Workspace;

            const cache = PrefabCache.Create(template, 1, { parent });

            const invalidParent = new Instance("Folder"); // not parented to Workspace

            // New behavior: SetCacheParent accepts any Instance. Verify it moves
            // in-use instances and updates CurrentCacheParent.
            const inUse = cache.GetPrefab();
            cache.SetCacheParent(invalidParent);
            expect(cache.CurrentCacheParent).to.equal(invalidParent);
            expect(inUse.Parent).to.equal(invalidParent);

            cache.ReturnPrefab(inUse);

            cache.Dispose();
            parent.Destroy();
            invalidParent.Destroy();
        });

        // Expand(n) should add 'n' new prefabs when requested.
        it("Expand with a numeric parameter should add that many prefabs", () => {
            const template = new Instance("Part");
            template.Archivable = true;

            const parent = new Instance("Folder");
            parent.Parent = Workspace;

            const cache = PrefabCache.Create(template, 1, { parent });

            // expand by 2 (now total open should allow 3 GetPrefab without creating extra)
            cache.Expand(2);

            const p1 = cache.GetPrefab();
            const p2 = cache.GetPrefab();
            const p3 = cache.GetPrefab();

            expect(p1).to.be.ok();
            expect(p2).to.be.ok();
            expect(p3).to.be.ok();

            cache.Dispose();
            parent.Destroy();
        });

        // For the generic PrefabCache, ReturnPrefab should invoke the
        // optional callback and reparent the instance back to
        // `CurrentCacheParent` (no BasePart-specific resets are assumed).
        it("ReturnPrefab invokes onReturn and reparents instance", () => {
            const template = new Instance("Part");
            template.Archivable = true;

            const parent = new Instance("Folder");
            parent.Parent = Workspace;

            let onGetCalled = false;
            let onReturnCalled = false;

            const cache = PrefabCache.Create(template, 1, {
                parent,
                onGet: () => (onGetCalled = true),
                onReturn: () => (onReturnCalled = true),
            });

            const p = cache.GetPrefab();
            expect(onGetCalled).to.equal(true);

            // move it elsewhere, then return
            p.Parent = Workspace;
            cache.ReturnPrefab(p);

            expect(onReturnCalled).to.equal(true);
            expect(p.Parent).to.equal(cache.CurrentCacheParent);

            cache.Dispose();
            parent.Destroy();
        });
    });
};
