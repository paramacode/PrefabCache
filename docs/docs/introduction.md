---
sidebar_position: 1
slug: /
---

# Introduction

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

**PrefabCache** is a generic, lightweight object-pooling library for Roblox. It lets you pre-create clones of any `Instance` and reuse them on demand instead of calling `Instance.new` or `Clone` every frame, keeping your game's memory allocation predictable and your frame times smooth.

## Why use object pooling?

Every time you clone or create a new instance at runtime, the engine has to allocate memory, run property replication, and fire lifecycle events. In hot paths like bullet systems, VFX spawners, or enemy waves, this adds up fast and can cause noticeable frame hitches.

An object pool solves this by **pre-creating** instances ahead of time and recycling them. When you need one you *get* it from the pool; when you're done you *return* it. No allocation, no destruction, just reparenting.

## Features

- **Generic & typed** -> works with any `Instance` subclass (`Part`, `Model`, `BasePart`, etc.) while preserving full type information.
- **Automatic expansion** -> if the pool runs out, it grows by a configurable `ExpansionSize` so your game never stalls.
- **Lifecycle callbacks** -> optional `onGet` and `onReturn` hooks let you reset or configure instances without extra boilerplate.
- **Configurable parent** -> choose where pooled instances live, and move them at runtime with `SetCacheParent`.
- **Safe template cloning** -> handles `Archivable = false` templates transparently.
- **Clean disposal** -> a single `Dispose` call destroys every instance and prevents further use.

## Quick example

<Tabs groupId="languages">
  <TabItem value="ts" label="TypeScript">
    ```ts
    import { PrefabCache } from "@rbxts/prefab-cache";
    import { ReplicatedStorage } from "@rbxts/services";

    const template = ReplicatedStorage.FindFirstChild("BulletPrefab") as Part;

    // Pre-create 20 bullets
    const bulletPool = PrefabCache.Create(template, 20);

    // Get a bullet, use it, return it
    const bullet = bulletPool.GetPrefab();
    bullet.Position = new Vector3(0, 10, 0);
    // ... later
    bulletPool.ReturnPrefab(bullet);
    ```
  </TabItem>
  <TabItem value="lua" label="Luau">
    ```lua
    local PrefabCache = require(path.to.PrefabCache)
    local ReplicatedStorage = game:GetService("ReplicatedStorage")

    local template = ReplicatedStorage:FindFirstChild("BulletPrefab")

    -- Pre-create 20 bullets
    local bulletPool = PrefabCache.Create(template, 20)

    -- Get a bullet, use it, return it
    local bullet = bulletPool:GetPrefab()
    bullet.Position = Vector3.new(0, 10, 0)
    -- ... later
    bulletPool:ReturnPrefab(bullet)
    ```
  </TabItem>
</Tabs>

## API at a glance

| Method | Description |
|:---:|:---:|
| `Create(template, count?, options?)` | Factory - creates a new cache with pre-created instances. |
| `GetPrefab()` | Retrieves an available instance (auto-expands if empty). |
| `ReturnPrefab(instance)` | Returns an instance to the pool. |
| `SetCacheParent(parent)` | Moves all pooled instances to a new parent. |
| `Expand(count?)` | Manually adds more instances to the pool. |
| `Dispose()` | Destroys everything and marks the cache as unusable. |

Head over to the [Installation](/docs/installation) page to get started, or jump straight into the [Guide](/docs/category/guide) for detailed usage of each method.
