---
sidebar_position: 3
title: ReturnPrefab
---

# ReturnPrefab

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

Returns an instance back to the pool, making it available for future `GetPrefab` calls. The instance's parent is reset to `CurrentCacheParent`. The optional `onReturn` callback is executed before the instance is stored.

---

### `ReturnPrefab(instance)`

| Parameter | Type | Description |
|:---:|:---:|:---:|
| `instance` | `T` | The instance to return to the pool. Must belong to this cache. |

**Returns:** `void`

:::danger
Passing an instance that was **not** retrieved from this cache will throw an error.
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

    const bullet = cache.GetPrefab();
    bullet.Position = new Vector3(0, 10, 0);

    // When done, return it to the pool
    cache.ReturnPrefab(bullet);
    ```
  </TabItem>
  <TabItem value="lua" label="Luau">
    ```lua
    local PrefabCache = require(path.to.PrefabCache)
    local ReplicatedStorage = game:GetService("ReplicatedStorage")

    local template = ReplicatedStorage:FindFirstChild("BulletPrefab")
    local cache = PrefabCache.Create(template, 10)

    local bullet = cache:GetPrefab()
    bullet.Position = Vector3.new(0, 10, 0)

    -- When done, return it to the pool
    cache:ReturnPrefab(bullet)
    ```
  </TabItem>
</Tabs>

---

### With onReturn callback

<Tabs groupId="languages">
  <TabItem value="ts" label="TypeScript">
    ```ts
    const cache = PrefabCache.Create(template, 10, {
        onReturn: (bullet) => {
            bullet.Transparency = 1;
            bullet.Anchored = true;
            bullet.CFrame = new CFrame(0, -500, 0);
        },
    });

    const bullet = cache.GetPrefab();

    // onReturn fires automatically — bullet is hidden and repositioned
    cache.ReturnPrefab(bullet);
    ```
  </TabItem>
  <TabItem value="lua" label="Luau">
    ```lua
    local cache = PrefabCache.Create(template, 10, {
        onReturn = function(bullet)
            bullet.Transparency = 1
            bullet.Anchored = true
            bullet.CFrame = CFrame.new(0, -500, 0)
        end,
    })

    local bullet = cache:GetPrefab()

    -- onReturn fires automatically — bullet is hidden and repositioned
    cache:ReturnPrefab(bullet)
    ```
  </TabItem>
</Tabs>
