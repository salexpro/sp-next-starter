declare module '*.svg?url' {
  const content: {
    src: string
    height: number
    width: number
    blurWidth?: number
    blurHeight?: number
  }
  export default content
}

// declare module '*.module.scss' {
//   const value: Record<string, string>
//   export default value
// }

declare module 'react-middle-ellipsis'
