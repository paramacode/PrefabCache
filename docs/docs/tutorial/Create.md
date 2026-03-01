---
sidebar_position: 1
title: Create
---

# Create

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

Factory method to create a new `PrefabCache` instance. It clones the given template, pre-creates a pool of instances, and returns a ready-to-use cache.

---

### `Create(template, numPrecreated?, options?)`

| Parameter | Type | Default | Description |
|:---:|:---:|:---:|:---:|
| `template` | `T extends Instance` | - | The instance used as cloning source. |
| `numPrecreated` | `number` | `5` | Number of instances to pre-create in the pool. Must be greater than 0. |
| `options` | `PrefabCacheOptions<T>` | `undefined` | Optional configuration object. |

#### Options

| Field | Type | Default | Description |
|:---:|:---:|:---:|:---:|
| `expansionSize` | `number` | `10` | How many instances to create when the pool auto-expands. |
| `parent` | `Instance` | `Workspace` | Parent for all pooled instances. |
| `onGet` | `(instance: T) => void` | `undefined` | Callback executed every time an instance is retrieved. |
| `onReturn` | `(instance: T) => void` | `undefined` | Callback executed every time an instance is returned. |

**Returns:** `PrefabCache<T>`

:::warning
If the template is a descendant of `Workspace`, a warning will be emitted. Consider keeping templates outside the live hierarchy.
:::

:::info
If the template's `Archivable` property is `false`, it will be temporarily set to `true` for cloning and then restored.
:::

---

### Basic usage

<Tabs groupId="languages">
  <TabItem value="ts" label="TypeScript">
    ```ts
    import { PrefabCache } from "@rbxts/prefab-cache";
    import { ReplicatedStorage } from "@rbxts/services";

    const template = ReplicatedStorage.FindFirstChild("BulletPrefab");

    const cache = PrefabCache.Create(template, 20);
    ```
  </TabItem>
  <TabItem value="lua" label="Luau">
    ```lua
    local PrefabCache = require(path.to.PrefabCache)
    local ReplicatedStorage = game:GetService("ReplicatedStorage")

    local template = ReplicatedStorage:FindFirstChild("BulletPrefab")

    local cache = PrefabCache.Create(template, 20)
    ```
  </TabItem>
</Tabs>

---

### With options

<Tabs groupId="languages">
  <TabItem value="ts" label="TypeScript">
    ```ts
    import { PrefabCache } from "@rbxts/prefab-cache";
    import { ReplicatedStorage, Workspace } from "@rbxts/services";

    const template = ReplicatedStorage.FindFirstChild("EnemyPrefab") as Model;

    const cache = PrefabCache.Create(template, 10, {
        expansionSize: 5,
        parent: Workspace.FindFirstChild("EnemyPool")!,
        onGet: (enemy) => {
            enemy.FindFirstChildOfClass("Humanoid")!.Health = 100;
        },
        onReturn: (enemy) => {
            enemy.PivotTo(new CFrame(0, -500, 0));
        },
    });
    ```
  </TabItem>
  <TabItem value="lua" label="Luau">
    ```lua
    local PrefabCache = require(path.to.PrefabCache)
    local ReplicatedStorage = game:GetService("ReplicatedStorage")

    local template = ReplicatedStorage:FindFirstChild("EnemyPrefab")

    local cache = PrefabCache.Create(template, 10, {
        expansionSize = 5,
        parent = workspace:FindFirstChild("EnemyPool"),
        onGet = function(enemy)
            enemy:FindFirstChildOfClass("Humanoid").Health = 100
        end,
        onReturn = function(enemy)
            enemy:PivotTo(CFrame.new(0, -500, 0))
        end,
    })
    ```
  </TabItem>
</Tabs>