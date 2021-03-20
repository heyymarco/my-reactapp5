export type Prop            = string // 'var(--blah)' => string
export type General         = string | number // 'center', 'inline-flex', 12, '12px', 1.5, '150%'
export type Expr            = General|Prop|      (General|Prop)[][] // [['clamp(', 12, 'var(--blah)', '100vw', ')']]

export type FontSize        = string |          (string|number)[][]
export type FontFamily      = string | string[]
export type FontWeight      = string | number | (string|number)[][]
export type FontStyle       = string
export type TextDecoration  = string
export type LineHeight      = string | number

export type Color           = string
export type Background      = string |                   string[][]
export type Image           = string |                   string[][]
export type ImagePosition   = 'center' | 'left' | 'right' | 'top' | 'bottom'

export type Opacity         = string | number

export type MarginBlock     = string | 0
export type MarginInline    = string | 0

export type PaddingXY       = string | 0 |               string[][]
export type Border          = string |                   string[][]
export type BorderRadius    = string | 0

export type Width           = string | 0 |               (string|0)[][]
export type Height          = string | 0 |               (string|0)[][]

export type Transition      = string |                   string[][]
export type Filter          = string |                   string[][]
export type Transform       = string |                   string[][]
export type Keyframes       = object
export type Animation       = string | (string | Keyframes)[][]

export type BoxShadow       = string | 0 |               (string|0)[][]

export type Cursor          = string

export type Orientation     = 'row' | 'row-reverse' | 'column' | 'column-reverse'
export type WhiteSpace      = 'normal' | 'pre' | 'nowrap' | 'pre-wrap' | 'pre-line' | 'break-spaces'

export type Gap             = string | 0


export type AlignItems      = 'center' | 'start' | 'end' | 'stretch'

export type InputTextLike   = 'text'|'number'|'email'|'tel'|'password'|'search'|'url'|'date'|'time'|'datetime-local'|'week'|'month'
export type InputType       = InputTextLike | 'color'|'file'|'range'