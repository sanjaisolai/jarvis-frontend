import type {
  Dispatch,
  SetStateAction,
} from 'react'

import type {
  UIComponent,
} from '../types/ui'

import DynamicRenderer from './DynamicRenderer'


interface DynamicComponentListProps {
  components: UIComponent[]

  setComponents:
    Dispatch<SetStateAction<UIComponent[]>>
}


function DynamicComponentList({
  components,
  setComponents,
}: DynamicComponentListProps) {

  return (
    <>
      {components.map(component => (

        <DynamicRenderer
          key={component.id}
          component={component}
          setComponents={setComponents}
        />

      ))}
    </>
  )
}


export default DynamicComponentList