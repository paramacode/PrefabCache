---
sidebar_position: 4
title: SetCacheParent
---

# SetCacheParent

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

Changes the parent of **all** cached instances, both available and currently in use. This is useful for moving pooled objects between containers at runtime.

---

### `SetCacheParent(newParent)`

| Parameter | Type | Description |
|:---:|:---:|:---:|
| `newParent` | `Instance` | The new parent for all pooled instances. |

**Returns:** `void`

:::info
This also updates `CurrentCacheParent`, so any instances created afterwards (via `Expand` or auto-expansion) will use the new parent.
:::

---

### Usage

<Tabs groupId="languages">
  <TabItem value="ts" label="TypeScript">
    ```ts
    import { PrefabCache } from "@rbxts/prefab-cache";
    import { ReplicatedStorage, Workspace } from "@rbxts/services";

    const template = ReplicatedStorage.FindFirstChild("CoinPrefab");
    const cache = PrefabCache.Create(template, 15);

    // Move all coins to a dedicated folder
    const coinFolder = new Instance("Folder");
    coinFolder.Name = "CoinPool";
    coinFolder.Parent = Workspace;

    cache.SetCacheParent(coinFolder);
    ```
  </TabItem>
  <TabItem value="lua" label="Luau">
    ```lua
    local PrefabCache = require(path.to.PrefabCache)
    local ReplicatedStorage = game:GetService("ReplicatedStorage")

    local template = ReplicatedStorage:FindFirstChild("CoinPrefab")
    local cache = PrefabCache.Create(template, 15)

    -- Move all coins to a dedicated folder
    local coinFolder = Instance.new("Folder")
    coinFolder.Name = "CoinPool"
    coinFolder.Parent = workspace

    cache:SetCacheParent(coinFolder)
    ```
  </TabItem>
</Tabs>
