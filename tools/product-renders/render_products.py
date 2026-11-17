"""Renderiza los envases NUDO en Blender en modo background (sin dependencias web)."""
import argparse
import hashlib
import json
import math
import os
import random
import re
import sys
import unicodedata
from pathlib import Path

import bpy
from mathutils import Vector

HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[1]
PALETTES = {
    'sage': ((0.35, 0.46, 0.34, 1), (0.16, 0.23, 0.17, 1)),
    'cream': ((0.79, 0.73, 0.61, 1), (0.30, 0.28, 0.22, 1)),
    'clay': ((0.63, 0.37, 0.29, 1), (0.32, 0.20, 0.16, 1)),
    'dark': ((0.13, 0.19, 0.15, 1), (0.08, 0.11, 0.09, 1)),
}

def material(name, color, roughness=.35, metallic=0):
    m = bpy.data.materials.new(name); m.diffuse_color = color; m.use_nodes = True
    p = m.node_tree.nodes.get('Principled BSDF')
    p.inputs['Base Color'].default_value = color
    p.inputs['Roughness'].default_value = roughness
    p.inputs['Metallic'].default_value = metallic
    return m

def lathe(name, rings, mat, segments=80):
    verts = [(radius*math.cos(2*math.pi*i/segments), radius*math.sin(2*math.pi*i/segments), z) for z, radius in rings for i in range(segments)]
    faces = []
    for row in range(len(rings)-1):
        for i in range(segments):
            j=(i+1)%segments; faces.append((row*segments+i,row*segments+j,(row+1)*segments+j,(row+1)*segments+i))
    faces.append(tuple(reversed(range(segments)))); faces.append(tuple((len(rings)-1)*segments+i for i in range(segments)))
    mesh=bpy.data.meshes.new(name); mesh.from_pydata(verts, [], faces); mesh.update()
    obj=bpy.data.objects.new(name, mesh); bpy.context.collection.objects.link(obj); obj.data.materials.append(mat)
    for p in mesh.polygons: p.use_smooth=True
    bevel=obj.modifiers.new('Bordes suaves', 'BEVEL'); bevel.width=.035; bevel.segments=3
    obj.modifiers.new('Normales ponderadas', 'WEIGHTED_NORMAL')
    return obj

def cylinder(name, r, depth, z, mat, x=0, y=0, vertices=72):
    bpy.ops.mesh.primitive_cylinder_add(vertices=vertices, radius=r, depth=depth, location=(x,y,z))
    obj=bpy.context.object; obj.name=name; obj.data.materials.append(mat)
    bevel=obj.modifiers.new('Bordes', 'BEVEL'); bevel.width=min(.035,depth*.18); bevel.segments=3
    obj.modifiers.new('Normales','WEIGHTED_NORMAL')
    for p in obj.data.polygons: p.use_smooth=True
    return obj

def box(name, location, scale, mat, bevel=.02):
    bpy.ops.mesh.primitive_cube_add(size=1, location=location); obj=bpy.context.object; obj.name=name
    obj.dimensions=scale; bpy.ops.object.transform_apply(location=False,rotation=False,scale=True)
    if bevel:
        mod=obj.modifiers.new('Bordes', 'BEVEL'); mod.width=bevel; mod.segments=3
        obj.modifiers.new('Normales','WEIGHTED_NORMAL')
    obj.data.materials.append(mat); return obj

def text(body, location, size, mat, font=None, max_width=None):
    curve=bpy.data.curves.new('Texto','FONT'); curve.body=body; curve.align_x='CENTER'; curve.align_y='CENTER'; curve.size=size
    if font: curve.font=font
    ob=bpy.data.objects.new('Etiqueta '+body,curve); bpy.context.collection.objects.link(ob); ob.location=location; ob.rotation_euler=(math.pi/2,0,0); curve.materials.append(mat)
    bpy.context.view_layer.update()
    if max_width and ob.dimensions.x>max_width: ob.scale *= max_width/ob.dimensions.x
    return ob

def wrap_name(value, limit=20):
    words=value.upper().split(); lines=['']
    for word in words:
        candidate=(lines[-1]+' '+word).strip()
        if len(candidate)>limit and lines[-1]: lines.append(word)
        else: lines[-1]=candidate
    return lines[:3]

def kind_for(p):
    if p.get('container'): return p['container']
    name=p['name'].lower(); art=p['art'].lower()
    if 'jar' in art: return 'tarro'
    if 'tube' in art: return 'tubo'
    if 'oil' in art or 'sérum' in name or 'aceite' in name: return 'gotero'
    if 'spray' in name or 'bruma' in name or 'protector térmico' in name: return 'pulverizador'
    if 'polvo' in name: return 'polvo'
    if 'jabón' in name or 'loción corporal' in name or 'gel de ducha' in name: return 'dosificador'
    return 'botella'

def point_at(obj, target): obj.rotation_euler=(Vector(target)-obj.location).to_track_quat('-Z','Y').to_euler()

def setup():
    bpy.ops.object.select_all(action='SELECT'); bpy.ops.object.delete(use_global=False)
    scene=bpy.context.scene; scene.render.engine='CYCLES'; scene.cycles.samples=20; scene.cycles.use_denoising=True
    scene.render.resolution_x=512; scene.render.resolution_y=512; scene.render.resolution_percentage=100
    scene.render.image_settings.file_format='PNG'; scene.render.film_transparent=False
    scene.view_settings.view_transform='AgX'
    world=bpy.data.worlds.new('Estudio'); scene.world=world; world.use_nodes=True
    world.node_tree.nodes['Background'].inputs[0].default_value=(0.78,0.75,0.69,1); world.node_tree.nodes['Background'].inputs[1].default_value=.45
    bg=material('Fondo porcelana',(0.77,0.75,0.70,1),.85)
    bpy.ops.mesh.primitive_plane_add(size=200,location=(0,0,-.035)); bpy.context.object.data.materials.append(bg)
    bpy.ops.object.camera_add(location=(3.4,-9.6,5.0)); cam=bpy.context.object; point_at(cam,(0,0,1.48)); cam.data.type='ORTHO'; cam.data.ortho_scale=4.2; scene.camera=cam
    for name, loc, power, size in [('Principal',(-4,-5,7),650,5.0),('Relleno',(4,-2,5),400,4.0),('Contorno',(1,4,6),850,3.2)]:
        bpy.ops.object.light_add(type='AREA',location=loc); lamp=bpy.context.object; lamp.name=name; lamp.data.energy=power; lamp.data.shape='DISK'; lamp.data.size=size; point_at(lamp,(0,0,1.2))
    return scene

def build(p, idx):
    k=kind_for(p); rng=random.Random(int(hashlib.sha256(p['id'].encode()).hexdigest()[:12],16))
    base=next((x for x in PALETTES if x in p['art']), 'sage'); c,d=PALETTES[base]
    factor=rng.uniform(.88,1.08); c=tuple(min(1,v*factor) for v in c[:3])+(1,)
    body=material('Envase',c,.23 if k in ('gotero','pulverizador') else .34)
    cap=material('Tapa',d,.28); cream=material('Etiqueta',(0.86,0.83,0.75,1),.72); ink=material('Tinta',(0.09,0.14,0.10,1),.8)
    gold=material('Detalle latón',(0.56,0.43,0.24,1),.27,.65)
    if k=='tarro':
        r=.79+rng.uniform(-.045,.045); h=1.12+rng.uniform(-.09,.10)
        lathe('Tarro',[(0,.65*r),(.06,r*.94),(.16,r),(h-.15,r),(h-.06,r*.96),(h,r*.89)],body)
        cylinder('Borde inferior',r*.94,.07,.06,cap); cylinder('Tapa roscada',r*(1.01+rng.uniform(0,.07)),.19+rng.uniform(0,.07),h+.10,cap); cylinder('Aro tapa',r*1.025,.035,h+.215,gold)
        label_z=h*.55; label_w=1.10; label_h=.69
    elif k=='tubo':
        r=.61; h=2.20+rng.uniform(-.12,.12)
        lathe('Tubo',[(.25,.43),(.31,.52),(h-.25,r),(h-.08,r*.84),(h,r*.75)],body)
        cylinder('Tapón',.43,.30,.16,cap); cylinder('Aro',.44,.035,.32,gold)
        box('Sellado superior',(0,0,h),(.92,.14,.075),cap,.02)
        label_z=1.27; label_w=.88; label_h=.94
    else:
        r=(.48 if k in ('gotero','polvo') else .62)+rng.uniform(-.035,.035)
        h=(1.55 if k=='gotero' else 1.8 if k=='polvo' else 2.18)+rng.uniform(-.12,.12)
        shoulder=rng.uniform(.22,.43); waist=r*rng.uniform(.91,1.0)
        lathe('Botella',[(0,r*.8),(.08,r*.98),(.18,r),(h*.55,waist),(h-shoulder,r),(h-.14,r*.87),(h-.06,r*.62),(h,r*.58)],body)
        cylinder('Collar',r*.59,.10,h+.025,gold)
        if k=='gotero':
            cylinder('Rosca gotero',r*.61,.22,h+.16,cap); cylinder('Aro gotero',r*.62,.035,h+.27,gold)
            bpy.ops.mesh.primitive_uv_sphere_add(segments=48,ring_count=24,location=(0,0,h+.45)); obj=bpy.context.object; obj.name='Bulbo gotero'; obj.scale=(r*.45,r*.45,.26); obj.data.materials.append(cap); bpy.ops.object.shade_smooth()
        elif k in ('pulverizador','dosificador'):
            cylinder('Rosca dispensador',r*.59,.20,h+.12,cap); cylinder('Cuello bomba',r*.25,.22,h+.30,cream)
            box('Cabezal',(0,0,h+.43),(.53,.40,.16),cap,.045); box('Boquilla',(.26,-.015,h+.42),(.40,.16,.10),cap,.035)
        else:
            cylinder('Tapón',r*rng.uniform(.58,.72),.25+rng.uniform(0,.1),h+.20,cap); cylinder('Aro superior',r*.62,.03,h+.35,gold)
        label_z=h*.50; label_w=min(1.0,r*1.5); label_h=.98 if k!='polvo' else .75
    # Panel frontal y tipografía real: cada producto recibe nombre y presentación propios.
    front=-r-.012
    box('Papel de etiqueta',(0,front,label_z),(label_w,.018,label_h),cream,.018)
    y=front-.013
    serif_path='C:/Windows/Fonts/georgia.ttf'; sans_path='C:/Windows/Fonts/arial.ttf'
    serif=bpy.data.fonts.load(serif_path) if os.path.exists(serif_path) else None
    sans=bpy.data.fonts.load(sans_path) if os.path.exists(sans_path) else None
    text('nudo',(0,y,label_z+label_h*.31),.22,ink,serif,label_w*.8)
    text('B O T I C A',(0,y,label_z+label_h*.13),.066,ink,sans,label_w*.8)
    lines=wrap_name(p['name'],20)
    for i,line in enumerate(lines): text(line,(0,y,label_z+label_h*.01-i*.105),.10,ink,sans,label_w*.86)
    text(p['size'].upper(),(0,y,label_z-label_h*.37),.075,ink,sans,label_w*.75)
    camera=bpy.context.scene.camera
    if k=='tarro': camera.data.ortho_scale=3.0; point_at(camera,(0,0,.78))
    elif k=='gotero': camera.data.ortho_scale=3.25; point_at(camera,(0,0,1.02))
    elif k=='polvo': camera.data.ortho_scale=3.2; point_at(camera,(0,0,1.05))
    else: camera.data.ortho_scale=3.75; point_at(camera,(0,0,1.28))
    return k

def main():
    args=argparse.ArgumentParser(); args.add_argument('--ids',default=''); args.add_argument('--out',required=True); opts=args.parse_args(sys.argv[sys.argv.index('--')+1:])
    products=json.loads((HERE/'catalog.json').read_text(encoding='utf-8')); ids=set(opts.ids.split(',')) if opts.ids else None
    os.makedirs(opts.out,exist_ok=True)
    for i,p in enumerate(products):
        if ids and p['id'] not in ids: continue
        scene=setup(); kind=build(p,i); scene.render.filepath=str(Path(opts.out)/(p['id']+'.png'))
        print('RENDER',p['id'],kind,flush=True); bpy.ops.render.render(write_still=True)
        for datablocks in (bpy.data.materials,bpy.data.meshes,bpy.data.curves,bpy.data.cameras,bpy.data.lights,bpy.data.worlds):
            for block in list(datablocks):
                if block.users==0: datablocks.remove(block)

if __name__=='__main__': main()
