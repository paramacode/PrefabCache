local ReplicatedStorage = game:GetService("ReplicatedStorage")

local PrefabCache = ReplicatedStorage:WaitForChild("PrefabCache")

local TestEZ = require(PrefabCache.include.node_modules["@rbxts"].testez.src)

local results = TestEZ.TestBootstrap:run({
	ReplicatedStorage.PrefabCache.Tests
})

if results.failureCount > 0 then
	error(`Failed an amount of "{results.failureCount}" tests: "{results.errors}"`)
end