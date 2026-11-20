import type {
  Dispatch,
  SetStateAction,
} from 'react'

import type {
  UIComponent,
} from '../types/ui'

import DynamicWindow from './DynamicWindow'

import TextCard from './TextCard'
import NewsCard from './NewsCard'
import VideoCard from './VideoCard'
import DynamicTable from './DynamicTable'

interface Props {
  component: UIComponent
  setComponents: Dispatch<SetStateAction<UIComponent[]>>
}


function DynamicRenderer({
  component,
  setComponents,
}: Props) {

  let content: React.ReactNode


  switch (component.type) {

    case 'table':
      content = (
        <DynamicTable
          {...component.props}
        />
      )
      break

    case 'text':

      content = (
        <TextCard
          {...component.props}
        />
      )

      break


    case 'news':

      content = (
        <NewsCard
          {...component.props}
        />
      )

      break


    case 'video':

      content = (
        <VideoCard
          {...component.props}
        />
      )

      break


    default:

      console.warn(
        'Unknown UI component:',
        component.type
      )

      return null
  }


  return (
    <DynamicWindow
      component={component}
      setComponents={setComponents}
    >
      {content}
    </DynamicWindow>
  )
}


export default DynamicRenderer