#version 310 es

#extension GL_GOOGLE_include_directive : enable

#include "constants.h"
#extension GL_EXT_debug_printf : enable
layout(input_attachment_index = 0, set = 0, binding = 0) uniform highp subpassInput in_color;

layout(set = 0, binding = 1) uniform sampler2D color_grading_lut_texture_sampler;

layout(location = 0) out highp vec4 out_color;




void main()
{
    highp ivec2 lut_tex_size = textureSize(color_grading_lut_texture_sampler, 0); // (256, 16)

    // highp vec4 color       = subpassLoad(in_color).rgba;
    highp vec4 color = subpassLoad(in_color);
    highp float _COLOR = float(lut_tex_size.y);
    highp float _COLOR_MINUS1 = _COLOR - 1.0;
    highp float _COLOR_SQRT = sqrt(_COLOR);
    highp float _COLOR_SQ = _COLOR*_COLOR;

    highp float weight = fract(color.b * _COLOR);

    highp float b_floor_idx = floor(color.b * _COLOR);
    highp float b_ceil_idx = ceil(color.b * _COLOR);

    highp float u1 = (color.r * _COLOR + _COLOR * b_floor_idx) / _COLOR_SQ;
    highp float u2 = (color.r * _COLOR + _COLOR * b_ceil_idx) / _COLOR_SQ;


    highp vec2 uv1  = vec2(u1, color.g);
    highp vec2 uv2  = vec2(u2, color.g);


    highp vec3 color1 = texture(color_grading_lut_texture_sampler, uv1 ).rgb;
    highp vec3 color2 = texture(color_grading_lut_texture_sampler, uv2 ).rgb;

    highp vec3 color_mix = mix(color1, color2, weight);
    out_color = vec4(color_mix.rgb, color.a);

    
}
