"""Build the hero CPU package for the portfolio: substrate, capacitors, gold pads, and a lid with etched markings.

Run: blender -b -P build_core.py -- <output glb> <preview png>
Materials are exported by name only; the site assigns the real shading at runtime.
"""
import math
import sys

import bpy
from mathutils import Vector

OUT, PREVIEW = sys.argv[sys.argv.index("--") + 1 :][:2]
bpy.ops.wm.read_factory_settings(use_empty=True)


def material(name, color, metallic=0.0, roughness=0.5, emission=None):
    mat = bpy.data.materials.new(name)
    mat.use_nodes = True
    bsdf = mat.node_tree.nodes["Principled BSDF"]
    bsdf.inputs["Base Color"].default_value = (*color, 1)
    bsdf.inputs["Metallic"].default_value = metallic
    bsdf.inputs["Roughness"].default_value = roughness
    if emission:
        bsdf.inputs["Emission Color"].default_value = (*emission, 1)
        bsdf.inputs["Emission Strength"].default_value = 3
    return mat


LID = material("lid", (0.55, 0.57, 0.6), metallic=1.0, roughness=0.32)
ETCH = material("etch", (0.16, 0.17, 0.18), metallic=0.6, roughness=0.85)
SUBSTRATE = material("substrate", (0.02, 0.05, 0.045), metallic=0.1, roughness=0.55)
GOLD = material("gold", (0.9, 0.68, 0.25), metallic=1.0, roughness=0.25)
CAP = material("cap_body", (0.1, 0.07, 0.05), metallic=0.0, roughness=0.6)
CAP_END = material("cap_end", (0.7, 0.72, 0.75), metallic=1.0, roughness=0.3)


def box(name, size, location, mat, bevel=0.0, rotation=(0, 0, 0)):
    bpy.ops.mesh.primitive_cube_add(size=1, location=location, rotation=rotation)
    obj = bpy.context.active_object
    obj.name = name
    obj.scale = size
    bpy.ops.object.transform_apply(scale=True)
    obj.data.materials.append(mat)
    if bevel > 0:
        mod = obj.modifiers.new("bevel", "BEVEL")
        mod.width = bevel
        mod.segments = 3
        mod.limit_method = "ANGLE"
    return obj


def text(body, size, location, mat, align="CENTER", spacing=1.0):
    bpy.ops.object.text_add(location=location)
    obj = bpy.context.active_object
    obj.data.body = body
    obj.data.size = size
    obj.data.align_x = align
    obj.data.align_y = "CENTER"
    obj.data.space_character = spacing
    obj.data.extrude = 0.004
    obj.data.materials.append(mat)
    bpy.ops.object.convert(target="MESH")
    return bpy.context.active_object


# substrate with a slim chamfer
box("substrate", (14, 14, 0.5), (0, 0, 0.25), SUBSTRATE, bevel=0.06)

# gold contact pads around the rim
for side in range(4):
    angle = side * math.pi / 2
    for i in range(22):
        offset = (i - 10.5) * 0.56
        x = math.cos(angle) * offset - math.sin(angle) * 6.45
        y = math.sin(angle) * offset + math.cos(angle) * 6.45
        box(f"pad_{side}_{i}", (0.34, 0.62, 0.03), (x, y, 0.515), GOLD, rotation=(0, 0, angle))

# rows of decoupling capacitors between lid and pads
for side in range(4):
    angle = side * math.pi / 2
    for i in range(9):
        if side % 2 == 0 and i in (0, 8):
            continue
        offset = (i - 4) * 1.0
        x = math.cos(angle) * offset - math.sin(angle) * 5.45
        y = math.sin(angle) * offset + math.cos(angle) * 5.45
        box(f"cap_{side}_{i}", (0.5, 0.26, 0.22), (x, y, 0.61), CAP, bevel=0.02, rotation=(0, 0, angle))
        for end in (-1, 1):
            ex = x + math.cos(angle) * end * 0.22
            ey = y + math.sin(angle) * end * 0.22
            box(f"cap_end_{side}_{i}_{end}", (0.1, 0.27, 0.23), (ex, ey, 0.61), CAP_END, bevel=0.015, rotation=(0, 0, angle))

# heat spreader: a flange and a raised lid with soft chamfers
box("lid_flange", (9.6, 9.6, 0.22), (0, 0, 0.61), LID, bevel=0.05)
box("lid_top", (8.2, 8.2, 0.7), (0, 0, 1.05), LID, bevel=0.16)

TOP = 1.404
# laser-etched markings
text("AYAAN", 1.55, (0, 1.35, TOP), ETCH, spacing=1.12)
text("FRONTEND DEVELOPER", 0.42, (0, 0.02, TOP), ETCH, spacing=1.35)
text("REACT  /  TYPESCRIPT  /  NEXT.JS", 0.24, (0, -0.62, TOP), ETCH, spacing=1.3)
text("SEOUL  KR", 0.26, (-2.55, -2.9, TOP), ETCH, align="LEFT", spacing=1.3)
text("EST. 2024", 0.26, (2.55, -2.9, TOP), ETCH, align="RIGHT", spacing=1.3)
box("rule", (5.1, 0.03, 0.006), (0, -1.25, TOP), ETCH)

# pin-1 marker and a small data-matrix style mark
bpy.ops.mesh.primitive_cylinder_add(vertices=3, radius=0.3, depth=0.006, location=(-3.45, 3.45, TOP), rotation=(0, 0, math.radians(15)))
bpy.context.active_object.data.materials.append(ETCH)
pattern = [
    "1011011",
    "1100101",
    "1011101",
    "1110011",
    "1001101",
    "1101011",
    "1111111",
]
for row, line in enumerate(pattern):
    for col, bit in enumerate(line):
        if bit == "1":
            box(f"dm_{row}_{col}", (0.11, 0.11, 0.006), (2.85 + col * 0.12, 3.6 - row * 0.12, TOP), ETCH)

# preview render
scene = bpy.context.scene
for engine in ("BLENDER_EEVEE", "BLENDER_EEVEE_NEXT"):
    try:
        scene.render.engine = engine
        break
    except TypeError:
        continue
world = bpy.data.worlds.new("w")
world.use_nodes = True
world.node_tree.nodes["Background"].inputs["Color"].default_value = (0.02, 0.025, 0.03, 1)
scene.world = world
for name, loc, energy, size, color in [("key", (6, -7, 9), 2600, 6, (1, 0.97, 0.92)), ("rim", (-8, 6, 5), 1500, 5, (0.6, 0.85, 1))]:
    light = bpy.data.lights.new(name, "AREA")
    light.energy, light.size, light.color = energy, size, color
    obj = bpy.data.objects.new(name, light)
    obj.location = loc
    obj.rotation_euler = (Vector((0, 0, 0.8)) - Vector(loc)).to_track_quat("-Z", "Y").to_euler()
    scene.collection.objects.link(obj)
cam = bpy.data.cameras.new("cam")
cam.lens = 55
cam_obj = bpy.data.objects.new("cam", cam)
cam_obj.location = (7.5, -11, 8.5)
cam_obj.rotation_euler = (Vector((0, 0, 0.8)) - cam_obj.location).to_track_quat("-Z", "Y").to_euler()
scene.collection.objects.link(cam_obj)
scene.camera = cam_obj
scene.render.resolution_x, scene.render.resolution_y = 960, 720
scene.render.filepath = PREVIEW
bpy.ops.render.render(write_still=True)

for obj in list(scene.objects):
    if obj.type in {"LIGHT", "CAMERA"}:
        bpy.data.objects.remove(obj)
bpy.ops.object.select_all(action="SELECT")
bpy.ops.export_scene.gltf(filepath=OUT, export_format="GLB", use_selection=True, export_apply=True, export_yup=True, export_animations=False)
import os
print("BUILT core", round(os.path.getsize(OUT) / 1e6, 2), "MB")
