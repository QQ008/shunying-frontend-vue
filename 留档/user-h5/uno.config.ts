import { defineConfig, presetUno } from 'unocss'
import presetRemToPx from '@unocss/preset-rem-to-px'

export default defineConfig({
  presets: [
    presetUno(),
    presetRemToPx({
        // baseFontSize: 4, // defaulted to 16, baseFontSize must be set when using custom rem unit, default unit is rem
        // defaultRem: 16, // defaulted to 16, defaultRem must be set when using custom rem unit
    }),
    // ...其他预设
  ],
  // rules: [
    // ['m-1', { margin: '0.25rem' }],
  // ],
  // shortcuts: {
    // btn: 'py-2 px-4 font-semibold rounded-lg shadow-md',
  // },
  // theme: {
    // colors: {
      // 'very-cool': '#0000ff', // class="text-very-cool"
      // 'brand-primary': 'hsl(var(--hue, 217) 78% 51%)', // class="bg-brand-primary"
    // }
  // }
}) 