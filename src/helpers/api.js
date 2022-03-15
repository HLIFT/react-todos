import axios from "axios";
import dateFormat from "dateformat";

const apiUrl = 'http://localhost:4000/api'

export async function getTodos() {
  const { data } = await axios.get(`${apiUrl}/todos`).catch(console.error)

  if (data.success) {
    let formattedTodos = data.todos.map(({ label_id, due_date, ...todo }) => ({
      ...todo, labelId: label_id, dueDate: due_date ? dateFormat(new Date(due_date), 'yyyy-mm-dd') : '',
    }))

    formattedTodos = formattedTodos.reduce((acc, curr) => (acc[curr.id] = curr, acc), {})

    return {
      success: true, todos: formattedTodos
    }
  }

  return data
}

export async function createTodo(todo) {
  const { data } = await axios.post(`${apiUrl}/todos`, {
    title: todo.title,
    description: todo.description === '' ? null : todo.description,
    label_id: todo.labelId,
    due_date: todo.dueDate === '' ? null : todo.dueDate
  }).catch(console.error)

  if (data.success) {
    const formattedTodo = {
      ...data.todo,
      labelId: data.todo.label_id,
      dueDate: data.todo.due_date ? dateFormat(new Date(data.todo.due_date), 'yyyy-mm-dd') : '',
    }

    return {
      success: true, todo: formattedTodo
    }
  }

  return data
}

export async function updateTodo(todo) {
  const { data } = await axios.put(`${apiUrl}/todos/${todo.id}`, {
    title: todo.title,
    description: todo.description === '' ? null : todo.description,
    label_id: todo.labelId,
    due_date: todo.dueDate === '' ? null : todo.dueDate,
    completed: todo.completed
  }).catch(console.error)

  if (data.success) {
    const formattedTodo = {
      ...data.todo,
      labelId: data.todo.label_id,
      dueDate: data.todo.due_date ? dateFormat(new Date(data.todo.due_date), 'yyyy-mm-dd') : '',
    }

    return {
      success: true, todo: formattedTodo
    }
  }

  return data
}

export async function completeTodo(todo) {
  const { data } = await axios.put(`${apiUrl}/todos/${todo.id}`, {
    title: todo.title,
    description: todo.description === '' ? null : todo.description,
    label_id: todo.labelId,
    due_date: todo.dueDate === '' ? null : todo.dueDate,
    completed: !todo.completed
  }).catch(console.error)

  console.log(data)

  if (data.success) {
    const formattedTodo = {
      ...data.todo, labelId: data.todo.label_id, dueDate: data.todo.due_date,
    }

    return {
      success: true, todo: formattedTodo
    }
  }

  return data
}

export async function deleteTodo(todo) {
  const { data } = await axios.delete(`${apiUrl}/todos/${todo.id}`).catch(console.error)
  console.log(data)
  return data
}

export async function getLabels() {
  const { data } = await axios.get(`${apiUrl}/labels`).catch(console.error)

  return data
}
