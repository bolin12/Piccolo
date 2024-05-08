#version 310 es

#extension GL_GOOGLE_include_directive : enable

#include "constants.h"

layout(input_attachment_index = 0, set = 0, binding = 0) uniform highp subpassInput in_color;

layout(set = 0, binding = 1) uniform sampler2D color_grading_lut_texture_sampler;

layout(location = 0) out highp vec4 out_color;




void main()
{
    highp ivec2 lut_tex_size = textureSize(color_grading_lut_texture_sampler, 0); // (256, 16)

    highp vec4 color       = subpassLoad(in_color).rgba;
    
    highp float floor_u = floor(color.g * 15.0) * 16.0;
    highp float ceil_u = ceil(color.g * 15.0) * 16.0;
    highp float u_1 = (color.r * 15.0 +  floor_u) / 255.0; 
    highp float u_2 = (color.r * 15.0 +  ceil_u) / 255.0;
    highp vec2 uv1          = vec2(u_1,  color.b);
    highp vec2 uv2          = vec2(u_2,  color.b);

    highp vec3 color_1 = texture(color_grading_lut_texture_sampler, uv1).rgb;
    highp vec3 color_2 = texture(color_grading_lut_texture_sampler, uv2).rgb;

    highp float alpha = color.g * 15.0 - floor(color.g * 15.0);
    highp vec3 color_mix = mix(color_1, color_2, alpha);
    // texture(color_grading_lut_texture_sampler, uv)
    // debugPrintfEXT("floor_u = %f, ceil_u = %f, color = %f, %f, %f, %f, uv1 = %f, %f, uv2 = %f, %f, color_1 = %f, %f, %f, color_2 = %f, %f, %f, alpha = %f, color_mix = %f, %f, %f\n", floor_u,ceil_u,  color.x, color.y, color.z, color.w, uv1.x, uv1.y, uv2.x, uv2.y, color_1.x, color_1.y, color_1.z, color_2.x, color_2.y, color_2.z, alpha, color_mix.x, color_mix.y, color_mix.z);
    // debugPrintfEXT("color origin: %f %f %f,   transfered: %f %f %f", color.r * 255.0, color.g * 255.0, color.b * 255.0, color_mix.r * 255.0,  color_mix.g * 255.0, color_mix.b * 255.0,);
    out_color = vec4(color_mix.rgb, color.a);
}
