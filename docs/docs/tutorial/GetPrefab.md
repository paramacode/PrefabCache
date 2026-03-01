---
sidebar_position: 2
title: GetPrefab
---

# GetPrefab

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

Retrieves an instance from the pool. If the pool is empty, it will automatically expand by `ExpansionSize` before returning an instance. The optional `onGet` callback is executed before the instance is returned.

---

### `GetPrefab()`

**Returns:** `T` -> A typed instance ready for use.

:::note
When the pool is empty, a warning is emitted and the cache auto-expands by `ExpansionSize` instances before returning one.
:::

---

### Usage

<Tabs groupId="languages">
  <TabItem value="ts" label="TypeScript">
    ```ts
    import { PrefabCache } from "@rbxts/prefab-cache";
    import { ReplicatedStorage } from "@rbxts/services";

    const template = ReplicatedStorage.FindFirstChild("BulletPrefab");
    const cache = PrefabCache.Create(template, 10);

    // Retrieve a bullet from the pool
    const bullet = cache.GetPrefab();
    bullet.Position = new Vector3(0, 10, 0);
    ```
  </TabItem>
  <TabItem value="lua" label="Luau">
    ```lua
    local PrefabCache = require(path.to.PrefabCache)
    local ReplicatedStorage = game:GetService("ReplicatedStorage")

    local template = ReplicatedStorage:FindFirstChild("BulletPrefab")
    local cache = PrefabCache.Create(template, 10)

    -- Retrieve a bullet from the pool
    local bullet = cache:GetPrefab()
    bullet.Position = Vector3.new(0, 10, 0)
    ```
  </TabItem>
</Tabs>

---

### With onGet callback

<Tabs groupId="languages">
  <TabItem value="ts" label="TypeScript">
    ```ts
    const cache = PrefabCache.Create(template, 10, {
        onGet: (bullet) => {
            bullet.Transparency = 0;
            bullet.Anchored = false;
        },
    });

    // onGet fires automatically - bullet is already visible and unanchored
    const bullet = cache.GetPrefab();
    ```
  </TabItem>
  <TabItem value="lua" label="Luau">
    ```lua
    local cache = PrefabCache.Create(template, 10, {
        onGet = function(bullet)
            bullet.Transparency = 0
            bullet.Anchored = false
        end,
    })

    -- onGet fires automatically - bullet is already visible and unanchored
    local bullet = cache:GetPrefab()
    ```
  </TabItem>
</Tabs>
