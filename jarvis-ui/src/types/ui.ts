export type UIComponentType =
  | 'text'
  | 'news'
  | 'video'
  | 'image'
  | 'card'
  | 'list'
  | 'table'


export type UIPosition =
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'center-left'
  | 'center'
  | 'center-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right'
  | 'custom'


export type UILayout =
  | {
      position:
        | 'top-left'
        | 'top-center'
        | 'top-right'
        | 'center-left'
        | 'center'
        | 'center-right'
        | 'bottom-left'
        | 'bottom-center'
        | 'bottom-right'

      width: number
      height: number

      zIndex?: number
      visible?: boolean
    }
  | {
      position: 'custom'

      x: number
      y: number

      width: number
      height: number

      zIndex?: number
      visible?: boolean
    }


export interface UIComponent {
  id: string
  type: UIComponentType
  props: Record<string, unknown>
  layout: UILayout
}


export type UIEvent =
  | {
      type: 'ui.create'
      component: UIComponent
    }

  | {
      type: 'ui.update'
      component: UIComponent
    }

  | {
      type: 'ui.remove'
      id: string
    }

  | {
      type: 'ui.clear'
    }