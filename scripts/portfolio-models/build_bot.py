"""Builds the miniature citizen ("bit") for the portfolio's chip world.

Run: blender -b -P build_bot.py -- <out.glb> [preview.png]
Parts are separate objects (body, head, foot_l, foot_r, arm_l, arm_r, pack) so the
page can animate a walk cycle without a skeleton. The model faces -Y in Blender (+Z in glTF).
"""
import math
import sys

import bpy

argv = sys.argv[sys.argv.index("--") + 1 :] if "--" in sys.argv else []
out_path = argv[0]
preview_path = argv[1] if len(argv) > 1 else None

bpy.ops.wm.read_factory_settings(use_empty=True)


def material(name, color, metallic=0.0, roughness=0.4, emission=None, strength=0.0):
    mat = bpy.data.materials.new(name)
    mat.use_nodes = True
    bsdf = mat.node_tree.nodes["Principled BSDF"]
    bsdf.inputs["Base Color"].default_value = (*color, 1)
    bsdf.inputs["Metallic"].default_value = metallic
    bsdf.inputs["Roughness"].default_value = roughness
    if emission:
        bsdf.inputs["Emission Color"].default_value = (*emission, 1)
        bsdf.inputs["Emission Strength"].default_value = strength
    return mat


MATS = {
    "shell": material("shell", (0.86, 0.88, 0.9), 0.0, 0.32),
    "visor": material("visor", (0.015, 0.02, 0.028), 0.2, 0.12),
    "eye": material("eye", (0.3, 0.9, 1.0), 0.0, 0.4, (0.3, 0.9, 1.0), 4.0),
    "glow": material("glow", (0.3, 0.9, 1.0), 0.0, 0.4, (0.3, 0.9, 1.0), 3.0),
    "dark": material("dark", (0.07, 0.08, 0.1), 0.3, 0.45),
    "accent": material("accent", (0.85, 0.66, 0.3), 1.0, 0.28),
}


def finish(obj, mat, bevel=0.0, subdiv=0):
    obj.data.materials.append(MATS[mat])
    if bevel > 0:
        mod = obj.modifiers.new("bevel", "BEVEL")
        mod.width = bevel
        mod.segments = 6
        mod.limit_method = "ANGLE"
    if subdiv > 0:
        mod = obj.modifiers.new("subdiv", "SUBSURF")
        mod.levels = subdiv
        mod.render_levels = subdiv
    bpy.context.view_layer.objects.active = obj
    for mod in list(obj.modifiers):
        bpy.ops.object.modifier_apply(modifier=mod.name)
    bpy.ops.object.shade_smooth()
    return obj


def box(name, size, location, mat, bevel=0.05, subdiv=0):
    bpy.ops.mesh.primitive_cube_add(size=1, location=location)
    obj = bpy.context.active_object
    obj.name = name
    obj.scale = size
    bpy.ops.object.transform_apply(scale=True)
    return finish(obj, mat, bevel, subdiv)


def sphere(name, scale, location, mat):
    bpy.ops.mesh.primitive_uv_sphere_add(radius=1, segments=40, ring_count=20, location=location)
    obj = bpy.context.active_object
    obj.name = name
    obj.scale = scale
    bpy.ops.object.transform_apply(scale=True)
    return finish(obj, mat)


def cylinder(name, radius, depth, location, mat, rotation=(0, 0, 0)):
    bpy.ops.mesh.primitive_cylinder_add(radius=radius, depth=depth, vertices=24, location=location, rotation=rotation)
    obj = bpy.context.active_object
    obj.name = name
    bpy.ops.object.transform_apply(rotation=True)
    return finish(obj, mat)


def join(name, parts, origin):
    bpy.ops.object.select_all(action="DESELECT")
    for part in parts:
        part.select_set(True)
    bpy.context.view_layer.objects.active = parts[0]
    if len(parts) > 1:
        bpy.ops.object.join()
    obj = bpy.context.active_object
    obj.name = name
    bpy.context.scene.cursor.location = origin
    bpy.ops.object.origin_set(type="ORIGIN_CURSOR")
    return obj


# body: a soft bean with a chest light
body = join(
    "body",
    [
        sphere("b0", (0.3, 0.26, 0.3), (0, 0, 0.44), "shell"),
        sphere("b2", (0.07, 0.03, 0.07), (0, -0.25, 0.5), "glow"),
    ],
    (0, 0, 0.44),
)

# head: big rounded block with a glass visor and two eyes
head = join(
    "head",
    [
        box("h0", (0.74, 0.56, 0.52), (0, 0, 1.0), "shell", bevel=0.2),
        box("h1", (0.6, 0.1, 0.34), (0, -0.265, 0.99), "visor", bevel=0.045),
        sphere("h2", (0.062, 0.03, 0.085), (-0.15, -0.318, 1.0), "eye"),
        sphere("h3", (0.062, 0.03, 0.085), (0.15, -0.318, 1.0), "eye"),
        cylinder("h4", 0.018, 0.2, (0.2, 0.05, 1.34), "dark"),
        sphere("h5", (0.055, 0.055, 0.055), (0.2, 0.05, 1.46), "glow"),
        cylinder("h6", 0.07, 0.06, (-0.385, 0, 1.0), "dark", rotation=(0, math.pi / 2, 0)),
        cylinder("h7", 0.07, 0.06, (0.385, 0, 1.0), "dark", rotation=(0, math.pi / 2, 0)),
    ],
    (0, 0, 0.74),
)

foot_l = join("foot_l", [box("f0", (0.2, 0.3, 0.13), (-0.15, -0.03, 0.065), "dark", bevel=0.06)], (-0.15, 0, 0.13))
foot_r = join("foot_r", [box("f1", (0.2, 0.3, 0.13), (0.15, -0.03, 0.065), "dark", bevel=0.06)], (0.15, 0, 0.13))

arm_l = join(
    "arm_l",
    [sphere("a0", (0.075, 0.075, 0.17), (-0.36, 0, 0.42), "shell"), sphere("a1", (0.085, 0.085, 0.085), (-0.36, 0, 0.27), "dark")],
    (-0.34, 0, 0.56),
)
arm_r = join(
    "arm_r",
    [sphere("a2", (0.075, 0.075, 0.17), (0.36, 0, 0.42), "shell"), sphere("a3", (0.085, 0.085, 0.085), (0.36, 0, 0.27), "dark")],
    (0.34, 0, 0.56),
)

# backpack: only the player wears it
pack = join(
    "pack",
    [box("p0", (0.34, 0.16, 0.32), (0, 0.3, 0.47), "accent", bevel=0.05), cylinder("p1", 0.03, 0.2, (0, 0.38, 0.72), "accent")],
    (0, 0.26, 0.47),
)

if preview_path:
    bpy.ops.mesh.primitive_plane_add(size=20, location=(0, 0, 0))
    ground = bpy.context.active_object
    ground.data.materials.append(material("ground", (0.05, 0.06, 0.07), 0.5, 0.4))
    bpy.ops.object.light_add(type="AREA", location=(-2.5, -3, 4))
    key = bpy.context.active_object
    key.data.energy = 600
    key.data.size = 3
    key.rotation_euler = (math.radians(50), 0, math.radians(-35))
    bpy.ops.object.light_add(type="AREA", location=(3, 2, 2.5))
    rim = bpy.context.active_object
    rim.data.energy = 250
    rim.data.color = (0.6, 0.8, 1)
    rim.rotation_euler = (math.radians(-60), 0, math.radians(120))
    bpy.ops.object.camera_add(location=(-2.4, -3.6, 1.7), rotation=(math.radians(76), 0, math.radians(-33)))
    bpy.context.scene.camera = bpy.context.active_object
    bpy.context.scene.camera.data.lens = 60
    world = bpy.data.worlds.new("w")
    world.use_nodes = True
    world.node_tree.nodes["Background"].inputs[0].default_value = (0.02, 0.025, 0.03, 1)
    bpy.context.scene.world = world
    bpy.context.scene.render.engine = "BLENDER_EEVEE"
    bpy.context.scene.render.resolution_x = 900
    bpy.context.scene.render.resolution_y = 700
    bpy.context.scene.render.filepath = preview_path
    bpy.ops.render.render(write_still=True)
    bpy.data.objects.remove(ground)

bpy.ops.object.select_all(action="DESELECT")
for obj in (body, head, foot_l, foot_r, arm_l, arm_r, pack):
    obj.select_set(True)
bpy.ops.export_scene.gltf(filepath=out_path, export_format="GLB", use_selection=True, export_apply=True, export_yup=True)
print("EXPORTED", out_path)
