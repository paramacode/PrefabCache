---
sidebar_position: 6
title: Dispose
---

# Dispose

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

Destroys **all** pooled instances (both available and in-use), destroys the internal template, and marks the cache as disposed. After disposal, calling any public method (`GetPrefab`, `ReturnPrefab`, `SetCacheParent`, `Expand`) will throw an error.

Calling `Dispose` on an already-disposed cache is a safe no-op.

---

### `Dispose()`

**Returns:** `void`

:::danger
Once disposed, the cache cannot be reused. Calling `GetPrefab`, `ReturnPrefab`, `SetCacheParent`, or `Expand` on a disposed cache will throw an error. Create a new `PrefabCache` if you need a fresh pool.
:::

---

### Usage

<Tabs groupId="languages">
  <TabItem value="ts" label="TypeScript">
    ```ts
    import { PrefabCache } from "@rbxts/prefab-cache";
    import { ReplicatedStorage } from "@rbxts/services";

    const template = ReplicatedStorage.FindFirstChild("BulletPrefab");
    const cache = PrefabCache.Create(template, 20);

    // Use the cache during the round...
    const bullet = cache.GetPrefab();
    cache.ReturnPrefab(bullet);

    // Round over — clean up everything
    cache.Dispose();
    ```
  </TabItem>
  <TabItem value="lua" label="Luau">
    ```lua
    local PrefabCache = require(path.to.PrefabCache)
    local ReplicatedStorage = game:GetService("ReplicatedStorage")

    local template = ReplicatedStorage:FindFirstChild("BulletPrefab")
    local cache = PrefabCache.Create(template, 20)

    -- Use the cache during the round...
    local bullet = cache:GetPrefab()
    cache:ReturnPrefab(bullet)

    -- Round over — clean up everything
    cache:Dispose()
    ```
  </TabItem>
</Tabs>
