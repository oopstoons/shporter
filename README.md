Shporter - A Flash IDE timeline exporter
========================================

Shporter is a Flash extension that exports timeline animation into different formats.

Do you have a 2D game with a lot of animated characters with many sequences and frames saved as massive sprites which is resulting in high memory usage and crap performance?
Did you animate it in Flash puppet/modular style? Will you? If yes, then you are in luck my friend. 
Shporter will export your Flash timeline animations and keep all your modular data intact. 
Save tons of memory and file space!

Currently, Shporter only exports to the [Spriter](http://www.brashmonkey.com/spriter.htm) format, but more formats are planned.
Luckily there are many [plugins](http://www.brashmonkey.com/forum/viewforum.php?f=3&sid=b22af28c5307fbceb04886436cc358f3) in development for the Spriter format:
- Unity: NGUI & ex2D - [Spriter Data API](http://www.brashmonkey.com/forum/viewtopic.php?f=3&t=534&sid=157d02f6f67897572c3692f3e0f60a4d)
- Flash: Starling - [SpriterMC](http://www.sammyjoeosborne.com/SpriterMC/)
- Flash: Starling - [SpriterAS](http://treefortress.com/introducing-spriteras-play-spriter-animations-scml-with-starling/) [GitHub](https://github.com/treefortress/SpriterAS)
- Corona: [Unnamed API](http://www.brashmonkey.com/forum/viewtopic.php?f=3&t=2838) [GitHub](https://github.com/XibalbaStudios/Spriter)
- Cocos 2D: [CCSpriterX](http://www.brashmonkey.com/forum/viewtopic.php?f=3&t=870)

## Road Map:
- Export textures and/or animation at a given scale 
- Research the following Unity 2D animation systems for export possibilities
  - [SmoothMoves](https://www.assetstore.unity3d.com/#/content/2844)
  - [EasyMotion2D](https://www.assetstore.unity3d.com/#/content/2138)
- Research Javascript export
- Research Corona export
- Research export to [Spline](http://esotericsoftware.com/) format

## Releases:

### Version 1.0.0 : May 13, 2013
- Initial release
- Exports to [Spriter SCML](http://www.brashmonkey.com/spriter.htm) format version B2
- Exports timeline elements or library items as pngs