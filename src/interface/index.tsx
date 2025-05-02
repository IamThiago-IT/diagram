export interface Position {
    x: number
    y: number
  }
  
  export interface Column {
    name: string
    type: string
    isPrimary: boolean
  }
  
  export interface Table {
    id: string
    name: string
    position: Position
    columns: Column[]
  }
  
  export interface Relation {
    id: string
    sourceTableId: string
    targetTableId: string
    sourceColumn: string
    targetColumn: string
    relationType: "one-to-one" | "one-to-many" | "many-to-many"
  }
  

  