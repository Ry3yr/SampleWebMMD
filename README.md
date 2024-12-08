# SampleWebMMD
SampleWebMMD MikuMiku Dance render with most features of a standart renderer (pmx, vmd, mp3)

Animated Stage example: https://ry3yr.github.io/SampleWebMMD/?stage=/livestageclub/livestageclubanimated.pmx

A video can be seen here
https://m.youtube.com/watch?v=0n8qi34uMjQ&list=PLBva3abEZvyT-_ajETBGeOCGBA_AFBT5Z&index=18&pp=iAQB

______________________

Special Notes:

Models with -off-the-beaten-path lip and eye bone structures (BoneMorphs) suchas (left side)
https://ry3yr.github.io/SampleWebMMD/unsupported-facial-features.gif
(The bones are arranged in a oval structure around the affected area)
are not supported by this renderer
(nor might they ever be, https://culdo.github.io/web-mmd/ - the other most advanced mmd webrenderer doesn't play nicely with them either.

Only regular Morphs (as seen in PMXE Morph tab) that don't involve bones, are supported


Only MikuMikuDance and MikuMikuMoving (both PC Apps) support those properly.
Furthermore most Android apps (mqo f.e.) and iOS might not support thos special cases either...)

(The usual approach - right image side, should work in virtually all cases,
and is highly recommended, as all major apps (VROID) and tools will see this as default way to handle mouth and eyes)
Mostly this will affect models ported from videogames or the like.
Perhaps people porting those should consider this when porting models,
to wide usecase of their model output.

2024/12/8 BoneMorphs can be converted to Blendshape Pures quite easily in PMXE actually: https://www.youtube.com/watch?v=If6KQASKFV4#https://i.ibb.co/C9mLz13/Screenshot-2024-12-08-08-25-38.jpg
