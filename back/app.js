const express = require('express')
const { PrismaClient } = require("@prisma/client");
const cors = require('cors')

const app = express()

const port = process.env.PORT || 4000

const prisma = new PrismaClient()

async function getAllTodos() {
  const todos = await prisma.todos.findMany()
  console.dir(todos, { depth: null })
  return todos
}

async function createTodo(body) {
  const todo = await prisma.todos.create({
    data: {
      title: body.title,
      description: body.description,
      label_id: body.label_id === '' ? null : parseInt(body.label_id),
      due_date: body.due_date ? new Date(body.due_date) : null
    }
  })
  console.dir(todo, { depth: null })
  return todo
}

async function updateTodo(id, body) {
  const todo = await prisma.todos.update({
    where: { id: id },
    data: {
      title: body.title,
      description: body.description,
      label_id: body.label_id ? parseInt(body.label_id) : null,
      due_date: body.due_date ? new Date(body.due_date) : null,
      completed: body.completed
    }
  })
  console.dir(todo, { depth: null })
  return todo
}

async function deleteTodo(id) {
  await prisma.todos.delete({
    where: { id: id }
  })
}

async function getAllLabels() {
  const labels = await prisma.labels.findMany()
  console.dir(labels, { depth: null })
  return labels
}

const dataMiddleware = (req, res, next) => {
  const { body } = req

  if (!body) {
    return res.status(422).json({ success: false, message: "Le body est obligatoire" })
  } else if (!body.title) {
    return res.status(422).json({ success: false, message: "Le titre est obligatoire" })
  }

  next()
}

app.use(cors())

app.use(express.json())

app.get('/api/todos', async (req, res) => {
  const todos = await getAllTodos()
  .catch((e) => {
    throw e
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

  const result = {
    success: true,
    todos: todos
  }

  res.status(200).json(result)
})

app.post('/api/todos', dataMiddleware, async (req, res) => {

  const todo = await createTodo(req.body)
  .catch((e) => {
    throw e
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

  const result = {
    success: true,
    todo: todo
  }

  res.status(201).json(result)
})

app.put('/api/todos/:id', dataMiddleware, async (req, res) => {
  const todo = await updateTodo(parseInt(req.params.id), req.body)
  .catch((e) => {
    let result = {
      success: false,
      message: "Erreur."
    }
    if (e.code === 'P2025') {
      result = {
        success: false,
        message: "Cette todo est introuvable."
      }
    }

    return res.status(422).json(result)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

  const result = {
    success: true,
    todo: todo
  }

  res.status(200).json(result)

})

app.delete('/api/todos/:id', async (req, res) => {
  await deleteTodo(parseInt(req.params.id))
  .catch((e) => {
    let result = {
      success: false,
      message: "Erreur."
    }
    if (e.code === 'P2025') {
      result = {
        success: false,
        message: "Cette todo est introuvable."
      }
    }

    res.status(422).json(result)
  })
  .finally(async () => {
    const result = {
      success: true
    }

    res.status(200).json(result)

    await prisma.$disconnect()
  })
})

app.get('/api/labels', async (req, res) => {
  const labels = await getAllLabels()
  .catch((e) => {
    throw e
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

  const result = {
    success: true,
    labels: labels
  }

  res.status(200).json(result)
})

app.get('*', (req, res) => {
  res.status(404).json({ success: false, message: 'Not found' })
})

app.listen(port)
