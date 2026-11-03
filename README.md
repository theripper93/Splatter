# Splatfinder
A fork of TheRipper93's [Splatter](https://github.com/theripper93/Splatter) module with some extended functionality for Pathfinder 2e system.

## What's the difference?
This module's main change is repurposing the "creatureType" and "creatureTypeCustom" to append  instead of overwriting each other. This way the module can utilize both fields to give the tokens blood color based on both their actor type (vehicle, hazard, treasure, character, NPC etc) as wall as their traits (Ghost, Skeleton, Undead, Humanoid etc).
With this change, you can easily disable all blood splatters on things that shouldn't bleed (like vehicles or hazards) without having to change the default token parameters

[This repo also includes an updated version of the configuration macro for Pathfinder 2e, with properly sorted creature types and comments for easy browsing.](https://github.com/KoggaJ/Splatter/blob/Splatfinder/CONFIGURATIONS.MD)

## Why not submit this to be merged with the main branch?
I'm not great at JavaScript. This "fix" has been heavily reliant on googled code that I cannot personally vouch for. It also replaces already existing functionality with my custom one, which is generally not a great practice in open source projects.
This branch exists to help me and few of my friends in running the module with Pathfinder/Starfinder 2e, as well as whomever else might need it, but it's by all means a hackjob that should not be merged with the main branch.
## You can find the documentation for the original module on the [WIKI](https://api.theripper93.com/modulewiki/splatter/free)
## Before opening an issue read [THIS](https://github.com/theripper93/Levels/blob/v9/ISSUES.md)

If you have an issue with this version, please see if using the main branch fixes it before submitting a bug report to TheRipper93 

<img src="https://user-images.githubusercontent.com/1346839/126053219-fe52f8b8-3203-46c0-a7df-26d4a235f388.png" width="400">

