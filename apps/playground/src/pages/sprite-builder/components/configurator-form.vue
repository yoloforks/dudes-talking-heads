<script setup lang="ts">
import { h } from 'vue'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'

import { Check, ChevronsUpDown } from 'lucide-vue-next'
import { cn } from '@/utils'
import { Button } from '../ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '../ui/command'
import {
  FormControl,
  // FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '../ui/popover'
import { toast } from '../ui/toast'

import ColorPicker from './color-picker.vue'
import { dudesLayers } from '@/pages/playground/constants.js'
import { DudeSpriteParams } from '@/pages/playground/playground.vue'

const props = defineProps<{
  initialValues: DudeSpriteParams
}>()

const emits = defineEmits<{
  (event: 'update-sprite', spriteData: DudeSpriteParams): void
  (event: 'update-colors', spriteData: DudeSpriteParams): void
  (event: 'on-reset'): void
}>()

const formValues: Record<string, { label: string, value: string }[]> = {
  body: dudesLayers.Body.map((body) => ({
    label: body.name,
    value: body.src
  })),
  eyes: dudesLayers.Eyes.map((eyes) => ({
    label: eyes.name,
    value: eyes.src
  })),
  mouth: dudesLayers.Mouth.map((mouth) => ({
    label: mouth.name,
    value: mouth.src
  })),
  hat: dudesLayers.Hat.map((hat) => ({
    label: hat.name,
    value: hat.src
  })),
  cosmetics: dudesLayers.Cosmetics.map((cosmetic) => ({
    label: cosmetic.name,
    value: cosmetic.src
  }))
}

for (const layer of ['eyes', 'mouth', 'hat', 'cosmetics']) {
  formValues[layer].unshift({
    label: 'Hide',
    value: ''
  })
}

const formSchema = toTypedSchema(z.object({
  body: z.string({ required_error: 'Please select a body.' }),
  bodyColor: z.string(),

  eyes: z.string(),
  eyesColor: z.string(),

  mouth: z.string(),
  mouthColor: z.string(),

  hat: z.string(),
  hatColor: z.string(),

  cosmetics: z.string(),
  cosmeticsColor: z.string()
}))

const { handleSubmit, setValues, values } = useForm({
  initialValues: props.initialValues,
  validationSchema: formSchema
})

const onSubmit = handleSubmit((values) => {
  // TODO: does not work
  toast({
    title: 'You submitted the following values:',
    description: h('pre', {
      class: 'mt-2 w-[340px] rounded-md bg-slate-950 p-4'
    }, h('code', { class: 'text-white' }, JSON.stringify(values, null, 2))),
  })
})

function onChangeSprite() {
  emits('update-sprite', values as DudeSpriteParams)
}

function onChangeColor(layer: string, color: string): void {
  setValues({ [`${layer}Color`]: color })
  emits('update-colors', values as DudeSpriteParams)
}
</script>

<template>
  <form class="space-y-6" @submit="onSubmit" @reset="emits('on-reset')">
    <FormField name="body" @update:model-value="onChangeSprite">
      <FormItem class="flex flex-col">
        <FormLabel>Body</FormLabel>
        <Popover>
          <PopoverTrigger as-child>
            <FormControl>
              <Button
                variant="outline"
                role="combobox"
                :class="cn('justify-between', !values.body && 'text-muted-foreground')">
                {{ values.body ? formValues.body.find((body) => body.value === values.body)?.label
                  : 'Select body...'}}
                <ChevronsUpDown class="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </FormControl>
          </PopoverTrigger>
          <PopoverContent class="p-0">
            <Command>
              <CommandInput placeholder="Search body..." />
              <CommandEmpty>Nothing found.</CommandEmpty>
              <CommandList>
                <CommandGroup>
                  <CommandItem
                    v-for="body in formValues.body"
                    :key="body.value"
                    :value="body.label"
                    @select="setValues({ body: body.value })"
                  >
                    <Check
                      :class="cn('mr-2 h-4 w-4', body.value === values.body ? 'opacity-100' : 'opacity-0')" />
                    {{ body.label }}
                  </CommandItem>
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
        <!-- <FormDescription>
          TODO: description
        </FormDescription> -->
        <FormMessage />
      </FormItem>
    </FormField>

    <color-picker
      :initial-value="values.bodyColor"
      @update-color="(color) => onChangeColor('body', color)"
    />

    <FormField name="eyes" @update:model-value="onChangeSprite">
      <FormItem class="flex flex-col">
        <FormLabel>Eyes</FormLabel>
        <Popover>
          <PopoverTrigger as-child>
            <FormControl>
              <Button
                variant="outline"
                role="combobox"
                :class="cn('justify-between', !values.eyes && 'text-muted-foreground')">
                {{ values.eyes ? formValues.eyes.find((eye) => eye.value === values.eyes)?.label
                  : 'Select eyes...'}}
                <ChevronsUpDown class="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </FormControl>
          </PopoverTrigger>
          <PopoverContent class="p-0">
            <Command>
              <CommandInput placeholder="Search eyes..." />
              <CommandEmpty>Nothing found.</CommandEmpty>
              <CommandList>
                <CommandGroup>
                  <CommandItem
                    v-for="eye in formValues.eyes"
                    :key="eye.value"
                    :value="eye.label"
                    @select="setValues({ eyes: eye.value })"
                  >
                    <Check
                      :class="cn('mr-2 h-4 w-4', eye.value === values.eyes ? 'opacity-100' : 'opacity-0')" />
                    {{ eye.label }}
                  </CommandItem>
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
        <!-- <FormDescription>
          TODO: description
        </FormDescription> -->
        <FormMessage />
      </FormItem>
    </FormField>

    <color-picker
      :initial-value="values.eyesColor"
      @update-color="(color) => onChangeColor('eyes', color)"
    />

    <FormField name="mouth" @update:model-value="onChangeSprite">
      <FormItem class="flex flex-col">
        <FormLabel>Mouth</FormLabel>
        <Popover>
          <PopoverTrigger as-child>
            <FormControl>
              <Button
                variant="outline"
                role="combobox"
                :class="cn('justify-between', !values.mouth && 'text-muted-foreground')">
                {{ values.mouth ? formValues.mouth.find((mouth) => mouth.value === values.mouth)?.label
                  : 'Select mouth...'}}
                <ChevronsUpDown class="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </FormControl>
          </PopoverTrigger>
          <PopoverContent class="p-0">
            <Command>
              <CommandInput placeholder="Search mouth..." />
              <CommandEmpty>Nothing found.</CommandEmpty>
              <CommandList>
                <CommandGroup>
                  <CommandItem
                    v-for="mouth in formValues.mouth"
                    :key="mouth.value"
                    :value="mouth.label"
                    @select="setValues({ mouth: mouth.value })"
                  >
                    <Check
                      :class="cn('mr-2 h-4 w-4', mouth.value === values.mouth ? 'opacity-100' : 'opacity-0')" />
                    {{ mouth.label }}
                  </CommandItem>
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
        <!-- <FormDescription>
          TODO: description
        </FormDescription> -->
        <FormMessage />
      </FormItem>
    </FormField>

    <color-picker
      :initial-value="values.mouthColor"
      @update-color="(color) => onChangeColor('mouth', color)"
    />

    <FormField name="hat" @update:model-value="onChangeSprite">
      <FormItem class="flex flex-col">
        <FormLabel>Hat</FormLabel>
        <Popover>
          <PopoverTrigger as-child>
            <FormControl>
              <Button
                variant="outline"
                role="combobox"
                :class="cn('justify-between', !values.hat && 'text-muted-foreground')">
                {{ values.hat ? formValues.hat.find((hat) => hat.value === values.hat)?.label
                  : 'Select hat...'}}
                <ChevronsUpDown class="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </FormControl>
          </PopoverTrigger>
          <PopoverContent class="p-0">
            <Command>
              <CommandInput placeholder="Search hat..." />
              <CommandEmpty>Nothing found.</CommandEmpty>
              <CommandList>
                <CommandGroup>
                  <CommandItem
                    v-for="hat in formValues.hat"
                    :key="hat.value"
                    :value="hat.label"
                    @select="setValues({ hat: hat.value })"
                  >
                    <Check
                      :class="cn('mr-2 h-4 w-4', hat.value === values.hat ? 'opacity-100' : 'opacity-0')" />
                    {{ hat.label }}
                  </CommandItem>
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
        <!-- <FormDescription>
          TODO: description
        </FormDescription> -->
        <FormMessage />
      </FormItem>
    </FormField>

    <color-picker
      :initial-value="values.hatColor"
      @update-color="(color) => onChangeColor('hat', color)"
    />

    <FormField name="cosmetics" @update:model-value="onChangeSprite">
      <FormItem class="flex flex-col">
        <FormLabel>Cosmetics</FormLabel>
        <Popover>
          <PopoverTrigger as-child>
            <FormControl>
              <Button
                variant="outline"
                role="combobox"
                :class="cn('justify-between', !values.cosmetics && 'text-muted-foreground')">
                {{ values.cosmetics ? formValues.cosmetics.find((cosmetic) => cosmetic.value === values.cosmetics)?.label
                  : 'Select cosmetics...'}}
                <ChevronsUpDown class="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </FormControl>
          </PopoverTrigger>
          <PopoverContent class="p-0">
            <Command>
              <CommandInput placeholder="Search cosmetics..." />
              <CommandEmpty>Nothing found.</CommandEmpty>
              <CommandList>
                <CommandGroup>
                  <CommandItem
                    v-for="cosmetic in formValues.cosmetics"
                    :key="cosmetic.value"
                    :value="cosmetic.label"
                    @select="setValues({ cosmetics: cosmetic.value })"
                  >
                    <Check
                      :class="cn('mr-2 h-4 w-4', cosmetic.value === values.cosmetics ? 'opacity-100' : 'opacity-0')" />
                    {{ cosmetic.label }}
                  </CommandItem>
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
        <!-- <FormDescription>
          TODO: description
        </FormDescription> -->
        <FormMessage />
      </FormItem>
    </FormField>

    <color-picker
      :initial-value="values.cosmeticsColor"
      @update-color="(color) => onChangeColor('cosmetics', color)"
    />

    <div class="flex justify-end gap-2">
      <Button size="sm" variant="outline" type="reset">
        Reset
      </Button>

      <Button size="sm" type="submit">
        Submit
      </Button>
    </div>
  </form>
</template>
