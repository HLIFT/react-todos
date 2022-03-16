import axios from 'axios';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import {
  ApiLabelsDataResponse,
  ApiTodoResponseData,
  ApiTodosResponseData,
  ApiWithoutDataResponse, NewFrontTodo,
  OldFrontTodo,
  TodoList,
// eslint-disable-next-line import/extensions
} from '../../back/commonTypes';

const apiUrl = 'http://localhost:4000/api';

export async function getTodos() {
  const { data } = await axios.get<ApiTodosResponseData>(`${apiUrl}/todos`);

  if (data.success) {
    // eslint-disable-next-line camelcase
    const formattedTodos = data.todos.map(({ label_id, due_date, ...todo }) => ({
      // eslint-disable-next-line camelcase
      ...todo, labelId: label_id, dueDate: due_date ? new Date(due_date) : null,
    })).reduce((acc: TodoList, curr) => ({ ...acc, [curr.id]: curr }), {});

    return {
      success: true, todos: formattedTodos,
    };
  }

  return data;
}

export async function createTodo(todo: NewFrontTodo) {
  console.log(todo);
  const { data } = await axios.post<ApiTodoResponseData>(`${apiUrl}/todos`, {
    title: todo.title,
    description: todo.description !== '' ? todo.description : null,
    label_id: todo.labelId,
    due_date: todo.dueDate ?? null,
  });

  if (data.success) {
    const formattedTodo = {
      ...data.todo,
      labelId: data.todo.label_id,
      dueDate: data.todo.due_date ? new Date(data.todo.due_date) : null,
    };

    return {
      success: true, todo: formattedTodo,
    };
  }

  return data;
}

export async function updateTodo(todo: OldFrontTodo) {
  console.log(todo);

  const { data } = await axios.put<ApiTodoResponseData>(`${apiUrl}/todos/${todo.id}`, {
    title: todo.title,
    description: todo.description === '' ? null : todo.description,
    label_id: todo.labelId,
    due_date: todo.dueDate ?? null,
    completed: todo.completed,
  });

  if (data.success) {
    const formattedTodo = {
      ...data.todo,
      labelId: data.todo.label_id,
      dueDate: data.todo.due_date ? new Date(data.todo.due_date) : null,
    };

    console.log(formattedTodo);

    return {
      success: true, todo: formattedTodo,
    };
  }

  return data;
}

export async function completeTodo(todo: OldFrontTodo) {
  const { data } = await axios.put<ApiTodoResponseData>(`${apiUrl}/todos/${todo.id}`, {
    title: todo.title,
    description: todo.description === '' ? null : todo.description,
    label_id: todo.labelId,
    due_date: todo.dueDate ? new Date(todo.dueDate) : null,
    completed: !todo.completed,
  });

  if (data.success) {
    const formattedTodo = {
      ...data.todo,
      labelId: data.todo.label_id,
      dueDate: data.todo.due_date ? new Date(data.todo.due_date) : null,
    };

    return {
      success: true, todo: formattedTodo,
    };
  }

  return data;
}

export async function deleteTodo(todo: OldFrontTodo) {
  const { data } = await axios.delete<ApiWithoutDataResponse>(`${apiUrl}/todos/${todo.id}`);
  return data;
}

export async function getLabels() {
  const { data } = await axios.get<ApiLabelsDataResponse>(`${apiUrl}/labels`);
  return data;
}
