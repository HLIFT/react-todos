export type CreatePayload = {
    title: string,
    description: string | null,
    label_id: number | null,
    due_date: Date | null,
}

export type UpdatePayload = {
    title: string,
    description: string | null,
    label_id: number | null,
    due_date: Date | null,
    completed: boolean
}

export type Todo = {
    id: number,
    title: string,
    description: string | null,
    label_id: number | null,
    due_date: Date | null,
    completed: boolean
}

export type Label = {
    id: number,
    name: string,
    color: string
}

type ApiResponseError = {
    success: false,
    message: string
}

type ApiResponseSuccess<Payload extends Record<string, unknown>> = {
    success: true,
} & Payload

// eslint-disable-next-line max-len
type ApiResponse<Payload extends Record<string, unknown>> = ApiResponseError | ApiResponseSuccess<Payload>

export type ApiTodosResponseData = ApiResponse<{
    todos: Todo[]
}>

export type ApiTodoResponseData = ApiResponse<{
    todo: Todo
}>

export type ApiLabelsDataResponse = ApiResponse<{
    labels: Label[],
}>

export type ApiWithoutDataResponse = ApiResponse<Record<string, unknown>>

type FrontTodoBase = {
    title: string,
    description: string | null,
    labelId: number | null,
    dueDate: Date | null,
    completed: boolean
}

export type NewFrontTodo = FrontTodoBase & {
    id: null,
}

export type OldFrontTodo = FrontTodoBase & {
    id: number,
}

export type FrontTodo = NewFrontTodo | OldFrontTodo

export type TodoList = Record<OldFrontTodo['id'], OldFrontTodo>

export type InputErrors = Record<string, string|undefined>
