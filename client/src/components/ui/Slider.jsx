import * as SliderPrimitive from '@radix-ui/react-slider';

// JavaScript adaptation of the shadcn/ui Radix slider, with the site's orchid tokens.
export default function Slider({ className = '', value, defaultValue, min = 0, max = 100, ...props }) {
  const values = value ?? defaultValue ?? [min];

  return (
    <SliderPrimitive.Root
      data-slot="slider"
      className={`relative flex w-full touch-none items-center select-none ${className}`}
      value={value}
      defaultValue={defaultValue}
      min={min}
      max={max}
      {...props}
    >
      <SliderPrimitive.Track data-slot="slider-track" className="relative h-2 w-full grow overflow-hidden rounded-full bg-white/20">
        <SliderPrimitive.Range data-slot="slider-range" className="absolute h-full bg-gradient-to-r from-[#dfa9f0] to-[#bb58d8]" />
      </SliderPrimitive.Track>
      {values.map((_, index) => (
        <SliderPrimitive.Thumb
          data-slot="slider-thumb"
          key={index}
          aria-label={values.length > 1 ? (index === 0 ? 'Minimum price' : 'Maximum price') : 'Price'}
          className="block size-5 shrink-0 rounded-full border-2 border-[#dfa9f0] bg-[#f7eff9] transition-shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#dfa9f0]"
        />
      ))}
    </SliderPrimitive.Root>
  );
}
