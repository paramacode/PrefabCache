---
sidebar_position: 5
title: Expand
---

# Expand

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

Manually expands the pool by creating additional instances. If `count` is omitted, `ExpansionSize` is used. This is useful for pre-warming the cache before a known spike in demand.

---

### `Expand(count?)`

| Parameter | Type | Default | Description |
|:---:|:---:|:---:|:---:|
| `count` | `number` | `ExpansionSize` | Number of instances to add to the pool. |

**Returns:** `void`

:::tip
`GetPrefab` calls `Expand` automatically when the pool is empty, but calling it manually beforehand avoids the runtime warning and potential frame spike.
:::

---

### Usage

<Tabs groupId="languages">
  <TabItem value="ts" label="TypeScript">
    ```ts
    import { PrefabCache } from "@rbxts/prefab-cache";
    import { ReplicatedStorage } from "@rbxts/services";

    const template = ReplicatedStorage.FindFirstChild("BulletPrefab");
    const cache = PrefabCache.Create(template, 5);

    // Pre-warm with 50 extra bullets before the round starts
    cache.Expand(50);
    ```
  </TabItem>
  <TabItem value="lua" label="Luau">
    ```lua
    local PrefabCache = require(path.to.PrefabCache)
    local ReplicatedStorage = game:GetService("ReplicatedStorage")

    local template = ReplicatedStorage:FindFirstChild("BulletPrefab")
    local cache = PrefabCache.Create(template, 5)

    -- Pre-warm with 50 extra bullets before the round starts
    cache:Expand(50)
    ```
  </TabItem>
</Tabs>

---

### Using default ExpansionSize

<Tabs groupId="languages">
  <TabItem value="ts" label="TypeScript">
    ```ts
    // ExpansionSize defaults to 10 (or whatever was set in options)
    cache.Expand();
    ```
  </TabItem>
  <TabItem value="lua" label="Luau">
    ```lua
    -- ExpansionSize defaults to 10 (or whatever was set in options)
    cache:Expand()
    ```
  </TabItem>
</Tabs>
