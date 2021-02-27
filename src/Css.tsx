export type Variable        = string
export type Expression      = Variable | string |          (Variable|string|number)[][]

export type FontSize        = string |          (string|number)[][]
export type FontFamily      = string | string[]
export type FontWeight      = string | number | (string|number)[][]
export type FontStyle       = string
export type TextDecoration  = string
export type LineHeight      = string | number

export type Color           = string
export type Background      = string |                   string[][]

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
export type Keyframes       = object
export type Animation       = string | (string | Keyframes)[][]

export type BoxShadow       = string | 0 |               (string|0)[][]

export type Cursor          = string

export type Orientation     = 'row' | 'row-reverse' | 'column' | 'column-reverse';
export type WhiteSpace      = 'normal' | 'pre' | 'nowrap' | 'pre-wrap' | 'pre-line' | 'break-spaces';

export type Gap             = string | 0


export type AlignItems      = 'center' | 'start' | 'end' | 'stretch'